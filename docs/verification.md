# Visitor acceptance record

## 2026-10-01 — published version 1

Target: https://ai-debug-brief.m2-zhao.chatgpt.site/

Browser: cloud Chromium through CUA, accessible DOM, read-only computed-style inspection, and ordinary mouse/keyboard controls. No DevTools access or policy bypass. Desktop initial viewport: 1188 × 761 CSS px; subsequent desktop: 1190 × 761. Narrow viewports: exactly 320 × 380 and 390 × 380 CSS px using window resizing and 200% browser zoom. These are narrow desktop browser tests, not physical phone tests.

### Passed live checks

- Correct page title/URL, nonblank content, no framework error overlay.
- Synthetic Maven example loads only by action, generates real bounded evidence, line citations, metadata and full selectable Markdown.
- Java dynamic-agent warning plus BUILD SUCCESS remains informational and does not claim a failure/root cause.
- Docker missing-Dockerfile fixture yields the bounded Docker input hypothesis. An unsupported cache-key wording safely falls back to no supported rule matched rather than guessing.
- Custom literal masking removes a synthetic private value from command, working directory, environment, question and complete Markdown; Evidence shows redacted metadata.
- HTML-looking log text remains inert: literal `<img ...>` appears as code and no image node is created.
- Copy is disabled before review. After review, Copy reports success and native paste back into the app confirms the complete 1,635-character Chinese Markdown. The separate cloud clipboard read API returned an empty value and was not used as evidence of failure.
- Editing input and changing language invalidates stale analysis; regenerating resets review.
- Cancel on native Clear and Replace dialogs preserves input and generated Markdown. Accepted replacement resets metadata to the synthetic fixture.
- Empty log, 20,001-line input and 1,048,577-byte input produce visible validation errors; no stale result remains after oversized input.
- Both English/Chinese and light/dark were visually inspected at both exact narrow widths, with no horizontal page overflow; source and result stack and the 320px header wraps. English/light, Chinese/dark core flows were exercised, rather than claiming every workflow in all eight combinations.
- Reload clears log, language and appearance back to in-memory defaults, with unchanged URL.
- Captured console log history contained only cloud browser extension metadata errors (75 entries), no app-origin warning/error. This is not a claim that the browser extension is error-free.

### Found and fixed locally; deployment retest required

ArrowRight/ArrowLeft/Home/End changed the selected tab while focus stayed on the previous tab. Live DOM confirmed activeElement remained `evidence-tab` after Markdown became selected. A DOM-attached regression assertion failed before the patch. The handler now waits for Vue's next tick so the parent v-model update reaches the child before focusing the selected tab. The same regression passes locally for all four keys. The published version must be updated and retested before marking this issue closed.

### Source and privacy evidence

App code contains no fetch/XHR/beacon/WebSocket, localStorage/sessionStorage/IndexedDB, URL mutation, or analytics. Analysis is local/pure and logs render through text interpolation. Clipboard writes are gated on a generated, reviewed result. External official-documentation links have `noopener noreferrer`. Reload behavior supports no app persistence. No network capture or browser storage-panel inspection was performed; source and UI evidence must not be described as a comprehensive network/security audit. Hosting asset requests and browser/extension behavior are outside the app-level claim.

### Automated checks after local keyboard fix

- 69 Vitest tests passed across four files
- 35 Python CI/static/coverage-gate tests passed
- Typecheck passed
- Production line coverage 247/247 (100%); statements 272/272; functions 83/83; branches 214/217 (98.61%)
- Existing contrast tests pass; source-token ratios and live computed typography are recorded in design.md

### Fidelity and remaining limits

Accepted concept and live rendered screenshots were inspected with `view_image` across copy, layout, typography, palette, containers, spacing and responsive behavior. No blocking visual mismatch remains against the documented design system and intentional deviations. Screenshots remain private QA artifacts, not public repository content. The 1505 × 1045 concept-native viewport was not available on the 1364 × 1024 desktop. No physical iOS/Android, Safari/Firefox, screen-reader session, forced clipboard-denial browser test, or live network/storage capture was performed. Clipboard-denial and async race behavior have automated UI coverage.
