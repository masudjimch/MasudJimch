// Renders the whole page from SITE_CONTENT (js/content.js).
// Edit content.js (or use admin.html) — you should not need to touch this file.

const LANG_KEY = "portfolio_lang";

// Returns the right-language string for a field that may be a plain string
// (legacy / single-language content) or a { en, bn } object.
function t(field) {
  if (field == null) return "";
  if (typeof field === "object") {
    const lang = getLang();
    return field[lang] || field.en || field.bn || "";
  }
  return field;
}

function getLang() {
  return document.documentElement.getAttribute("data-lang") ||
    localStorage.getItem(LANG_KEY) ||
    (SITE_CONTENT.site && SITE_CONTENT.site.defaultLang) || "en";
}

function setLang(lang) {
  document.documentElement.setAttribute("data-lang", lang);
  localStorage.setItem(LANG_KEY, lang);
  renderAll();
}

const ECG_PATH = "M0 14 L30 14 L38 4 L46 24 L54 8 L62 14 L100 14 L108 2 L116 26 L124 14 L200 14 L208 6 L216 22 L224 14 L300 14 L308 4 L316 24 L324 14 L400 14";

function ecgDivider() {
  return `<svg class="ecg-divider" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">
    <path d="${ECG_PATH}"/>
  </svg>`;
}

function renderNav() {
  const nav = document.getElementById("main-nav-list");
  const vis = SITE_CONTENT.site.sectionVisibility || {};
  const builtinItems = SITE_CONTENT.nav.filter(item => {
    const id = item.href.replace("#", "");
    return vis[id] !== false;
  }).map(item => `<li><a href="${item.href}">${t(item.label)}</a></li>`);

  const order = getSectionOrder(SITE_CONTENT.site.sectionOrder, SITE_CONTENT.customSections);
  const customItems = (SITE_CONTENT.customSections || [])
    .filter(cs => vis[cs.id] !== false)
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map(cs => `<li><a href="#${cs.id}">${t(cs.title) || ""}</a></li>`);

  nav.innerHTML = builtinItems.concat(customItems).join("");

  document.getElementById("brand-link").innerHTML =
    `${SITE_CONTENT.site.name}<span>.</span>`;

  const toggle = document.getElementById("nav-toggle");
  const sidebar = document.getElementById("main-nav");
  const overlay = document.getElementById("sidebar-overlay");
  const closeBtn = document.getElementById("sidebar-close");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (!toggle.dataset.wired) {
    toggle.addEventListener("click", openSidebar);
    overlay.addEventListener("click", closeSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    sidebar.addEventListener("click", (e) => { if (e.target.closest("a")) closeSidebar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSidebar(); });
    toggle.dataset.wired = "1";
  }

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    const current = getLang();
    langBtn.textContent = current === "en" ? "বাং" : "EN";
    langBtn.title = current === "en" ? "বাংলায় দেখুন" : "View in English";
    if (!langBtn.dataset.wired) {
      langBtn.addEventListener("click", () => setLang(getLang() === "en" ? "bn" : "en"));
      langBtn.dataset.wired = "1";
    }
  }
}

function renderHero() {
  const h = SITE_CONTENT.hero;
  document.getElementById("hero-eyebrow").textContent = t(h.eyebrow);
  document.getElementById("hero-name").textContent = h.name;
  document.getElementById("hero-role").textContent = t(h.role);
  document.getElementById("hero-tagline").textContent = t(h.tagline);
  document.getElementById("hero-cta").innerHTML = `${h.ctaIcon ? `<span class="btn-icon">${h.ctaIcon}</span>` : ""}${t(h.ctaLabel)}`;
  document.getElementById("hero-cta").href = h.ctaHref;
  document.getElementById("hero-photo").src = h.photo;
  document.getElementById("hero-photo").alt = h.name;

  const statusEl = document.getElementById("hero-status");
  if (statusEl) statusEl.textContent = t(h.status);

  const badgeWrap = document.getElementById("hero-badges");
  if (badgeWrap && h.badges) {
    badgeWrap.innerHTML = h.badges.map((b, i) => `
      <span class="floating-badge fb-${i % 4}" style="--i:${i}">
        <span class="fb-icon">${b.icon}</span><span class="fb-label">${b.label}</span>
      </span>
    `).join("");
  }

}

