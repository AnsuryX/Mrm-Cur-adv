# 🚀 Complete Deployment Guide - Zoho CRM Integration

# Deployment Guide — Netlify (recommended)

This repository is a static multi-page site (HTML/CSS/vanilla JS). It uses CDN-hosted Tailwind, AOS, and Font Awesome, and the contact form posts directly to Formspree. There is no build required, but a harmless `npm run build` script exists that echoes "No build step required".

This guide shows two common ways to deploy to Netlify:
- using the Netlify web UI (recommended for quick setup)
- using the Netlify CLI (useful for local preview, CI, or scripting)

Important repo files referenced:
- `netlify.toml` — repo already contains Netlify settings (publish = ".", functions = "netlify/functions", node_bundler = "esbuild").
- `netlify/functions/zoho-submit.js` — historical stub (returns 410). Contact form currently posts to Formspree (`contact.html`).
- `contact.html` — the contact form action posts to Formspree by default: `https://formspree.io/f/manlrprn`.
- `package.json` — contains a safe `build` script: `echo 'No build step required'`.

1) Deploy via Netlify Web UI
--------------------------------
1. Push your latest code to your GitHub (or GitLab/Bitbucket) repository.
2. Go to https://app.netlify.com and sign in (or sign up) and click "New site from Git".
3. Choose the Git provider and select this repository.
4. In the Build settings set:
	 - Build command: `npm run build` (or leave blank). Using `npm run build` is safe here because the script only echoes a message.
	 - Publish directory: `.`
5. (Optional) In the Netlify UI under "Functions settings" set the functions directory to `netlify/functions` (this is already configured via `netlify.toml`).
6. Deploy. Netlify will build (run the echo build) and publish the repository root.

Notes / gotchas for the UI flow
- The site uses a redirect in `netlify.toml` to route all paths to `/index.html`. This is useful for SPA-like deep links but be aware when adding server-side routes.
- `zoho-submit.js` is a stub that returns HTTP 410. The contact form uses Formspree — do not expect `zoho-submit.js` to be invoked unless you deliberately change the form to point at a Netlify function.

2) Deploy via Netlify CLI (local preview & production deploys)
--------------------------------
Prerequisites: Node.js + npm installed.

Install the Netlify CLI (PowerShell):

```powershell
npm install -g netlify-cli
```

Login and link or create a site:

```powershell
# login to Netlify (opens browser)
netlify login

# in your repo folder, you can create & link a new site (interactive)
cd 'c:\Users\Ayoub ansari\OneDrive\Documents\mrmfinal cursor'
netlify init
```

Quick deploy (draft preview):

```powershell
# Deploy the current folder as a draft deploy (not production)
netlify deploy --dir=. 
```

Deploy to production:

```powershell
# Deploy the current folder to production (after linking the site)
netlify deploy --prod --dir=.
```

3) Functions & environment variables
--------------------------------
- The repository is configured to use `esbuild` for bundling functions (see `netlify.toml`). When adding serverless functions place them in `netlify/functions/` and follow the Netlify function shape (`exports.handler = async (event) => { ... }`).
- If you reintroduce server-side CRM relay functions you must add credentials in the Netlify UI under Site settings → Build & deploy → Environment → Environment variables. Do not hard-code secrets in the repo.

4) Replacing Formspree with a Netlify function (optional)
--------------------------------
If you prefer to handle form submissions via a Netlify function instead of Formspree, update `contact.html` to submit (or fetch) to your function endpoint (for example `/api/submit` or `/.netlify/functions/submit`). Example client-side fetch (simplified):

```javascript
// inside js/main.js's initializeContactForm or a small inline script
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const data = new FormData(form);
	const payload = Object.fromEntries(data.entries());

	const res = await fetch('/.netlify/functions/submit', {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' }
	});
	// handle response / redirect
});
```

Then implement `netlify/functions/submit.js` (remember to read/write secrets via Netlify environment vars).

5) Local preview without Netlify CLI
--------------------------------
Because this is a static site with CDN assets, you can preview locally with a simple static server. Example (PowerShell):

```powershell
# Python simple server
python -m http.server 8080

# or
npx http-server . -p 8080 -c-1
```

6) Troubleshooting
--------------------------------
- If functions aren't building, confirm `netlify.toml` includes `functions = "netlify/functions"` and Netlify UI functions directory matches.
- If deep links return index content unexpectedly, check the `[[redirects]]` section in `netlify.toml` (the repo currently has `/* -> /index.html`).
- If contact submissions fail, verify `contact.html` form `action` is correct (Formspree or function endpoint) and that CORS/redirect behavior is handled by your function or the Formspree settings.

7) Quick checklist before deploying
--------------------------------
- Commit and push all changes to the repo.
- Confirm `contact.html` form target is what you expect (Formspree vs Netlify function).
- Confirm `assets/` includes the required images and `assets/mrm-logo.png` exists.
- Verify `netlify.toml` is correct (publish = ".", functions path as desired).

If you want, I can also:
- Scaffold a minimal `netlify/functions/submit.js` example and update `contact.html` to use it (I will not commit any secrets — I'll read them from Netlify environment variables).
- Walk through connecting a GitHub repo to Netlify step-by-step with screenshots (or sample UI choices).

---

If you'd like me to scaffold the Netlify function + client fetch and run a local `netlify dev` preview, tell me which option you prefer (keep Formspree, or replace with a function). I can implement the function and a tiny test harness next.
