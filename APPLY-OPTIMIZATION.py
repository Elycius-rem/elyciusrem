#!/usr/bin/env python3
from pathlib import Path
import sys
import subprocess

ROOT = Path.cwd()

required = [
    ROOT / "script.js",
    ROOT / ".github" / "workflows" / "static.yml",
]
missing = [str(path) for path in required if not path.exists()]
if missing:
    print("ERROR: Run this from the root of your elyciusrem repository.")
    print("Missing:", ", ".join(missing))
    sys.exit(1)

# 1) Create manifest generator
tools = ROOT / "tools"
tools.mkdir(exist_ok=True)

generator = tools / "build-gallery-manifest.py"
generator_code = r'''#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]

CONFIG = {
    "photography": {
        "folder": ROOT / "assets" / "gallery" / "photography",
        "prefix": "photo-",
    },
    "drawings": {
        "folder": ROOT / "assets" / "gallery" / "drawings",
        "prefix": "drawing-",
    },
}

manifest = {}

for gallery_type, config in CONFIG.items():
    folder = config["folder"]
    prefix = config["prefix"]
    entries = []

    if folder.exists():
        pattern = re.compile(
            rf"^{re.escape(prefix)}(\d+)\.(jpg|jpeg|png|webp)$",
            re.IGNORECASE,
        )

        for file in folder.iterdir():
            if not file.is_file():
                continue

            match = pattern.match(file.name)
            if not match:
                continue

            entries.append({
                "number": int(match.group(1)),
                "src": file.relative_to(ROOT).as_posix(),
            })

    entries.sort(key=lambda entry: entry["number"])
    manifest[gallery_type] = entries

output = ROOT / "gallery-manifest.json"
output.write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

print(
    "Gallery manifest generated:",
    ", ".join(f"{name}={len(items)}" for name, items in manifest.items())
)
'''
generator.write_text(generator_code, encoding="utf-8")

# 2) Patch script.js
script_path = ROOT / "script.js"
script = script_path.read_text(encoding="utf-8")

manifest_loader = r'''
let galleryManifestPromise = null;

async function loadGalleryManifest() {
  if (location.protocol !== "http:" && location.protocol !== "https:") {
    return null;
  }

  if (!galleryManifestPromise) {
    galleryManifestPromise = fetch("gallery-manifest.json", {
      cache: "no-store"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Gallery manifest returned HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((manifest) => {
        if (!manifest || typeof manifest !== "object") return null;
        return manifest;
      })
      .catch((error) => {
        console.warn(
          "Gallery manifest unavailable; falling back to image discovery.",
          error
        );
        return null;
      });
  }

  return galleryManifestPromise;
}
'''

if "async function loadGalleryManifest()" not in script:
    marker = '};\nlet activeGalleryType = "photography";'
    if marker not in script:
        print("ERROR: Could not locate galleryConfig in script.js.")
        sys.exit(1)

    script = script.replace(
        marker,
        "};\n" + manifest_loader + '\nlet activeGalleryType = "photography";',
        1,
    )

old_discovery = '''  const cfg = galleryConfig[type];
  activeGalleryImages = await discoverNumberedGalleryImages(
    cfg.folder,
    GALLERY_DISCOVERY_LIMIT,
    cfg.prefix
  );'''

new_discovery = '''  const cfg = galleryConfig[type];
  const manifest = await loadGalleryManifest();
  const manifestEntries = manifest?.[type];

  if (Array.isArray(manifestEntries)) {
    activeGalleryImages = manifestEntries
      .filter((entry) =>
        entry &&
        Number.isInteger(Number(entry.number)) &&
        typeof entry.src === "string"
      )
      .map((entry) => ({
        number: Number(entry.number),
        src: entry.src
      }));
  } else {
    activeGalleryImages = await discoverNumberedGalleryImages(
      cfg.folder,
      GALLERY_DISCOVERY_LIMIT,
      cfg.prefix
    );
  }'''

if old_discovery in script:
    script = script.replace(old_discovery, new_discovery, 1)
elif "const manifest = await loadGalleryManifest();" not in script:
    print("ERROR: Could not locate gallery discovery in script.js.")
    sys.exit(1)

script_path.write_text(script, encoding="utf-8")

# 3) Patch GitHub Pages workflow
workflow_path = ROOT / ".github" / "workflows" / "static.yml"
workflow = workflow_path.read_text(encoding="utf-8")

if "Generate gallery manifest" not in workflow:
    checkout = '''      - name: Checkout
        uses: actions/checkout@v4
'''
    generated = '''      - name: Checkout
        uses: actions/checkout@v4

      - name: Generate gallery manifest
        run: python3 tools/build-gallery-manifest.py
'''
    if checkout not in workflow:
        print("ERROR: Could not locate Checkout step in static.yml.")
        sys.exit(1)

    workflow = workflow.replace(checkout, generated, 1)
    workflow_path.write_text(workflow, encoding="utf-8")

# 4) Patch local launchers
bat_path = ROOT / "START-WEBSITE.bat"
if bat_path.exists():
    bat = bat_path.read_text(encoding="utf-8")
    if "build-gallery-manifest.py" not in bat:
        bat = bat.replace(
            'if %errorlevel%==0 (\n  start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"\n  py -m http.server 8080 --bind 127.0.0.1',
            'if %errorlevel%==0 (\n  py tools\\\\build-gallery-manifest.py\n  start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"\n  py -m http.server 8080 --bind 127.0.0.1',
            1,
        )
        bat = bat.replace(
            'if %errorlevel%==0 (\n  start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"\n  python -m http.server 8080 --bind 127.0.0.1',
            'if %errorlevel%==0 (\n  python tools\\\\build-gallery-manifest.py\n  start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"\n  python -m http.server 8080 --bind 127.0.0.1',
            1,
        )
        bat_path.write_text(bat, encoding="utf-8")

sh_path = ROOT / "START-WEBSITE.sh"
if sh_path.exists():
    sh = sh_path.read_text(encoding="utf-8")
    if "build-gallery-manifest.py" not in sh:
        server_line = '"$PYTHON" -m http.server 8080 --bind 127.0.0.1'
        if server_line in sh:
            sh = sh.replace(
                server_line,
                '"$PYTHON" tools/build-gallery-manifest.py\n\n' + server_line,
                1,
            )
            sh_path.write_text(sh, encoding="utf-8")

# 5) Generate initial manifest immediately
subprocess.run([sys.executable, str(generator)], check=True)

print()
print("Done.")
print("Review the Git diff, then commit and push.")
print("GitHub Pages will regenerate gallery-manifest.json on every deploy.")
