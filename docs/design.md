# AI Debug Brief design specification

## Reference

The primary-screen concept was generated and visually inspected at 1505 × 1045; the design system below records the accepted reference. Built-in image generation was used for the concept only; production UI is native Vue/HTML/CSS. The concept is a visual specification, not factual diagnostic output. All example data is synthetic.

## Accepted design system

- True white background `#ffffff`, ink `#172b2c`, teal actions `#08776e`, muted text `#626f78`, decorative borders `#d6dde0`, subtle surfaces `#f6f8f9`
- Accessible interactive boundaries use stronger `#7a898a` borders; focus uses a distinct three-pixel outline
- Native system sans-serif, 40px maximum desktop heading, 21px section headings, 14–17px UI/body text, 14px monospace log/evidence/Markdown
- Content width up to 1600px, 40px desktop side gutters, two equal working columns separated by 30px
- Five/six-pixel radii, thin neutral dividers, no shadows, gradients, marketing imagery, or card grids
- Header contains product name, language and appearance controls; main contains introduction, source column and evidence column; footer states local processing behavior
- Input column: source editor, optional context disclosure, redaction disclosure, full-width Generate brief action
- Output column: restrained empty state before generation; actual evidence statistics, Evidence/Markdown tabs, cautious hypotheses, line-cited excerpts, warnings, review acknowledgement and Copy brief
- Icons: external-link directional arrow is a simple 1.5px outline SVG; the empty-state three-line document is decorative CSS and carries no content

## Allowed visible copy and core interaction

The English UI copy is centralized in `src/i18n.ts`, with Chinese equivalents in the same file. Heading: “From build log to a better question.” Intro explicitly states browser-local processing and that no model runs. Main headings: “01 / Source log” and “02 / Evidence & brief.” Main actions: “Synthetic example,” “Clear,” “Generate brief,” “Evidence,” “Markdown,” “Copy brief.”

The initial editor is empty. The synthetic example is loaded only by explicit action. Existing input replacement and clear use native confirmation dialogs. Editing input or changing language removes stale analysis. Generation resets the review acknowledgement; copy is disabled until the user acknowledges reviewing the complete brief. The complete Markdown remains selectable. Clipboard failures reveal the full Markdown and explain manual copy. Async clipboard completion is ignored after changing or regenerating the brief.

No pasted data is uploaded, saved in localStorage, added to URLs, or automatically written to the clipboard. No model runs. Redaction is explicitly heuristic and requires human review. Logs render only as text.

## Responsive and alternative states

At 740px and below, columns stack with source above evidence. At 1000px and below, metadata labels stack above controls. At 380px and below, the header wraps into separate name and preferences rows. All core controls have at least 44px targets. Form controls and readable code content use 14px or larger text. Evidence wraps long lines. The editor permits horizontal scrolling rather than expanding the viewport.

Theme choices are System, Light and Dark; system changes are observed only for this session. Dark palette: background `#131e20`, text `#edf5f5`, muted `#b0c1c3`, accent `#73d7c9`, interactive borders `#788e90`. All theme and language preferences are in-memory only.

## Intentional concept deviations

1. The concept's confident sample conclusion is replaced by actual bounded domain hypotheses. A match is never declared the root cause; skipped compilation is never presented as a fix.
2. Initial state is empty, rather than silently populated with a generated analysis; a user must explicitly load and analyze a synthetic example.
3. The concept's densely packed type and tiny controls are increased to readable 14px text and 44px interaction targets, extending the page height.
4. Review acknowledgement is required before Copy. The full Markdown is still selectable, so this is a reminder, not a security guarantee.
5. Input control borders are stronger than decorative borders for adequate contrast.
6. Results use two accessible tabs to manage real variable-length output, rather than reproduce the concept's duplicated preview structure.
7. Evidence review also includes all redacted metadata and signal reference counts, to make exported context visible before copying.
8. Mobile, Chinese and dark variants extend the same specified visual system; they add no new product functions.

