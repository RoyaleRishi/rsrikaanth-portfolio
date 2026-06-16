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
