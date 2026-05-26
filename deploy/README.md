# CSGPL — Deployment Guide

This folder contains everything ops needs to deploy the CSGPL CMS to
Firebase, Vercel, Netlify or any static host.

## 1. One-time Firebase setup

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Authenticate & link to the project
firebase login
firebase use csgpl-83618
```

## 2. Deploy security rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

Rules live in:

- `deploy/firestore.rules`
- `deploy/storage.rules`

> **Why:** the public site reads from Firestore but only authenticated admins
> may write. Storage uses identical semantics for media files.

## 3. Configure Storage CORS

Required so the admin's browser may upload directly to the bucket.

```bash
gsutil cors set deploy/cors.json gs://csgpl-83618.firebasestorage.app
```

Edit `deploy/cors.json` to add any additional domains you serve from.

## 4. Build

```bash
npm install
npm run build
```

The build emits a single `dist/index.html` (Vite single-file plugin) that
can be hosted on any static host.

Build-time environment variables:

| Var                       | Default               | Purpose                                  |
| ------------------------- | --------------------- | ---------------------------------------- |
| `VITE_SITE_URL`           | `https://csgpl.in`    | Canonical/OG/sitemap base URL            |
| `VITE_FIREBASE_ENABLED`   | `true`                | Set to `false` to force fallback mode    |

## 5. Hosting

Any of:

```bash
# Firebase Hosting
firebase deploy --only hosting

# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

For Firebase Hosting, configure `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

## 6. Sitemap & robots.txt

The admin SEO page provides one-click downloads for `sitemap.xml` and
`robots.txt` based on the current Firestore state. Upload these to the
root of your hosting bucket.

## 7. Admin access

Demo credentials (offline / local-fallback): `admin@csgpl.in` / `admin123`.

For production, create an admin via Firebase Console → Authentication →
Add user, then sign in at `/admin/login` with that real credential.
