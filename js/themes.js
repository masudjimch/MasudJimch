/*
  THEMES.JS — style & color scheme presets.
  Pick one from admin.html (Theme & Style card) — the whole site's colors,
  accent, corner-roundness, and heading font switch instantly.
*/

const THEMES = [
  {
    id: "navy-gold",
    name: "Navy & Gold",
    description: "Classic, serif, editorial — deep navy with warm gold accents.",
    radius: "2px",
    fontDisplay: "'Fraunces', Georgia, serif",
    vars: {
      paper: "#F7F4EC", paperDim: "#EFE9DD",
      ink: "#14232E", inkSoft: "#4B5B65",
      night: "#10202C", nightSoft: "#1E3A4C",
      gold: "#C08A2E", goldSoft: "#E4C486",
      sage: "#3E6E63",
      line: "rgba(20,35,46,0.12)"
    }
  },
  {
    id: "teal-charcoal",
    name: "Teal & Charcoal",
    description: "Modern, rounded, sans — cool teal on charcoal.",
    radius: "10px",
    fontDisplay: "'Space Grotesk', 'IBM Plex Sans', sans-serif",
    vars: {
      paper: "#F3F7F7", paperDim: "#E5EEEE",
      ink: "#1B2B2E", inkSoft: "#52696D",
      night: "#152325", nightSoft: "#223B3E",
      gold: "#2E8C86", goldSoft: "#7FC4BE",
      sage: "#B76E4A",
      line: "rgba(21,35,37,0.12)"
    }
  },
  {
    id: "burgundy-cream",
    name: "Burgundy & Cream",
    description: "Warm, classic, serif — cream paper with deep burgundy.",
    radius: "3px",
    fontDisplay: "'Fraunces', Georgia, serif",
    vars: {
      paper: "#FBF3EA", paperDim: "#F2E4D3",
      ink: "#2E1B1E", inkSoft: "#6B5049",
      night: "#3B1420", nightSoft: "#552030",
      gold: "#B4553A", goldSoft: "#D98F6F",
      sage: "#7C7A3E",
      line: "rgba(46,27,30,0.12)"
    }
  },
  {
    id: "slate-amber",
    name: "Slate & Amber",
    description: "Modern, rounded, sans — cool slate with amber highlights.",
    radius: "8px",
    fontDisplay: "'Space Grotesk', 'IBM Plex Sans', sans-serif",
    vars: {
      paper: "#F5F6F8", paperDim: "#E9EBEF",
      ink: "#1E2733", inkSoft: "#54627A",
      night: "#101826", nightSoft: "#1C2A3D",
      gold: "#D98E33", goldSoft: "#F0BE7E",
      sage: "#3E7A8C",
      line: "rgba(30,39,51,0.12)"
    }
  },
  {
    id: "forest-copper",
    name: "Forest & Copper",
    description: "Earthy, classic, serif — deep forest with copper accents.",
    radius: "3px",
    fontDisplay: "'Fraunces', Georgia, serif",
    vars: {
      paper: "#F5F6EF", paperDim: "#E9EBDC",
      ink: "#1E271D", inkSoft: "#52604C",
      night: "#122016", nightSoft: "#1E3324",
      gold: "#B9612E", goldSoft: "#E0A470",
      sage: "#4C6E8A",
      line: "rgba(30,39,29,0.12)"
    }
  },
  {
    id: "royal-purple",
    name: "Royal Purple & Gold",
    description: "Luxurious dark purple, rich gold, ornate serif headings.",
    radius: "4px",
    fontDisplay: "'Playfair Display', Georgia, serif",
    vars: {
      paper: "#1A1224", paperDim: "#241A33",
      ink: "#F3EDE0", inkSoft: "#C9BFD9",
      night: "#0D0716", nightSoft: "#1D1330",
      gold: "#D4AF37", goldSoft: "#F0D97A",
      sage: "#8B6FC9",
      line: "rgba(243,237,224,0.15)"
    }
  },
  {
    id: "obsidian-emerald",
    name: "Obsidian & Emerald",
    description: "Dark jewel tones — emerald and amber on near-black.",
    radius: "4px",
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    vars: {
      paper: "#0F1714", paperDim: "#16211C",
      ink: "#EAF3EE", inkSoft: "#AFC7BB",
      night: "#070C0A", nightSoft: "#10201A",
      gold: "#2FBF8F", goldSoft: "#7BE0BB",
      sage: "#C9A227",
      line: "rgba(234,243,238,0.14)"
    }
  },
  {
    id: "crimson-noir",
    name: "Crimson Noir",
    description: "Bold dark luxury — crimson red on near-black, dramatic serif.",
    radius: "2px",
    fontDisplay: "'Playfair Display', Georgia, serif",
    vars: {
      paper: "#160C0D", paperDim: "#221214",
      ink: "#F5E9E7", inkSoft: "#D2AFA9",
      night: "#0A0505", nightSoft: "#1E0F10",
      gold: "#C0263B", goldSoft: "#E85F6F",
      sage: "#9C8552",
      line: "rgba(245,233,231,0.14)"
    }
  },
  {
    id: "neon-nights",
    name: "Neon Nights",
    description: "Colorful electric dark — neon pink & teal, bold geometric display font.",
    radius: "12px",
    fontDisplay: "'Unbounded', 'Space Grotesk', sans-serif",
    vars: {
      paper: "#10121C", paperDim: "#191D2E",
      ink: "#EAF0FF", inkSoft: "#9AA3C7",
      night: "#06070D", nightSoft: "#141726",
      gold: "#FF5FA8", goldSoft: "#FFA3CE",
      sage: "#38E1C6",
      line: "rgba(234,240,255,0.16)"
    }
  },
  {
    id: "cyber-violet",
    name: "Cyber Violet",
    description: "Dark electric violet & cyan — futuristic, high-energy, techy.",
    radius: "10px",
    fontDisplay: "'Orbitron', 'Space Grotesk', sans-serif",
    vars: {
      paper: "#120E1F", paperDim: "#1B1530",
      ink: "#EDE9FF", inkSoft: "#A79FCF",
      night: "#080612", nightSoft: "#160F28",
      gold: "#B26BFF", goldSoft: "#D9AFFF",
      sage: "#2FE0D0",
      line: "rgba(237,233,255,0.16)"
    }
  },
  {
    id: "graphite-mono",
    name: "Graphite Mono",
    description: "Dark minimal grayscale with a single warm amber accent.",
    radius: "6px",
    fontDisplay: "'Space Grotesk', sans-serif",
    vars: {
      paper: "#16171A", paperDim: "#1F2023",
      ink: "#EDEEF0", inkSoft: "#9C9EA5",
      night: "#0A0A0C", nightSoft: "#1A1B1E",
      gold: "#E0A040", goldSoft: "#F0C583",
      sage: "#7A8A99",
      line: "rgba(237,238,240,0.13)"
    }
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    description: "Soft light — dusty rose & mauve, elegant serif headings.",
    radius: "10px",
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    vars: {
      paper: "#FBF4F2", paperDim: "#F3E4E1",
      ink: "#3A2226", inkSoft: "#7A5E60",
      night: "#3E2229", nightSoft: "#552F38",
      gold: "#C46B7A", goldSoft: "#E4A6B0",
      sage: "#8C7A5E",
      line: "rgba(58,34,38,0.12)"
    }
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Fresh light — sky blue & teal, clean modern sans headings.",
    radius: "10px",
    fontDisplay: "'Space Grotesk', sans-serif",
    vars: {
      paper: "#F2F8FA", paperDim: "#E3F0F3",
      ink: "#132B33", inkSoft: "#4E6D76",
      night: "#0D1F26", nightSoft: "#173540",
      gold: "#1E8FA8", goldSoft: "#6FC4D8",
      sage: "#DE8A4E",
      line: "rgba(19,43,51,0.12)"
    }
  }
];

