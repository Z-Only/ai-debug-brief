#!/usr/bin/env bash
# Run from any directory. COVERAGE_BASE may be a commit or the empty Git tree.
set -euo pipefail
cd "$(dirname "$0")/.."
bun run check:static
bun run typecheck
bun run test:gate
bun run test:coverage
bun run build
if [[ -n "${COVERAGE_BASE:-}" ]]; then
  base="$COVERAGE_BASE"
else
  base=$(git hash-object -t tree --stdin </dev/null)
fi
args=(--base "$base" --report coverage/lcov.info . --total-min 95 --changed-min 95 --json-output coverage/gate-summary.json)
# Local invocation includes untracked/staged/unstaged source. CI evaluates only
# the checked-out commit that was tested, never a moving remote branch.
if [[ "${CI:-}" != true ]]; then args+=(--working-tree); fi
python3 scripts/check_coverage.py "${args[@]}"
