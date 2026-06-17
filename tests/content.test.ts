import { describe, it, expect } from "vitest";
import { workSchema, writingSchema } from "../src/content.config";

describe("workSchema", () => {
  it("accepts a complete work entry", () => {
    const parsed = workSchema.safeParse({
      title: "AI Engineer Intern",
      kind: "role",
      org: "RoonCyber Inc.",
      period: "Aug–Dec 2025",
      summary: "Built risk-scoring and anomaly detection for security workflows.",
      bullets: ["Cut MTTR by 20%."],
      tech: ["Python", "LLMs", "AWS"],
      links: [{ label: "GitHub", href: "https://github.com/RoyaleRishi" }],
      order: 1,
    });
    expect(parsed.success).toBe(true);
  });

  it("defaults bullets, tech, and links to empty arrays", () => {
    const parsed = workSchema.parse({
      title: "X",
      kind: "project",
      period: "2025",
      summary: "y",
      order: 1,
    });
    expect(parsed.bullets).toEqual([]);
    expect(parsed.tech).toEqual([]);
    expect(parsed.links).toEqual([]);
  });

  it("rejects an entry missing the title", () => {
    const parsed = workSchema.safeParse({ kind: "project", period: "2025", summary: "x", order: 1 });
    expect(parsed.success).toBe(false);
  });

  it("rejects an invalid kind", () => {
    const parsed = workSchema.safeParse({
      title: "X",
      kind: "hobby",
      period: "2025",
      summary: "x",
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