function getTheme(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

function applyTheme(id) {
  const theme = getTheme(id);
  const root = document.documentElement.style;
  root.setProperty("--paper", theme.vars.paper);
  root.setProperty("--paper-dim", theme.vars.paperDim);
  root.setProperty("--ink", theme.vars.ink);
  root.setProperty("--ink-soft", theme.vars.inkSoft);
  root.setProperty("--night", theme.vars.night);
  root.setProperty("--night-soft", theme.vars.nightSoft);
  root.setProperty("--gold", theme.vars.gold);
  root.setProperty("--gold-soft", theme.vars.goldSoft);
  root.setProperty("--sage", theme.vars.sage);
  root.setProperty("--line", theme.vars.line);
  root.setProperty("--radius", theme.radius);
  root.setProperty("--font-display", theme.fontDisplay);
  document.documentElement.setAttribute("data-theme", theme.id);
}

// Apply immediately (before full DOM render) to avoid a flash of the default theme.
// Skip this on admin.html: the editor always stays in its own fixed light UI so
// its fields and labels stay legible no matter which theme is chosen for the
// public site (a dark site theme should never make the editor itself dark).
if (typeof SITE_CONTENT !== "undefined" && !/admin\.html$/.test(location.pathname)) {
  applyTheme((SITE_CONTENT.site && SITE_CONTENT.site.theme) || "navy-gold");
}
