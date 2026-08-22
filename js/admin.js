// Click-to-edit admin panel.
// Loads SITE_CONTENT (from content.js), lets you edit it with plain form fields,
// and lets you download a new content.js to upload to your GitHub repo.

let data = JSON.parse(JSON.stringify(SITE_CONTENT)); // working copy

// Backward-compatible: older content.js files won't have an "apps" section yet.
data.apps = data.apps || { heading: "Apps", subheading: "Apps I've built — view details, download, or buy.", items: [] };
data.site.fontPreset = data.site.fontPreset || "theme-default";

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

/* ---------------- DRAG & REORDER ---------------- */
function moveInArray(arr, from, to) {
  if (to < 0 || to >= arr.length || from === to) return;
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
}

function attachDrag(itemEl, index, arr, rerender) {
  itemEl.draggable = true;
  itemEl.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
    itemEl.classList.add("dragging");
  });
  itemEl.addEventListener("dragend", () => itemEl.classList.remove("dragging"));
  itemEl.addEventListener("dragover", (e) => { e.preventDefault(); itemEl.classList.add("drag-over"); });
  itemEl.addEventListener("dragleave", () => itemEl.classList.remove("drag-over"));
  itemEl.addEventListener("drop", (e) => {
    e.preventDefault();
    itemEl.classList.remove("drag-over");
    const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(fromIdx)) return;
    moveInArray(arr, fromIdx, index);
    rerender();
  });
}

// Adds a drag handle + up/down buttons to an item, and wires up drag-and-drop on it.
function attachReorder(itemEl, arr, index, rerender) {
  itemEl.classList.add("has-toolbar");
  const wrap = document.createElement("div");
  wrap.className = "item-toolbar";

  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.textContent = "⠿";
  handle.title = "Drag to reorder";

  const btns = document.createElement("div");
  btns.className = "reorder-btns";
  const up = document.createElement("button");
  up.type = "button"; up.className = "reorder-btn"; up.textContent = "▲"; up.title = "Move up";
  up.disabled = index === 0;
  up.addEventListener("click", () => { moveInArray(arr, index, index - 1); rerender(); });
  const down = document.createElement("button");
  down.type = "button"; down.className = "reorder-btn"; down.textContent = "▼"; down.title = "Move down";
  down.disabled = index === arr.length - 1;
  down.addEventListener("click", () => { moveInArray(arr, index, index + 1); rerender(); });
  btns.appendChild(up);
  btns.appendChild(down);

  wrap.appendChild(handle);
  wrap.appendChild(btns);
  itemEl.appendChild(wrap);
  attachDrag(itemEl, index, arr, rerender);
}

/* ---------------- ICON PICKER ---------------- */
const ICON_PRESETS = ["📧", "☎️", "🌐", "💼", "✕", "📘", "📷", "▶️", "🐙", "🔬", "🎓", "💬", "✈️", "📍", "🔗", "✨"];

function iconPickerField(label, value, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "field icon-picker";
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value ?? "";
  input.maxLength = 4;
  input.addEventListener("input", () => onChange(input.value));

  const chips = document.createElement("div");
  chips.className = "icon-picker-chips";
  ICON_PRESETS.forEach(icon => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "icon-chip" + (icon === value ? " active" : "");
    chip.textContent = icon;
    chip.addEventListener("click", () => {
      input.value = icon;
      onChange(icon);
      chips.querySelectorAll(".icon-chip").forEach(c => c.classList.toggle("active", c === chip));
    });
    chips.appendChild(chip);
  });

  wrap.appendChild(lbl);
  wrap.appendChild(input);
  wrap.appendChild(chips);
  return wrap;
}

/* ---------------- THEME & STYLE ---------------- */
function refreshStyling() {
  applyStyling(data.site.theme, data.site.fontPreset);
}

function renderThemeSwatches() {
  const wrap = clear("theme-swatches");
  data.site.theme = data.site.theme || "navy-gold";

  THEMES.forEach(theme => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "theme-swatch" + (theme.id === data.site.theme ? " active" : "");
    card.style.setProperty("--sw-paper", theme.vars.paper);
    card.style.setProperty("--sw-night", theme.vars.night);
    card.style.setProperty("--sw-gold", theme.vars.gold);
    card.style.setProperty("--sw-sage", theme.vars.sage);
    card.style.setProperty("--sw-radius", theme.radius);
    card.innerHTML = `
      <span class="sw-dots">
        <span class="sw-dot sw-dot-paper"></span>
        <span class="sw-dot sw-dot-night"></span>
        <span class="sw-dot sw-dot-gold"></span>
        <span class="sw-dot sw-dot-sage"></span>
      </span>
      <span class="sw-name">${theme.name}</span>
      <span class="sw-desc">${theme.description}</span>
    `;
    card.addEventListener("click", () => {
      data.site.theme = theme.id;
      refreshStyling(); // instant live preview, including on this admin page
      renderThemeSwatches();
      showToast(`Theme set to "${theme.name}"`);
    });
    wrap.appendChild(card);
  });
}