function renderAbout() {
  const a = SITE_CONTENT.about;
  document.getElementById("about-heading").textContent = t(a.heading);
  document.getElementById("about-photo").src = a.photo;
  document.getElementById("about-photo").alt = t(a.heading);

  const textWrap = document.getElementById("about-text");
  textWrap.innerHTML = a.paragraphs.map(p => `<p>${p}</p>`).join("");

  const credList = document.getElementById("about-credentials");
  credList.innerHTML = a.credentials.map(c => `<li>${c}</li>`).join("");

  const statsRow = document.getElementById("about-stats");
  statsRow.innerHTML = a.stats.map(s => `
    <div class="stat">
      <div class="value">${s.value}</div>
      <div class="label">${s.label}</div>
    </div>`).join("");

  const cvBtn = document.getElementById("about-cv-btn");
  if (cvBtn) {
    if (SITE_CONTENT.cv && SITE_CONTENT.cv.dataUrl) {
      cvBtn.style.display = "";
      cvBtn.href = SITE_CONTENT.cv.dataUrl;
      cvBtn.download = SITE_CONTENT.cv.name || "CV.pdf";
    } else {
      cvBtn.style.display = "none";
    }
  }
}

function renderTabbedSection({ data, tabsElId, panelsElId, itemRenderer }) {
  const tabsEl = document.getElementById(tabsElId);
  const panelsEl = document.getElementById(panelsElId);

  tabsEl.innerHTML = data.categories.map((cat, i) =>
    `<button class="tab-btn ${i === 0 ? "active" : ""}" data-tab="${cat.id}">${cat.label}</button>`
  ).join("");

  panelsEl.innerHTML = data.categories.map((cat, i) =>
    `<div class="tab-panel ${i === 0 ? "active" : ""}" data-panel="${cat.id}">
      ${itemRenderer(cat)}
    </div>`
  ).join("");

  if (!tabsEl.dataset.wired) {
    tabsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      const id = btn.dataset.tab;
      tabsEl.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      panelsEl.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === id));
    });
    tabsEl.dataset.wired = "1";
  }
}

function renderStars(rating) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) stars += "★";
    else if (i === full && half) stars += "⯪";
    else stars += "☆";
  }
  return `<span class="app-stars" title="${r} / 5">${stars}</span>`;
}

