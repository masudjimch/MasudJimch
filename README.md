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

1. Open `admin.html` in any web browser (you can just double-click the file on your computer, or open it from your published site at `.../admin.html`).
2. Click into any field and change the text. Use "+ Add" buttons to add publications, photos, menu items, etc. Use "Remove ✕" to delete an item.
3. When you're done, click **Download content.js**.
4. In your GitHub repository, open `js/content.js`, click the pencil (edit) icon, delete everything, and paste in the contents of the file you just downloaded. Commit the change.
5. Your live site updates automatically within a minute.

## How to change the site's colors & style

1. Open `admin.html` → the top card is **Theme & Style**, showing several color swatches (each with a name and a small description).
2. Click any swatch — the whole page (including the admin panel itself) instantly re-colors so you can preview it.
3. Click **Download content.js** and replace the file in your repo like usual. Your live site will use the new theme.

## How to upload publication PDFs

1. Open `admin.html` → scroll to **Publications**.
2. Under any publication entry, click the **Publication PDF** file picker and choose the PDF from your computer.
3. That's it — the PDF is embedded directly into `content.js` (no separate upload to GitHub needed for the PDF itself). A "⬇ Download PDF" button will appear next to that publication on your live site, so any visitor can click it to download the paper.
4. Keep each PDF under 4MB so `content.js` doesn't get too large. If a file is bigger, compress it first (there are free online PDF compressors) or host it elsewhere and paste that link into the "Link (URL)" field instead.
5. Remember to still click **Download content.js** and replace the file in your GitHub repo afterward.

## How to add your own photos

1. Add your image files (`.jpg` or `.png`) into the `images/` folder in your GitHub repo.
2. In `admin.html`, set the photo path field to match exactly, e.g. `images/my-photo.jpg`.
3. Download `content.js` again and update it in your repo (see steps above).

## Notes

- This is a static site (no backend/database), so editing always works the same way: edit in `admin.html` → download → replace `content.js` in GitHub → commit.
- The site is fully responsive and works on mobile.
- Replace the placeholder profile/gallery images in `images/` with your real photos whenever you're ready — the current ones are just simple placeholders.
