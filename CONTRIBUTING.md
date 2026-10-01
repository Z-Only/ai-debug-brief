# Contributing

Use synthetic data only. Never commit real logs, credentials, personal data, or internal hostnames. Keep processing local and ephemeral; network requests and browser input persistence are prohibited in application source.

Run `bun install --frozen-lockfile` and `bun run ci-gate` before opening a pull request. Add unit/component tests for fixes and new behavior. Cover error states, repeated actions, and cancellation as well as the happy path. Review the UI at desktop and mobile widths after visual changes.

Total and changed executable line coverage must each be at least 95%. Do not weaken thresholds, exclude runtime adapters/entrypoints, add ignore directives, or fabricate LCOV records to pass. Missing/incomplete coverage and a zero-line application fail closed. Static source checks are conservative guardrails, not a complete security audit.

Dependency changes must update `bun.lock`. Keep GitHub Actions pinned to immutable commit SHAs. No deployment credentials or API keys are needed for this frontend.