function renderFontSwatches() {
  const wrap = clear("font-swatches");
  data.site.fontPreset = data.site.fontPreset || "theme-default";

  FONT_PRESETS.forEach(preset => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "theme-swatch font-swatch" + (preset.id === data.site.fontPreset ? " active" : "");
    card.innerHTML = `
      <span class="font-preview" style="font-family:${preset.fontDisplay || "var(--font-display)"}">Aa</span>
      <span class="sw-name">${preset.name}</span>
      <span class="sw-desc">${preset.description}</span>
    `;
    card.addEventListener("click", () => {
      data.site.fontPreset = preset.id;
      refreshStyling();
      renderFontSwatches();
      showToast(`Font set to "${preset.name}"`);
    });
    wrap.appendChild(card);
  });
}

/* ---------------- GITHUB CONNECT & SAVE ---------------- */
function renderGithubFields() {
  const cfg = ghLoadConfig() || { owner: "", repo: "", branch: "main", token: "" };
  const c = clear("github-fields");

  c.appendChild(field({ label: "GitHub username / organization", value: cfg.owner, onChange: v => { cfg.owner = v; ghSaveConfig(cfg); } }));
  c.appendChild(field({ label: "Repository name", value: cfg.repo, onChange: v => { cfg.repo = v; ghSaveConfig(cfg); } }));
  c.appendChild(field({ label: "Branch", value: cfg.branch || "main", onChange: v => { cfg.branch = v; ghSaveConfig(cfg); } }));

  const tokenField = field({ label: "Personal access token", value: cfg.token, onChange: v => { cfg.token = v; ghSaveConfig(cfg); }, span2: true });
  const tokenInput = tokenField.querySelector("input");
  tokenInput.type = "password";
  tokenInput.autocomplete = "off";
  c.appendChild(tokenField);

  if (!cfg.owner && !cfg.repo && !cfg.token) ghSaveConfig(cfg);
}

function setGithubStatus(msg, isError) {
  const el = document.getElementById("github-status");
  el.textContent = msg;
  el.classList.toggle("error", !!isError);
}

async function handleGithubTest() {
  const cfg = ghLoadConfig();
  if (!cfg || !cfg.owner || !cfg.repo || !cfg.token) {
    setGithubStatus("Fill in username, repository, and token first.", true);
    return;
  }
  setGithubStatus("Testing connection…");
  try {
    const result = await ghTestConnection(cfg);
    setGithubStatus(result.message, !result.ok);
  } catch (e) {
    setGithubStatus("Connection failed: " + e.message, true);
  }
}

function handleGithubForget() {
  ghClearConfig();
  renderGithubFields();
  setGithubStatus("Saved token removed from this browser.");
}

async function handleSaveToGithub() {
  const cfg = ghLoadConfig();
  if (!cfg || !cfg.owner || !cfg.repo || !cfg.token) {
    setGithubStatus("Connect to GitHub first (fill in the fields above).", true);
    document.getElementById("github-card").scrollIntoView({ behavior: "smooth" });
    return;
  }
  cfg.branch = cfg.branch || "main";

  const buttons = [document.getElementById("save-github-btn"), document.getElementById("save-github-btn-bottom")];
  buttons.forEach(b => { if (b) { b.disabled = true; b.dataset.origText = b.textContent; b.textContent = "Saving…"; } });
  setGithubStatus("Saving to GitHub…");

  try {
    const fileText = buildContentFileText();
    const result = await ghSaveFile(cfg, "js/content.js", fileText, "Update portfolio content via admin panel");
    if (result.ok) {
      setGithubStatus("✓ Saved! Your live site will update within a minute or two.");
      showToast("Saved to GitHub");
    } else {
      setGithubStatus("Save failed: " + result.message, true);
    }
  } catch (e) {
    setGithubStatus("Save failed: " + e.message, true);
  } finally {
    buttons.forEach(b => { if (b) { b.disabled = false; b.textContent = b.dataset.origText; } });
  }
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
    attachReorder(row, data.nav, i, renderSite);
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
  c.appendChild(field({ label: "Button icon (emoji)", value: h.ctaIcon, onChange: v => h.ctaIcon = v }));
  c.appendChild(field({ label: "Button links to", value: h.ctaHref, onChange: v => h.ctaHref = v }));
  c.appendChild(field({ label: "Photo path (images/yourfile.jpg)", value: h.photo, onChange: v => h.photo = v, span2: true }));
  c.appendChild(field({ label: "Status text (e.g. Available)", value: h.status, onChange: v => h.status = v }));

  const badgeList = clear("hero-badges-list");
  (h.badges || []).forEach((b, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Emoji/icon", value: b.icon, onChange: v => b.icon = v }));
    grid.appendChild(field({ label: "Label (e.g. Physician)", value: b.label, onChange: v => b.label = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { h.badges.splice(i, 1); renderHero(); }));
    attachReorder(row, h.badges, i, renderHero);
    badgeList.appendChild(row);
  });
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

/* ---------------- PDF UPLOAD ---------------- */
const PDF_MAX_BYTES = 4 * 1024 * 1024; // 4MB — keeps content.js a reasonable size

function buildPdfUploader(item, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "pdf-uploader";

  const label = document.createElement("label");
  label.textContent = "Publication PDF";
  wrap.appendChild(label);

  if (item.pdfDataUrl) {
    const status = document.createElement("div");
    status.className = "pdf-status";
    status.innerHTML = `
      <span class="pdf-filename">📄 ${item.pdfName || "uploaded.pdf"}</span>
      <a href="${item.pdfDataUrl}" target="_blank" rel="noopener">Preview</a>
      <button type="button" class="remove-btn pdf-remove">Remove PDF ✕</button>
    `;
    status.querySelector(".pdf-remove").addEventListener("click", () => {
      item.pdfDataUrl = "";
      item.pdfName = "";
      onChange();
    });
    wrap.appendChild(status);
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > PDF_MAX_BYTES) {
        showToast(`"${file.name}" is too large (max 4MB). Try compressing the PDF.`);
        input.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        item.pdfDataUrl = reader.result;
        item.pdfName = file.name;
        onChange();
      };
      reader.readAsDataURL(file);
    });
    wrap.appendChild(input);
  }

  return wrap;
}

