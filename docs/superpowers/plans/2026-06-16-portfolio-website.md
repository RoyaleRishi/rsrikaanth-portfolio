# rsrikaanth.com Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a calm, editorial four-page personal portfolio (Home / Work / About / Writing) at rsrikaanth.com, with a signature kolam line-draw page transition.

**Architecture:** Astro 5 static site. Content (work entries, essays) lives in typed content collections so adding an entry means editing data, not markup. Hand-tuned CSS design tokens drive a paper-and-ink visual system. Astro's `ClientRouter` provides view transitions; a small client script draws an SVG kolam line on each navigation, fully gated behind `prefers-reduced-motion`. Pure logic (reduced-motion detection, kolam path generation, content schemas) is unit-tested with Vitest; pages are verified by build + dev-server inspection.

**Tech Stack:** Astro 5, TypeScript, Vitest, `@fontsource-variable/fraunces`, `@fontsource-variable/inter`, MDX, hand-rolled CSS custom properties. Deploy to Cloudflare Pages or Vercel.

**Design reference:** `docs/superpowers/specs/2026-06-16-portfolio-website-design.md`

**Design tokens (use everywhere — no raw hex in components):**
- `--paper: #F4EFE6`, `--ink: #1F1B16`
- `--brick: #B33A26`, `--green: #2E5E3A`, `--ochre: #D89A3B`, `--maroon: #6E2233`
- Fonts: `--font-display: "Fraunces Variable"`, `--font-body: "Inter Variable"`

---

## File Structure

```
portfolio/
├── astro.config.mjs          # Astro + MDX integration, site URL
├── vitest.config.ts          # Vitest via getViteConfig
├── tsconfig.json
├── package.json
├── public/
│   ├── resume.pdf            # Rishi supplies (placeholder ok)
│   ├── favicon.svg
│   └── images/              # portrait + woven images (placeholders ok)
├── src/
│   ├── content.config.ts     # work + writing collection schemas
│   ├── content/
│   │   ├── work/*.md         # one file per work entry
│   │   └── writing/*.mdx     # one file per essay
│   ├── lib/
│   │   ├── motion.ts         # prefersReducedMotion()
│   │   └── kolam.ts          # kolamPath() generator
│   ├── styles/
│   │   ├── tokens.css        # design tokens (CSS custom properties)
│   │   └── global.css        # base element styles, prose, utilities
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── KolamTransition.astro
│   │   ├── WorkEntry.astro
│   │   └── EssayCard.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro       # Home
│       ├── work.astro        # Work index
│       ├── about.astro       # About
│       └── writing/
│           ├── index.astro   # Writing index
│           └── [...slug].astro # essay page
└── tests/
    ├── motion.test.ts
    ├── kolam.test.ts
    └── content.test.ts
```

---

## Task 1: Scaffold the Astro project and tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`

- [ ] **Step 1: Initialize Astro in the existing directory**

The repo already exists with a `docs/` folder and git initialized. Scaffold Astro non-interactively into the current directory:

```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
```

If the CLI refuses because the directory is non-empty, scaffold into a temp dir and move files in:

```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes ._astro_tmp \
  && cp -R ._astro_tmp/. . && rm -rf ._astro_tmp
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/mdx @fontsource-variable/fraunces @fontsource-variable/inter
npm install -D vitest
```

- [ ] **Step 3: Configure Astro with MDX and the site URL**

Overwrite `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://rsrikaanth.com",
  integrations: [mdx()],
});
```

- [ ] **Step 4: Add the Vitest config**

Create `vitest.config.ts`:

```ts
/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Add test + build scripts**

In `package.json`, ensure the `scripts` block contains:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 6: Verify the project builds**

Run: `npm run build`
Expected: build completes with the default starter page, exit code 0.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with MDX and Vitest"
```

---

## Task 2: Design tokens and global styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Write the design tokens**

Create `src/styles/tokens.css`:

```css
:root {
  --paper: #f4efe6;
  --ink: #1f1b16;
  --ink-soft: #5f5e5a;
  --brick: #b33a26;
  --green: #2e5e3a;
  --ochre: #d89a3b;
  --maroon: #6e2233;

  --font-display: "Fraunces Variable", Georgia, serif;
  --font-body: "Inter Variable", system-ui, sans-serif;

  --measure: 66ch;
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;

  --content-max: 72rem;
  --prose-max: 38rem;
}
```

- [ ] **Step 2: Write the global base styles**

Create `src/styles/global.css`:

```css
@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/inter";
@import "./tokens.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 480;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 var(--space-2);
}

h1 {
  font-size: clamp(2.5rem, 6vw, 4.25rem);
}
h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
}
h3 {
  font-size: 1.35rem;
}

a {
  color: inherit;
  text-decoration: none;
}

p {
  margin: 0 0 var(--space-2);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--space-3);
}

.prose {
  max-width: var(--prose-max);
}
.prose p,
.prose li {
  font-size: 1.125rem;
  line-height: 1.75;
}

/* Animated underline used on inline links */
.link {
  background-image: linear-gradient(var(--brick), var(--brick));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1.5px;
  transition: background-size 220ms ease;
  padding-bottom: 1px;
}
.link:hover,
.link:focus-visible {
  background-size: 100% 1.5px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

:focus-visible {
  outline: 2px solid var(--maroon);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: exit code 0 (styles compile; fonts resolve).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and global styles"
```

---

## Task 3: Reduced-motion utility (TDD)

