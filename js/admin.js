// Click-to-edit admin panel.
// Loads SITE_CONTENT (from content.js), lets you edit it with plain form fields,
// and lets you download a new content.js to upload to your GitHub repo.

let data = JSON.parse(JSON.stringify(SITE_CONTENT)); // working copy

// Backward-compatible: older content.js files won't have an "apps" section yet.
data.apps = data.apps || { heading: "Apps", subheading: "Apps I've built — view details, download, or buy.", items: [] };
data.site.fontPreset = data.site.fontPreset || "theme-default";
data.site.sectionStyles = data.site.sectionStyles || {};
data.cv = data.cv || { dataUrl: "", name: "" };
data.journey = data.journey || { heading: "Journey", subheading: "Milestones, awards, and speaking engagements", items: [] };
data.testimonials = data.testimonials || { heading: "Testimonials", subheading: "What patients and colleagues say", items: [] };
data.blog = data.blog || { heading: "Blog", subheading: "Notes and articles", items: [] };
data.faq = data.faq || { heading: "FAQ", subheading: "Common questions", items: [] };
data.customSections = data.customSections || [];

function field({ label, value, onChange, textarea = false, span2 = false, richText = true, statusLabel = null }) {
  const wrap = document.createElement("div");
  wrap.className = "field" + (span2 ? " span-2" : "");
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = document.createElement(textarea ? "textarea" : "input");
  if (!textarea) input.type = "text";
  input.value = value ?? "";
  input.addEventListener("input", () => onChange(input.value));
  if (richText) {
    input.classList.add("formattable");
    input.addEventListener("focus", () => setActiveFormatField(input, statusLabel || label));
  }
  wrap.appendChild(lbl);
  wrap.appendChild(input);
  return wrap;
}

function checkboxField({ label, checked, onChange }) {
  const wrap = document.createElement("label");
  wrap.className = "checkbox-field";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  const span = document.createElement("span");
  span.textContent = label;
  wrap.appendChild(input);
  wrap.appendChild(span);
  return wrap;
}

function toggleSwitch({ checked, onChange }) {
  const label = document.createElement("label");
  label.className = "toggle-switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  const slider = document.createElement("span");
  slider.className = "toggle-slider";
  label.appendChild(input);
  label.appendChild(slider);
  return label;
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

/* ---------------- PER-SECTION FONT & COLOR ---------------- */
const SECTION_LABELS = {
  home: "Home / Hero", about: "About", publications: "Publications", apps: "Apps",
  journey: "Journey", testimonials: "Testimonials", blog: "Blog",
  gallery: "Gallery", faq: "FAQ", contact: "Contact"
};

function getSectionLabel(id) {
  if (SECTION_LABELS[id]) return SECTION_LABELS[id];
  const cs = (data.customSections || []).find(c => c.id === id);
  if (cs) return (cs.title && (cs.title.en || cs.title.bn)) || "Untitled section";
  return id;
}

function renderSectionStyles() {
  const wrap = clear("section-styles-list");
  data.site.sectionStyles = data.site.sectionStyles || {};

  getAllSectionIds(data.customSections).forEach(id => {
    data.site.sectionStyles[id] = data.site.sectionStyles[id] || { font: "theme-default", color: "theme-default" };
    const conf = data.site.sectionStyles[id];

    const row = document.createElement("div");
    row.className = "section-style-row";

    const label = document.createElement("div");
    label.className = "section-style-label";
    label.textContent = getSectionLabel(id);
    row.appendChild(label);

    const fontSelect = document.createElement("select");
    fontSelect.className = "section-style-select";
    HEADING_FONTS.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.id; opt.textContent = f.name;
      if (f.id === conf.font) opt.selected = true;
      fontSelect.appendChild(opt);
    });
    fontSelect.addEventListener("change", () => { conf.font = fontSelect.value; });
    row.appendChild(fontSelect);

    const colorWrap = document.createElement("div");
    colorWrap.className = "section-color-swatches";
    ACCENT_COLORS.forEach(c => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "section-color-dot" + (c.id === conf.color ? " active" : "");
      dot.title = c.name;
      dot.style.background = c.hex || "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0/10px 10px";
      dot.addEventListener("click", () => {
        conf.color = c.id;
        colorWrap.querySelectorAll(".section-color-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
      });
      colorWrap.appendChild(dot);
    });
    row.appendChild(colorWrap);

    wrap.appendChild(row);
  });
}

