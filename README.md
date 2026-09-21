# AC Cable Selection — PWA package

This folder is a ready-to-host Progressive Web App. Keep the folder structure
exactly as-is (`index.html`, `manifest.json`, `service-worker.js`, and the
`icons/` folder all sit next to each other) — everything uses relative paths
so it works whether it's hosted at a domain root or a sub-path.

## 1. Host it (GitHub Pages, ~5 minutes)

1. Create a new GitHub repo (public repos get free Pages hosting).
2. Upload all the files in this folder, preserving the `icons/` subfolder.
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch:
   `main`, folder `/ (root)` → Save.
4. GitHub gives you a URL like:
   `https://<your-username>.github.io/<repo-name>/`
5. Open it — it should load the app. On Android Chrome you'll get an
   "Install app" prompt; on desktop Chrome, an install icon appears in the
   address bar. That confirms the PWA is valid before you package it.

(Netlify or Vercel work the same way if you'd rather drag-and-drop the
folder instead of using Git.)

## 2. Generate the Android package with PWABuilder

1. Go to **pwabuilder.com**.
2. Paste your GitHub Pages URL and click **Start**.
3. It will fetch `manifest.json` and audit the app — you should see green
   checks for manifest, service worker, and icons.
4. Click **Package for stores → Android**.
5. Choose:
   - **Signing key**: let PWABuilder generate one for you (keep the
     downloaded `.keystore` file safe — you'll need it for any future
     updates to the same app listing).
   - **Package type**: Trusted Web Activity (default) is right for this.
6. Download the package — you'll get a signed `.apk` (installable directly
   on a phone for testing) and an `.aab` (the format Google Play wants for
   a store listing).

## 3. Install / test

- Sideload the `.apk` onto an Android phone (enable "Install unknown apps"
  for your file manager/browser first), or
- Upload the `.aab` to a Google Play Console **Internal testing** track for
  a proper install-from-Play test.

## Updating later

When you change `index.html`, bump `CACHE_VERSION` at the top of
`service-worker.js` (e.g. `cable-select-v2`) before redeploying — that's
what makes returning users' cached copies refresh instead of sticking on
the old version. Re-run PWABuilder against the same hosted URL if you also
want to rebuild the APK.

## What's included

- `index.html` — the app itself
- `manifest.json` — PWA metadata (name, icons, colors, display mode, screenshots)
- `service-worker.js` — offline caching (cache-first for the app shell)
- `icons/` — app icons at the sizes Android/iOS/desktop expect, including
  maskable variants for adaptive Android icons
- `screenshots/` — real screenshots of the app (2 mobile, 1 desktop),
  referenced from `manifest.json` so PWABuilder and the Play Store listing
  have them ready-made