function renderApps() {
  const a = SITE_CONTENT.apps;
  const section = document.getElementById("apps");
  if (!a || !a.items || !a.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  document.getElementById("apps-heading").textContent = t(a.heading);
  document.getElementById("apps-subheading").textContent = t(a.subheading);

  document.getElementById("apps-grid").innerHTML = (a.items || []).map(app => `
    <div class="app-card">
      <div class="app-card-top">
        <img class="app-icon" src="${app.icon}" alt="${app.name}">
        <div>
          <p class="app-name">${app.name}</p>
          <p class="app-platform">${app.platform || ""}</p>
        </div>
      </div>
      <p class="app-tagline">${app.tagline || ""}</p>
      <div class="app-meta-row">
        ${renderStars(app.rating)}
        <span class="app-rating-count">${app.ratingCount || ""}</span>
        ${app.price ? `<span class="app-price">${app.price}</span>` : ""}
      </div>
      <div class="app-actions">
        ${app.primaryCtaUrl ? `<a class="btn btn-gold app-btn" href="${app.primaryCtaUrl}" target="_blank" rel="noopener">${app.primaryCtaLabel || "View"}</a>` : ""}
        ${app.secondaryCtaUrl ? `<a class="btn btn-outline-dark app-btn" href="${app.secondaryCtaUrl}" target="_blank" rel="noopener">${app.secondaryCtaLabel || "Learn more"}</a>` : ""}
      </div>
    </div>
  `).join("");
}

function renderPublications() {
  const p = SITE_CONTENT.publications;
  document.getElementById("publications-heading").textContent = t(p.heading);
  document.getElementById("publications-subheading").textContent = t(p.subheading);

  renderTabbedSection({
    data: p,
    tabsElId: "publications-tabs",
    panelsElId: "publications-panels",
    itemRenderer: (cat) => `
      <ul class="pub-list">
        ${cat.items.map(item => `
          <li class="pub-item">
            <span class="pub-year">${item.year}</span>
            <span>
              <p class="pub-title">${item.title}</p>
              <span class="pub-journal">${item.journal}</span>
            </span>
            <span class="pub-actions">
              ${item.pdfDataUrl ? `<a class="pub-link pub-pdf" href="${item.pdfDataUrl}" download="${item.pdfName || "publication.pdf"}">⬇ Download PDF</a>` : ""}
              ${item.link && item.link !== "#" ? `<a class="pub-link" href="${item.link}" target="_blank" rel="noopener">View →</a>` : ""}
            </span>
          </li>
        `).join("")}
      </ul>
    `
  });
}

/* ---------------- JOURNEY ---------------- */
const JOURNEY_PALETTE = ["#E4C486", "#7FD9C4", "#F2A65A", "#8FB8E0", "#E88FA6", "#B79CED"];
function journeyCategoryColor(cat) {
  if (!cat) return JOURNEY_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  return JOURNEY_PALETTE[Math.abs(hash) % JOURNEY_PALETTE.length];
}

const journeyState = { view: "timeline", activeIdx: 0 };
let journeyWaveAnimId = null;

function renderJourney() {
  const j = SITE_CONTENT.journey;
  const section = document.getElementById("journey");
  if (!j || !j.items || !j.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  section.dataset.view = journeyState.view;
  document.getElementById("journey-heading").textContent = t(j.heading);
  document.getElementById("journey-subheading").textContent = t(j.subheading);

  // List view (unchanged, chronological cards)
  document.getElementById("journey-list").innerHTML = j.items.map(item => `
    <div class="journey-item">
      <div class="journey-year">${item.year || ""}</div>
      <div class="journey-body">
        <p class="journey-title">${item.title || ""}</p>
        <p class="journey-desc">${item.description || ""}</p>
      </div>
    </div>
  `).join("");

  // Timeline view (animated wave + glowing nodes)
  if (journeyState.activeIdx >= j.items.length) journeyState.activeIdx = 0;
  const track = document.getElementById("journey-track");
  track.innerHTML = j.items.map((item, i) => {
    const color = journeyCategoryColor(item.category);
    return `
    <button type="button" class="journey-node${item.highlight ? " is-highlight" : ""}${i === journeyState.activeIdx ? " active" : ""}" style="--node-color:${color}" data-idx="${i}">
      <span class="journey-node-year">${item.year || ""}</span>
      <span class="journey-node-dot"></span>
      <span class="journey-node-title">${item.title || ""}</span>
    </button>`;
  }).join("");

  track.querySelectorAll(".journey-node").forEach(node => {
    node.onclick = () => {
      journeyState.activeIdx = parseInt(node.dataset.idx, 10);
      renderJourneyDetail();
      track.querySelectorAll(".journey-node").forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };
  });
  renderJourneyDetail();

  document.getElementById("journey-view-timeline").classList.toggle("active", journeyState.view === "timeline");
  document.getElementById("journey-view-list").classList.toggle("active", journeyState.view === "list");
  document.getElementById("journey-view-timeline").onclick = () => { journeyState.view = "timeline"; renderJourney(); };
  document.getElementById("journey-view-list").onclick = () => { journeyState.view = "list"; renderJourney(); };

  document.getElementById("journey-scroll-left").onclick = () => track.scrollBy({ left: -260, behavior: "smooth" });
  document.getElementById("journey-scroll-right").onclick = () => track.scrollBy({ left: 260, behavior: "smooth" });

  initJourneyWave();
}

function renderJourneyDetail() {
  const j = SITE_CONTENT.journey;
  const item = j.items[journeyState.activeIdx];
  const detail = document.getElementById("journey-detail");
  if (!item || !detail) return;
  const color = journeyCategoryColor(item.category);
  detail.innerHTML = `
    <p class="journey-detail-year">${item.year || ""}</p>
    <h3 class="journey-detail-title">${item.title || ""}</h3>
    <p class="journey-detail-desc">${item.description || ""}</p>
    ${item.category ? `<span class="journey-detail-cat" style="background:${color}22;color:${color};">${item.category}</span>` : ""}
  `;
}

function initJourneyWave() {
  const canvas = document.getElementById("journey-wave");
  if (!canvas || journeyState.view !== "timeline") return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = Math.max(1, rect.width * dpr);
    h = canvas.height = Math.max(1, rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  };
  resize();
  if (!canvas.dataset.resizeWired) {
    canvas.dataset.resizeWired = "1";
    window.addEventListener("resize", () => resize());
  }

  const rows = 6;
  let flow = 0; // accumulating horizontal drift — this is what makes the wave visibly flow
  function draw() {
    ctx.clearRect(0, 0, w, h);
    flow += 0.9 * dpr;
    for (let r = 0; r < rows; r++) {
      const baseY = h * (0.16 + r * 0.15);
      const amp = h * 0.05 * (1 - r * 0.07);
      const spacing = 20 * dpr;
      const alpha = 0.30 - r * 0.028;
      const rowFlow = flow * (0.5 + r * 0.14); // each row drifts at its own speed = parallax
      const wobble = flow * 0.012 * (1 + r * 0.12);
      ctx.fillStyle = `rgba(228, 196, 134, ${Math.max(alpha, 0.04)})`;
      for (let x = -spacing * 2; x < w + spacing * 2; x += spacing) {
        // wrap x with the drift so dots continuously stream leftward, looping seamlessly
        const wrapped = ((x - rowFlow) % (w + spacing * 4) + (w + spacing * 4)) % (w + spacing * 4) - spacing * 2;
        const y = baseY + Math.sin(wrapped * 0.014 + wobble + r * 1.4) * amp;
        const size = (r === 0 ? 1.7 : 1.3) * dpr;
        ctx.beginPath();
        ctx.arc(wrapped, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    journeyWaveAnimId = requestAnimationFrame(draw);
  }
  if (journeyWaveAnimId) cancelAnimationFrame(journeyWaveAnimId);
  draw();
}

/* ---------------- TESTIMONIALS ---------------- */
function renderTestimonials() {
  const te = SITE_CONTENT.testimonials;
  const section = document.getElementById("testimonials");
  if (!te) { if (section) section.style.display = "none"; return; }
  if (section) section.style.display = "";
  document.getElementById("testimonials-heading").textContent = t(te.heading);
  document.getElementById("testimonials-subheading").textContent = t(te.subheading);

  document.getElementById("testimonials-grid").innerHTML = (te.items || []).map(item => `
    <div class="testimonial-card">
      <p class="testimonial-quote">"${item.quote || ""}"</p>
      <div class="testimonial-person">
        ${item.photo ? `<img src="${item.photo}" alt="${item.name || ""}" class="testimonial-photo">` : `<span class="testimonial-avatar">${(item.name || "?").charAt(0)}</span>`}
        <div>
          <p class="testimonial-name">${item.name || ""}</p>
          <p class="testimonial-role">${item.role || ""}</p>
        </div>
      </div>
    </div>
  `).join("");

  const headingEl = document.getElementById("feedback-heading");
  const noteEl = document.getElementById("feedback-note");
  if (headingEl) headingEl.textContent = t(te.formHeading) || "Share your feedback";
  if (noteEl) noteEl.textContent = t(te.formNote) || "";

  setupFeedbackForm();
}

function setupFeedbackForm() {
  const form = document.getElementById("feedback-form");
  if (!form || form.dataset.wired === "1") return;
  form.dataset.wired = "1";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("feedback-status");
    const btn = document.getElementById("feedback-submit");
    const name = document.getElementById("feedback-name").value.trim();
    const role = document.getElementById("feedback-role").value.trim();
    const message = document.getElementById("feedback-message").value.trim();
    if (!name || !message) return;

    const endpoint = SITE_CONTENT.site.feedbackFormEndpoint;
    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = "Sending…";

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, role, message })
        });
        if (!res.ok) throw new Error("bad status");
        status.textContent = "Thank you — your feedback has been sent!";
        form.reset();
      } else {
        // Fallback when no form endpoint is configured: open a pre-filled email.
        const email = (SITE_CONTENT.contact && SITE_CONTENT.contact.emails && SITE_CONTENT.contact.emails[0]?.value) || "";
        const subject = encodeURIComponent(`Website feedback from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}${role ? " (" + role + ")" : ""}`);
        if (email) window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        status.textContent = "Opening your email app to send this feedback…";
      }
    } catch (err) {
      status.textContent = "Something went wrong — please try again, or use the contact section.";
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
}

