# Prapti Mangade — Portfolio

A premium, animated personal portfolio built with **React 18 + Vite**, **Framer Motion** and **Lucide** icons, with a dark/light theme and a secure, working **contact form** that emails enquiries to `praptimangade@gmail.com` through **Resend**.

## Features

- Black-and-pink design inspired by the Profilee template, plus a full **light theme** (remembered per visitor; follows the system setting on first visit; circular reveal animation on switch)
- Animations: intro loader, word-reveal hero headline, typing role text, rotating glow ring, floating tech chips, parallax, scroll progress bar, cursor glow, spotlight cards, magnetic buttons, 3D tilt, animated counters, scroll-drawn timeline, filter transitions, modal case studies, animated mobile menu
- Respects `prefers-reduced-motion`
- Responsive from 320px phones to wide desktops
- Sections: Hero · Tech marquee · About + stats · Services · Experience timeline · Skills · **Court AI** case study · Projects (filters + case-study modal) · Contact · Footer
- Real screenshots of every live project in `public/projects/`
- Résumé view and download links, Open Graph image, SEO meta tags, JSON-LD, accessible labels, skip link, keyboard-friendly modal

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm test             # contact API tests
```

During `npm run dev`, `/api/contact` is served by the same handler used in production. To try the success flow without an email account, create `.env` with `CONTACT_DEV_MOCK=1`.

## Edit your content

Everything lives in `src/data/`:

| File | What it controls |
|---|---|
| `profile.js` | Name, intro, roles, email, socials, stats, services, résumé path, **photo** |
| `experience.js` | Timeline — add your **current company name** and earlier dates here |
| `skills.js` | Skill groups and the scrolling marquee |
| `projects.js` | Court AI case study and all project cards |

**Add your photo:** replace `public/profile.png`; `profile.js` uses it in the navigation, page icon, loader and hero.

**Résumé:** update `resume` and `resumeDownload` in `profile.js` when your Google Drive résumé changes. Set Drive sharing to **Anyone with the link — Viewer** so visitors can open and download it.

## Contact form — receive email (Resend)

The Node.js handler at `/api/contact` is already deployed as a Netlify Function. The live form's “not configured” error means the Resend API key has not been added to that site's function environment yet.

1. Sign in to <https://resend.com> using `praptimangade@gmail.com` and create an API key under **API Keys**.
2. In Netlify, open the `praptimangade.netlify.app` site's **Site configuration → Environment variables → Add a variable**. Add `RESEND_API_KEY` with the API key as its secret value. Do not add the key to React code, `.env.example`, GitHub, or this chat.
3. Save the variable and **trigger a new deploy** so the serverless function receives it. Environment changes do not apply to already-deployed functions.
4. Submit a test message with a real reply-to address and at least 20 characters in the message; check the inbox and spam folder for `praptimangade@gmail.com`.

The default sender is Resend's `onboarding@resend.dev`, which lets you test without owning a domain. Resend restricts that test sender to delivering to the email address registered to your Resend account, so create the account with `praptimangade@gmail.com`. If your Resend account uses a different address, or you want a branded sender, verify a domain in Resend and add these optional Netlify variables:

| Variable | Example |
|---|---|
| `CONTACT_TO_EMAIL` | `praptimangade@gmail.com` |
| `CONTACT_FROM_EMAIL` | `Prapti Mangade <hello@yourdomain.com>` |

**Built-in protection:** server-side validation, email format and length limits, a hidden honeypot field, a too-fast-submit check, a per-IP rate limit (5 per 10 minutes), header-injection stripping, HTML-escaped email body, the visitor's address set as **Reply-To** (not From), no storage of messages, and no message content or keys in logs.

## Deploy to Netlify

1. Push the portfolio project to its own GitHub repository and import it at <https://app.netlify.com> → **Add new site → Import from Git**. Keep the repository scoped to this project; do not publish your Windows home folder.
2. Netlify reads `netlify.toml` for the `npm run build` command, `dist` publish directory, Node 20 runtime and `/api/contact` function. If the project is nested in the repository, set the site's base directory to the folder containing `package.json` and `netlify.toml`.
3. In **Site configuration → Environment variables**, add `RESEND_API_KEY`. Add `CONTACT_TO_EMAIL` or `CONTACT_FROM_EMAIL` only if you need to override the defaults above, then trigger a deploy.
4. After Netlify assigns your site URL, update `siteUrl` in `src/data/profile.js` and the `og:image` URL in `index.html` if you want social link previews to use your live domain.

## Project structure

```
api/contact.js               Vercel function
netlify/functions/contact.mjs Netlify function
server/contact-core.js       Shared validation, anti-spam, Resend call
src/data/*                   All editable content
src/components/*             Sections & animation helpers
src/styles.css               Design tokens (dark + light) and layout
public/projects/*            Live-site screenshots
tests/contact.test.js        API tests
```

## Things to confirm before publishing

- **Current employer**: the .NET role (from Oct 2026) is shown without a company name. Add it in `experience.js` if you want it public.
- **Earlier dates**: Java, frontend and full-stack phases have no dates. Add them in `experience.js`.
- **Student Management Portal, MahaStudy, Payroll Management System**: these have no public link yet, so they were left out. Add them to `projects.js` when ready.
- **Dormitory_Booking** repo is empty on GitHub, so it is not listed.
- PM Books and Soil Serumz contain some template placeholder text (lorem ipsum reviews). Clean those up before you highlight them to recruiters.
