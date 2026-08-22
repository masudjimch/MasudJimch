// Renders the whole page from SITE_CONTENT (js/content.js).
// Edit content.js (or use admin.html) — you should not need to touch this file.

const ECG_PATH = "M0 14 L30 14 L38 4 L46 24 L54 8 L62 14 L100 14 L108 2 L116 26 L124 14 L200 14 L208 6 L216 22 L224 14 L300 14 L308 4 L316 24 L324 14 L400 14";

function ecgDivider() {
  return `<svg class="ecg-divider" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">
    <path d="${ECG_PATH}"/>
  </svg>`;
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderNav() {
  const nav = document.getElementById("main-nav-list");
  nav.innerHTML = SITE_CONTENT.nav.map(item =>
    `<li><a href="${item.href}">${item.label}</a></li>`
  ).join("");

  document.getElementById("brand-link").innerHTML =
    `${SITE_CONTENT.site.name.replace(/^Dr\.?\s*/i, "")} <span>Dr</span>`;
  document.getElementById("brand-link").innerHTML =
    `Dr<span>.</span> ${SITE_CONTENT.site.name.replace(/^Dr\.?\s*/i, "")}`;

  document.getElementById("nav-toggle").addEventListener("click", () => {
    document.getElementById("main-nav").classList.toggle("open");
  });
}

function renderHero() {
  const h = SITE_CONTENT.hero;
  document.getElementById("hero-eyebrow").textContent = h.eyebrow;
  document.getElementById("hero-name").textContent = h.name;
  document.getElementById("hero-role").textContent = h.role;
  document.getElementById("hero-tagline").textContent = h.tagline;
  document.getElementById("hero-cta").innerHTML = `${h.ctaIcon ? `<span class="btn-icon">${h.ctaIcon}</span>` : ""}${h.ctaLabel}`;
  document.getElementById("hero-cta").href = h.ctaHref;
  document.getElementById("hero-photo").src = h.photo;
  document.getElementById("hero-photo").alt = h.name;

  const statusEl = document.getElementById("hero-status");
  if (statusEl) statusEl.textContent = h.status || "";

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
  document.getElementById("about-heading").textContent = a.heading;
  document.getElementById("about-photo").src = a.photo;
  document.getElementById("about-photo").alt = a.heading;

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

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    const id = btn.dataset.tab;
    tabsEl.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
    panelsEl.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === id));
  });
}

function renderApps() {
  const a = SITE_CONTENT.apps;
  const section = document.getElementById("apps");
  if (!a || !a.items || !a.items.length) {
    if (section) section.style.display = "none";
    return;
  }
  document.getElementById("apps-heading").textContent = a.heading;
  document.getElementById("apps-subheading").textContent = a.subheading;

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

function renderPublications() {
  const p = SITE_CONTENT.publications;
  document.getElementById("publications-heading").textContent = p.heading;
  document.getElementById("publications-subheading").textContent = p.subheading;

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

function renderGallery() {
  const g = SITE_CONTENT.gallery;
  document.getElementById("gallery-heading").textContent = g.heading;
  document.getElementById("gallery-subheading").textContent = g.subheading;

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
  document.getElementById("contact-heading").textContent = c.heading;
  document.getElementById("contact-subheading").textContent = c.subheading;

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
    `© ${new Date().getFullYear()} ${SITE_CONTENT.site.name}. ${SITE_CONTENT.site.footerNote}`;
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
    ".section-head, .about-grid, .tabs, .tab-panel.active, .apps-grid, .contact-grid, .hero-photo-frame, .hero .wrap > div"
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => {
    t.classList.add("reveal");
    observer.observe(t);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderHero();
  renderAbout();
  renderPublications();
  renderApps();
  renderGallery();
  renderContact();
  renderFooter();
  injectDividers();
  numberSections();
  setupActiveNav();
  setupScrollReveal();
});