**Files:**
- Create: `src/lib/motion.ts`
- Test: `tests/motion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/motion.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { prefersReducedMotion } from "../src/lib/motion";

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("prefersReducedMotion", () => {
  it("returns true when the user requests reduced motion", () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false when the user does not request reduced motion", () => {
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("returns true (safe default) when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(prefersReducedMotion()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- motion`
Expected: FAIL — cannot find module `../src/lib/motion`.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/motion.ts`:

```ts
export function prefersReducedMotion(): boolean {
  if (typeof matchMedia !== "function") return true;
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- motion`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add prefersReducedMotion utility with tests"
```

---

## Task 4: Kolam path generator (TDD)

The transition draws a single continuous looping line. `kolamPath()` returns an SVG path string: a horizontal row of loops (arcs alternating above/below a baseline) across a given width — the kolam motif rendered as one stroke.

**Files:**
- Create: `src/lib/kolam.ts`
- Test: `tests/kolam.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/kolam.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { kolamPath } from "../src/lib/kolam";

describe("kolamPath", () => {
  it("starts with a move command at the left baseline", () => {
    const d = kolamPath({ width: 1000, baseline: 50, loops: 5, amplitude: 20 });
    expect(d.startsWith("M0,50")).toBe(true);
  });

  it("emits one cubic bezier segment per loop", () => {
    const d = kolamPath({ width: 1000, baseline: 50, loops: 5, amplitude: 20 });
    const curves = d.match(/C/g) ?? [];
    expect(curves.length).toBe(5);
  });

  it("ends at the right edge on the baseline", () => {
    const d = kolamPath({ width: 1000, baseline: 50, loops: 4, amplitude: 20 });
    expect(d.trimEnd().endsWith("1000,50")).toBe(true);
  });

  it("throws when loops is less than 1", () => {
    expect(() => kolamPath({ width: 100, baseline: 10, loops: 0, amplitude: 5 })).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- kolam`
Expected: FAIL — cannot find module `../src/lib/kolam`.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/kolam.ts`:

```ts
export interface KolamOptions {
  width: number;
  baseline: number;
  loops: number;
  amplitude: number;
}

export function kolamPath({ width, baseline, loops, amplitude }: KolamOptions): string {
  if (loops < 1) throw new Error("kolamPath requires at least 1 loop");
  const step = width / loops;
  let d = `M0,${baseline}`;
  for (let i = 0; i < loops; i++) {
    const x0 = i * step;
    const x1 = (i + 1) * step;
    const dir = i % 2 === 0 ? -1 : 1; // alternate above/below baseline
    const cy = baseline + dir * amplitude;
    const c1x = x0 + step / 3;
    const c2x = x0 + (2 * step) / 3;
    d += ` C${c1x},${cy} ${c2x},${cy} ${x1},${baseline}`;
  }
  return d;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- kolam`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add kolam path generator with tests"
```

---

## Task 5: Content collection schemas (TDD)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/neuronote.md` (one seed entry to test against)
- Test: `tests/content.test.ts`

- [ ] **Step 1: Write the failing test**

The schemas are Zod objects exported for direct validation testing (decoupled from Astro's loader).

Create `tests/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { workSchema, writingSchema } from "../src/content.config";

describe("workSchema", () => {
  it("accepts a complete work entry", () => {
    const parsed = workSchema.safeParse({
      title: "NeuroNote",
      kind: "project",
      context: "Personal project",
      summary: "An AI knowledge base.",
      why: "Because memory should compound.",
      tech: ["Python", "RAG"],
      order: 1,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an entry missing the title", () => {
    const parsed = workSchema.safeParse({ kind: "project", summary: "x", why: "y", order: 1 });
    expect(parsed.success).toBe(false);
  });

  it("rejects an invalid kind", () => {
    const parsed = workSchema.safeParse({
      title: "X",
      kind: "hobby",
      summary: "x",
      why: "y",
      order: 1,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("writingSchema", () => {
  it("accepts a complete essay entry", () => {
    const parsed = writingSchema.safeParse({
      title: "On the unbroken line",
      description: "A first essay.",
      pubDate: new Date("2026-06-16"),
      draft: false,
    });
    expect(parsed.success).toBe(true);
  });

  it("defaults draft to false", () => {
    const parsed = writingSchema.parse({
      title: "X",
      description: "y",
      pubDate: new Date("2026-06-16"),
    });
    expect(parsed.draft).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content`
Expected: FAIL — cannot find module `../src/content.config`.

- [ ] **Step 3: Write the schemas and collections**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const workSchema = z.object({
  title: z.string(),
  kind: z.enum(["role", "project"]),
  context: z.string().optional(),
  summary: z.string(),
  why: z.string(),
  tech: z.array(z.string()).default([]),
  link: z.string().url().optional(),
  order: z.number(),
});

export const writingSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  draft: z.boolean().default(false),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: workSchema,
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: writingSchema,
});

export const collections = { work, writing };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- content`
Expected: PASS (5 tests).

- [ ] **Step 5: Add one seed work entry**

Create `src/content/work/neuronote.md`:

```md
---
title: NeuroNote
kind: project
context: Personal project
summary: An AI knowledge base that turns scattered notes into a queryable second brain.
why: I wanted memory that compounds — where the things I learn stay reachable instead of decaying.
tech: ["Python", "LLMs", "RAG", "Vector search"]
order: 1
---

NeuroNote ingests notes and documents, embeds them, and answers questions over
the corpus with citations back to the source.
```

- [ ] **Step 6: Verify build picks up the collection**

Run: `npm run build`
Expected: exit code 0; no schema errors for the seed entry.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add work and writing content collections with schema tests"
```

---

## Task 6: Nav and Footer components

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Write the Nav**

Create `src/components/Nav.astro`:

```astro
---
const { pathname } = Astro.url;
const links = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];
const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
---

<nav class="nav container" aria-label="Primary">
  <a href="/" class="wordmark">Rishi Srikaanth</a>
  <ul>
    {
      links.map((l) => (
        <li>
          <a href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
            {l.label}
          </a>
        </li>
      ))
    }
  </ul>
</nav>

<style>
  .nav {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-block: var(--space-3);
  }
  .wordmark {
    font-family: var(--font-display);
    font-size: 1.15rem;
    letter-spacing: -0.01em;
  }
  ul {
    display: flex;
    gap: var(--space-3);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul a {
    color: var(--ink-soft);
    transition: color 180ms ease;
  }
  ul a:hover,
  ul a[aria-current="page"] {
    color: var(--ink);
  }
</style>
```

- [ ] **Step 2: Write the Footer**

Create `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
const links = [
  { href: "mailto:srikaanth.r@northeastern.edu", label: "Email" },
  { href: "https://github.com/", label: "GitHub" },
  { href: "https://www.linkedin.com/in/rishisrikaanth/", label: "LinkedIn" },
  { href: "/resume.pdf", label: "Résumé" },
];
---

<footer class="footer container">
  <p class="grace" lang="mul">Nairobi · சென்னை · Boston</p>
  <ul>
    {links.map((l) => (
      <li><a class="link" href={l.href}>{l.label}</a></li>
    ))}
  </ul>
  <p class="fine">© {year} Rishi Srikaanth · <span lang="sw">Karibu</span> / <span lang="ta">வணக்கம்</span></p>
</footer>

<style>
  .footer {
    border-top: 0.5px solid color-mix(in srgb, var(--ink) 18%, transparent);
    margin-top: var(--space-6);
    padding-block: var(--space-4) var(--space-5);
    display: grid;
    gap: var(--space-2);
  }
  .grace {
    font-family: var(--font-display);
    font-size: 1.1rem;
    margin: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .fine {
    color: var(--ink-soft);
    font-size: 0.9rem;
    margin: 0;
  }
</style>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Nav and Footer components"
```

---

## Task 7: Kolam transition component

Implements the signature motion. Uses `astro:after-swap` to redraw an SVG overlay line on each navigation, animating `stroke-dashoffset` from full length to zero. Skipped entirely under reduced motion (CSS handles a plain fade fallback via the `ClientRouter`).

**Files:**
- Create: `src/components/KolamTransition.astro`

- [ ] **Step 1: Write the component**

Create `src/components/KolamTransition.astro`:

```astro
---
import { kolamPath } from "../lib/kolam";
const d = kolamPath({ width: 1200, baseline: 60, loops: 6, amplitude: 22 });
---

<div class="kolam" aria-hidden="true" data-kolam>
  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" width="100%" height="100%">
    <path d={d} fill="none" stroke="var(--maroon)" stroke-width="1.5" stroke-linecap="round" data-kolam-path></path>
  </svg>
</div>

<script>
  import { prefersReducedMotion } from "../lib/motion";

  function draw() {
    if (prefersReducedMotion()) return;
    const wrap = document.querySelector<HTMLElement>("[data-kolam]");
    const path = document.querySelector<SVGPathElement>("[data-kolam-path]");
    if (!wrap || !path) return;

    const len = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    wrap.style.opacity = "1";

    // force reflow so the offset reset is committed before animating
    void path.getBoundingClientRect();

    path.style.transition = "stroke-dashoffset 700ms ease-in-out";
    path.style.strokeDashoffset = "0";

    window.setTimeout(() => {
      wrap.style.opacity = "0";
    }, 750);
  }

  document.addEventListener("astro:after-swap", draw);
  draw();
</script>

<style>
  .kolam {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 120px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 400ms ease 200ms;
    z-index: 50;
  }
  @media (prefers-reduced-motion: reduce) {
    .kolam {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit code 0 (the client script bundles).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add kolam page-transition overlay"
```

---

## Task 8: Base layout

Wires fonts, global styles, SEO meta, `ClientRouter` view transitions, the skip link, Nav, Footer, and the kolam overlay.

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write the layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import { ClientRouter } from "astro:transitions";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import KolamTransition from "../components/KolamTransition.astro";

interface Props {
  title: string;
  description?: string;
}
const { title, description = "Rishi Srikaanth — AI Engineer." } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="canonical" href={canonical} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <ClientRouter />
  </head>
  <body>
    <a href="#main" class="sr-only">Skip to content</a>
    <KolamTransition />
    <Nav />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout with view transitions and SEO meta"
```

---

## Task 9: WorkEntry component and Work page

**Files:**
- Create: `src/components/WorkEntry.astro`, `src/pages/work.astro`
- Create: remaining seed entries `src/content/work/*.md`

- [ ] **Step 1: Add the remaining work seed entries**

Create `src/content/work/roconcyber.md`:

```md
---
title: AI Engineer Intern
kind: role
context: RoonCyber
summary: Built LLM-driven tooling for security workflows.
why: I wanted to see how AI holds up where the stakes are real and adversarial.
tech: ["Python", "LLMs"]
order: 2
---

Placeholder — Rishi to refine the specifics and impact.
```

Create `src/content/work/finra.md`:

```md
---
title: AI Engineer Intern (incoming)
kind: role
context: FINRA
summary: Joining FINRA to work on AI applied to market integrity.
why: Markets are a place where fairness and machine intelligence meet head-on.
tech: ["Python", "ML"]
order: 3
---

Placeholder — starting soon; details to follow.
```

Create `src/content/work/beam-me-up.md`:

```md
---
title: Beam Me Up
kind: project
context: Course project
summary: A Monte Carlo localization system framed through information theory.
why: I like problems where uncertainty is the whole game.
tech: ["Python", "Probabilistic methods"]
order: 4
---

Placeholder — Rishi to expand.
```

> Note: `context: "RoonCyber"` — confirm the exact employer spelling against the resume before launch.

- [ ] **Step 2: Write the WorkEntry component**

Create `src/components/WorkEntry.astro`:

```astro
---
interface Props {
  title: string;
  context?: string;
  summary: string;
  why: string;
  tech: string[];
  link?: string;
}
const { title, context, summary, why, tech, link } = Astro.props;
---

<article class="entry">
  <header>
    <h3>{title}</h3>
    {context && <p class="context">{context}</p>}
  </header>
  <p class="summary">{summary}</p>
  <p class="why">{why}</p>
  {
    tech.length > 0 && (
      <ul class="tech">
        {tech.map((t) => <li>{t}</li>)}
      </ul>
    )
  }
  {link && <a class="link" href={link}>View on GitHub →</a>}
</article>

<style>
  .entry {
    padding-block: var(--space-4);
    border-top: 0.5px solid color-mix(in srgb, var(--ink) 15%, transparent);
    display: grid;
    gap: var(--space-1);
  }
  .context {
    color: var(--brick);
    font-size: 0.95rem;
    margin: 0;
  }
  .summary {
    font-size: 1.15rem;
    margin: var(--space-1) 0 0;
  }
  .why {
    color: var(--ink-soft);
    max-width: var(--prose-max);
  }
  .tech {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-2);
    list-style: none;
    padding: 0;
    margin: var(--space-1) 0 0;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
</style>
```

- [ ] **Step 3: Write the Work page**

Create `src/pages/work.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import WorkEntry from "../components/WorkEntry.astro";

const entries = (await getCollection("work")).sort(
  (a, b) => a.data.order - b.data.order
);
---

<BaseLayout title="Work — Rishi Srikaanth" description="Selected work and projects.">
  <section class="container">
    <h1>Work</h1>
    <p class="prose lede">A handful of things I've built and the reasons they mattered to me.</p>
    <div class="list">
      {
        entries.map((e) => (
          <WorkEntry
            title={e.data.title}
            context={e.data.context}
            summary={e.data.summary}
            why={e.data.why}
            tech={e.data.tech}
            link={e.data.link}
          />
        ))
      }
    </div>
  </section>
</BaseLayout>

<style>
  .lede {
    color: var(--ink-soft);
    font-size: 1.2rem;
    margin-bottom: var(--space-4);
  }
  .list {
    margin-top: var(--space-3);
  }
</style>
```

- [ ] **Step 4: Verify build and inspect**

Run: `npm run build`
Expected: exit code 0.
Run: `npm run dev` and open `http://localhost:4321/work`.
Expected: entries render sorted by `order`, each with title, context, summary, why, tech.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Work page and WorkEntry with seed entries"
```

---

## Task 10: EssayCard, Writing index, and essay page

**Files:**
- Create: `src/components/EssayCard.astro`, `src/pages/writing/index.astro`, `src/pages/writing/[...slug].astro`
- Create: `src/content/writing/the-unbroken-line.mdx`

- [ ] **Step 1: Write the inaugural essay**

Create `src/content/writing/the-unbroken-line.mdx`:

```mdx
---
title: The unbroken line
description: On kolam, code, and carrying more than one place inside you.
pubDate: 2026-06-16
draft: false
---

Every morning in front of some Tamil homes, a hand bends to the ground and draws
a kolam — one continuous line looping around a grid of dots, gone by evening,
drawn again tomorrow. I think about it a lot when I write software.

_(Placeholder draft — to be written with Rishi.)_
```

- [ ] **Step 2: Write the EssayCard**

Create `src/components/EssayCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  href: string;
}
const { title, description, pubDate, href } = Astro.props;
const date = pubDate.toLocaleDateString("en-US", { year: "numeric", month: "long" });
---

<a class="card" href={href}>
  <h3>{title}</h3>
  <p class="desc">{description}</p>
  <time datetime={pubDate.toISOString()}>{date}</time>
</a>

<style>
  .card {
    display: grid;
    gap: var(--space-1);
    padding-block: var(--space-3);
    border-top: 0.5px solid color-mix(in srgb, var(--ink) 15%, transparent);
  }
  .card h3 {
    margin: 0;
    transition: color 180ms ease;
  }
  .card:hover h3 {
    color: var(--brick);
  }
  .desc {
    color: var(--ink-soft);
    margin: 0;
    max-width: var(--prose-max);
  }
  time {
    color: var(--ink-soft);
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 3: Write the Writing index**

Create `src/pages/writing/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import EssayCard from "../../components/EssayCard.astro";

const essays = (await getCollection("writing", ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<BaseLayout title="Writing — Rishi Srikaanth" description="Essays.">
  <section class="container">
    <h1>Writing</h1>
    <p class="prose lede">Occasional essays — usually where my interests collide.</p>
    <div>
      {
        essays.map((e) => (
          <EssayCard
            title={e.data.title}
            description={e.data.description}
            pubDate={e.data.pubDate}
            href={`/writing/${e.id}`}
          />
        ))
      }
    </div>
  </section>
</BaseLayout>

<style>
  .lede {
    color: var(--ink-soft);
    font-size: 1.2rem;
    margin-bottom: var(--space-4);
  }
</style>
```

- [ ] **Step 4: Write the essay detail page**

Create `src/pages/writing/[...slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const essays = await getCollection("writing", ({ data }) => !data.draft);
  return essays.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const date = entry.data.pubDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
---

<BaseLayout title={`${entry.data.title} — Rishi Srikaanth`} description={entry.data.description}>
  <article class="container essay prose">
    <h1>{entry.data.title}</h1>
    <time datetime={entry.data.pubDate.toISOString()}>{date}</time>
    <Content />
  </article>
</BaseLayout>

<style>
  .essay {
    margin-inline: auto;
  }
  time {
    display: block;
    color: var(--ink-soft);
    margin-bottom: var(--space-4);
  }
</style>
```

- [ ] **Step 5: Verify build and inspect**

Run: `npm run build`
Expected: exit code 0; `/writing` and `/writing/the-unbroken-line` generated.
Run: `npm run dev`, open `http://localhost:4321/writing`, click into the essay.
Expected: index lists the essay; detail page renders MDX prose.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Writing index, essay pages, and inaugural essay"
```

---

## Task 11: Home page

**Files:**
- Create: `src/pages/index.astro` (overwrites the starter)

- [ ] **Step 1: Write the Home page**

Create `src/pages/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import WorkEntry from "../components/WorkEntry.astro";

const featured = (await getCollection("work"))
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);

const latest = (await getCollection("writing", ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
)[0];
---

<BaseLayout title="Rishi Srikaanth — AI Engineer">
  <section class="hero container">
    <p class="eyebrow">AI Engineer</p>
    <h1>Rishi Srikaanth</h1>
    <p class="prose intro">
      I build AI systems and think a lot about who they're for. Raised between
      Nairobi and Tamil Nadu, now in Boston — I care about AI safety, cultural
      equity, and the questions class quietly asks of technology.
    </p>
  </section>

  <section class="container">
    <div class="head"><h2>Selected work</h2><a class="link" href="/work">All work →</a></div>
    {
      featured.map((e) => (
        <WorkEntry
          title={e.data.title}
          context={e.data.context}
          summary={e.data.summary}
          why={e.data.why}
          tech={e.data.tech}
          link={e.data.link}
        />
      ))
    }
  </section>

  {
    latest && (
      <section class="container latest">
        <div class="head"><h2>Writing</h2><a class="link" href="/writing">All essays →</a></div>
        <a class="latest-link" href={`/writing/${latest.id}`}>
          <h3>{latest.data.title}</h3>
          <p>{latest.data.description}</p>
        </a>
      </section>
    )
  }
</BaseLayout>

<style>
  .hero {
    padding-block: var(--space-6) var(--space-5);
  }
  .eyebrow {
    color: var(--ochre);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0 0 var(--space-2);
  }
  .intro {
    font-size: 1.3rem;
    color: var(--ink-soft);
    margin-top: var(--space-3);
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: var(--space-5);
  }
  .latest-link h3 {
    margin: var(--space-2) 0 var(--space-1);
    transition: color 180ms ease;
  }
  .latest-link:hover h3 {
    color: var(--brick);
  }
  .latest-link p {
    color: var(--ink-soft);
    max-width: var(--prose-max);
  }
</style>
```

- [ ] **Step 2: Verify build and inspect**

Run: `npm run build`
Expected: exit code 0.
Run: `npm run dev`, open `http://localhost:4321/`.
Expected: hero, three featured work entries, latest essay teaser. Navigate between pages and confirm the kolam line draws across the top on each transition (and does NOT under an OS "reduce motion" setting).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Home page"
```

---

## Task 12: About page

**Files:**
- Create: `src/pages/about.astro`
- Create: `public/images/portrait.jpg` (placeholder — Rishi supplies)

- [ ] **Step 1: Add a placeholder portrait**

Create a placeholder so the build doesn't 404. Any small image works:

```bash
mkdir -p public/images
printf '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%%" height="100%%" fill="#e7ded0"/><text x="50%%" y="50%%" font-family="Georgia" font-size="28" fill="#6e2233" text-anchor="middle">portrait</text></svg>' > public/images/portrait.svg
```

- [ ] **Step 2: Write the About page**

Create `src/pages/about.astro`. Personality is woven into prose (no interests section); chess/tennis/singing appear inside the narrative.

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout
  title="About — Rishi Srikaanth"
  description="Raised between Nairobi and Tamil Nadu, now building AI in Boston."
>
  <section class="container about">
    <div class="portrait">
      <img src="/images/portrait.svg" alt="Portrait of Rishi Srikaanth" width="800" height="1000" />
    </div>
    <div class="prose body">
      <h1>About</h1>
      <p>
        I grew up between Nairobi and Tamil Nadu, studied in India, and now build
        AI systems in Boston. Carrying more than one place inside you changes how
        you see a problem — you assume there's always another vantage point you
        haven't taken yet.
      </p>
      <p>
        I'm drawn to AI safety and to the quieter question underneath it: who
        gets to benefit, and who pays. Cultural equity and the way class shapes
        access aren't side interests for me — they're the lens I bring to the work.
      </p>
      <p>
        Away from the screen I play chess for the long quiet think, tennis for the
        opposite, and I sing — which is its own kind of pattern-matching. They all
        leak back into how I build.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .about {
    display: grid;
    gap: var(--space-4);
    padding-block: var(--space-5);
  }
  @media (min-width: 48rem) {
    .about {
      grid-template-columns: 0.8fr 1.2fr;
      gap: var(--space-5);
      align-items: start;
    }
  }
  .portrait img {
    border-radius: 4px;
    filter: grayscale(0.15);
  }
</style>
```

- [ ] **Step 3: Verify build and inspect**

Run: `npm run build`
Expected: exit code 0.
Run: `npm run dev`, open `http://localhost:4321/about`.
Expected: portrait + woven narrative; responsive two-column on wide screens.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add About page"
```

---

## Task 13: Favicon, resume placeholder, and 404

**Files:**
- Create: `public/favicon.svg`, `public/resume.pdf` (placeholder), `src/pages/404.astro`

- [ ] **Step 1: Add a favicon (kolam dot mark)**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f4efe6"/><path d="M4 16 C8 8 12 8 16 16 C20 24 24 24 28 16" fill="none" stroke="#6e2233" stroke-width="2" stroke-linecap="round"/></svg>
```

- [ ] **Step 2: Add a placeholder résumé**

```bash
cp /Users/rishis/Desktop/resume-may26.pdf public/resume.pdf || printf '%%PDF-1.4 placeholder' > public/resume.pdf
```

> Note: replace with the canonical résumé PDF before launch.

- [ ] **Step 3: Write the 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Not found — Rishi Srikaanth" description="That page doesn't exist.">
  <section class="container" style="padding-block: var(--space-6);">
    <h1>Lost the thread</h1>
    <p class="prose">That page isn't here. <a class="link" href="/">Back to the start →</a></p>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exit code 0; `404.html` emitted.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add favicon, resume asset, and 404 page"
```

---

## Task 14: Final verification and deploy configuration

**Files:**
- Create: `README.md`
- Create: `public/robots.txt`, `src/pages/sitemap-note.md` (or use `@astrojs/sitemap`)

- [ ] **Step 1: Add sitemap integration**

```bash
npm install @astrojs/sitemap
```

Update `astro.config.mjs` integrations:

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://rsrikaanth.com",
  integrations: [mdx(), sitemap()],
});
```

- [ ] **Step 2: Add robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://rsrikaanth.com/sitemap-index.xml
```

- [ ] **Step 3: Run the full test suite and build**

Run: `npm test`
Expected: all suites pass (motion, kolam, content).
Run: `npm run build`
Expected: exit code 0; `dist/` contains `index.html`, `work/index.html`, `about/index.html`, `writing/index.html`, the essay page, `404.html`, `sitemap-index.xml`.

- [ ] **Step 4: Manual QA pass (dev server)**

Run: `npm run preview` and verify:
- Every page renders; nav active states correct.
- Kolam line draws on navigation; disappears.
- Set OS "reduce motion" → reload → no kolam animation, plain instant nav.
- Keyboard: Tab reaches skip link, nav, and all links; focus ring visible.
- Footer grace note and all links present; résumé downloads.

- [ ] **Step 5: Write the README with deploy steps**

Create `README.md`:

```md
# rsrikaanth.com

Personal portfolio. Astro 5, static output.

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

## Deploy
1. Push to GitHub.
2. Connect the repo to Cloudflare Pages (build command `npm run build`, output `dist`)
   or Vercel (framework preset: Astro).
3. Add custom domain `rsrikaanth.com`; update the registrar's DNS to the host's
   target (CNAME/`A`/nameservers per provider instructions).
4. Confirm HTTPS and that `https://rsrikaanth.com` serves the site.
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add sitemap, robots, README, and final QA"
```

- [ ] **Step 7 (manual, by Rishi): Deploy**

Connect the repo to Cloudflare Pages or Vercel, point `rsrikaanth.com` DNS at the deployment, and verify the live site. Replace placeholder content (portrait, images, résumé, work specifics, essay) as it's ready.

---

## Notes for the implementer

- **Confirm employer spelling** ("RoonCyber") and exact role titles/dates against the résumé PDF before launch; seed entries use placeholder copy intentionally.
- **Astro 5 specifics:** content collections use the glob loader in `src/content.config.ts`; view transitions are imported as `ClientRouter` from `astro:transitions`; collection entry identifiers use `entry.id` (not `entry.slug`).
- **Do not introduce raw hex** in components — use the CSS custom properties from `tokens.css`.
- All copy marked "Placeholder" is intentional scaffolding to be replaced collaboratively; it must never block the build.
```
