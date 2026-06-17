import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const workSchema = z.object({
  title: z.string(),
  kind: z.enum(["role", "project"]),
  org: z.string().optional(),
  period: z.string(),
  summary: z.string(),
  bullets: z.array(z.string()).default([]),
  tech: z.array(z.string()).default([]),
  links: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
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