/* ---------------- APPS ---------------- */
const ICON_MAX_BYTES = 1.5 * 1024 * 1024; // 1.5MB — app icons should be small

function buildIconUploader(app, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "pdf-uploader";
  const label = document.createElement("label");
  label.textContent = "App icon";
  wrap.appendChild(label);

  const status = document.createElement("div");
  status.className = "pdf-status";
  status.innerHTML = `<img src="${app.icon}" alt="" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">`;
  wrap.appendChild(status);

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > ICON_MAX_BYTES) {
      showToast(`"${file.name}" is too large (max 1.5MB). Try a smaller image.`);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      app.icon = reader.result;
      onChange();
    };
    reader.readAsDataURL(file);
  });
  wrap.appendChild(input);
  return wrap;
}

function renderApps() {
  const c = clear("apps-fields");
  const apps = data.apps;
  c.appendChild(field({ label: "Section heading", value: apps.heading, onChange: v => apps.heading = v }));
  c.appendChild(field({ label: "Subheading", value: apps.subheading, onChange: v => apps.subheading = v, span2: true }));

  const list = clear("apps-list");
  apps.items.forEach((app, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";

    row.appendChild(buildIconUploader(app, renderApps));

    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "App name", value: app.name, onChange: v => app.name = v }));
    grid.appendChild(field({ label: "Platform (e.g. Android, iOS, Web)", value: app.platform, onChange: v => app.platform = v }));
    grid.appendChild(field({ label: "Tagline / short description", value: app.tagline, span2: true, onChange: v => app.tagline = v }));
    grid.appendChild(field({ label: "Price (e.g. Free, $2.99)", value: app.price, onChange: v => app.price = v }));
    grid.appendChild(field({ label: "Rating (0–5, e.g. 4.5)", value: String(app.rating ?? ""), onChange: v => app.rating = parseFloat(v) || 0 }));
    grid.appendChild(field({ label: "Rating count text (e.g. 120 reviews)", value: app.ratingCount, onChange: v => app.ratingCount = v }));
    grid.appendChild(field({ label: "Primary button label (e.g. Get on Play Store)", value: app.primaryCtaLabel, onChange: v => app.primaryCtaLabel = v }));
    grid.appendChild(field({ label: "Primary button URL", value: app.primaryCtaUrl, onChange: v => app.primaryCtaUrl = v }));
    grid.appendChild(field({ label: "Secondary button label (optional, e.g. Direct Download)", value: app.secondaryCtaLabel, onChange: v => app.secondaryCtaLabel = v }));
    grid.appendChild(field({ label: "Secondary button URL (optional)", value: app.secondaryCtaUrl, onChange: v => app.secondaryCtaUrl = v }));
    row.appendChild(grid);

    row.appendChild(removeBtn(() => { apps.items.splice(i, 1); renderApps(); }));
    attachReorder(row, apps.items, i, renderApps);
    list.appendChild(row);
  });
}
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
    attachReorder(block, p.categories, ci, renderPublications);

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
      g.appendChild(field({ label: "Link (URL, optional)", value: item.link, span2: true, onChange: v => item.link = v }));
      row.appendChild(g);
      row.appendChild(buildPdfUploader(item, () => renderPublications()));
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
    attachReorder(block, g.categories, ci, renderGallery);

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

  // Migrate legacy single-email schema to the new emails[] list, once.
  if (!ct.emails) {
    ct.emails = ct.email ? [{ icon: "📧", label: "Email", value: ct.email }] : [{ icon: "📧", label: "Email", value: "" }];
    delete ct.email;
  }
  // Make sure older links (saved before icons existed) have a default icon.
  (ct.links || []).forEach(l => { if (!l.icon) l.icon = "🔗"; });

  c.appendChild(field({ label: "Section heading", value: ct.heading, onChange: v => ct.heading = v }));
  c.appendChild(field({ label: "Subheading", value: ct.subheading, onChange: v => ct.subheading = v, span2: true }));
  c.appendChild(field({ label: "Phone", value: ct.phone, onChange: v => ct.phone = v }));
  c.appendChild(field({ label: "Location", value: ct.location, onChange: v => ct.location = v }));

  const emailsList = clear("contact-emails-list");
  ct.emails.forEach((em, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(iconPickerField("Icon", em.icon, v => em.icon = v));
    grid.appendChild(field({ label: "Label (e.g. Work Email)", value: em.label, onChange: v => em.label = v }));
    grid.appendChild(field({ label: "Email address", value: em.value, span2: true, onChange: v => em.value = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { ct.emails.splice(i, 1); renderContact(); }));
    attachReorder(row, ct.emails, i, renderContact);
    emailsList.appendChild(row);
  });

  const links = clear("contact-links-list");
  ct.links.forEach((l, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(iconPickerField("Icon", l.icon, v => l.icon = v));
    grid.appendChild(field({ label: "Label (e.g. LinkedIn)", value: l.label, onChange: v => l.label = v }));
    grid.appendChild(field({ label: "URL", value: l.url, span2: true, onChange: v => l.url = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { ct.links.splice(i, 1); renderContact(); }));
    attachReorder(row, ct.links, i, renderContact);
    links.appendChild(row);
  });
}

/* ---------------- ADD BUTTONS (top-level) ---------------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const type = btn.dataset.add;
  if (type === "nav") { data.nav.push({ label: "New item", href: "#" }); renderSite(); }
  if (type === "hero-badge") { data.hero.badges = data.hero.badges || []; data.hero.badges.push({ icon: "✨", label: "New badge" }); renderHero(); }
  if (type === "paragraph") { data.about.paragraphs.push("New paragraph text."); renderAbout(); }
  if (type === "credential") { data.about.credentials.push("New credential"); renderAbout(); }
  if (type === "stat") { data.about.stats.push({ value: "0", label: "New stat" }); renderAbout(); }
  if (type === "contact-email") { data.contact.emails = data.contact.emails || []; data.contact.emails.push({ icon: "📧", label: "Email", value: "" }); renderContact(); }
  if (type === "contact-link") { data.contact.links.push({ icon: "🔗", label: "New link", url: "https://" }); renderContact(); }
  if (type === "app") {
    data.apps.items.push({
      icon: "images/app-icon-placeholder.svg", name: "New App", tagline: "Short description here.",
      platform: "Android", price: "Free", rating: 5, ratingCount: "",
      primaryCtaLabel: "View", primaryCtaUrl: "#", secondaryCtaLabel: "", secondaryCtaUrl: ""
    });
    renderApps();
  }
  if (type === "pub-category") {
    data.publications.categories.push({ id: "cat" + Date.now(), label: "New tab", items: [] });
    renderPublications();
  }
  if (type === "gallery-category") {
    data.gallery.categories.push({ id: "cat" + Date.now(), label: "New tab", images: [] });
    renderGallery();
  }
});

/* ---------------- DOWNLOAD / SAVE ---------------- */
function buildContentFileText() {
  return `/*
  CONTENT.JS — generated by admin.html
  Upload this file into the js/ folder of your GitHub repo, replacing the old one.
*/

const SITE_CONTENT = ${JSON.stringify(data, null, 2)};
`;
}

function downloadContent() {
  const fileText = buildContentFileText();
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
document.getElementById("save-github-btn").addEventListener("click", handleSaveToGithub);
document.getElementById("save-github-btn-bottom").addEventListener("click", handleSaveToGithub);
document.getElementById("github-test-btn").addEventListener("click", handleGithubTest);
document.getElementById("github-forget-btn").addEventListener("click", handleGithubForget);

/* ---------------- INIT ---------------- */
renderGithubFields();
renderThemeSwatches();
renderFontSwatches();
renderSite();
renderHero();
renderAbout();
renderPublications();
renderApps();
renderGallery();
renderContact();
