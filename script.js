const data = window.SITE_DATA || {};
const blogPosts = window.BLOG_POSTS || [];

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const copyDiscord = document.querySelector(".copy-discord");

/* ---------- Small security helpers ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value), location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.href;
  } catch {
    return "";
  }
}

function safeLocalUrl(value) {
  try {
    const url = new URL(String(value), location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "file:") return "";
    if (location.protocol !== "file:" && url.origin !== location.origin) return "";
    return url.href;
  } catch {
    return "";
  }
}

function configureExternalLink(anchor, value) {
  const href = safeHttpUrl(value);
  if (!href) return false;
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  return true;
}


window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
});

menuButton?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

copyDiscord?.addEventListener("click", async () => {
  const value = copyDiscord.dataset.copy;
  const state = copyDiscord.querySelector(".copy-state");
  try {
    await navigator.clipboard.writeText(value);
    state.textContent = "copied";
  } catch {
    state.textContent = value;
  }
  setTimeout(() => state.textContent = "copy", 1500);
});

/* ---------- Image helpers ---------- */

const extensions = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];

function padded(number) {
  return String(number).padStart(2, "0");
}

function findExistingImage(baseWithoutExtension) {
  return new Promise((resolve) => {
    let i = 0;

    const tryNext = () => {
      if (i >= extensions.length) {
        resolve(null);
        return;
      }

      const src = `${baseWithoutExtension}.${extensions[i++]}`;
      const img = new Image();

      img.onload = () => resolve(src);
      img.onerror = tryNext;
      img.src = src;
    };

    tryNext();
  });
}

async function discoverNumberedImages(folder, maxImages = 20, prefix = "") {
  const checks = Array.from({ length: maxImages }, (_, index) =>
    findExistingImage(`${folder}/${prefix}${padded(index + 1)}`)
  );
  const results = await Promise.all(checks);
  return results.filter(Boolean);
}

/*
  Gallery variant: preserve the actual file number.
  This is important when a file is missing on the hosted site. Without the
  number, filtering out a missing image shifts every title/medium after it.
*/
async function discoverNumberedGalleryImages(folder, maxImages = 20, prefix = "") {
  const checks = Array.from({ length: maxImages }, async (_, index) => {
    const number = index + 1;
    const src = await findExistingImage(`${folder}/${prefix}${padded(number)}`);
    return src ? { src, number } : null;
  });

  const results = await Promise.all(checks);
  return results.filter(Boolean);
}

function addFallbackClass(img, fallback) {
  img.addEventListener("error", () => {
    img.hidden = true;
    fallback.hidden = false;
  });
}

/* ---------- Minecraft cards + modal ---------- */

const darkenyaGrid = document.querySelector("#darkenya-grid");
const independentGrid = document.querySelector("#independent-grid");
const darkenyaContext = document.querySelector("#darkenya-context");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalYears = document.querySelector("#modal-years");
const modalDescription = document.querySelector("#modal-description");
const modalLinks = document.querySelector("#modal-links");
const modalVideosSection = document.querySelector("#modal-videos-section");
const modalVideos = document.querySelector("#modal-videos");
const modalImage = document.querySelector("#modal-image");
const modalImagePlaceholder = document.querySelector("#modal-image-placeholder");
const viewerCounter = document.querySelector("#viewer-counter");
const viewerDots = document.querySelector("#viewer-dots");
const prevButton = document.querySelector(".viewer-prev");
const nextButton = document.querySelector(".viewer-next");

let activeImages = [];
let activeIndex = 0;
let activeProject = null;

