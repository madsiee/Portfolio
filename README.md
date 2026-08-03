# Galaxy Portfolio

Immersive space portfolio inspired by [dungyov.com](https://dungyov.com) — dark starfield, scroll-to-fly, and a single content file you edit.

## Quick start

```bash
npm install
npm run dev
```

## Edit your content

All copy, roles, case studies, talks, and contact info live in:

**[`src/content.ts`](src/content.ts)**

1. Change `brand`, `intro`, `pitch`, career story, numbers, cases, talks, manifesto, and contact.
2. Drop your portrait at `public/portrait.jpg`.
3. Optionally add talk thumbnails under `public/`.

Then refresh the browser.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |

## Stack

Vite · React · TypeScript · Three.js (`@react-three/fiber`) · Unbounded + Space Grotesk
