# rsrikaanth.com — Portfolio Website Design

**Date:** 2026-06-16
**Owner:** Rishi Srikaanth
**Status:** Approved design, pending implementation plan

---

## 1. Concept: *One continuous line*

A personal-brand portfolio that pairs the polish and restraint of the Anthropic
aesthetic with quiet, authentic character. The organizing metaphor is the
**kolam** — a single unbroken line drawn deliberately around fixed points,
redrawn fresh each day. The site is calm paper-and-ink; the character lives in
three places only:

1. **Voice** — warm, earnest, first-person.
2. **Motion** — a kolam line that draws itself between pages.
3. **Content** — the work, and a multicultural (Kenyan + Tamil) perspective.

Guiding principle: **authenticity lensed through class.** Culture is the thread,
never the wallpaper. It is *part of* who Rishi is but does not define him; what
defines him is his multicultural perspective and his interests. Visual treatment
sits at the most restrained "Whisper" level; the kolam appears chiefly *in
motion*, not as static ornament.

---

## 2. Audience & goals

- **Audience:** broad / personal brand — recruiters, peers, and anyone who
  searches his name.
- **Primary goal:** leave a memorable, authentic impression of who he is, with
  work and personality balanced.
- **Voice:** warm and earnest (the Anthropic register). Personality is **fully
  woven** through prose, captions, and small details — there is no dedicated
  "interests" section.

---

## 3. Site map

Multi-page site: **Home / Work / About / Writing.**

### Home (`/`)
- Hero: name, "AI Engineer," one or two honest sentences.
- Teaser of 2–3 selected works.
- A glimpse into Writing (latest essay).
- Footer with the grace note and links.

### Work (`/work`)
- A curated **index** of selected work — no separate case-study pages (keeps the
  surface tight and uniformly polished).
- Each entry: title, context/role, what it does and *why it mattered*, impact,
  tech, and a GitHub link where applicable.
- Source material (from resume):
  - **Experience:** AI Engineer Intern @ RoonCyber; Software Engineer @ Visteon;
    Teaching Assistant (CS4100) @ Northeastern; incoming AI Engineer Intern @
    FINRA.
  - **Projects:** NeuroNote (AI knowledge base), Beam Me Up (Information-Theory
    MCL), Navigatio (agentic travel chat w/ RAG), Sentinel (malware prediction).

### About (`/about`)
- Portrait + warm narrative: the Nairobi → Tamil heritage → India → Boston arc.
- What he cares about: AI safety, cultural equity, socio-economic questions.
- Interests (chess, tennis, singing) woven into prose, not listed.
- A few woven images used sparingly (e.g. a chessboard, a place).

### Writing (`/writing`)
- Essay index backed by MDX content collection.
- Launches with **one inaugural essay**; built to grow.

---

## 4. Visual system

- **Palette:**
  - paper `#F4EFE6`, ink `#1F1B16`
  - accents, used one at a time: brick `#B33A26`, deep green `#2E5E3A`,
    turmeric `#D89A3B`, maroon `#6E2233`
  - Mostly ink-on-paper; an accent appears only as a single rule, an underline,
    or a small mark.
- **Typography:** **Fraunces** (display serif — warm, characterful headlines)
  + **Inter** (humanist sans — body and UI). Self-hosted for performance.
- **Grace notes:**
  - Footer place-line: `Nairobi · சென்னை · Boston`.
  - A quiet bilingual welcome: `Karibu / வணக்கம்`.
  - A faint kolam-dot section rule is the only static motif.
- **Mode:** light only at launch. (Warm dark mode is a possible later addition.)

---

## 5. Motion (the signature)

- **Astro View Transitions** for seamless cross-page persistence.
- On each navigation, a single paper-toned **kolam line draws across the
  viewport** (~700ms, an SVG path animated via `stroke-dashoffset`), then
  settles. This is the one unmistakable flourish.
- Micro-interactions: link underlines that draw in; gentle fade-up on scroll.
- **All motion is gated behind `prefers-reduced-motion`**, falling back to a
  clean fade.

---

## 6. Architecture & build

- **Framework:** Astro, with content collections for `work` and `writing`
  (Markdown/MDX).
- **Styling:** hand-tuned CSS with design tokens (CSS custom properties) — no
  heavy UI framework, for full control over polish.
- **Components (each one clear purpose, testable in isolation):**
  - `BaseLayout` — document shell, fonts, view-transition wiring, skip link.
  - `Nav` — wordmark + links (Work, Writing, About).
  - `Footer` — grace note, email (`srikaanth.r@northeastern.edu`), GitHub,
    LinkedIn, resume PDF download.
  - `KolamTransition` — the SVG line-draw overlay + reduced-motion fallback.
  - `WorkEntry` — one work/project card from the `work` collection.
  - `EssayCard` — one entry in the Writing index.
  - `Prose` — typographic wrapper for long-form (About, essays).
- **Content as data:** `work` and `writing` are content collections with typed
  frontmatter schemas, so adding an entry is editing data, not markup.
- **Accessibility:** semantic HTML, visible focus states, **WCAG AA** contrast,
  reduced-motion support.
- **Assets:** resume PDF downloadable; portrait + a few images supplied by Rishi
  (designed around tasteful placeholders so the build is never blocked).

### Hosting / domain
- Deploy free to **Cloudflare Pages or Vercel**; point `rsrikaanth.com` DNS at
  the deployment. (`rsrikaanth.com` is registered but not yet hosted.)

---

## 7. Scope discipline (YAGNI)

In scope for launch:
- The four pages above, light mode, the kolam transition, one inaugural essay.

Explicitly **out** of launch scope:
- Dark mode, CMS, comments, separate project case-study pages, analytics
  (privacy-friendly analytics may be added later).

---

## 8. Open content tasks (collaborative, during implementation)

- Final hero sentences and About narrative (warm/earnest, first-person).
- The inaugural essay (candidate theme: multicultural lens × AI safety).
- Portrait and 2–3 woven images.
- Per-entry "why it mattered" copy for Work.