/* ---------------- GITHUB CONNECT & SAVE ---------------- */
function renderGithubFields() {
  const cfg = ghLoadConfig() || { owner: "", repo: "", branch: "main", token: "" };
  const c = clear("github-fields");

  c.appendChild(field({ label: "GitHub username / organization", value: cfg.owner, richText: false, onChange: v => { cfg.owner = v; ghSaveConfig(cfg); } }));
  c.appendChild(field({ label: "Repository name", value: cfg.repo, richText: false, onChange: v => { cfg.repo = v; ghSaveConfig(cfg); } }));
  c.appendChild(field({ label: "Branch", value: cfg.branch || "main", richText: false, onChange: v => { cfg.branch = v; ghSaveConfig(cfg); } }));

  const tokenField = field({ label: "Personal access token", value: cfg.token, richText: false, onChange: v => { cfg.token = v; ghSaveConfig(cfg); }, span2: true });
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

/* ---------------- BILINGUAL FIELDS ---------------- */
// Ensures obj[key] is a { en, bn } object — migrates a legacy plain string
// (same text in both) the first time it's touched, without losing data.
function ensureBilingual(obj, key) {
  const v = obj[key];
  if (v && typeof v === "object") return v;
  obj[key] = { en: v || "", bn: v || "" };
  return obj[key];
}

function bilingualField(label, obj, key, opts = {}) {
  const val = ensureBilingual(obj, key);
  const wrap = document.createElement("div");
  wrap.className = "field bilingual-field" + (opts.span2 ? " span-2" : "");
  const lbl = document.createElement("label");
  lbl.textContent = label;
  wrap.appendChild(lbl);
  const row = document.createElement("div");
  row.className = "bilingual-row";
  row.appendChild(field({ label: "English", value: val.en, textarea: opts.textarea, richText: opts.richText, onChange: v => val.en = v, statusLabel: `${label} (English)` }));
  row.appendChild(field({ label: "বাংলা", value: val.bn, textarea: opts.textarea, richText: opts.richText, onChange: v => val.bn = v, statusLabel: `${label} (বাংলা)` }));
  wrap.appendChild(row);
  return wrap;
}

/* ---------------- MASTER FORMAT TOOLBAR (bold/italic/underline/size/case/sub-sup/font) ----------------
   One toolbar, docked to the side, instead of a toolbar under every field.
   Click into any text field to make it the active target, select the words you
   want to change, then use the toolbar. */
let activeFormatField = null;

function setActiveFormatField(input, label) {
  activeFormatField = input;
  const status = document.getElementById("master-format-status");
  const toolbar = document.getElementById("master-format-toolbar");
  if (status) status.textContent = "Editing: " + label;
  if (toolbar) toolbar.classList.remove("disabled");
}

// Wraps the current selection in the active field with `before`/`after` (used
// for inline HTML tags) and fires an input event so the field's onChange runs.
function wrapSelection(before, after) {
  const el = activeFormatField;
  if (!el) return;
  const start = el.selectionStart, end = el.selectionEnd;
  const val = el.value;
  const selected = val.slice(start, end) || "text";
  el.value = val.slice(0, start) + before + selected + after + val.slice(end);
  el.selectionStart = start + before.length;
  el.selectionEnd = start + before.length + selected.length;
  el.focus();
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// Transforms the selected text's case in place (no HTML tags involved).
function transformSelectionCase(fn) {
  const el = activeFormatField;
  if (!el) return;
  const start = el.selectionStart, end = el.selectionEnd;
  if (start === end) return;
  const val = el.value;
  const transformed = fn(val.slice(start, end));
  el.value = val.slice(0, start) + transformed + val.slice(end);
  el.selectionStart = start;
  el.selectionEnd = start + transformed.length;
  el.focus();
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function setupAdminBackToTop() {
  const btn = document.getElementById("admin-back-to-top");
  if (!btn) return;
  const toggle = () => btn.classList.toggle("show", window.scrollY > 480);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function buildMasterFormatToolbar() {
  const bar = document.createElement("div");
  bar.id = "master-format-toolbar";
  bar.className = "master-format-toolbar disabled";

  const title = document.createElement("div");
  title.className = "master-format-title";
  title.textContent = "Format";
  bar.appendChild(title);

  const status = document.createElement("div");
  status.id = "master-format-status";
  status.className = "master-format-status";
  status.textContent = "Click into any text field, select some words, then use the buttons below.";
  bar.appendChild(status);

  const fontSelect = document.createElement("select");
  fontSelect.className = "master-format-font-select";
  HEADING_FONTS.filter(f => f.css).forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.css;
    opt.textContent = f.name;
    fontSelect.appendChild(opt);
  });
  fontSelect.addEventListener("mousedown", () => { if (activeFormatField) activeFormatField._lastSelection = [activeFormatField.selectionStart, activeFormatField.selectionEnd]; });
  fontSelect.addEventListener("change", () => {
    if (!activeFormatField) return;
    const sel = activeFormatField._lastSelection;
    if (sel) { activeFormatField.selectionStart = sel[0]; activeFormatField.selectionEnd = sel[1]; }
    wrapSelection(`<span style="font-family:${fontSelect.value}">`, "</span>");
    fontSelect.selectedIndex = -1;
  });
  const fontRow = document.createElement("div");
  fontRow.className = "master-format-row";
  const fontLbl = document.createElement("label");
  fontLbl.textContent = "Font";
  fontRow.appendChild(fontLbl);
  fontRow.appendChild(fontSelect);
  bar.appendChild(fontRow);

  const grid = document.createElement("div");
  grid.className = "master-format-grid";
  const addBtn = (label, title2, onClick) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "format-btn";
    b.textContent = label;
    b.title = title2;
    // mousedown (not click) so we still have the field's selection before it blurs
    b.addEventListener("mousedown", (e) => { e.preventDefault(); onClick(); });
    grid.appendChild(b);
  };
  addBtn("B", "Bold", () => wrapSelection("<b>", "</b>"));
  addBtn("I", "Italic", () => wrapSelection("<i>", "</i>"));
  addBtn("U", "Underline", () => wrapSelection("<u>", "</u>"));
  addBtn("A+", "Bigger text", () => wrapSelection('<span style="font-size:1.3em">', "</span>"));
  addBtn("A−", "Smaller text", () => wrapSelection('<span style="font-size:0.82em">', "</span>"));
  addBtn("x²", "Superscript", () => wrapSelection("<sup>", "</sup>"));
  addBtn("x₂", "Subscript", () => wrapSelection("<sub>", "</sub>"));
  addBtn("AA", "UPPERCASE", () => transformSelectionCase(s => s.toUpperCase()));
  addBtn("aa", "lowercase", () => transformSelectionCase(s => s.toLowerCase()));
  addBtn("Aa", "Title Case", () => transformSelectionCase(s => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())));
  bar.appendChild(grid);

  document.body.appendChild(bar);
}

