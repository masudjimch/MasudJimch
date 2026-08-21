// Click-to-edit admin panel.
// Loads SITE_CONTENT (from content.js), lets you edit it with plain form fields,
// and lets you download a new content.js to upload to your GitHub repo.

let data = JSON.parse(JSON.stringify(SITE_CONTENT)); // working copy

function field({ label, value, onChange, textarea = false, span2 = false }) {
  const wrap = document.createElement("div");
  wrap.className = "field" + (span2 ? " span-2" : "");
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = document.createElement(textarea ? "textarea" : "input");
  if (!textarea) input.type = "text";
  input.value = value ?? "";
  input.addEventListener("input", () => onChange(input.value));
  wrap.appendChild(lbl);
  wrap.appendChild(input);
  return wrap;
}

function removeBtn(onClick) {
  const btn = document.createElement("button");
  btn.className = "remove-btn";
  btn.type = "button";
  btn.textContent = "Remove ✕";
  btn.addEventListener("click", onClick);
  return btn;
}

function clear(elOrId) {
  const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
  el.innerHTML = "";
  return el;
}

/* ---------------- SITE + NAV ---------------- */
function renderSite() {
  const c = clear("site-fields");
  c.appendChild(field({ label: "Your name (shown in header)", value: data.site.name, onChange: v => data.site.name = v }));
  c.appendChild(field({ label: "Tagline", value: data.site.tagline, onChange: v => data.site.tagline = v }));
  c.appendChild(field({ label: "Footer note", value: data.site.footerNote, onChange: v => data.site.footerNote = v, span2: true }));

  const navList = clear("nav-list");
  data.nav.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Menu label", value: item.label, onChange: v => item.label = v }));
    grid.appendChild(field({ label: "Links to (e.g. #about)", value: item.href, onChange: v => item.href = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { data.nav.splice(i, 1); renderSite(); }));
    navList.appendChild(row);
  });
}

/* ---------------- HERO ---------------- */
function renderHero() {
  const c = clear("hero-fields");
  const h = data.hero;
  c.appendChild(field({ label: "Small label above name", value: h.eyebrow, onChange: v => h.eyebrow = v }));
  c.appendChild(field({ label: "Full name / heading", value: h.name, onChange: v => h.name = v }));
  c.appendChild(field({ label: "Role / title", value: h.role, onChange: v => h.role = v }));
  c.appendChild(field({ label: "Tagline", value: h.tagline, onChange: v => h.tagline = v, textarea: true, span2: true }));
  c.appendChild(field({ label: "Button text", value: h.ctaLabel, onChange: v => h.ctaLabel = v }));
  c.appendChild(field({ label: "Button links to", value: h.ctaHref, onChange: v => h.ctaHref = v }));
  c.appendChild(field({ label: "Photo path (images/yourfile.jpg)", value: h.photo, onChange: v => h.photo = v, span2: true }));
}

/* ---------------- ABOUT ---------------- */
function renderAbout() {
  const c = clear("about-fields");
  const a = data.about;
  c.appendChild(field({ label: "Section heading", value: a.heading, onChange: v => a.heading = v }));
  c.appendChild(field({ label: "Photo path (images/yourfile.jpg)", value: a.photo, onChange: v => a.photo = v }));

  const paras = clear("about-paragraphs");
  a.paragraphs.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    row.appendChild(field({ label: `Paragraph ${i + 1}`, value: p, textarea: true, span2: true, onChange: v => a.paragraphs[i] = v }));
    row.appendChild(removeBtn(() => { a.paragraphs.splice(i, 1); renderAbout(); }));
    paras.appendChild(row);
  });

  const creds = clear("about-credentials-list");
  a.credentials.forEach((cred, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    row.appendChild(field({ label: `Credential ${i + 1}`, value: cred, span2: true, onChange: v => a.credentials[i] = v }));
    row.appendChild(removeBtn(() => { a.credentials.splice(i, 1); renderAbout(); }));
    creds.appendChild(row);
  });

  const stats = clear("about-stats-list");
  a.stats.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Value (e.g. 10+)", value: s.value, onChange: v => s.value = v }));
    grid.appendChild(field({ label: "Label (e.g. Years in practice)", value: s.label, onChange: v => s.label = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { a.stats.splice(i, 1); renderAbout(); }));
    stats.appendChild(row);
  });
}

/* ---------------- PUBLICATIONS ---------------- */
function renderPublications() {
  const c = clear("publications-fields");
  const p = data.publications;
  c.appendChild(field({ label: "Section heading", value: p.heading, onChange: v => p.heading = v }));
  c.appendChild(field({ label: "Subheading", value: p.subheading, onChange: v => p.subheading = v }));

  const catsWrap = clear("publications-categories");
  p.categories.forEach((cat, ci) => {
    const block = document.createElement("div");
    block.className = "category-block";
    const h4 = document.createElement("h4");
    h4.textContent = "Tab / category";
    block.appendChild(h4);
    block.appendChild(removeBtn(() => { p.categories.splice(ci, 1); renderPublications(); }));

    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Tab name (e.g. Research Papers)", value: cat.label, onChange: v => cat.label = v }));
    block.appendChild(grid);

    const itemsInner = document.createElement("div");
    itemsInner.className = "items-inner";
    cat.items.forEach((item, ii) => {
      const row = document.createElement("div");
      row.className = "repeat-item";
      const g = document.createElement("div");
      g.className = "field-grid";
      g.appendChild(field({ label: "Title", value: item.title, span2: true, onChange: v => item.title = v }));
      g.appendChild(field({ label: "Journal / publisher", value: item.journal, onChange: v => item.journal = v }));
      g.appendChild(field({ label: "Year", value: item.year, onChange: v => item.year = v }));
      g.appendChild(field({ label: "Link (URL)", value: item.link, span2: true, onChange: v => item.link = v }));
      row.appendChild(g);
      row.appendChild(removeBtn(() => { cat.items.splice(ii, 1); renderPublications(); }));
      itemsInner.appendChild(row);
    });
    const addItemBtn = document.createElement("button");
    addItemBtn.className = "btn-add";
    addItemBtn.type = "button";
    addItemBtn.textContent = "+ Add publication to this tab";
    addItemBtn.addEventListener("click", () => {
      cat.items.push({ title: "New publication title", journal: "Journal name", year: "2025", link: "#" });
      renderPublications();
    });
    itemsInner.appendChild(addItemBtn);
    block.appendChild(itemsInner);
    catsWrap.appendChild(block);
  });
}

