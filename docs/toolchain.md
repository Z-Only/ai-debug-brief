# Toolchain and coverage contract

Verified against the official npm registry on 2026-10-01:

| Package                      | Installed | Latest verified |
| ---------------------------- | --------- | --------------- |
| Vue                          | 3.5.43    | 3.5.43          |
| Vite                         | 8.3.2     | 8.3.2           |
| @vitejs/plugin-vue           | 6.0.9     | 6.0.9           |
| Vitest / @vitest/coverage-v8 | 5.0.3     | 5.0.3           |
| @vue/test-utils              | 2.5.1     | 2.5.1           |
| happy-dom                    | 20.14.5   | 20.14.5         |
| vue-tsc                      | 3.3.11    | 3.3.11          |
| TypeScript                   | 6.0.3     | 7.0.2           |
| Bun                          | 1.4.2     | 1.4.2           |

Registry metadata: https://registry.npmjs.org/ . All direct package versions are exact and `bun.lock` locks transitive dependencies.

TypeScript 7.0.2 was tested in an isolated installation with vue-tsc 3.3.11. Even `vue-tsc --version` fails with `ERR_PACKAGE_PATH_NOT_EXPORTED` because vue-tsc resolves the removed `typescript/lib/tsc` entrypoint. TypeScript 6.0.3 is the latest compatible 6.x release verified by the registry. Revisit this pin when Vue language tooling supports the new TypeScript API.

## Coverage

- Application coverage includes every TypeScript and Vue file in `src`, including entrypoints and adapters
- Unit/component tests must instrument real application source; declaration-only files and dedicated tests are not production code
- Total executable lines and newly added/changed executable lines must each be at least 95%, without rounding up
- Missing reports, invalid LCOV, missing current source records, invalid base revisions, and an application with zero executable lines fail closed
- A change containing no executable production lines can have a zero changed-line denominator; it cannot bypass the total gate
- Local runs include tracked, staged, unstaged, and untracked source; CI reads the checked-out commit
- Static source guardrails forbid direct network API calls, browser storage, dynamic execution, unsafe HTML injection, type-safety suppression, and embedded private keys

The static checks are deliberately conservative and supplement review and tests; they are not a comprehensive security scanner. CI has an unconditional aggregate `ci-gate` job that fails unless verification succeeds. Repository administrators must configure that check as required; the workflow file alone does not enable branch protection.