/* ---------------- SITE + NAV ---------------- */
function renderSite() {
  const c = clear("site-fields");
  c.appendChild(field({ label: "Your name (shown in header)", value: data.site.name, onChange: v => data.site.name = v }));
  c.appendChild(field({ label: "Tagline", value: data.site.tagline, onChange: v => data.site.tagline = v }));
  c.appendChild(bilingualField("Footer note", data.site, "footerNote", { span2: true }));

  const navList = clear("nav-list");
  data.nav.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(bilingualField("Menu label", item, "label"));
    grid.appendChild(field({ label: "Links to (e.g. #about)", value: item.href, richText: false, onChange: v => item.href = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { data.nav.splice(i, 1); renderSite(); }));
    attachReorder(row, data.nav, i, renderSite);
    navList.appendChild(row);
  });

  const s = clear("site-settings-fields");
  s.appendChild(field({ label: "WhatsApp number (with country code, digits only, e.g. 8801XXXXXXXXX)", value: data.site.whatsapp, richText: false, onChange: v => data.site.whatsapp = v }));
  s.appendChild(field({ label: "Google Analytics ID (e.g. G-XXXXXXX, leave blank to disable)", value: data.site.gaId, richText: false, onChange: v => data.site.gaId = v }));
  s.appendChild(field({ label: "SEO description (shown in Google/social previews)", value: data.site.seoDescription, textarea: true, span2: true, onChange: v => data.site.seoDescription = v }));
  s.appendChild(field({ label: "Social preview image path (images/yourfile.jpg)", value: data.site.socialImage, span2: true, richText: false, onChange: v => data.site.socialImage = v }));
  s.appendChild(field({ label: "Feedback form endpoint (optional — from Formspree.io or similar; leave blank to use email instead)", value: data.site.feedbackFormEndpoint, span2: true, richText: false, onChange: v => data.site.feedbackFormEndpoint = v }));
}

