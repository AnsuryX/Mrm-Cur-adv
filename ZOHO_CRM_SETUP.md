# Zoho CRM Integration Setup Guide

This guide will help you deploy the Zoho CRM integration for your Mohamed Rama Mursal LLP website on Netlify.

---

## 📋 What This Integration Does

When visitors submit the contact form on your website, the integration will:
1. ✅ Validate all form fields
2. ✅ Send the data to your Netlify serverless function
3. ✅ Automatically create a new Lead in your Zoho CRM
4. ✅ Map all form fields to appropriate Zoho CRM fields
5. ✅ Show success/error messages to the user

---

# Contact form integration (Formspree)

This repository no longer forwards form submissions to Zoho CRM. Contact form submission is handled directly by Formspree for simplicity and to avoid storing CRM credentials in the site environment.

Current setup
- Contact form POSTs to: `https://formspree.io/f/manlrprn`
- On successful submission the user is redirected to `thank-you.html`.

Why this change
- Removes the need for server-side credentials and functions for basic contact capture.
- Simplifies deployments and reduces maintenance overhead.

If you prefer to forward submissions to a CRM (Zoho, HubSpot, etc.), I can reintroduce a secure Netlify/Serverless function. That will require storing provider credentials in environment variables and adding the relay function back into `netlify/functions/`.

Files of interest
- `js/main.js` — client-side submission now targets Formspree
- `netlify/functions/zoho-submit.js` — kept as a 410 stub (Zoho integration removed)
- `.env.example` — updated to reference Formspree endpoint

Reach out if you want me to re-enable a server-side CRM relay and map form fields to your CRM schema.
git add -A


