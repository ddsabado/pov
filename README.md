# POV Portfolio

A photography portfolio for DDWUMP (Dwight Sabado) — built with React, Vite, TypeScript, and Tailwind CSS. Images hosted on Cloudinary. Deployed to GitHub Pages.

## Live Site

[https://ddsabado.github.io/pov-portfolio](https://ddsabado.github.io/pov-portfolio)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Motion (motion/react) |
| Icons | Lucide React |
| Image hosting | Cloudinary SDK |
| Fonts | Inter + IBM Plex Mono (Google Fonts) |
| Deployment | GitHub Pages |

## Pages

### `/` — Landing
- Full-screen photo slideshow (9 photos, 4s interval, 1.2s crossfade, order shuffled via Fisher-Yates on each visit)
- DDWUMP brand top-right, View button bottom-center
- On click: background fades to black while DDWUMP animates via shared `layoutId` transition into the navbar position
- Scroll locked on this page; `scrollbar-gutter` disabled to prevent black bar on right edge

### `/gallery` — Scroll Gallery
- 23 photo groups fetched from Cloudinary tags
- Each group has a custom layout: `default`, `triangle-up/down/left/right`, `triangle-inverted-tail`, `row`, `staggered`, `centered-cascade`, `centered-stack`, `cascade-align`, `cascade-align-3`, `top-center-then-staggered`
- Groups animate in with staggered fade-up spring on scroll into view, fade out on scroll out
- Click any photo to open a fullscreen modal with blur backdrop, fade+scale transition, and left/right navigation
- Modal arrows fade in on open, fade out, reappear on hover in left/right zones

### `/gear` — Gear
- Rotating half-circle dial showing 6 gear items
- Scroll or arrow keys to cycle through items
- Each item animates onto the arc with the standard entrance spring
- Flavor text (name, subtitle, description, specs) slides up/down on change; fades in on first load
- Responsive: stacked on portrait mobile, side-by-side on landscape/desktop

### `/about` — About
- Minimal page with social links (Instagram, Spotify)
- Content fades in on load

## Navbar
- Fixed top, hidden on scroll down, revealed on scroll up
- Tab-select nav with shared `layoutId` pill that slides between active tabs
- DDWUMP links back to landing; shared `layoutId` with landing page DDWUMP for smooth cross-route transition

## Project Structure

```
src/
├── assets/          # Local gear images
├── components/
│   ├── Gallery.tsx  # Photo groups + custom layouts
│   ├── Navbar.tsx   # Hide-on-scroll + animated tab select
│   └── PhotoModal.tsx
├── data/
│   └── photos.ts    # Cloudinary SDK setup + 23 photo groups
├── pages/
│   ├── Landing.tsx
│   ├── Home.tsx
│   ├── Gear.tsx
│   └── About.tsx
├── App.tsx          # Router + shared layout (Navbar lives here)
└── index.css        # Tailwind v4 @theme tokens
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/pov-portfolio](http://localhost:5173/pov-portfolio)

## Build & Deploy

```bash
npm run build    # production build
npm run deploy   # deploy to GitHub Pages
```

## Design System

- **Background:** pure black `#000` throughout
- **Fonts:** Inter (all UI) + IBM Plex Mono (metadata, specs)
- **Animation standard:** `opacity: 0→1`, `y: 48→0`, `scale: 0.93→1`, spring `stiffness: 120, damping: 16`
- **Page transitions:** `opacity: 0→1`, `duration: 0.8s`, `ease: easeInOut`