/* ---------------- SECTIONS: show/hide + reorder ---------------- */
function renderSectionsManager() {
  data.site.sectionVisibility = data.site.sectionVisibility || {};
  data.site.sectionOrder = getSectionOrder(data.site.sectionOrder, data.customSections).filter(id => id !== "home");

  const list = clear("sections-manager-list");
  data.site.sectionOrder.forEach((id, i) => {
    if (data.site.sectionVisibility[id] === undefined) data.site.sectionVisibility[id] = true;
    const row = document.createElement("div");
    row.className = "section-manager-row";

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "⠿";
    row.appendChild(handle);

    const label = document.createElement("span");
    label.className = "section-manager-label";
    label.textContent = getSectionLabel(id);
    if (!SECTION_LABELS[id]) {
      const tag = document.createElement("span");
      tag.className = "section-manager-hint";
      tag.textContent = " (custom)";
      label.appendChild(tag);
    }
    row.appendChild(label);

    row.appendChild(toggleSwitch({
      checked: data.site.sectionVisibility[id],
      onChange: v => { data.site.sectionVisibility[id] = v; }
    }));

    attachDrag(row, i, data.site.sectionOrder, renderSectionsManager);
    list.appendChild(row);
  });
}

/* ---------------- CUSTOM SECTIONS ---------------- */
function renderCustomSectionsAdmin() {
  data.customSections = data.customSections || [];
  const wrap = clear("custom-sections-list");

  data.customSections.forEach((cs, i) => {
    cs.title = cs.title || { en: "", bn: "" };
    cs.subheading = cs.subheading || { en: "", bn: "" };
    cs.body = cs.body || { en: "", bn: "" };
    cs.eyebrow = cs.eyebrow || { en: "", bn: "" };

    const row = document.createElement("div");
    row.className = "repeat-item has-toolbar";

    const toolbar = document.createElement("div");
    toolbar.className = "item-toolbar";
    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "⠿";
    toolbar.appendChild(handle);
    toolbar.appendChild(removeBtn(() => {
      const removedId = cs.id;
      data.customSections.splice(i, 1);
      data.site.sectionOrder = (data.site.sectionOrder || []).filter(id => id !== removedId);
      if (data.site.sectionVisibility) delete data.site.sectionVisibility[removedId];
      renderCustomSectionsAdmin();
      renderSectionsManager();
      renderSectionStyles();
    }));
    row.appendChild(toolbar);

    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(bilingualField("Eyebrow label (optional, small text above title, e.g. \"Awards\")", cs, "eyebrow"));
    const titleField = bilingualField("Section name / title", cs, "title");
    titleField.querySelectorAll("input, textarea").forEach(el => {
      el.addEventListener("input", () => renderSectionsManager());
    });
    grid.appendChild(titleField);
    grid.appendChild(bilingualField("Subheading (optional)", cs, "subheading"));
    grid.appendChild(bilingualField("Content (paragraphs — leave a blank line between paragraphs)", cs, "body", { span2: true, textarea: true, richText: true }));
    row.appendChild(grid);

    attachDrag(row, i, data.customSections, renderCustomSectionsAdmin);
    wrap.appendChild(row);
  });

  document.getElementById("add-custom-section-btn").onclick = () => {
    const id = "custom-" + Date.now();
    data.customSections.push({
      id, title: { en: "New Section", bn: "নতুন সেকশন" },
      subheading: { en: "", bn: "" }, body: { en: "", bn: "" }
    });
    renderCustomSectionsAdmin();
    renderSectionsManager();
    renderSectionStyles();
  };
}

