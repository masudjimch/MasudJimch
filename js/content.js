/*
  CONTENT.JS — this is the ONLY file you normally need to edit by hand.
  Easiest way: open admin.html in your browser, edit everything by clicking,
  then click "Download content.js" and replace this file in your GitHub repo.

  If you ever edit this file directly, just change the text inside the quotes.
  Do not remove commas or quotation marks.
*/

const SITE_CONTENT = {
  site: {
    name: "Dr. Your Name",
    initials: "YN",
    tagline: "Physician & Researcher",
    footerNote: "Built with care. Updated regularly."
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Publications", href: "#publications" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" }
  ],

  hero: {
    eyebrow: "Portfolio",
    name: "Dr. Your Name",
    role: "MBBS, MD — Internal Medicine",
    tagline: "Practicing medicine with evidence, empathy, and attention to detail.",
    ctaLabel: "Get in touch",
    ctaHref: "#contact",
    photo: "images/profile.svg"
  },

  about: {
    heading: "About",
    paragraphs: [
      "I am a physician based in Khulna, Bangladesh, focused on patient-centered care and clinical research.",
      "Over the years I have worked across hospital medicine, outpatient care, and community health programs, publishing research along the way.",
      "This site brings together my background, publications, and moments from my work — feel free to reach out."
    ],
    photo: "images/about.svg",
    stats: [
      { value: "10+", label: "Years in practice" },
      { value: "20+", label: "Publications" },
      { value: "5", label: "Hospitals worked with" }
    ],
    credentials: [
      "MBBS — Your Medical College",
      "MD, Internal Medicine — Your University",
      "Member, Bangladesh Medical Association"
    ]
  },

  publications: {
    heading: "Publications",
    subheading: "Research papers, articles, and case studies",
    categories: [
      {
        id: "research",
        label: "Research Papers",
        items: [
          {
            title: "Sample Research Paper Title Goes Here",
            journal: "Journal of Example Medicine",
            year: "2024",
            link: "#"
          },
          {
            title: "Another Research Paper Title",
            journal: "Bangladesh Journal of Medicine",
            year: "2023",
            link: "#"
          }
        ]
      },
      {
        id: "articles",
        label: "Articles",
        items: [
          {
            title: "Sample Article or Opinion Piece",
            journal: "Health Magazine",
            year: "2024",
            link: "#"
          }
        ]
      },
      {
        id: "cases",
        label: "Case Studies",
        items: [
          {
            title: "Sample Case Study Title",
            journal: "Clinical Case Reports",
            year: "2022",
            link: "#"
          }
        ]
      }
    ]
  },

  gallery: {
    heading: "Gallery",
    subheading: "Photos from work, conferences, and events",
    categories: [
      {
        id: "clinic",
        label: "Clinic",
        images: [
          { src: "images/gallery-1.svg", caption: "At the clinic" },
          { src: "images/gallery-2.svg", caption: "With the team" }
        ]
      },
      {
        id: "conferences",
        label: "Conferences",
        images: [
          { src: "images/gallery-3.svg", caption: "Speaking at a conference" }
        ]
      }
    ]
  },

  contact: {
    heading: "Contact",
    subheading: "Feel free to reach out for consultations, collaborations, or questions.",
    email: "your.email@example.com",
    phone: "+880 1XXX-XXXXXX",
    location: "Khulna, Bangladesh",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/yourname" },
      { label: "ResearchGate", url: "https://researchgate.net/profile/yourname" },
      { label: "Twitter / X", url: "https://x.com/yourname" }
    ]
  }
};