function projectCard(project, index) {
  const button = document.createElement("button");
  button.className = "minecraft-card";
  button.type = "button";
  button.dataset.project = project.id;

  const preview = document.createElement("div");
  preview.className = "minecraft-preview";

  const img = document.createElement("img");
  img.alt = `${project.title} preview`;
  img.loading = "lazy";
  img.hidden = true;

  const placeholder = document.createElement("div");
  placeholder.className = "minecraft-placeholder";
  placeholder.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><small>add 01.jpg</small>`;

  preview.append(img, placeholder);

  findExistingImage(`${project.folder}/01`).then((found) => {
    if (!found) return;
    img.src = found;
    img.hidden = false;
    placeholder.hidden = true;
  });

  const copy = document.createElement("div");
  copy.className = "minecraft-card-copy";
  copy.innerHTML = `
    <div>
      <span class="card-type">${escapeHTML(project.kind || "Minecraft build")}</span>
      <h3>${escapeHTML(project.title)}</h3>
    </div>
    <div class="card-open">
      ${project.years ? `<small>${escapeHTML(project.years)}</small>` : ""}
      <span>Open ↗</span>
    </div>
  `;

  button.append(preview, copy);
  button.addEventListener("click", () => openProject(project));
  return button;
}

if (darkenyaContext && data.darkenyaTeam) {
  darkenyaContext.innerHTML = `
    <div>
      <p class="eyebrow">Building team</p>
      <h3>${escapeHTML(data.darkenyaTeam.title)}</h3>
    </div>
    <div class="team-context-copy">
      <p>${escapeHTML(data.darkenyaTeam.description)}</p>
      <div class="team-meta">
        <span>${escapeHTML(data.darkenyaTeam.period)}</span>
        <span>${escapeHTML(data.darkenyaTeam.status)}</span>
      </div>
    </div>
  `;
}

const darkenyaProjects = (data.minecraftProjects || []).filter((project) => project.group === "darkenya");
const independentProjects = (data.minecraftProjects || []).filter((project) => project.group !== "darkenya");

darkenyaProjects.forEach((project, index) => {
  darkenyaGrid?.appendChild(projectCard(project, index));
});

independentProjects.forEach((project, index) => {
  independentGrid?.appendChild(projectCard(project, darkenyaProjects.length + index));
});

async function openProject(project) {
  activeProject = project;
  activeIndex = 0;
  activeImages = [];

  document.querySelector(".modal-kicker").textContent = project.kind || (project.group === "darkenya" ? "Darkenya build" : "Minecraft build");
  modalTitle.textContent = project.title;
  modalYears.textContent = project.years || "";
  modalYears.hidden = !project.years;
  modalDescription.textContent = project.description;
  modalLinks.innerHTML = "";
  (project.links || []).forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "modal-link";
    if (!configureExternalLink(anchor, link.url)) return;
    anchor.textContent = `${link.label} ↗`;
    modalLinks.appendChild(anchor);
  });

  renderProjectVideos(project.videos || []);

  modalImage.hidden = true;
  modalImagePlaceholder.hidden = false;
  modalImagePlaceholder.querySelector("small").innerHTML =
    `Add <code>01.jpg</code>, <code>02.jpg</code>… to <code>${escapeHTML(project.folder)}/</code>.`;

  viewerCounter.textContent = "loading…";
  viewerDots.innerHTML = "";
  prevButton.disabled = true;
  nextButton.disabled = true;

  modal.showModal();

  activeImages = await discoverNumberedImages(
    project.folder,
    project.maxImages || 20,
    project.imagePrefix || ""
  );

  activeIndex = 0;
  renderViewer();
}

function renderProjectVideos(videos) {
  modalVideos.innerHTML = "";
  modalVideosSection.hidden = videos.length === 0;

  const canEmbedYouTube = location.protocol === "http:" || location.protocol === "https:";

  videos.forEach((video) => {
    const youtubeId = getYouTubeId(video.url);
    if (!youtubeId) return;

    const item = document.createElement("article");
    item.className = "project-video";

    const frame = document.createElement("div");
    frame.className = "project-video-frame";

    if (canEmbedYouTube) {
      const iframe = document.createElement("iframe");
      const origin = encodeURIComponent(location.origin);
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?origin=${origin}`;
      iframe.title = video.title || `${activeProject?.title || "Minecraft project"} video`;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      frame.appendChild(iframe);
    } else {
      const fallback = document.createElement("a");
      fallback.className = "project-video-fallback";
      if (!configureExternalLink(fallback, video.url)) return;
      fallback.innerHTML = `
        <img src="https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg" alt="${escapeHTML(video.title || "YouTube video")} preview">
        <span class="project-video-fallback-overlay">
          <b>Open on YouTube ↗</b>
          <small>Embedded playback needs the local server.<br>Use START-WEBSITE.bat instead of opening index.html directly.</small>
        </span>
      `;
      frame.appendChild(fallback);
    }

    item.appendChild(frame);

    const footer = document.createElement("div");
    footer.className = "project-video-footer";

    if (video.title) {
      const title = document.createElement("p");
      title.className = "project-video-title";
      title.textContent = video.title;
      footer.appendChild(title);
    }

    const youtubeLink = document.createElement("a");
    youtubeLink.className = "project-video-youtube-link";
    if (!configureExternalLink(youtubeLink, video.url)) return;
    youtubeLink.textContent = "YouTube ↗";
    footer.appendChild(youtubeLink);

    item.appendChild(footer);
    modalVideos.appendChild(item);
  });

  // Hide the whole section if every supplied URL was invalid.
  if (!modalVideos.children.length) {
    modalVideosSection.hidden = true;
  }
}

