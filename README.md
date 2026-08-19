# Elycius rem — local portfolio

Static website. No build step, framework or package manager required.

## Start locally

The site can be opened by double-clicking `index.html`.

For the most reliable behavior, use a tiny local server:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

---

# THE EASY PHOTO SYSTEM

You normally do **not** have to edit the HTML to add images.

## 1. Minecraft project screenshots

Each Minecraft project already has its own folder:

```text
assets/
  minecraft/
    darkenya/
    vorbauprojekt/
    reload/
    frankfurt2099/
    rpg/
    tanz-der-vampire/
    foxlay-lobby/
    sumpfdorf/
    bahnstrecke/
```

Put images into the correct folder and name them:

```text
01.jpg
02.jpg
03.jpg
04.jpg
```

The website automatically looks for images from `01` to `20`.

- `01.jpg` becomes the card preview.
- Clicking the project opens the popup.
- The popup automatically finds all numbered images.
- You can use `.jpg`, `.jpeg`, `.png` or `.webp`.
- Do not skip numbers if possible.

Example:

```text
assets/minecraft/frankfurt2099/01.jpg
assets/minecraft/frankfurt2099/02.jpg
assets/minecraft/frankfurt2099/03.jpg
```

That is enough. No HTML change required.

## 2. Photography

Put photos here:

```text
assets/gallery/photography/
```

Rename them:

```text
photo-01.jpg
photo-02.jpg
photo-03.jpg
```

The site automatically looks for up to 250 numbered images. It initially shows 18 and reveals more with the **See more** button.

## 3. Drawn art

Put drawings here:

```text
assets/gallery/drawings/
```

Rename them:

```text
drawing-01.jpg
drawing-02.jpg
drawing-03.jpg
```

Again: no HTML change required.

## Recommended image sizes

You do not have to resize everything perfectly.

A useful target is:

- Minecraft / photos: around 1600–2400 px on the long edge
- JPEG quality around 80–90%
- Avoid massive 10–30 MB originals for the website

---

# Editing Minecraft descriptions

Open:

```text
content.js
```

Every project looks like this:

```js
{
  id: "frankfurt2099",
  title: "Frankfurt2099",
  years: "",
  description: "Your description here.",
  folder: "assets/minecraft/frankfurt2099",
  imagePrefix: "",
  maxImages: 20
}
```

Usually you only need to change `years` and `description`.

---


# Adding new videos

This has been simplified.

Open:

```text
content.js
```

Find the `videos` list and add:

```js
{
  title: "My new video",
  kind: "Music video",
  url: "https://youtu.be/..."
}
```

That is all.

You **do not** need to find or enter the YouTube video ID yourself.

For a YouTube Short, simply paste the Shorts URL:

```js
{
  title: "New Short",
  url: "https://www.youtube.com/shorts/XXXXXXXXXXX"
}
```

The website detects `/shorts/` automatically and gives it the vertical 9:16 card layout.

`kind` is optional. If you omit it, the website uses `Short-form` for Shorts and `Video editing` for normal videos.

---

# Minecraft structure

Darkenya is represented as the **building team**, not as a project.

The projects currently grouped under Darkenya are:

```text
Vorbauprojekt
Reload
Frankfurt2099
RPG
```

The other Minecraft builds are displayed separately as independent work.

Every build still uses the same easy image system:

```text
01.jpg   preview + first popup image
02.jpg   second popup image
03.jpg   third popup image
...
```


# Previous YouTube notes

YouTube cards are also stored in:

```text
content.js
```

They use the YouTube video ID to display a real thumbnail preview.

Clicking a preview opens the original video on YouTube.

---

# Blog

The blog is at:

```text
blog.html
```

## Add a new article

### Step 1
Duplicate:

```text
posts/_template.html
```

For example:

```text
posts/why-i-like-old-minecraft-servers.html
```

### Step 2
Open the copied file in a text editor and replace:

- title
- date
- tags
- introduction
- article paragraphs

### Step 3
Open:

```text
blog-posts.js
```

Add:

```js
{
  title: "Why I like old Minecraft servers",
  date: "2026-08-17",
  tags: ["Minecraft", "Internet"],
  summary: "A short description of the article.",
  url: "posts/why-i-like-old-minecraft-servers.html"
}
```

The article then appears automatically on the homepage and on `blog.html`.

---

# CV / timeline

`content.js` already contains an empty:

