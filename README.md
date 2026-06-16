# rsrikaanth.com

Personal portfolio. Astro, static output. Calm paper-and-ink design with a
signature kolam line-draw page transition.

## Develop
- `npm install`
- `npm run dev` → http://localhost:4321
- `npm test` → unit tests (Vitest)
- `npm run build` → static site in `dist/`

## Content
- Work entries: `src/content/work/*.md` (frontmatter schema in `src/content.config.ts`)
- Essays: `src/content/writing/*.mdx` (set `draft: true` to hide)
- Résumé: replace `public/resume.pdf`
- Portrait: replace `public/images/portrait.svg`

## Design
- Spec: `docs/superpowers/specs/2026-06-16-portfolio-website-design.md`
- Plan: `docs/superpowers/plans/2026-06-16-portfolio-website.md`
- Design tokens (colors, type, spacing): `src/styles/tokens.css` — use the CSS
  custom properties, never raw hex, in components.

## Deploy
1. Push to GitHub.
2. Connect the repo to Cloudflare Pages (build command `npm run build`, output `dist`)
   or Vercel (framework preset: Astro).
3. Add custom domain `rsrikaanth.com`; update the registrar's DNS to the host's
   target (CNAME/`A`/nameservers per provider instructions).
4. Confirm HTTPS and that `https://rsrikaanth.com` serves the site.