function clearProjectVideos() {
  // Removing the iframes stops any video that is currently playing.
  if (modalVideos) modalVideos.innerHTML = "";
  if (modalVideosSection) modalVideosSection.hidden = true;
}

function renderViewer() {
  if (!activeImages.length) {
    modalImage.hidden = true;
    modalImagePlaceholder.hidden = false;
    viewerCounter.textContent = "0 / 0";
    viewerDots.innerHTML = "";
    prevButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  modalImagePlaceholder.hidden = true;
  modalImage.hidden = false;
  modalImage.src = activeImages[activeIndex];
  modalImage.alt = `${activeProject.title} — image ${activeIndex + 1}`;
  viewerCounter.textContent = `${activeIndex + 1} / ${activeImages.length}`;

  prevButton.disabled = activeImages.length < 2;
  nextButton.disabled = activeImages.length < 2;

  viewerDots.innerHTML = "";
  activeImages.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `viewer-dot${index === activeIndex ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Show image ${index + 1}`);
    dot.addEventListener("click", () => {
      activeIndex = index;
      renderViewer();
    });
    viewerDots.appendChild(dot);
  });
}

function moveViewer(direction) {
  if (activeImages.length < 2) return;
  activeIndex = (activeIndex + direction + activeImages.length) % activeImages.length;
  renderViewer();
}

prevButton?.addEventListener("click", () => moveViewer(-1));
nextButton?.addEventListener("click", () => moveViewer(1));

document.querySelector(".modal-close")?.addEventListener("click", () => {
  clearProjectVideos();
  modal.close();
});

modal?.addEventListener("click", (event) => {
  const box = modal.querySelector(".modal-shell").getBoundingClientRect();
  const inside =
    event.clientX >= box.left &&
    event.clientX <= box.right &&
    event.clientY >= box.top &&
    event.clientY <= box.bottom;
  if (!inside) {
    clearProjectVideos();
    modal.close();
  }
});

modal?.addEventListener("close", clearProjectVideos);

document.addEventListener("keydown", (event) => {
  if (!modal?.open) return;
  if (event.key === "ArrowLeft") moveViewer(-1);
  if (event.key === "ArrowRight") moveViewer(1);
});

/* ---------- YouTube preview cards ---------- */

const videoGrid = document.querySelector("#video-grid");

function getYouTubeResource(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const allowedHosts = new Set(["youtube.com", "m.youtube.com", "youtu.be"]);
    if (!allowedHosts.has(hostname)) return { videoId: "", playlistId: "" };

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.split("/")[2] || "";
    } else {
      videoId = parsed.searchParams.get("v") || "";
    }

    const playlistId = parsed.searchParams.get("list") || "";
    const validVideo = /^[A-Za-z0-9_-]{6,20}$/.test(videoId) ? videoId : "";
    const validPlaylist = /^[A-Za-z0-9_-]{10,}$/.test(playlistId) ? playlistId : "";

    return { videoId: validVideo, playlistId: validPlaylist };
  } catch {
    return { videoId: "", playlistId: "" };
  }
}

