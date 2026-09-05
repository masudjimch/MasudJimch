/*
  FONTS.JS — typography presets, independent from color themes.
  Pick one from admin.html (Typography card) to override the heading/body
  fonts regardless of which color theme is active. "Theme Default" leaves
  each theme's own built-in font pairing untouched.
*/

const FONT_PRESETS = [
  {
    id: "theme-default",
    name: "Theme Default",
    description: "Use whichever font comes built into the color theme.",
    fontDisplay: null,
    fontBody: null
  },
  {
    id: "elegant-serif",
    name: "Elegant Editorial",
    description: "Fraunces — warm, literary serif headings.",
    fontDisplay: "'Fraunces', Georgia, serif",
    fontBody: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  },
  {
    id: "luxury-serif",
    name: "Luxury Display",
    description: "Playfair Display — dramatic, high-contrast serif.",
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  },
  {
    id: "romantic-serif",
    name: "Romantic Serif",
    description: "Cormorant Garamond — refined, elegant serif.",
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  },
  {
    id: "modern-geometric",
    name: "Modern Geometric",
    description: "Space Grotesk — clean, contemporary sans headings.",
    fontDisplay: "'Space Grotesk', sans-serif",
    fontBody: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Inter — quiet, ultra-legible, minimal.",
    fontDisplay: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif"
  },
  {
    id: "bold-statement",
    name: "Bold Statement",
    description: "Syne — confident, geometric, attention-grabbing.",
    fontDisplay: "'Syne', sans-serif",
    fontBody: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  },
  {
    id: "futuristic-tech",
    name: "Futuristic Tech",
    description: "Orbitron — sci-fi, technical, great with dark/neon themes.",
    fontDisplay: "'Orbitron', sans-serif",
    fontBody: "'Space Grotesk', sans-serif"
  },
  {
    id: "bold-poster",
    name: "Bold Poster",
    description: "Bebas Neue — tall, condensed, poster-style headings.",
    fontDisplay: "'Bebas Neue', sans-serif",
    fontBody: "'Inter', sans-serif"
  },
  {
    id: "playful-rounded",
    name: "Playful Rounded",
    description: "Righteous — friendly, rounded, confident display font.",
    fontDisplay: "'Righteous', sans-serif",
    fontBody: "'Poppins', sans-serif"
  },
  {
    id: "neo-grotesk",
    name: "Neo Grotesk",
    description: "Unbounded — bold, geometric, contemporary — a stylish match for Neon Nights.",
    fontDisplay: "'Unbounded', sans-serif",
    fontBody: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  }
];

function getFontPreset(id) {
  return FONT_PRESETS.find(f => f.id === id) || FONT_PRESETS[0];
}

// Overrides --font-display / --font-body on top of whatever the current theme set.
// Pass "theme-default" (or omit) to leave the theme's own fonts alone.
function applyFontPreset(id) {
  const preset = getFontPreset(id);
  const root = document.documentElement.style;
  if (preset.fontDisplay) root.setProperty("--font-display", preset.fontDisplay);
  if (preset.fontBody) root.setProperty("--font-body", preset.fontBody);
  document.documentElement.setAttribute("data-font", preset.id);
}

// Applies both the color theme and (if set) a font override — call this instead
// of applyTheme() directly whenever site.theme or site.fontPreset might have changed.
function applyStyling(themeId, fontPresetId) {
  applyTheme(themeId);
  if (fontPresetId && fontPresetId !== "theme-default") {
    applyFontPreset(fontPresetId);
  }
}

// --- Custom (user-added) fonts --------------------------------------------
// Builds a Google Fonts CSS URL for a font family name, e.g. "Lobster" or
// "Playfair Display" -> https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap
function googleFontUrl(name) {
  const family = name.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
}

// Injects a <link> tag for each custom font in site.customFonts so it's
// actually loadable — call this on every page (index.html and admin.html)
// as early as possible, since fonts take a moment to fetch.
function injectCustomFonts(customFonts) {
  (customFonts || []).forEach(f => {
    if (!f || !f.name) return;
    const id = "custom-font-" + f.name.replace(/\s+/g, "-").toLowerCase();
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = googleFontUrl(f.name);
    document.head.appendChild(link);
  });
}

// Returns the merged list of built-in + custom fonts as {name, css} pairs,
// for populating font dropdowns (formatting toolbar, per-section font picker).
function getAllAvailableFonts(customFonts) {
  const custom = (customFonts || []).map(f => ({ name: f.name + " (your font)", css: `'${f.name}', sans-serif` }));
  return custom;
}

if (typeof SITE_CONTENT !== "undefined") {
  injectCustomFonts(SITE_CONTENT.site && SITE_CONTENT.site.customFonts);
  const fp = (SITE_CONTENT.site && SITE_CONTENT.site.fontPreset) || "theme-default";
  if (fp !== "theme-default") applyFontPreset(fp);
}
