# rsrikaanth.com

Rishi Srikaanth's personal portfolio. Astro, static output. Paper-and-ink design
with marigold accents, kolam-inspired motifs, and an interactive skills
constellation on the Projects page.

## Develop

- `npm install`
- `npm run dev` → http://localhost:4321
- `npm test` → unit tests (Vitest)
- `npm run build` → static site in `dist/`

## Updating your work (experience & projects)

Every role and project is **one Markdown file** in `src/content/work/`. Add a
file and it shows up automatically — on its page, on the home page, and (for
projects) in the constellation. There is **no limit**: the Experience and
Projects pages render every file you add.

**To add a new one:** copy an existing file in `src/content/work/`, rename it,
and edit the fields. The filename (minus `.md`) is the entry's `id` — keep it
lowercase-with-dashes (e.g. `my-new-project.md` → id `my-new-project`).

Frontmatter fields:

| Field     | Required | Notes |
|-----------|----------|-------|
| `title`   | yes | e.g. "AI Engineer Intern" or "NeuroNote" |
| `kind`    | yes | `role` (experience) or `project` |
| `org`     | no  | company, or a short project tagline |
| `period`  | yes | free text, e.g. `Aug–Dec 2025` or `2026` (quote bare years: `"2026"`) |
| `summary` | yes | one-line description |
| `bullets` | no  | list of achievement lines (where your metrics go) |
| `tech`    | no  | list of tech tags |
| `links`   | no  | list of `{ label, href }` (e.g. GitHub) |
| `order`   | yes | sort priority — **smaller shows first**, numbered separately per kind |

`order` is **per kind**: roles are 1,2,3,4… and projects are 1,2,3,4…
independently, so `order: 1` just means "first in its own list."

**Where each entry appears:**
- Experience (`role`) → the full `/experience` page + a list on the home page.
- Projects (`project`) → the full `/projects` page; the top 3 (lowest `order`)
  also preview on the home page.

### Constellation skills (Projects page)

The "sky of skills" and which project each skill highlights are defined in
`src/pages/projects.astro` (the `skills` array). To make a **new project** light
up when a skill is tapped, add the project's `id` to that skill's `projects`
list (first id = "most relevant"). Editing skills is optional — new project
cards show regardless.

> Note on auto-sync: LinkedIn has no usable public API for your profile, and a
> raw GitHub repo dump isn't curated, so these Markdown files are the
> intentional source of truth. Editing a file is the whole workflow.

## Writing

Essays live in `src/content/writing/*.mdx`. Set `draft: true` in the frontmatter
to hide one. With no published essays, the Writing page shows an empty state.

## Assets

- Résumé → `public/resume.pdf`
- Portrait → `public/images/portrait.jpg`

## Deploy

1. Push to GitHub.
2. Connect the repo to **Vercel** (auto-detects Astro) or **Cloudflare Pages**
   (build command `npm run build`, output directory `dist`).
3. Add the custom domain `rsrikaanth.com`; set the DNS records the host shows you
   at your registrar.
4. The host auto-issues HTTPS. Every push to `main` redeploys.
