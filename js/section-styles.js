/*
  SECTION-STYLES.JS — per-section heading font & color overrides.
  Each section (Home, About, Publications, Apps, Journey, Testimonials,
  Blog, Gallery, FAQ, Contact) can independently use a different heading
  font and accent color from the lists below, on top of whichever color
  theme / global font preset is active. Leave a section on "Theme Default"
  to just inherit the global look.
*/

const HEADING_FONTS = [
  { id: "theme-default", name: "Theme Default", css: null },
  { id: "fraunces", name: "Fraunces", css: "'Fraunces', Georgia, serif" },
  { id: "playfair", name: "Playfair Display", css: "'Playfair Display', Georgia, serif" },
  { id: "cormorant", name: "Cormorant Garamond", css: "'Cormorant Garamond', Georgia, serif" },
  { id: "dm-serif", name: "DM Serif Display", css: "'DM Serif Display', Georgia, serif" },
  { id: "abril", name: "Abril Fatface", css: "'Abril Fatface', Georgia, serif" },
  { id: "marcellus", name: "Marcellus", css: "'Marcellus', Georgia, serif" },
  { id: "space-grotesk", name: "Space Grotesk", css: "'Space Grotesk', sans-serif" },
  { id: "inter", name: "Inter", css: "'Inter', sans-serif" },
  { id: "syne", name: "Syne", css: "'Syne', sans-serif" },
  { id: "poppins", name: "Poppins", css: "'Poppins', sans-serif" },
  { id: "orbitron", name: "Orbitron (futuristic)", css: "'Orbitron', sans-serif" },
  { id: "bebas-neue", name: "Bebas Neue (bold poster)", css: "'Bebas Neue', sans-serif" },
  { id: "righteous", name: "Righteous (playful rounded)", css: "'Righteous', sans-serif" },
  { id: "unbounded", name: "Unbounded (bold geometric)", css: "'Unbounded', sans-serif" }
];

const ACCENT_COLORS = [
  { id: "theme-default", name: "Theme Default", hex: null },
  { id: "gold", name: "Gold", hex: "#C08A2E" },
  { id: "rose-gold", name: "Rose Gold", hex: "#D98F6F" },
  { id: "crimson", name: "Crimson", hex: "#C0263B" },
  { id: "emerald", name: "Emerald", hex: "#2FBF8F" },
  { id: "sapphire", name: "Sapphire", hex: "#2E6FBF" },
  { id: "amethyst", name: "Amethyst", hex: "#8B6FC9" },
  { id: "amber", name: "Amber", hex: "#D98E33" },
  { id: "teal", name: "Teal", hex: "#2E8C86" },
  { id: "coral", name: "Coral", hex: "#E8735F" },
  { id: "copper", name: "Copper", hex: "#B9612E" },
  { id: "burgundy", name: "Burgundy", hex: "#7A2E38" },
  { id: "forest", name: "Forest Green", hex: "#3E6E63" },
  { id: "slate-blue", name: "Slate Blue", hex: "#3E7A8C" },
  { id: "neon-pink", name: "Neon Pink", hex: "#FF5FA8" },
  { id: "charcoal", name: "Charcoal", hex: "#2A2A2A" },
  { id: "ivory", name: "Ivory (for dark sections)", hex: "#F2EFE6" }
];

const BUILTIN_SECTION_IDS = ["home", "about", "publications", "apps", "journey", "testimonials", "blog", "gallery", "faq", "contact"];

// Returns builtin section ids plus any custom section ids (in their stored array order).
function getAllSectionIds(customSections) {
  const customIds = (customSections || []).map(cs => cs.id);
  return [...BUILTIN_SECTION_IDS, ...customIds];
}

// Normalizes a stored section order (array of ids, excluding "home") into a
// full, valid order with "home" always first and any missing/new ids appended.
function getSectionOrder(order, customSections) {
  const others = getAllSectionIds(customSections).filter(id => id !== "home");
  const base = (order && order.length) ? order.filter(id => others.includes(id)) : others.slice();
  others.forEach(id => { if (!base.includes(id)) base.push(id); });
  return ["home", ...base];
}

function getHeadingFont(id) { return HEADING_FONTS.find(f => f.id === id) || HEADING_FONTS[0]; }
function getAccentColor(id) { return ACCENT_COLORS.find(c => c.id === id) || ACCENT_COLORS[0]; }

// --- Contrast guard -------------------------------------------------------
// A section-heading accent color that looked fine on a light theme can
// become nearly invisible if the person later switches to a dark theme (or
// vice versa). Before applying a custom heading color we check it against
// the current page background and silently fall back to the theme's own
// (always-legible) heading color if the contrast is too low.
function relLuminance(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16) / 255;
  const g = parseInt(c.substr(2, 2), 16) / 255;
  const b = parseInt(c.substr(4, 2), 16) / 255;
  const lin = v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrastRatio(hex1, hex2) {
  const l1 = relLuminance(hex1), l2 = relLuminance(hex2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
function isColorSafeOnPaper(hex) {
  try {
    const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
    if (!paper) return true;
    return contrastRatio(hex, paper) >= 2.5;
  } catch (e) {
    return true;
  }
}

// Applies each section's chosen heading font/color as scoped CSS variables
// directly on that <section> element, so it only affects that section.
function applySectionStyles(sectionStyles, customSections) {
  if (!sectionStyles) return;
  getAllSectionIds(customSections).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const conf = sectionStyles[id] || {};
    const font = getHeadingFont(conf.font);
    const color = getAccentColor(conf.color);
    if (font.css) el.style.setProperty("--heading-font", font.css);
    else el.style.removeProperty("--heading-font");
    if (color.hex && isColorSafeOnPaper(color.hex)) el.style.setProperty("--heading-color", color.hex);
    else el.style.removeProperty("--heading-color");
  });
}
