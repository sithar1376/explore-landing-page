# SmileWithSithar — Connect With Purpose

Standalone Next.js landing page and thank-you page for the Meaningful Outreach Discovery Session. This project is intentionally separate from the main `smilewithsithar.com` website.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The thank-you page only shows confirmation content after FormSubmit accepts a real form request in the same browser session.

## Configuration

Copy `.env.example` to `.env.local` and review:

- `NEXT_PUBLIC_SITE_URL` — production URL, planned as `https://explore.smilewithsithar.com`.
- `NEXT_PUBLIC_FORMSUBMIT_ENDPOINT` — existing FormSubmit AJAX endpoint.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, including country code.
- `NEXT_PUBLIC_VIMEO_URL` — optional real Vimeo welcome-video URL; leave unset to hide the video section.

The complimentary PDF is not downloaded or automatically emailed by this site. Sithar personally sends it after the completed discovery session.

## Checks

```bash
npm run typecheck
npm run build
```

## Vercel deployment

1. Create a new Vercel project from this folder or its own Git repository. Do not point Vercel at the main website repository.
2. Add the environment variables above in Vercel Project Settings.
3. Deploy and test a real form submission. Confirm the notification reaches `sithar1376@gmail.com`; a successful browser redirect alone does not prove inbox delivery.
4. In the new Vercel project's Domains settings, add `explore.smilewithsithar.com`.
5. Apply only the DNS record Vercel displays for that subdomain. Do not change the apex/root records used by `smilewithsithar.com`.
6. Confirm HTTPS is active, configure Sithar's real Vimeo video if available, and retest mobile layouts before running ads.

FormSubmit may require one-time email activation for a new origin or endpoint. Complete any activation email before launch and submit a second test afterward.
