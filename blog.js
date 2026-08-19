const posts = window.BLOG_POSTS || [];
const list = document.querySelector("#blog-list");

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

if (!posts.length) {
  const empty = document.createElement("div");
  empty.className = "blog-empty";
  const text = document.createElement("p");
  text.textContent = "No posts yet. The first article can be added using posts/_template.html.";
  empty.appendChild(text);
  list.appendChild(empty);
} else {
  posts.forEach((post) => {
    const link = document.createElement("a");
    link.className = "blog-list-item";

    const safeUrl = safeLocalUrl(post.url || "");
    if (safeUrl) link.href = safeUrl;

    const time = document.createElement("time");
    time.textContent = post.date || "";

    const content = document.createElement("div");
    const tags = document.createElement("div");
    tags.className = "tags";
    tags.textContent = (post.tags || []).join(" · ");

    const heading = document.createElement("h2");
    heading.textContent = post.title || "Untitled";

    const summary = document.createElement("p");
    summary.textContent = post.summary || "";

    content.append(tags, heading, summary);

    const arrow = document.createElement("span");
    arrow.className = "blog-arrow";
    arrow.textContent = "↗";

    link.append(time, content, arrow);
    list.appendChild(link);
  });
}
