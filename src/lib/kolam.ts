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
    const dir = i % 2 === 0 ? -1 : 1;
    const cy = baseline + dir * amplitude;
    const c1x = x0 + step / 3;
    const c2x = x0 + (2 * step) / 3;
    d += ` C${c1x},${cy} ${c2x},${cy} ${x1},${baseline}`;
  }
  return d;
}
