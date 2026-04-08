# Personal microsite

A personal brand / music site that loads like an old computer: countdown → terminal boot → glitch → ASCII name → Mac System 7–style desktop.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (production)

This app is a standard **Next.js 15** client-heavy site (no API routes, no server-only data fetching). Deploy with the default Node build:

```bash
npm install
npm run build
npm run start
```

**Recommended:** [Vercel](https://vercel.com) — import the repo, framework preset **Next.js**, build command `npm run build`, output `.next`, install `npm install`. No environment variables are required.

**Alternatives:** Any host that runs `next start` or Vercel-compatible adapters. **Static export** (`output: 'export'`) is not configured; switching would need a deliberate check of dynamic imports and asset paths, so the safe default is a normal Next.js deployment.

Static assets (`public/`, including `public/listen_now/`) are served as-is; ensure large media is acceptable for your git/CI limits or host them externally and update paths in code.

## Flow

1. **Countdown** — Fast countdown (matrix green, right-aligned), then auto-advances at 00:00:00.
2. **Terminal boot** — Matrix-green terminal with music-themed lines (tracks, releases, content engine).
3. **Letter glitch** — Full-screen glitch text (colors: `#2b4539`, `#61dca3`, `#61b3dc`) for a few seconds.
4. **ASCII text** — “MICHAEL JO” ASCII art with waves for a few seconds.
5. **Mac desktop** — System 7–style hub: teal desktop, menu bar, draggable windows (Note Pad, About This Macintosh, System Folder). Double-click desktop icons to open windows.

## Stack

- Next.js 15 (App Router)
- React 19
- TailwindCSS
- Three.js (ASCIIText only)

## Customization

- **Countdown**: `src/components/CountdownPhase.tsx` — initial time and tick speed.
- **Boot lines**: `src/components/TerminalBootPhase.tsx` — `BOOT_LINES` (tracks, messages).
- **Glitch duration**: `src/app/page.tsx` — `GLITCH_DURATION_MS`.
- **ASCII duration**: `src/app/page.tsx` — `ASCII_DURATION_MS`.
- **Desktop**: `src/components/MacDesktop.tsx` — icons, window content, and future song/release microsites.
# MICHAEL-JONES-OS
# MICHAEL-JONES-OS