## Fidelity ledger

The generated concept was inspected with `view_image` before implementation. Implementation verification must compare a current rendered screenshot with this reference before release.

| Comparison  | Concept evidence                           | Implementation decision                                           | Verification                                           |
| ----------- | ------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------ |
| Palette     | White/ink/teal working surface             | Locked CSS tokens; no gradients or overlays                       | Live light/dark screenshots and computed styles verified           |
| Layout      | Source left, results right, slim header    | Two-column grid with source-first mobile stack                    | Live desktop and exact 320/390 CSS px checked; no page overflow        |
| Typography  | Strong compact heading, clear labels, code | System sans and monospace, readable 14px minimum core text        | Live computed controls 14px, desktop h1 35.64px, narrow h1 29px       |
| Containers  | Thin flat borders and dividers             | Disclosures and excerpts only, no nested card grid                | Concept and rendered screenshots inspected with view_image              |
| Copy        | Direct workflow headings and actions       | Centralized bilingual copy; factual claims corrected              | Source and live above-the-fold copy agree with allowed bilingual copy |
| Interaction | Generate, review, copy                     | Real bounded analysis, review acknowledgement, clipboard fallback | UI flow tests pass                                     |
| Responsive  | Desktop primary reference                  | Defined mobile stacking and wrapped header                        | Live stacked layouts and wrapped headers checked in both languages/themes                                  |

## Automated checks completed

UI flow tests cover empty input, synthetic example generation, evidence and full Markdown, all editable metadata, literal redaction, stale invalidation, replacement/clear confirmation including cancellation, clipboard success and denied permission, delayed clipboard completion races, bounds and generic errors, Chinese interface/output, system/light/dark mode and cleanup, keyboard tabs, and inert rendering of HTML-looking logs. Entrypoint wiring is also checked. Full-suite production coverage at the implementation checkpoint: 100% lines/statements/functions at the previous checkpoint; final run recorded separately. Specific CSS color-pair tests cover both themes: primary/hover text, muted text, control borders and focus against adjacent surfaces. These checks are not a full WCAG audit. Browser/fidelity review is a separate release requirement, not implied by those tests.

Final implementation checkpoint: 69 Vitest tests passed across four files; production line, statement and function coverage 100%, branch coverage 98.61%. The contrast tests caught a focus indicator at 2.996:1 against the subtle light surface; the light focus token was strengthened to `#358d84` and all tested color pairs now pass. Redacted metadata and per-signal occurrence/omitted-reference counts are visible in Evidence review. Live browser and fidelity validation are recorded in docs/verification.md; the keyboard-focus fix requires the release owner to deploy and recheck it.

## Visitor acceptance comparison (2026-10-01)

The concept and live desktop render were inspected with `view_image`, together with narrow English/light and Chinese/dark screenshots. Seven comparison dimensions were checked: copy, two-column/source-first layout, typography, white/ink/teal palette, thin flat container treatment, spacing and control geometry, and responsive wrapping. No unplanned visual additions or blocking clipping were found. The implementation faithfully follows the accepted design system and the intentional deviations listed above; it is not pixel-identical to the denser concept. Above-the-fold copy matches the allowed copy list. The concept’s 1505 × 1045 native viewport was not reproduced on the available 1364 × 1024 cloud desktop; live desktop content was tested at 1188/1190 × 761 CSS px. Exact 320/390 × 380 CSS px narrow layouts used normal browser window resizing and 200% zoom, not a phone or mobile browser emulation.

Computed control text is 14px; code is 14px/23.8px. Desktop h1 was 35.64px at 1188 CSS px; narrow h1 is 29px at 320 CSS px, with 20px section headings. Token contrast ratios (light/dark) are: main text 14.81/15.38, muted text 5.17/9.12, primary button 5.42/8.99, control border on page 3.64/4.92, focus on subtle surface 3.72/10.73. These targeted checks do not constitute a full accessibility audit.
