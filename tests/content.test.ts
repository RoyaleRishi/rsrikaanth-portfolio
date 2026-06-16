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
