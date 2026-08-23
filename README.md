# Your Portfolio Website

A ready-to-publish personal portfolio website. No coding needed to edit it.

## What's inside

- `index.html` — the website itself
- `admin.html` — **open this to edit your content** (name, bio, publications, gallery, contact) by clicking on fields
- `js/content.js` — where all your text lives (admin.html edits this for you)
- `images/` — put your photos here
- `css/` — styling (you shouldn't need to touch this)

## How to publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `your-username.github.io` for a root URL, or any name for a project URL).
2. Upload all the files and folders from this project into that repository (keep the folder structure exactly as-is).
3. In your repository, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, choose the `main` branch and `/ (root)` folder, then click **Save**.
5. Wait a minute or two — GitHub will give you a live URL like `https://your-username.github.io/repo-name/`.

## How to edit your content

**Option A — Save directly to GitHub (recommended, one-time setup):**

1. Create a **fine-grained personal access token**: go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new), sign in, and:
   - Under "Repository access", choose **Only select repositories** and pick your portfolio repo.
   - Under "Permissions → Repository permissions", set **Contents** to **Read and write**.
   - Set an expiration you're comfortable with, then click **Generate token** and copy it (you won't see it again).
2. Open `admin.html` and fill in the **Connect to GitHub** card at the top: your GitHub username, the repository name, the branch (usually `main`), and paste in the token.
3. Click **Test connection** to confirm it works.
4. From then on, edit anything you like and click **Save to GitHub** — it commits straight to your repo. Your live site updates within a minute or two.
5. Your token is stored only in this browser's `localStorage`, and is sent only to `api.github.com`. Don't use "Save to GitHub" on a shared/public computer with your token saved. Click **Forget saved token** anytime to remove it, and you can revoke the token itself from your GitHub settings whenever you want.

**Option B — Manual download & upload (no token needed):**

1. Open `admin.html`, edit your content by clicking into fields.
2. Click **Download content.js**.
3. In your GitHub repository, open `js/content.js`, click the pencil (edit) icon, delete everything, and paste in the contents of the file you just downloaded. Commit the change.
4. Your live site updates automatically within a minute.

## How to change the site's colors & style

1. Open `admin.html` → the top card is **Theme & Style**, showing several color swatches (each with a name and a small description).
2. Click any swatch — the whole page (including the admin panel itself) instantly re-colors so you can preview it.
3. Click **Save to GitHub** (or **Download content.js** and upload it yourself). Your live site will use the new theme.

## How to upload publication PDFs

1. Open `admin.html` → scroll to **Publications**.
2. Under any publication entry, click the **Publication PDF** file picker and choose the PDF from your computer.
3. That's it — the PDF is embedded directly into `content.js` (no separate upload to GitHub needed for the PDF itself). A "⬇ Download PDF" button will appear next to that publication on your live site, so any visitor can click it to download the paper.
4. Keep each PDF under 4MB so `content.js` doesn't get too large. If a file is bigger, compress it first (there are free online PDF compressors) or host it elsewhere and paste that link into the "Link (URL)" field instead.
5. Remember to still click **Save to GitHub** (or download and replace `content.js` in your GitHub repo) afterward.

## How to add your own photos

1. Add your image files (`.jpg` or `.png`) into the `images/` folder in your GitHub repo.
2. In `admin.html`, set the photo path field to match exactly, e.g. `images/my-photo.jpg`.
3. Download `content.js` again and update it in your repo (see steps above).

## New features (this round)

- **Dark theme text-visibility bug fixed**: some headings/buttons were using a text color that matched the background in dark themes, making them invisible. This is fixed across all 9 themes.
- **Per-section fonts & colors**: a new "Section fonts & colors" card in `admin.html` lets you pick a different heading font and accent color for each section (Home, About, Publications, Apps, Journey, Testimonials, Blog, Gallery, FAQ, Contact) independently — 11 fonts and 17 colors to choose from. Leave any section on "Theme Default" to keep it matching the rest of the site.
- **Real content filled in** from your CV: About, credentials, career Journey timeline, all 13 publications, and Contact details (both emails, phone, address, ResearchGate/ORCID/Academia.edu/ScienceOpen links).
- **CV embedded**: your CV PDF is already embedded in `content.js` — the "Download CV" button works immediately, no upload step needed.
- **WhatsApp number** was pre-filled from your CV — clear it in Site settings if you'd rather not show the floating WhatsApp button.
- **Testimonials section** is currently empty (hidden on the live site) since no real testimonials were provided — add some in `admin.html` whenever you have them, and the section will reappear automatically.