/* ---------------- HERO ---------------- */
function renderHero() {
  const c = clear("hero-fields");
  const h = data.hero;
  c.appendChild(bilingualField("Small label above name", h, "eyebrow"));
  c.appendChild(field({ label: "Full name / heading", value: h.name, onChange: v => h.name = v }));
  c.appendChild(bilingualField("Role / title", h, "role"));
  c.appendChild(bilingualField("Tagline", h, "tagline", { textarea: true, span2: true }));
  c.appendChild(bilingualField("Button text", h, "ctaLabel"));
  c.appendChild(field({ label: "Button icon (emoji)", value: h.ctaIcon, richText: false, onChange: v => h.ctaIcon = v }));
  c.appendChild(field({ label: "Button links to", value: h.ctaHref, richText: false, onChange: v => h.ctaHref = v }));
  c.appendChild(field({ label: "Photo path (images/yourfile.jpg)", value: h.photo, richText: false, onChange: v => h.photo = v, span2: true }));
  c.appendChild(bilingualField("Status text (e.g. Available)", h, "status"));

  const badgeList = clear("hero-badges-list");
  (h.badges || []).forEach((b, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Emoji/icon", value: b.icon, richText: false, onChange: v => b.icon = v }));
    grid.appendChild(field({ label: "Label (e.g. Physician)", value: b.label, onChange: v => b.label = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { h.badges.splice(i, 1); renderHero(); }));
    attachReorder(row, h.badges, i, renderHero);
    badgeList.appendChild(row);
  });
}

/* ---------------- CV / RESUME ---------------- */
const CV_MAX_BYTES = 6 * 1024 * 1024; // 6MB

function renderCv() {
  const wrap = clear("cv-fields");
  const cv = data.cv;

  if (cv.dataUrl) {
    const status = document.createElement("div");
    status.className = "pdf-status";
    status.innerHTML = `
      <span class="pdf-filename">📄 ${cv.name || "CV.pdf"}</span>
      <a href="${cv.dataUrl}" target="_blank" rel="noopener">Preview</a>
      <button type="button" class="remove-btn pdf-remove">Remove CV ✕</button>
    `;
    status.querySelector(".pdf-remove").addEventListener("click", () => {
      cv.dataUrl = ""; cv.name = ""; renderCv();
    });
    wrap.appendChild(status);
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > CV_MAX_BYTES) {
        showToast(`"${file.name}" is too large (max 6MB). Try compressing the PDF.`);
        input.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => { cv.dataUrl = reader.result; cv.name = file.name; renderCv(); };
      reader.readAsDataURL(file);
    });
    wrap.appendChild(input);
  }
}