```js
timeline: []
```

The CV timeline can be added there once the dates/content are available.

---

# Main files

```text
index.html        main portfolio
styles.css        portfolio design
script.js         galleries, Minecraft popups, YouTube previews
content.js        project and video information
blog.html         blog overview
blog.css          blog/article styles
blog.js           blog overview rendering
blog-posts.js     list of blog posts
posts/            individual articles
assets/           your images
```


# Party of Humanists timeline

The Party of Humanists section is generated from `humanistsTimeline` inside `content.js`.

Each role has:

```js
{
  period: "December 2024 — June 2026",
  role: "Example role",
  points: [
    "First responsibility.",
    "Second responsibility."
  ]
}
```

Add another object to the list when you want to extend the timeline.


# V4 additions

## Profile image / orbit

The header only shows a small green dot and the name. The profile image itself is used prominently in the animated orbit on the home screen:

```text
assets/profile/elycius-profile.png
```

Replace that file to change the central profile mark.

## Project links

Minecraft entries in `content.js` may optionally include external links:

```js
links: [
  { label: "Project video", url: "https://..." }
]
```

They appear inside the project popup.

## Gallery metadata

Images still work just by putting them into the gallery folders. Metadata is optional.

```js
galleryMeta: {
  photography: {
    "01": { title: "Optional photo title" }
  },
  drawings: {
    "01": { title: "Optional drawing title", medium: "Ink on paper" }
  }
}
```

No title/medium is required.


# Adding videos to Minecraft projects

Minecraft project popups can also contain embedded YouTube videos.

Open:

```text
content.js
```

Inside the relevant Minecraft project, add a `videos` list:

```js
{
  id: "frankfurt2099",
  title: "Frankfurt2099",
  // ...the existing project settings...

  videos: [
    {
      title: "Frankfurt2099 project video",
      url: "https://www.youtube.com/watch?v=Fs-JLoyeaZc"
    }
  ]
}
```

The website extracts the YouTube ID automatically.

## More than one project video

Just add more entries:

```js
videos: [
  {
    title: "Overview",
    url: "https://www.youtube.com/watch?v=VIDEO_ID_1"
  },
  {
    title: "Making of",
    url: "https://youtu.be/VIDEO_ID_2"
  }
]
```

The videos appear underneath the screenshot viewer in that project's popup.
They are only loaded when the popup is opened, and playback stops when the popup is closed.

If a project has no `videos` list, no video section is shown.

# Important: embedded YouTube videos when running locally

YouTube embedded players need to be opened from a real `http://` or `https://` page. If you double-click `index.html`, the browser opens it as `file://...`; YouTube may then show **Error 153 / Video player configuration error** because there is no normal HTTP referrer.

## Windows — easiest method

Double-click:

```text
START-WEBSITE.bat
```

The site opens at:

```text
http://localhost:8080
```

Keep the black terminal window open while using the site. Close it when you are finished.

## macOS / Linux

Run:

```bash
./START-WEBSITE.sh
```

## Directly opening index.html still works

The portfolio itself still works if you open `index.html` directly. Project videos simply switch to a thumbnail with an **Open on YouTube** link instead of showing a broken embedded player.


# Gallery viewing (v5)

The gallery now keeps every image's **original aspect ratio**. Portrait photos remain portrait, square drawings remain square, and landscape images are not cropped into fixed tiles.

The page initially displays 18 images per gallery tab. If more images are present, a **See more** button reveals another 18 at a time.

The viewer can discover up to 250 numbered files by default:

```text
photo-01.jpg ... photo-250.jpg
drawing-01.jpg ... drawing-250.jpg
```

If you ever need more than 250, change this line in `script.js`:

```js
const GALLERY_DISCOVERY_LIMIT = 250;
```

Clicking any gallery image opens a fullscreen viewer. In the viewer:

- use the left/right arrow buttons to move through **all images in the current tab**, including images not yet revealed by See more
- use the keyboard left/right arrow keys as well
- click the image or use **Zoom +** to enlarge it
- click again / choose **Fit image** to return to the full-image view
- press Escape or use × to close the viewer


## Lightbox behavior (v6)

- The unzoomed lightbox always fits the complete image inside the viewer without cropping.
- Clicking an image zooms around the exact point clicked.
- While zoomed, the enlarged image is scrollable.
- Clicking the zoomed image again returns to full-image fit.
