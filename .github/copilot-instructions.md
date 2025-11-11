## Repo snapshot (short)

- Small static multi-page site (HTML/CSS/vanilla JS) for a law firm. Key pages: `index.html`, `aboutus.html`, `services.html`, `contact.html`.
- Styles: `css/` (global + per-page). Client logic: `js/main.js` (single large initializer file). Assets: `assets/`.

## Quick start (what an agent needs immediately)

- No build step: `package.json` contains a no-op build script. Edit files directly and preview with a static server: e.g. `python -m http.server 8080` or `npx http-server . -p 8080 -c-1`.
- Netlify: `netlify.toml` publishes root, functions in `netlify/functions`, bundler `esbuild`. `netlify dev` is useful for testing functions + redirects.

## Key patterns & where to change things

- `js/main.js` exposes initializer helpers (search for `initializeContactForm`, `initializeTestimonials`, `initializeServicesNav`). Modify behavior there.
- CSS: global rules in `css/style.css`; page-specific files (e.g. `css/home.css`). Tailwind via CDN  do not assume a local build.
- Forms: `contact.html` posts to Formspree by default. `netlify/functions/zoho-submit.js` is a stub returning 410; do not rely on it.

## Conventions & non-obvious rules

- Keep changes minimal and localized. Avoid adding a build pipeline unless requested.
- New serverless functions go in `netlify/functions/` and must follow `exports.handler = async (event) => { ... }` for Netlify + be bundleable by `esbuild`.
- Deep links are served to `index.html` because of the global redirect in `netlify.toml` (`/* -> /index.html`).

## Concrete examples

- Change phone: edit `index.html` and `contact.html` for `tel:+254702929018`.
- Change contact form target: edit the `<form action="...">` in `contact.html` or replace with a client-side `fetch` to `/.netlify/functions/<fn>`.

## For AI agents making edits

- Always reference exact files and lines in PRs. Prefer minimal patches and explain how new code integrates with `js/main.js`.
- When adding functions, include a minimal test event and document any required environment variables at the top of the function.

If you want a checklist for first-time local development or a short mapping of `js/main.js` helper names to page behavior, tell me which form/feature to map and I will add it.
