# AI Debug Brief

A browser-only workspace for turning Jenkins, Docker, and Maven logs into a structured debugging brief to paste into ChatGPT. Built with Vue 3, TypeScript, Vite, and Bun. It prepares a prompt; it does not run a model, execute commands, or confirm a root cause. No API keys or backend are required.

## Development

Requires Node.js 22.12+ (Node 24 recommended), Bun 1.4.2, Python 3, and Git.

```sh
bun install --frozen-lockfile
bun run dev
```

## Verification

```sh
bun run ci-gate
```

The aggregate gate runs static guardrails, strict Vue/TypeScript checks, regression tests for the gate scripts, unit/component tests with coverage, a production build, and fail-closed total/new-code line coverage checks. Both line-coverage thresholds are 95%; Vitest additionally requires 95% statements, branches, and functions. All executable application entrypoints and Vue components are included.

Local checks compare the working tree (including untracked source) to an empty tree by default. To check only changes against a known revision, run `COVERAGE_BASE=<base-commit> bun run ci-gate`. CI uses the pull request base, merge-queue base, or push predecessor and checks the exact tested commit. Configure branch protection to require the `ci-gate` status check before merging.

## Privacy and safety

The application is designed to process text in browser memory, without a backend, model API, telemetry, or automatic input persistence. Review and redact confidential information before copying a brief into any external service. Automated redaction cannot guarantee that all sensitive information is removed. Keep real logs, tokens, credentials, and private infrastructure details out of issues, tests, examples, and screenshots. Use synthetic fixtures only.

Logs are limited to 1 MiB and 20,000 lines; metadata to 64 KiB. Custom redaction supports 20 literal strings of up to 200 characters each. Review both the raw input and full generated brief before sharing. See [evidence, limits, and official references](docs/reference-notes.md).

## Dependencies

Direct dependencies are pinned and Bun's lockfile is committed. Dependabot checks Bun packages and GitHub Actions weekly, grouping compatible package updates and Actions updates. TypeScript 6 is currently pinned for vue-tsc compatibility; see [toolchain notes](docs/toolchain.md).

## License

MIT. See [LICENSE](LICENSE).
