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
  nav.innerHTML = SITE_CONTENT.nav.map(item =>
    `<li><a href="${item.href}">${t(item.label)}</a></li>`
  ).join("");

  document.getElementById("brand-link").innerHTML =
    `Dr<span>.</span> ${SITE_CONTENT.site.name.replace(/^Dr\.?\s*/i, "")}`;

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

  const cvBtn = document.getElementById("hero-cv-btn");
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
function renderJourney() {
  const j = SITE_CONTENT.journey;
  const section = document.getElementById("journey");
  if (!j || !j.items || !j.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  document.getElementById("journey-heading").textContent = t(j.heading);
  document.getElementById("journey-subheading").textContent = t(j.subheading);

  document.getElementById("journey-list").innerHTML = j.items.map(item => `
    <div class="journey-item">
      <div class="journey-year">${item.year || ""}</div>
      <div class="journey-body">
        <p class="journey-title">${item.title || ""}</p>
        <p class="journey-desc">${item.description || ""}</p>
      </div>
    </div>
  `).join("");
}

/* ---------------- TESTIMONIALS ---------------- */
function renderTestimonials() {
  const te = SITE_CONTENT.testimonials;
  const section = document.getElementById("testimonials");
  if (!te || !te.items || !te.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  document.getElementById("testimonials-heading").textContent = t(te.heading);
  document.getElementById("testimonials-subheading").textContent = t(te.subheading);

  document.getElementById("testimonials-grid").innerHTML = te.items.map(item => `
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
    ".section-head, .about-grid, .tabs, .tab-panel.active, .apps-grid, .contact-grid, .hero-photo-frame, .hero .wrap > div, .journey-list, .testimonials-grid, .blog-grid, .faq-list"
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
    elx.classList.add("reveal");
    observer.observe(elx);
  });
}

function setupModalClose() {
  const modal = document.getElementById("blog-modal");
  if (!modal) return;
  document.getElementById("blog-modal-close").addEventListener("click", closeBlogModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeBlogModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBlogModal(); });
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
  renderFooter();
  renderWhatsapp();
  injectDividers();
  numberSections();
  applySectionStyles(SITE_CONTENT.site.sectionStyles);
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-lang", getLang());
  renderSeo();
  injectAnalytics();
  renderAll();
  setupActiveNav();
  setupScrollReveal();
  setupModalClose();
});
