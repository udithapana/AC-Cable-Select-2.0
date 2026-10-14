# AC Cable Selection — PWA package (flat structure)

Every file in this folder sits at the **same level** — no subfolders. This is
deliberate: GitHub's drag-and-drop upload can silently flatten folder
structure, and the manifest/icons only work if every file lands exactly
where it's referenced from. A flat structure removes that failure mode
entirely — there's no folder nesting left to get wrong.

## 0. Give it its own repository (important)

Do **not** upload this into an existing app's repository (e.g.
`Solar_Site_Inspection_App-3.0`). Phones identify an installed web app by its
address, so two different apps at the same address clash — one replaces or
blocks the other, and Chrome can show "This app cannot be installed".
Create a new repository just for this tool, e.g. `Cable-Selection-App`, so it
gets its own address: `https://udithapana.github.io/Cable-Selection-App/`.
Your other apps stay installed and untouched.

## 1. Create the repo and upload

1. Go to **github.com → New repository**. Name it e.g. `Cable-Selection-App`, Public.
2. Open the new repo → **Add file → Upload files**.
3. Open this folder on your computer, select **all 17 files** (Ctrl/Cmd+A),
   and drag them all into the GitHub upload box at once.
4. Confirm the file list GitHub shows you matches this folder exactly —
   17 files, no folders, nothing missing:
   ```
   index.html
   manifest.json
   service-worker.js
   icon-192.png
   icon-512.png
   icon-maskable-192.png
   icon-maskable-512.png
   apple-touch-icon.png
   apple-touch-icon-167.png
   apple-touch-icon-152.png
   favicon.ico
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

## 3b. Getting the icon on iPhone / iPad

iPhones only take the icon from `apple-touch-icon.png` (Safari ignores the
manifest icons). If you see a blank tile, a screenshot thumbnail or a grey
letter instead of the cable icon:

1. Make sure you're opening the **new repo's address** — not
   `Solar_Site_Inspection_App-3.0`, which serves a different app and its own
   icons.
2. Check the icon is live: open
   `https://<your-username>.github.io/<repo-name>/apple-touch-icon.png` in
   Safari. You should see the copper / grey cable icon on a dark square. If you get a 404, the
   file didn't upload.
3. iOS stores the icon when you add the shortcut and never refreshes it.
   **Delete the old home-screen icon**, close the Safari tab, then reopen
   the URL and use **Share → Add to Home Screen** again.
4. Android/Chrome: uninstall the old app first, then reinstall — the
   launcher also keeps the old icon until then.

## 4. Then generate the APK

Go to **pwabuilder.com**, paste your GitHub Pages URL, and follow the
Android packaging steps from there (signing key, Trusted Web Activity,
download the `.apk`/`.aab`).

## Updating later

When you change `index.html` or any asset, bump the version in `CACHE_VERSION` at the top
of `service-worker.js` (e.g. `v4` → `v5`; keep the `cable-select-` prefix so it never touches your other apps' caches) before re-uploading —
that's what makes returning visitors' cached copies refresh instead of
sticking on the old version.

## What's included

- `index.html` — the app itself: calculator, History, Backup/Restore tab,
  A4 PDF report (download or share to WhatsApp/email), REGEN logo in the
  report header
- `manifest.json` — PWA metadata (name, icons, colors, display mode,
  screenshots)
- `service-worker.js` — offline caching (cache-first for the app shell)
- `icon-*.png`, `favicon.ico`, `favicon-*.png`, `apple-touch-icon*.png` —
  cable-mark app icons at the sizes Android/iOS/iPadOS/desktop expect,
  including maskable variants for Android's adaptive icon shape
- `mobile-1.png`, `mobile-2.png`, `desktop.png` — screenshots referenced
  from `manifest.json` for the install prompt / store listing
