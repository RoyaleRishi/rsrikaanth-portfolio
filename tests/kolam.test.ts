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