/* ---------------- BLOG ---------------- */
function renderBlog() {
  const b = SITE_CONTENT.blog;
  const section = document.getElementById("blog");
  if (!b || !b.items || !b.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  document.getElementById("blog-heading").textContent = t(b.heading);
  document.getElementById("blog-subheading").textContent = t(b.subheading);

  const items = [...b.items].sort((x, y) => (y.date || "").localeCompare(x.date || ""));

  document.getElementById("blog-grid").innerHTML = items.map((post) => `
    <button type="button" class="blog-card" data-blog-idx="${b.items.indexOf(post)}">
      ${post.cover ? `<img src="${post.cover}" alt="${post.title}" class="blog-cover">` : ""}
      <div class="blog-card-body">
        ${post.date ? `<p class="blog-date">${formatDate(post.date)}</p>` : ""}
        <p class="blog-title">${post.title || ""}</p>
        <p class="blog-excerpt">${post.excerpt || ""}</p>
        <span class="blog-read-more">Read more →</span>
      </div>
    </button>
  `).join("");

  document.querySelectorAll(".blog-card").forEach(card => {
    card.addEventListener("click", () => openBlogModal(b.items[parseInt(card.dataset.blogIdx, 10)]));
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function openBlogModal(post) {
  const modal = document.getElementById("blog-modal");
  document.getElementById("blog-modal-title").textContent = post.title || "";
  document.getElementById("blog-modal-date").textContent = post.date ? formatDate(post.date) : "";
  document.getElementById("blog-modal-body").innerHTML = (post.content || "")
    .split(/\n\s*\n/).map(p => `<p>${p.trim()}</p>`).join("");
  const cover = document.getElementById("blog-modal-cover");
  if (post.cover) {
    cover.src = post.cover;
    cover.style.display = "";
  } else {
    cover.style.display = "none";
  }
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBlogModal() {
  document.getElementById("blog-modal").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------------- FAQ ---------------- */
function renderFaq() {
  const f = SITE_CONTENT.faq;
  const section = document.getElementById("faq");
  if (!f || !f.items || !f.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  document.getElementById("faq-heading").textContent = t(f.heading);
  document.getElementById("faq-subheading").textContent = t(f.subheading);

  document.getElementById("faq-list").innerHTML = f.items.map((item) => `
    <div class="faq-item">
      <button type="button" class="faq-question">
        <span>${item.q || ""}</span>
        <span class="faq-caret">＋</span>
      </button>
      <div class="faq-answer"><p>${item.a || ""}</p></div>
    </div>
  `).join("");

  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => q.parentElement.classList.toggle("open"));
  });
}

function renderGallery() {
  const g = SITE_CONTENT.gallery;
  document.getElementById("gallery-heading").textContent = t(g.heading);
  document.getElementById("gallery-subheading").textContent = t(g.subheading);

  renderTabbedSection({
    data: g,
    tabsElId: "gallery-tabs",
    panelsElId: "gallery-panels",
    itemRenderer: (cat) => `
      <div class="gallery-grid">
        ${cat.images.map(img => `
          <figure class="gallery-card">
            <img src="${img.src}" alt="${img.caption}" loading="lazy">
            <figcaption class="gallery-caption">${img.caption}</figcaption>
          </figure>
        `).join("")}
      </div>
    `
  });
}

function renderContact() {
  const c = SITE_CONTENT.contact;
  document.getElementById("contact-heading").textContent = t(c.heading);
  document.getElementById("contact-subheading").textContent = t(c.subheading);

  // Backward-compatible: older content.js files had a single c.email string.
  const emails = (c.emails && c.emails.length) ? c.emails : (c.email ? [{ icon: "📧", label: "Email", value: c.email }] : []);

  let detailsHtml = "";
  emails.forEach(e => {
    detailsHtml += `
      <dt>${e.icon || "📧"} ${e.label || "Email"}</dt>
      <dd><a href="mailto:${e.value}">${e.value}</a></dd>`;
  });
  if (c.phone) {
    detailsHtml += `<dt>☎️ Phone</dt><dd><a href="tel:${c.phone.replace(/[^+\d]/g, "")}">${c.phone}</a></dd>`;
  }
  if (c.location) {
    detailsHtml += `<dt>📍 Location</dt><dd>${c.location}</dd>`;
  }
  document.getElementById("contact-details").innerHTML = detailsHtml;

  document.getElementById("contact-links").innerHTML = (c.links || []).map(l =>
    `<a href="${l.url}" target="_blank" rel="noopener"><span>${l.icon ? `<span class="btn-icon">${l.icon}</span>` : ""}${l.label}</span><span>↗</span></a>`
  ).join("");
}

function renderFooter() {
  document.getElementById("footer-note").textContent =
    `© ${new Date().getFullYear()} ${SITE_CONTENT.site.name}. ${t(SITE_CONTENT.site.footerNote)}`;
}

/* ---------------- WHATSAPP FLOATING BUTTON ---------------- */
function renderWhatsapp() {
  const num = SITE_CONTENT.site.whatsapp;
  const wa = document.getElementById("whatsapp-float");
  if (!wa) return;
  if (num) {
    wa.href = `https://wa.me/${num.replace(/[^\d]/g, "")}`;
    wa.style.display = "flex";
  } else {
    wa.style.display = "none";
  }
}

/* ---------------- SEO / SOCIAL META ---------------- */
function renderSeo() {
  const s = SITE_CONTENT.site;
  document.title = `${s.name} — ${s.tagline || ""}`;
  setMeta("description", s.seoDescription || "", false);
  setMeta("og:title", s.name, true);
  setMeta("og:description", s.seoDescription || "", true);
  if (s.socialImage) setMeta("og:image", new URL(s.socialImage, window.location.href).href, true);
  setMeta("twitter:card", "summary_large_image", false);
}

function setMeta(key, content, isProperty) {
  if (!content) return;
  const selector = isProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(isProperty ? "property" : "name", key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/* ---------------- GOOGLE ANALYTICS ---------------- */
function injectAnalytics() {
  const id = SITE_CONTENT.site.gaId;
  if (!id) return;
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
  document.head.appendChild(s2);
}

function injectDividers() {
  document.querySelectorAll(".ecg-slot").forEach(slot => {
    slot.innerHTML = ecgDivider();
  });
}

function numberSections() {
  const eyebrows = Array.from(document.querySelectorAll("main section .section-eyebrow"))
    .filter(e => e.closest("section").style.display !== "none");
  eyebrows.forEach((e, i) => {
    const num = String(i + 1).padStart(2, "0");
    e.textContent = e.textContent.replace(/^\d{2} — /, "");
    e.textContent = `${num} — ${e.textContent}`;
  });
}

function setupActiveNav() {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const links = Array.from(document.querySelectorAll("nav.main-nav a"));
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

function setupScrollReveal() {
  const targets = document.querySelectorAll(
    ".section-head, .about-grid, .tabs, .contact-grid, .hero-photo-frame, .hero .wrap > div, " +
    ".app-card, .testimonial-card, .blog-card, .journey-item, .faq-item, .pub-item, .gallery-card, .stat, .floating-badge"
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(elx => {
    if (!elx.classList.contains("reveal-in")) elx.classList.add("reveal");
    observer.observe(elx);
  });
}

function setupBackToTop() {
  const btn = document.getElementById("back-to-top-float");
  if (!btn) return;
  const toggle = () => btn.classList.toggle("show", window.scrollY > 480);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupHeaderShrink() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggle = () => header.classList.toggle("scrolled", window.scrollY > 40);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

function setupHeroParallax() {
  const frame = document.querySelector(".hero-photo-frame");
  const eyebrow = document.querySelector(".hero-eyebrow");
  if (!frame) return;
  const onScroll = () => {
    const y = Math.min(window.scrollY, 600);
    frame.style.transform = `translateY(${y * 0.08}px)`;
    if (eyebrow) eyebrow.style.transform = `translateY(${y * 0.15}px)`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupStagger() {
  document.querySelectorAll(
    ".apps-grid, .testimonials-grid, .blog-grid, .journey-list, .faq-list, .gallery-grid, .pub-list, .hero-badges"
  ).forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty("--i", i);
    });
  });
}

function setupTiltCards() {
  const selectors = ".app-card, .testimonial-card, .blog-card, .gallery-card";
  document.querySelectorAll(selectors).forEach(card => {
    card.classList.add("tilt-card");
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(px * 8).toFixed(2)}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function setupModalClose() {
  const modal = document.getElementById("blog-modal");
  if (!modal) return;
  document.getElementById("blog-modal-close").addEventListener("click", closeBlogModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeBlogModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBlogModal(); });
}

/* ---------------- CUSTOM SECTIONS ---------------- */
function renderCustomSections() {
  const main = document.querySelector("main");
  if (!main) return;
  const list = SITE_CONTENT.customSections || [];
  const currentIds = new Set(list.map(cs => cs.id));

  // Remove any custom sections that no longer exist in content
  main.querySelectorAll("section.custom-section").forEach(el => {
    if (!currentIds.has(el.id)) el.remove();
  });

  list.forEach(cs => {
    let section = document.getElementById(cs.id);
    if (!section) {
      section = document.createElement("section");
      section.id = cs.id;
      section.className = "custom-section";
      main.appendChild(section);
    }
    const bodyText = t(cs.body) || "";
    const paragraphs = bodyText.split(/\n\s*\n/).filter(p => p.trim())
      .map(p => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`).join("");
    const eyebrow = t(cs.eyebrow);
    const subheading = t(cs.subheading);
    section.innerHTML = `
      <div class="wrap">
        <div class="section-head">
          ${eyebrow ? `<p class="section-eyebrow">${eyebrow}</p>` : ""}
          <h2>${t(cs.title) || ""}</h2>
          ${subheading ? `<p>${subheading}</p>` : ""}
        </div>
        <div class="custom-section-body">${paragraphs}</div>
      </div>
    `;
  });
}

function applySectionLayout() {
  const main = document.querySelector("main");
  if (!main) return;
  const order = getSectionOrder(SITE_CONTENT.site.sectionOrder, SITE_CONTENT.customSections);
  const vis = SITE_CONTENT.site.sectionVisibility || {};
  document.querySelectorAll(".ecg-slot").forEach(el => el.remove());
  let lastVisible = null;
  order.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const emptyHidden = section.style.display === "none";
    const visible = id === "home" || (vis[id] !== false && !emptyHidden);
    if (!visible) { section.style.display = "none"; return; }
    section.style.display = "";
    main.appendChild(section);
    if (lastVisible) {
      const slot = document.createElement("div");
      slot.className = "ecg-slot";
      main.insertBefore(slot, section);
    }
    lastVisible = section;
  });
}

function renderAll() {
  renderNav();
  renderHero();
  renderAbout();
  renderPublications();
  renderApps();
  renderJourney();
  renderTestimonials();
  renderBlog();
  renderGallery();
  renderFaq();
  renderContact();
  renderCustomSections();
  renderFooter();
  renderWhatsapp();
  applySectionLayout();
  injectDividers();
  numberSections();
  applySectionStyles(SITE_CONTENT.site.sectionStyles, SITE_CONTENT.customSections);
  setupStagger();
  setupTiltCards();
  setupScrollReveal();
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-lang", getLang());
  renderSeo();
  injectAnalytics();
  renderAll();
  setupActiveNav();
  setupModalClose();
  setupBackToTop();
  setupHeaderShrink();
  setupHeroParallax();
});