## New features (latest round)

- **Bangla/English toggle**: a "বাং/EN" button in the header switches the language. **Scope**: this switches navigation labels, section headings/subheadings, hero text, and the footer note (write both languages for these in `admin.html` — each has an "English" and "বাংলা" box). Longer content you write yourself — About paragraphs, publication details, app details, gallery captions, testimonials, FAQ answers, blog posts, journey entries — is single-language: whatever you type shows regardless of the toggle. You can still write any of that content in Bangla directly if you want the whole site in Bangla.
- **CV / Resume download**: upload your CV as a PDF under the **CV / Resume** card — a "📄 Download CV" button appears next to your hero button.
- **Journey section**: a timeline for milestones, awards, and speaking engagements (year, title, description).
- **Testimonials section**: patient/colleague quotes, each with an optional uploaded photo.
- **Blog section**: posts with a title, date, cover image, excerpt (shown on the card), and full content — clicking a post opens it in a reading modal, all on one page (no separate blog engine needed).
- **FAQ section**: click-to-expand question/answer accordion.
- **WhatsApp floating button**: set your number (with country code, digits only) in **Site settings** — a floating chat button appears on every page. Leave blank to hide it.
- **Google Analytics**: paste your Measurement ID (e.g. `G-XXXXXXX`) in **Site settings** to track visitors. Leave blank to disable.
- **SEO & social preview**: set a description and preview image in **Site settings** — controls how your site looks when shared on WhatsApp/Facebook/Twitter or found on Google.
- **Custom 404 page**: `404.html` is included and styled to match your theme — GitHub Pages automatically shows it for broken links, no setup needed.
- Any of the new sections (Journey, Testimonials, Blog, FAQ) automatically hides itself on the live site if you delete all its entries — no need to remove it from the menu manually, though you may want to for tidiness.

## Setting up a custom domain (optional)

1. Buy a domain from any registrar (Namecheap, GoDaddy, etc.).
2. In the registrar's DNS settings, add a `CNAME` record pointing your domain (or subdomain like `www`) to `your-username.github.io`.
3. In your GitHub repo, go to **Settings → Pages → Custom domain**, type your domain, and save. GitHub creates a `CNAME` file in your repo automatically.
4. Wait for DNS to propagate (can take a few hours), then check "Enforce HTTPS" once it's available.

## New features

- **9 themes** with luxurious dark options (Royal Purple & Gold, Obsidian & Emerald, Crimson Noir, Neon Nights), each with its own font.
- **Typography card**: independently override fonts (7 presets — elegant serif, luxury display, minimal, bold, etc.) regardless of which color theme you pick.
- **Apps section**: showcase apps you've built, each with an uploaded icon, platform, price, star rating, and up to two buttons (e.g. "Get on Play Store" + "Direct Download"). About the rating: since this is a static site with no backend, the star rating is one you set yourself in `admin.html` (e.g. copy your real Play Store/App Store rating) — it isn't collected live from site visitors. For genuine visitor reviews, link your primary button straight to your app's real Play Store/App Store listing, where real reviews already live.
- **Reorder tabs/categories, links, and apps**: drag (⠿) or use ▲▼ buttons to reorder Publications tabs, Gallery tabs, menu items, hero badges, apps, and Contact emails/links.
- **Multiple email addresses**, each with its own icon and label.
- **Icons on links, buttons, and apps**: contact links/emails have an icon picker, the hero button has an icon field, and apps have an uploaded icon.

## Notes

- This is a static site (no backend/database), so editing always works the same way: edit in `admin.html` → download → replace `content.js` in GitHub → commit.
- The site is fully responsive and works on mobile.
- Replace the placeholder profile/gallery images in `images/` with your real photos whenever you're ready — the current ones are just simple placeholders.