function getYouTubeId(url) {
  return getYouTubeResource(url).videoId;
}

function getYouTubePlaylistId(url) {
  return getYouTubeResource(url).playlistId;
}

function isShortVideo(video) {
  return video.format === "short" || String(video.url || "").includes("/shorts/");
}

function validPreviewVideoId(value) {
  return /^[A-Za-z0-9_-]{6,20}$/.test(String(value || "")) ? String(value) : "";
}

function videoCard(video) {
  const resource = getYouTubeResource(video.url);
  const short = isShortVideo(video);
  const playlist = Boolean(resource.playlistId && !resource.videoId);
  const previewVideoId =
    resource.videoId ||
    validPreviewVideoId(video.previewVideoId) ||
    getYouTubeId(video.previewUrl || "");

  const link = document.createElement("a");
  link.className = `video-card${short ? " video-card--short" : ""}${playlist ? " video-card--playlist" : ""}`;
  if (!configureExternalLink(link, video.url)) {
    link.removeAttribute("href");
    link.removeAttribute("target");
  }

  const thumb = document.createElement("div");
  thumb.className = "video-thumb";

  if (previewVideoId) {
    const image = document.createElement("img");
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.src = `https://i.ytimg.com/vi/${previewVideoId}/hqdefault.jpg`;
    image.alt = `${video.title || "YouTube"} preview`;
    thumb.appendChild(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "playlist-placeholder";
    const mark = document.createElement("span");
    mark.textContent = "≡";
    const label = document.createElement("small");
    label.textContent = "YouTube playlist";
    placeholder.append(mark, label);
    thumb.appendChild(placeholder);
  }

  const play = document.createElement("span");
  play.className = "play-button";
  play.setAttribute("aria-hidden", "true");
  play.textContent = playlist ? "≡" : "▶";

  const badge = document.createElement("span");
  badge.className = "youtube-label";
  badge.textContent = `${playlist ? "Playlist" : short ? "Short" : "YouTube"} ↗`;

  thumb.append(play, badge);

  const copy = document.createElement("div");
  copy.className = "video-copy";
  const kind = document.createElement("span");
  kind.textContent = video.kind || (playlist ? "Playlist" : short ? "Short-form" : "Video editing");
  const title = document.createElement("h3");
  title.textContent = video.title || "YouTube";
  copy.append(kind, title);

  link.append(thumb, copy);
  return link;
}

if (videoGrid) {
  const videos = data.videos || [];
  const regularVideos = videos.filter((video) => !isShortVideo(video));
  const shorts = videos.filter((video) => isShortVideo(video));

  regularVideos.forEach((video) => videoGrid.appendChild(videoCard(video)));

  if (shorts.length) {
    const shortsHeading = document.createElement("div");
    shortsHeading.className = "video-subheading";
    shortsHeading.innerHTML = `
      <p class="eyebrow">Short-form</p>
      <h3>Shorts</h3>
    `;
    videoGrid.appendChild(shortsHeading);

    const shortsGrid = document.createElement("div");
    shortsGrid.className = "shorts-grid";
    shorts.forEach((video) => shortsGrid.appendChild(videoCard(video)));
    videoGrid.appendChild(shortsGrid);
  }
}

/* ---------- Party of Humanists timeline ---------- */

const humanistsTimeline = document.querySelector("#humanists-timeline");

if (humanistsTimeline) {
  (data.humanistsTimeline || []).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-date">${escapeHTML(entry.period)}</div>
      <div class="timeline-marker" aria-hidden="true"><span></span></div>
      <div class="timeline-content">
        <h3>${escapeHTML(entry.role)}</h3>
        <ul>${(entry.points || []).map((point) => `<li>${escapeHTML(point)}</li>`).join("")}</ul>
      </div>
    `;
    humanistsTimeline.appendChild(item);
  });
}

/* ---------- Gallery auto-discovery + lightbox ---------- */

const galleryGrid = document.querySelector("#gallery-grid");
const galleryTabs = document.querySelectorAll(".gallery-tab");
const galleryMoreButton = document.querySelector("#gallery-more");

const galleryLightbox = document.querySelector("#gallery-lightbox");
const galleryLightboxImage = document.querySelector("#gallery-lightbox-image");
const galleryLightboxImageWrap = document.querySelector(".gallery-lightbox-image-wrap");
const galleryLightboxCanvas = document.querySelector(".gallery-lightbox-canvas");
const galleryLightboxCaption = document.querySelector("#gallery-lightbox-caption");
const galleryLightboxCategory = document.querySelector("#gallery-lightbox-category");
const galleryLightboxCounter = document.querySelector("#gallery-lightbox-counter");
const galleryLightboxPrev = document.querySelector("#gallery-lightbox-prev");
const galleryLightboxNext = document.querySelector("#gallery-lightbox-next");
const galleryLightboxClose = document.querySelector("#gallery-lightbox-close");
const galleryLightboxZoom = document.querySelector("#gallery-lightbox-zoom");

const GALLERY_DISCOVERY_LIMIT = 110;
const GALLERY_INITIAL_COUNT = 18;
const GALLERY_MORE_COUNT = 18;

const galleryConfig = {
  photography: {
    folder: "assets/gallery/photography",
    prefix: "photo-",
    label: "Photography"
  },
  drawings: {
    folder: "assets/gallery/drawings",
    prefix: "drawing-",
    label: "Drawn Art"
  }
};

let activeGalleryType = "photography";
let activeGalleryImages = [];
let visibleGalleryCount = GALLERY_INITIAL_COUNT;
let lightboxIndex = 0;
let lightboxZoomed = false;

function galleryMetaFor(type, imageNumber) {
  const number = String(imageNumber).padStart(2, "0");
  return data.galleryMeta?.[type]?.[number] || {};
}

function galleryCaptionData(type, imageNumber) {
  const cfg = galleryConfig[type];
  const number = String(imageNumber).padStart(2, "0");
  const meta = galleryMetaFor(type, imageNumber);

  return {
    number,
    title: meta.title || "",
    medium: type === "drawings" ? (meta.medium || "") : "",
    fallback: `${cfg.label} / ${number}`
  };
}

let renderedGalleryCount = 0;

function sizeGalleryItem(figure, image) {
  if (!galleryGrid || !figure || !image?.naturalWidth || !image?.naturalHeight) return;

  const gridStyles = getComputedStyle(galleryGrid);
  const rowHeight = parseFloat(gridStyles.gridAutoRows) || 8;
  const rowGap = parseFloat(gridStyles.rowGap) || 12;
  const width = figure.getBoundingClientRect().width;
  if (!width) return;

  const imageHeight = width * (image.naturalHeight / image.naturalWidth);
  const borderAllowance = 2;
  const targetHeight = imageHeight + borderAllowance;
  const span = Math.max(1, Math.ceil((targetHeight + rowGap) / (rowHeight + rowGap)));

  figure.style.gridRowEnd = `span ${span}`;
}

function resizeAllGalleryItems() {
  galleryGrid?.querySelectorAll(".gallery-item").forEach((figure) => {
    const image = figure.querySelector("img");
    if (image?.complete) sizeGalleryItem(figure, image);
  });
}

function makeGalleryItem(entry, index, type) {
  const cfg = galleryConfig[type];
  const meta = galleryCaptionData(type, entry.number);
  const figure = document.createElement("figure");
  figure.className = "gallery-item";
  figure.tabIndex = 0;
  figure.setAttribute("role", "button");
  figure.setAttribute("aria-label", `Open ${meta.title || `${cfg.label} image ${meta.number}`}`);

  const img = document.createElement("img");
  img.src = entry.src;
  img.alt = meta.title || `${cfg.label} image ${meta.number}`;
  img.loading = "lazy";
  img.decoding = "async";

  img.addEventListener("load", () => {
    requestAnimationFrame(() => sizeGalleryItem(figure, img));
  });

  const caption = document.createElement("figcaption");
  if (meta.title || meta.medium) {
    if (meta.title) {
      const strong = document.createElement("strong");
      strong.textContent = meta.title;
      caption.appendChild(strong);
    }
    if (meta.medium) {
      const small = document.createElement("small");
      small.textContent = meta.medium;
      caption.appendChild(small);
    }
  } else {
    caption.textContent = meta.fallback;
  }

  const open = () => openGalleryLightbox(index);
  figure.addEventListener("click", open);
  figure.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  figure.append(img, caption);

  if (img.complete) {
    requestAnimationFrame(() => sizeGalleryItem(figure, img));
  }

  return figure;
}

function updateGalleryMoreButton() {
  if (!galleryMoreButton) return;
  const remaining = activeGalleryImages.length - renderedGalleryCount;
  galleryMoreButton.hidden = remaining <= 0;
  galleryMoreButton.textContent = remaining > 0
    ? `See more (${remaining} remaining)`
    : "See more";
}

function appendVisibleGalleryItems() {
  if (!galleryGrid) return;

  const targetCount = Math.min(visibleGalleryCount, activeGalleryImages.length);

  for (let index = renderedGalleryCount; index < targetCount; index += 1) {
    galleryGrid.appendChild(makeGalleryItem(activeGalleryImages[index], index, activeGalleryType));
  }

  renderedGalleryCount = targetCount;
  updateGalleryMoreButton();
}

async function renderGallery(type) {
  if (!galleryGrid) return;

  activeGalleryType = type;
  activeGalleryImages = [];
  visibleGalleryCount = GALLERY_INITIAL_COUNT;
  renderedGalleryCount = 0;

  if (galleryMoreButton) galleryMoreButton.hidden = true;
  galleryGrid.classList.add("is-loading");
  galleryGrid.replaceChildren();

  const loading = document.createElement("div");
  loading.className = "gallery-loading";
  loading.textContent = `Looking for ${galleryConfig[type].label.toLowerCase()}…`;
  galleryGrid.appendChild(loading);

  const cfg = galleryConfig[type];
  activeGalleryImages = await discoverNumberedGalleryImages(
    cfg.folder,
    GALLERY_DISCOVERY_LIMIT,
    cfg.prefix
  );

  galleryGrid.classList.remove("is-loading");
  galleryGrid.replaceChildren();

  if (!activeGalleryImages.length) {
    const empty = document.createElement("div");
    empty.className = "gallery-empty";

    const label = document.createElement("span");
    label.textContent = cfg.label;
    const heading = document.createElement("h3");
    heading.textContent = "No images added yet.";
    const paragraph = document.createElement("p");
    paragraph.textContent = `Drop ${cfg.prefix}01.jpg, ${cfg.prefix}02.jpg… into ${cfg.folder}/.`;

    empty.append(label, heading, paragraph);
    galleryGrid.appendChild(empty);
    return;
  }

  appendVisibleGalleryItems();
}

galleryMoreButton?.addEventListener("click", () => {
  visibleGalleryCount += GALLERY_MORE_COUNT;
  appendVisibleGalleryItems();
});

galleryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    galleryTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderGallery(tab.dataset.gallery);
  });
});

function fitLightboxImage() {
  if (!galleryLightboxImageWrap || !galleryLightboxImage || !galleryLightboxCanvas) return;
  if (!galleryLightboxImage.naturalWidth || !galleryLightboxImage.naturalHeight) return;

  const availableWidth = Math.max(1, galleryLightboxImageWrap.clientWidth);
  const availableHeight = Math.max(1, galleryLightboxImageWrap.clientHeight);
  const naturalWidth = galleryLightboxImage.naturalWidth;
  const naturalHeight = galleryLightboxImage.naturalHeight;

  // Calculate an exact "contain" size. The image element itself has the same
  // aspect ratio as the file, so no part of the image can be cropped.
  const scale = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight, 1);
  const fitWidth = Math.max(1, Math.round(naturalWidth * scale));
  const fitHeight = Math.max(1, Math.round(naturalHeight * scale));

  galleryLightboxImage.dataset.fitWidth = String(fitWidth);
  galleryLightboxImage.dataset.fitHeight = String(fitHeight);
  galleryLightboxImage.style.width = `${fitWidth}px`;
  galleryLightboxImage.style.height = `${fitHeight}px`;

  if (!lightboxZoomed) {
    galleryLightboxCanvas.style.setProperty("--image-width", `${fitWidth}px`);
    galleryLightboxCanvas.style.setProperty("--image-height", `${fitHeight}px`);
  }
}

function setLightboxZoom(zoomed, focus = { x: 0.5, y: 0.5 }) {
  if (!galleryLightboxImageWrap || !galleryLightboxImage || !galleryLightboxCanvas) return;

  lightboxZoomed = zoomed;
  galleryLightboxImageWrap.classList.toggle("is-zoomed", zoomed);

  if (galleryLightboxZoom) {
    galleryLightboxZoom.textContent = zoomed ? "Fit image" : "Zoom +";
  }

  if (!zoomed) {
    fitLightboxImage();
    galleryLightboxImageWrap.scrollLeft = 0;
    galleryLightboxImageWrap.scrollTop = 0;
    return;
  }

  const fitWidth = Number(galleryLightboxImage.dataset.fitWidth) || galleryLightboxImage.clientWidth;
  const fitHeight = Number(galleryLightboxImage.dataset.fitHeight) || galleryLightboxImage.clientHeight;

  // A physical-size zoom instead of CSS transform means the enlarged image
  // becomes real scrollable content rather than being clipped by the viewport.
  const zoomFactor = window.matchMedia("(max-width: 650px)").matches ? 2.6 : 2.2;
  const zoomWidth = Math.round(fitWidth * zoomFactor);
  const zoomHeight = Math.round(fitHeight * zoomFactor);

  galleryLightboxCanvas.style.setProperty("--image-width", `${zoomWidth}px`);
  galleryLightboxCanvas.style.setProperty("--image-height", `${zoomHeight}px`);
  galleryLightboxImage.style.width = `${zoomWidth}px`;
  galleryLightboxImage.style.height = `${zoomHeight}px`;

  // Wait for layout, then keep the point that was clicked in the centre of
  // the viewer. This makes zoom feel anchored to the cursor/finger position.
  requestAnimationFrame(() => {
    const canvasWidth = galleryLightboxCanvas.scrollWidth;
    const canvasHeight = galleryLightboxCanvas.scrollHeight;
    const imageOffsetX = Math.max(0, (canvasWidth - zoomWidth) / 2);
    const imageOffsetY = Math.max(0, (canvasHeight - zoomHeight) / 2);
    const targetX = imageOffsetX + focus.x * zoomWidth;
    const targetY = imageOffsetY + focus.y * zoomHeight;

    galleryLightboxImageWrap.scrollLeft = targetX - galleryLightboxImageWrap.clientWidth / 2;
    galleryLightboxImageWrap.scrollTop = targetY - galleryLightboxImageWrap.clientHeight / 2;
  });
}

function renderGalleryLightbox() {
  if (!activeGalleryImages.length || !galleryLightboxImage) return;

  lightboxIndex = (lightboxIndex + activeGalleryImages.length) % activeGalleryImages.length;
  const entry = activeGalleryImages[lightboxIndex];
  const meta = galleryCaptionData(activeGalleryType, entry.number);
  const cfg = galleryConfig[activeGalleryType];

  setLightboxZoom(false);
  galleryLightboxImage.onload = () => fitLightboxImage();
  galleryLightboxImage.src = entry.src;
  galleryLightboxImage.alt = meta.title || `${cfg.label} image ${meta.number}`;
  if (galleryLightboxImage.complete) fitLightboxImage();
  galleryLightboxCategory.textContent = cfg.label;
  galleryLightboxCounter.textContent = `${lightboxIndex + 1} / ${activeGalleryImages.length}`;

  galleryLightboxCaption.replaceChildren();
  if (meta.title || meta.medium) {
    if (meta.title) {
      const strong = document.createElement("strong");
      strong.textContent = meta.title;
      galleryLightboxCaption.appendChild(strong);
    }
    if (meta.medium) {
      const small = document.createElement("small");
      small.textContent = meta.medium;
      galleryLightboxCaption.appendChild(small);
    }
  } else {
    galleryLightboxCaption.textContent = meta.fallback;
  }

  const hasMultiple = activeGalleryImages.length > 1;
  galleryLightboxPrev.disabled = !hasMultiple;
  galleryLightboxNext.disabled = !hasMultiple;
}

function openGalleryLightbox(index) {
  if (!galleryLightbox || !activeGalleryImages.length) return;
  lightboxIndex = index;
  renderGalleryLightbox();
  galleryLightbox.showModal();
  document.body.classList.add("lightbox-open");

  // The dialog has no measurable viewport until it is open. Re-fit on the
  // next frame so even cached images get the correct full-image dimensions.
  requestAnimationFrame(() => {
    if (galleryLightboxImage?.complete) fitLightboxImage();
  });
}

function closeGalleryLightbox() {
  if (!galleryLightbox?.open) return;
  galleryLightbox.close();
  document.body.classList.remove("lightbox-open");
  setLightboxZoom(false);
}

function moveGalleryLightbox(direction) {
  if (activeGalleryImages.length < 2) return;
  lightboxIndex += direction;
  renderGalleryLightbox();
}

galleryLightboxPrev?.addEventListener("click", () => moveGalleryLightbox(-1));
galleryLightboxNext?.addEventListener("click", () => moveGalleryLightbox(1));
galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);
galleryLightboxZoom?.addEventListener("click", () => setLightboxZoom(!lightboxZoomed));
galleryLightboxImage?.addEventListener("click", (event) => {
  if (lightboxZoomed) {
    setLightboxZoom(false);
    return;
  }

  const rect = galleryLightboxImage.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  setLightboxZoom(true, { x, y });
});

galleryLightbox?.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  setLightboxZoom(false);
});

galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) closeGalleryLightbox();
});

let galleryResizeTimer = null;
window.addEventListener("resize", () => {
  if (galleryLightbox?.open && !lightboxZoomed) fitLightboxImage();

  clearTimeout(galleryResizeTimer);
  galleryResizeTimer = setTimeout(resizeAllGalleryItems, 100);
});

document.addEventListener("keydown", (event) => {
  if (!galleryLightbox?.open) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveGalleryLightbox(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveGalleryLightbox(1);
  }
});

if (galleryGrid) renderGallery("photography");

/* ---------- Blog homepage preview ---------- */

const homeBlogPosts = document.querySelector("#home-blog-posts");

function postCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";

  const meta = document.createElement("div");
  meta.className = "post-meta";
  const date = document.createElement("span");
  date.textContent = post.date || "";
  const tags = document.createElement("span");
  tags.textContent = (post.tags || []).join(" · ");
  meta.append(date, tags);

  const heading = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.textContent = post.title || "Untitled";
  const safePostUrl = safeLocalUrl(post.url || "");
  if (safePostUrl) titleLink.href = safePostUrl;
  heading.appendChild(titleLink);

  const summary = document.createElement("p");
  summary.textContent = post.summary || "";

  const read = document.createElement("a");
  read.className = "post-read";
  if (safePostUrl) read.href = safePostUrl;
  read.textContent = "Read post ↗";

  article.append(meta, heading, summary, read);
  return article;
}

if (homeBlogPosts) {
  if (!blogPosts.length) {
    homeBlogPosts.innerHTML = `
      <div class="post-empty">
        <span>Blog archive</span>
        <h3>No posts yet.</h3>
        <p>The structure is ready for the first topic.</p>
      </div>
    `;
  } else {
    blogPosts.slice(0, 3).forEach((post) => homeBlogPosts.appendChild(postCard(post)));
  }
}
