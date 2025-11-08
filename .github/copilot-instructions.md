## Repo snapshot

- This is a small static multi-page website for "Mohamed Rama Mursal LLP" (HTML/CSS/vanilla JS). Key entry points: `index.html`, `aboutus.html`, `services.html`, `contact.html`.
- Styles live in `css/` (e.g. `css/style.css`, `css/home.css`). Main client logic is in `js/main.js` (large single-file script that initializes UI components).
- Assets (logo, images) live in `assets/`.

## What you need to know to be productive

- There is no frontend framework or build pipeline: `package.json` contains a single script `build` that echoes "No build step required". Edits are made directly to the HTML/CSS/JS files.
- Tailwind is used via CDN (see `index.html` head); do not expect a local Tailwind build. Keep changes compatible with CDN usage (avoid relying on JIT-only utilities unless you add a build step).
- Forms are handled client-side and submit to Formspree: open `contact.html` and search for the `<form ... action="https://formspree.io/" ...>` element. There used to be a Netlify Zoho function (`netlify/functions/zoho-submit.js`) but it is now a stub returning 410 — the repo comment explicitly says Zoho integration was removed.
- Netlify deployment is configured in `netlify.toml`. Important bits:
  - `publish = "."` (root)
  - `functions = "netlify/functions"` and `node_bundler = "esbuild"` for serverless functions
  - A global redirect `/* -> /index.html` is present (useful: the site behaves like an SPA in production; be careful when adding routes).

## Conventions & patterns you should follow

- Keep changes minimal and localized: the site is plain HTML pages wired together with anchors and `js/main.js`. Avoid large refactors that introduce build tooling unless requested.
- JavaScript pattern: `js/main.js` exposes many initializer functions (e.g. `initializeContactForm`, `initializeTestimonials`, `initializeServicesNav`). Edit or extend those functions rather than scattering new logic across files.
- Styling pattern: global CSS in `css/style.css` + page-specific CSS files. Use existing utility classes and the Tailwind CDN for quick tweaks.
- Forms: modify `contact.html` and update client-side validation in `js/main.js` (search for `initializeContactForm`). If you need server-side processing, update or add Netlify functions in `netlify/functions/` and adjust `netlify.toml` if required.

## Quick examples (where to change things)

- To change the phone number shown site-wide: edit `index.html` and `contact.html` header CTA links (look for `tel:+254702929018`).
- To change contact form target: edit the `action` attribute in `contact.html` form (currently Formspree). If switching to Netlify functions, replace `action` with a client-side fetch to a function under `netlify/functions/`.
- To add a new service anchor: add the section in `services.html` with an `id` and update service links in `index.html` (the services box links to e.g. `services.html#corporate`). Update `js/main.js` if you need interactive show/hide behavior.

## Integration notes & gotchas

- `netlify/functions/zoho-submit.js` is intentionally a stub (returns 410). Do not rely on it. If you need CRM integration, implement a new function and ensure `node_bundler = "esbuild"` can bundle it (follow Netlify function entry shape: `exports.handler = async (event) => { ... }`).
- The repo uses external CDNs for fonts, AOS, Font Awesome and Tailwind. Offline/local dev may need a simple static server to test pages (no npm install required).
- The global redirect in `netlify.toml` means deep links will serve `index.html`. If you add server-side routes, update redirects carefully.

## Developer workflows (commands)

Use a simple static server for local previews (examples):

```powershell
# simple python server (Windows PowerShell)
python -m http.server 8080

# or install a tiny node server
npx http-server . -p 8080 -c-1
```

Netlify preview (if you use the Netlify CLI):

```powershell
# optional: run Netlify dev to test functions + redirects
netlify dev
```

Note: there is no build step in `package.json`. If you add a build pipeline (e.g. to compile Tailwind or bundle JS), update `package.json` and add instructions here.

## If you're an AI agent making edits

- Prefer minimal, targeted edits. Reference the exact file and line region when proposing a change (e.g. "in `contact.html` change form action from `https://formspree.io/f/manlrprn` to `https://formspree.io/f/NEWID`").
- When changing behavior, point to existing helper functions in `js/main.js` (e.g. `initializeContactForm`) and explain how your change integrates with them.
- When introducing new serverless functions, add tests/examples and mention required environment variables. Place functions in `netlify/functions/` and respect `netlify.toml` bundler settings.

---

If anything above is unclear or you'd like more detail on a specific area (forms, Netlify functions, or `js/main.js` internals), tell me which file or behavior and I'll expand with concrete examples and a small patch.