/* ---------------- ABOUT ---------------- */
function renderAbout() {
  const c = clear("about-fields");
  const a = data.about;
  c.appendChild(bilingualField("Section heading", a, "heading"));
  c.appendChild(field({ label: "Photo path (images/yourfile.jpg)", value: a.photo, richText: false, onChange: v => a.photo = v }));

  const paras = clear("about-paragraphs");
  a.paragraphs.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    row.appendChild(field({ label: `Paragraph ${i + 1}`, value: p, textarea: true, richText: true, span2: true, onChange: v => a.paragraphs[i] = v }));
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
  c.appendChild(bilingualField("Section heading", apps, "heading"));
  c.appendChild(bilingualField("Subheading", apps, "subheading", { span2: true }));

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
    grid.appendChild(field({ label: "Rating (0–5, e.g. 4.5)", value: String(app.rating ?? ""), richText: false, onChange: v => app.rating = parseFloat(v) || 0 }));
    grid.appendChild(field({ label: "Rating count text (e.g. 120 reviews)", value: app.ratingCount, onChange: v => app.ratingCount = v }));
    grid.appendChild(field({ label: "Primary button label (e.g. Get on Play Store)", value: app.primaryCtaLabel, onChange: v => app.primaryCtaLabel = v }));
    grid.appendChild(field({ label: "Primary button URL", value: app.primaryCtaUrl, richText: false, onChange: v => app.primaryCtaUrl = v }));
    grid.appendChild(field({ label: "Secondary button label (optional, e.g. Direct Download)", value: app.secondaryCtaLabel, onChange: v => app.secondaryCtaLabel = v }));
    grid.appendChild(field({ label: "Secondary button URL (optional)", value: app.secondaryCtaUrl, richText: false, onChange: v => app.secondaryCtaUrl = v }));
    row.appendChild(grid);

    row.appendChild(removeBtn(() => { apps.items.splice(i, 1); renderApps(); }));
    attachReorder(row, apps.items, i, renderApps);
    list.appendChild(row);
  });
}
function renderPublications() {
  const c = clear("publications-fields");
  const p = data.publications;
  c.appendChild(bilingualField("Section heading", p, "heading"));
  c.appendChild(bilingualField("Subheading", p, "subheading"));

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
      g.appendChild(field({ label: "Link (URL, optional)", value: item.link, span2: true, richText: false, onChange: v => item.link = v }));
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

/* ---------------- JOURNEY ---------------- */
function renderJourney() {
  const c = clear("journey-fields");
  const j = data.journey;
  c.appendChild(bilingualField("Section heading", j, "heading"));
  c.appendChild(bilingualField("Subheading", j, "subheading", { span2: true }));

  const list = clear("journey-list-admin");
  j.items.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Year", value: item.year, onChange: v => item.year = v }));
    grid.appendChild(field({ label: "Title", value: item.title, onChange: v => item.title = v }));
    grid.appendChild(field({ label: "Category (e.g. Career, Education, Award) — controls the timeline dot color", value: item.category, onChange: v => item.category = v }));
    grid.appendChild(field({ label: "Description", value: item.description, span2: true, textarea: true, onChange: v => item.description = v }));
    row.appendChild(grid);
    row.appendChild(checkboxField({ label: "Highlight (larger, brighter dot on the timeline)", checked: item.highlight, onChange: v => item.highlight = v }));
    row.appendChild(removeBtn(() => { j.items.splice(i, 1); renderJourney(); }));
    attachReorder(row, j.items, i, renderJourney);
    list.appendChild(row);
  });
}

