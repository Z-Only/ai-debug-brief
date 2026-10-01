import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const css = readFileSync("src/styles.css", "utf8");
const sheet = new CSSStyleSheet();
sheet.replaceSync(css);
const normalizeSelector = (value: string) => value.replace(/\s|["']/g, "");
function style(selector: string) {
  const rule = [...sheet.cssRules].find(
    (candidate) =>
      candidate instanceof CSSStyleRule &&
      normalizeSelector(candidate.selectorText) === normalizeSelector(selector),
  );
  if (!(rule instanceof CSSStyleRule))
    throw new Error(`Missing CSS rule: ${selector}`);
  return rule.style;
}
function tokens(selector: string) {
  const declaration = style(selector);
  return Object.fromEntries(
    ["bg", "ink", "muted", "accent", "subtle", "focus", "control-border"].map(
      (key) => [
        key,
        declaration.getPropertyValue(`--${key}`).trim().replace(/^#/, ""),
      ],
    ),
  ) as Record<string, string>;
}
function luminance(hex: string, brightness = 1) {
  if (hex.length === 3) hex = [...hex].map((char) => char + char).join("");
  const rgb = [0, 2, 4].map(
    (index) => (parseInt(hex.slice(index, index + 2), 16) / 255) * brightness,
  );
  const linear = rgb.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}
function contrast(a: string, b: string, brightness = 1) {
  const [lo, hi] = [luminance(a, brightness), luminance(b, brightness)].sort(
    (x, y) => x - y,
  );
  return (hi! + 0.05) / (lo! + 0.05);
}
describe("implemented color-pair contrast checks", () => {
  for (const [name, selector, buttonText] of [
    ["light", ".app-shell", "ffffff"],
    ["dark", ".app-shell[data-theme=dark]", "102926"],
  ]) {
    it(`${name}: primary, hover, text, interactive border and focus pairs meet their thresholds`, () => {
      const colors = tokens(selector!);
      expect(contrast(colors.ink!, colors.bg!)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.muted!, colors.bg!)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(buttonText!, colors.accent!)).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(buttonText!, colors.accent!, 0.93),
      ).toBeGreaterThanOrEqual(4.5);
      for (const adjacent of [colors.bg!, colors.subtle!]) {
        expect(
          contrast(colors["control-border"]!, adjacent),
        ).toBeGreaterThanOrEqual(3);
        expect(contrast(colors.focus!, adjacent)).toBeGreaterThanOrEqual(3);
      }
    });
  }
  it("uses the tested tokens in the actual interactive styles", () => {
    // happy-dom does not retain var() in border shorthands. Check normalized
    // declarations as well as parsing the actual palette through CSSOM.
    const compact = css.replace(/\s|["']/g, "");
    expect(compact).toContain("select{border:1pxsolidvar(--control-border)");
    expect(compact).toContain(
      "textarea,input{border:1pxsolidvar(--control-border)",
    );
    expect(compact).toContain("outline:3pxsolidvar(--focus)");
    expect(compact).toMatch(
      /\.primary:hover:not\(:disabled\)\{filter:brightness\(0?\.93\);?\}/,
    );
    expect(compact).toContain("background:var(--accent);color:#fff");
    expect(compact).toContain(
      ".app-shell[data-theme=dark].primary{color:#102926",
    );
  });
});