/* ---------------- GALLERY ---------------- */
function renderGallery() {
  const c = clear("gallery-fields");
  const g = data.gallery;
  c.appendChild(field({ label: "Section heading", value: g.heading, onChange: v => g.heading = v }));
  c.appendChild(field({ label: "Subheading", value: g.subheading, onChange: v => g.subheading = v }));

  const catsWrap = clear("gallery-categories");
  g.categories.forEach((cat, ci) => {
    const block = document.createElement("div");
    block.className = "category-block";
    const h4 = document.createElement("h4");
    h4.textContent = "Tab / category";
    block.appendChild(h4);
    block.appendChild(removeBtn(() => { g.categories.splice(ci, 1); renderGallery(); }));

    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Tab name (e.g. Clinic)", value: cat.label, onChange: v => cat.label = v }));
    block.appendChild(grid);

    const itemsInner = document.createElement("div");
    itemsInner.className = "items-inner";
    cat.images.forEach((img, ii) => {
      const row = document.createElement("div");
      row.className = "repeat-item";
      const gg = document.createElement("div");
      gg.className = "field-grid";
      gg.appendChild(field({ label: "Image path (images/yourfile.jpg)", value: img.src, span2: true, onChange: v => img.src = v }));
      gg.appendChild(field({ label: "Caption", value: img.caption, span2: true, onChange: v => img.caption = v }));
      row.appendChild(gg);
      row.appendChild(removeBtn(() => { cat.images.splice(ii, 1); renderGallery(); }));
      itemsInner.appendChild(row);
    });
    const addImgBtn = document.createElement("button");
    addImgBtn.className = "btn-add";
    addImgBtn.type = "button";
    addImgBtn.textContent = "+ Add photo to this tab";
    addImgBtn.addEventListener("click", () => {
      cat.images.push({ src: "images/new-photo.jpg", caption: "Caption here" });
      renderGallery();
    });
    itemsInner.appendChild(addImgBtn);
    block.appendChild(itemsInner);
    catsWrap.appendChild(block);
  });
}

/* ---------------- CONTACT ---------------- */
function renderContact() {
  const c = clear("contact-fields");
  const ct = data.contact;
  c.appendChild(field({ label: "Section heading", value: ct.heading, onChange: v => ct.heading = v }));
  c.appendChild(field({ label: "Subheading", value: ct.subheading, onChange: v => ct.subheading = v, span2: true }));
  c.appendChild(field({ label: "Email", value: ct.email, onChange: v => ct.email = v }));
  c.appendChild(field({ label: "Phone", value: ct.phone, onChange: v => ct.phone = v }));
  c.appendChild(field({ label: "Location", value: ct.location, onChange: v => ct.location = v, span2: true }));

  const links = clear("contact-links-list");
  ct.links.forEach((l, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Label (e.g. LinkedIn)", value: l.label, onChange: v => l.label = v }));
    grid.appendChild(field({ label: "URL", value: l.url, onChange: v => l.url = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { ct.links.splice(i, 1); renderContact(); }));
    links.appendChild(row);
  });
}

/* ---------------- ADD BUTTONS (top-level) ---------------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const type = btn.dataset.add;
  if (type === "nav") { data.nav.push({ label: "New item", href: "#" }); renderSite(); }
  if (type === "paragraph") { data.about.paragraphs.push("New paragraph text."); renderAbout(); }
  if (type === "credential") { data.about.credentials.push("New credential"); renderAbout(); }
  if (type === "stat") { data.about.stats.push({ value: "0", label: "New stat" }); renderAbout(); }
  if (type === "contact-link") { data.contact.links.push({ label: "New link", url: "https://" }); renderContact(); }
  if (type === "pub-category") {
    data.publications.categories.push({ id: "cat" + Date.now(), label: "New tab", items: [] });
    renderPublications();
  }
  if (type === "gallery-category") {
    data.gallery.categories.push({ id: "cat" + Date.now(), label: "New tab", images: [] });
    renderGallery();
  }
});

/* ---------------- DOWNLOAD ---------------- */
function downloadContent() {
  const fileText =
`/*
  CONTENT.JS — generated by admin.html
  Upload this file into the js/ folder of your GitHub repo, replacing the old one.
*/

const SITE_CONTENT = ${JSON.stringify(data, null, 2)};
`;
  const blob = new Blob([fileText], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("content.js downloaded — upload it to your repo's js/ folder");
}

function showToast(msg) {
  let t = document.getElementById("admin-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "admin-toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

document.getElementById("download-btn").addEventListener("click", downloadContent);
document.getElementById("download-btn-bottom").addEventListener("click", downloadContent);

/* ---------------- INIT ---------------- */
renderSite();
renderHero();
renderAbout();
renderPublications();
renderGallery();
renderContact();
