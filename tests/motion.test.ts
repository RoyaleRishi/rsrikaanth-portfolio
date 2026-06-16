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
