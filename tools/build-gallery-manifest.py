#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
GALLERIES = {
    "photography": (ROOT / "assets" / "gallery" / "photography", "photo-"),
    "drawings": (ROOT / "assets" / "gallery" / "drawings", "drawing-"),
}
manifest = {}
for gallery_type, (folder, prefix) in GALLERIES.items():
    pattern = re.compile(rf"^{re.escape(prefix)}(\d+)\.(jpg|jpeg|png|webp)$", re.IGNORECASE)
    entries = []
    if folder.exists():
        for file in folder.iterdir():
            if not file.is_file():
                continue
            match = pattern.match(file.name)
            if not match:
                continue
            entries.append({"number": int(match.group(1)), "src": file.relative_to(ROOT).as_posix()})
    entries.sort(key=lambda entry: entry["number"])
    manifest[gallery_type] = entries
(ROOT / "gallery-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Generated gallery-manifest.json:", ", ".join(f"{name}={len(items)}" for name, items in manifest.items()))