/* ---------------- TESTIMONIALS ---------------- */
function buildPhotoUploader(target, key, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "pdf-uploader";
  const label = document.createElement("label");
  label.textContent = "Photo (optional)";
  wrap.appendChild(label);

  if (target[key]) {
    const status = document.createElement("div");
    status.className = "pdf-status";
    status.innerHTML = `<img src="${target[key]}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`;
    const rm = document.createElement("button");
    rm.type = "button"; rm.className = "remove-btn"; rm.textContent = "Remove photo ✕";
    rm.addEventListener("click", () => { target[key] = ""; onChange(); });
    status.appendChild(rm);
    wrap.appendChild(status);
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > ICON_MAX_BYTES) { showToast(`"${file.name}" is too large (max 1.5MB).`); input.value = ""; return; }
      const reader = new FileReader();
      reader.onload = () => { target[key] = reader.result; onChange(); };
      reader.readAsDataURL(file);
    });
    wrap.appendChild(input);
  }
  return wrap;
}

function renderTestimonials() {
  const c = clear("testimonials-fields");
  const te = data.testimonials;
  c.appendChild(bilingualField("Section heading", te, "heading"));
  c.appendChild(bilingualField("Subheading", te, "subheading", { span2: true }));
  c.appendChild(bilingualField("Feedback form heading", te, "formHeading"));
  c.appendChild(bilingualField("Feedback form note", te, "formNote", { span2: true, textarea: true }));

  const list = clear("testimonials-list-admin");
  te.items.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    row.appendChild(buildPhotoUploader(item, "photo", renderTestimonials));
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Name", value: item.name, onChange: v => item.name = v }));
    grid.appendChild(field({ label: "Role (e.g. Patient, Colleague)", value: item.role, onChange: v => item.role = v }));
    grid.appendChild(field({ label: "Quote", value: item.quote, span2: true, textarea: true, onChange: v => item.quote = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { te.items.splice(i, 1); renderTestimonials(); }));
    attachReorder(row, te.items, i, renderTestimonials);
    list.appendChild(row);
  });
}

/* ---------------- BLOG ---------------- */
function renderBlog() {
  const c = clear("blog-fields");
  const b = data.blog;
  c.appendChild(bilingualField("Section heading", b, "heading"));
  c.appendChild(bilingualField("Subheading", b, "subheading", { span2: true }));

  const list = clear("blog-list-admin");
  b.items.forEach((item, i) => {
    item.tags = item.tags || [];
    item.attachments = item.attachments || [];
    const row = document.createElement("div");
    row.className = "repeat-item";
    row.appendChild(buildPhotoUploader(item, "cover", () => renderBlog()));
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Title", value: item.title, span2: true, onChange: v => item.title = v }));
    grid.appendChild(field({ label: "Date (YYYY-MM-DD)", value: item.date, richText: false, onChange: v => item.date = v }));
    grid.appendChild(field({ label: "Tags (comma separated, e.g. Anatomy, Teaching)", value: item.tags.join(", "), onChange: v => { item.tags = v.split(",").map(s => s.trim()).filter(Boolean); } }));
    grid.appendChild(field({ label: "External link (optional — e.g. full article on another site)", value: item.externalUrl, span2: true, richText: false, onChange: v => item.externalUrl = v }));
    grid.appendChild(field({ label: "Excerpt (shows on the card)", value: item.excerpt, span2: true, textarea: true, onChange: v => item.excerpt = v }));
    grid.appendChild(field({ label: "Full post content (blank line = new paragraph)", value: item.content, span2: true, textarea: true, richText: true, onChange: v => item.content = v }));
    row.appendChild(grid);

    row.appendChild(buildAttachmentsUploader(item, () => renderBlog()));

    row.appendChild(removeBtn(() => { b.items.splice(i, 1); renderBlog(); }));
    attachReorder(row, b.items, i, renderBlog);
    list.appendChild(row);
  });
}

