# AC Cable Selection — PWA package (flat structure)

Every file in this folder sits at the **same level** — no subfolders. This is
deliberate: GitHub's drag-and-drop upload can silently flatten folder
structure, and the manifest/icons only work if every file lands exactly
where it's referenced from. A flat structure removes that failure mode
entirely — there's no folder nesting left to get wrong.

## 1. Create the repo and upload

1. Go to **github.com → New repository**. Any name, Public.
2. Open the new repo → **Add file → Upload files**.
3. Open this folder on your computer, select **all 14 files** (Ctrl/Cmd+A),
   and drag them all into the GitHub upload box at once.
4. Confirm the file list GitHub shows you matches this folder exactly —
   14 files, no folders, nothing missing:
   ```
   index.html
   manifest.json
   service-worker.js
   icon-192.png
   icon-512.png
   icon-maskable-192.png
   icon-maskable-512.png
   apple-touch-icon.png
   favicon-32.png
   favicon-16.png
   mobile-1.png
   mobile-2.png
   desktop.png
   README.md
   ```
5. Commit the upload (the default commit message is fine).

## 2. Turn on GitHub Pages

1. Repo → **Settings → Pages**.
2. Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` →
   **Save**.
3. Repo → **Actions** tab → wait for the Pages build to finish with a green
   checkmark (usually under a minute).
4. Your URL: `https://<your-username>.github.io/<repo-name>/`

## 3. Verify it's actually installable before packaging an APK

1. Open the URL from step 2 on **desktop Chrome**.
2. Open DevTools (F12) → **Application** tab → **Manifest**.
   - If everything's right, you'll see your REGEN app name, icons, and
     colors, with **no red errors** at the top.
   - If something's still wrong, this panel tells you exactly which file
     it couldn't find — screenshot that error and send it over.
3. On Android Chrome, visiting the same URL should offer **"Install app"**
   (or an install icon in the address bar on desktop). That confirms it's
   ready for PWABuilder.

## 4. Then generate the APK

Go to **pwabuilder.com**, paste your GitHub Pages URL, and follow the
Android packaging steps from there (signing key, Trusted Web Activity,
download the `.apk`/`.aab`).

## Updating later

When you change `index.html` or any asset, bump `CACHE_VERSION` at the top
of `service-worker.js` (e.g. `cable-select-flat-v2`) before re-uploading —
that's what makes returning visitors' cached copies refresh instead of
sticking on the old version.

## What's included

- `index.html` — the app itself, now with your REGEN logo in the PDF
  report header
- `manifest.json` — PWA metadata (name, icons, colors, display mode,
  screenshots)
- `service-worker.js` — offline caching (cache-first for the app shell)
- `icon-*.png`, `favicon-*.png`, `apple-touch-icon.png` — app icons at the
  sizes Android/iOS/desktop expect, including maskable variants for
  Android's adaptive icon shape
- `mobile-1.png`, `mobile-2.png`, `desktop.png` — screenshots referenced
  from `manifest.json` for the install prompt / store listing
