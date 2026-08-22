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

if (typeof SITE_CONTENT !== "undefined") {
  const fp = (SITE_CONTENT.site && SITE_CONTENT.site.fontPreset) || "theme-default";
  if (fp !== "theme-default") applyFontPreset(fp);
}