/* ---------------- FILE ATTACHMENTS (any file type) ---------------- */
const ATTACHMENT_MAX_BYTES = 6 * 1024 * 1024; // 6MB per file — keeps content.js a reasonable size

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function buildAttachmentsUploader(item, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "attachments-uploader";

  const label = document.createElement("label");
  label.textContent = "Attached files (any type — PDF, Word, Excel, audio, video, zip…)";
  wrap.appendChild(label);

  const list = document.createElement("div");
  list.className = "attachments-list";
  item.attachments.forEach((att, ai) => {
    const row = document.createElement("div");
    row.className = "attachment-row";
    row.innerHTML = `
      <span class="attachment-name">📎 ${att.name}</span>
      <span class="attachment-size">${formatFileSize(att.size)}</span>
      <a href="${att.dataUrl}" target="_blank" rel="noopener">Preview</a>
    `;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove ✕";
    removeButton.addEventListener("click", () => { item.attachments.splice(ai, 1); onChange(); });
    row.appendChild(removeButton);
    list.appendChild(row);
  });
  wrap.appendChild(list);

  const input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > ATTACHMENT_MAX_BYTES) {
      showToast(`"${file.name}" is too large (max 6MB).`);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      item.attachments.push({ name: file.name, size: file.size, dataUrl: reader.result });
      onChange();
    };
    reader.readAsDataURL(file);
  });
  wrap.appendChild(input);

  return wrap;
}

/* ---------------- FAQ ---------------- */
function renderFaq() {
  const c = clear("faq-fields");
  const f = data.faq;
  c.appendChild(bilingualField("Section heading", f, "heading"));
  c.appendChild(bilingualField("Subheading", f, "subheading", { span2: true }));

  const list = clear("faq-list-admin");
  f.items.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "repeat-item";
    const grid = document.createElement("div");
    grid.className = "field-grid";
    grid.appendChild(field({ label: "Question", value: item.q, span2: true, onChange: v => item.q = v }));
    grid.appendChild(field({ label: "Answer", value: item.a, span2: true, textarea: true, onChange: v => item.a = v }));
    row.appendChild(grid);
    row.appendChild(removeBtn(() => { f.items.splice(i, 1); renderFaq(); }));
    attachReorder(row, f.items, i, renderFaq);
    list.appendChild(row);
  });
}

/* ---------------- GALLERY ---------------- */
function renderGallery() {
  const c = clear("gallery-fields");
  const g = data.gallery;
  c.appendChild(bilingualField("Section heading", g, "heading"));
  c.appendChild(bilingualField("Subheading", g, "subheading"));

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
      gg.appendChild(field({ label: "Image path (images/yourfile.jpg)", value: img.src, span2: true, richText: false, onChange: v => img.src = v }));
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

  c.appendChild(bilingualField("Section heading", ct, "heading"));
  c.appendChild(bilingualField("Subheading", ct, "subheading", { span2: true }));
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
    grid.appendChild(field({ label: "URL", value: l.url, span2: true, richText: false, onChange: v => l.url = v }));
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
  if (type === "journey-item") {
    data.journey.items.push({ year: "2025", title: "New milestone", description: "", category: "Career", highlight: false });
    renderJourney();
  }
  if (type === "testimonial") {
    data.testimonials.items.push({ name: "New person", role: "", quote: "", photo: "" });
    renderTestimonials();
  }
  if (type === "blog-post") {
    data.blog.items.push({ title: "New post", date: new Date().toISOString().slice(0, 10), cover: "", excerpt: "", content: "" });
    renderBlog();
  }
  if (type === "faq-item") {
    data.faq.items.push({ q: "New question?", a: "" });
    renderFaq();
  }
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
buildMasterFormatToolbar();
setupAdminBackToTop();
renderGithubFields();
renderThemeSwatches();
renderFontSwatches();
renderSectionStyles();
renderSite();
renderCustomSectionsAdmin();
renderSectionsManager();
renderHero();
renderCv();
renderAbout();
renderPublications();
renderApps();
renderJourney();
renderTestimonials();
renderBlog();
renderFaq();
renderGallery();
renderContact();
