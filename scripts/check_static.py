#!/usr/bin/env python3
"""Dependency-free guardrails for a browser-only, non-persistent application.

These deliberately conservative source checks supplement strict vue-tsc; they
are not a complete security scanner or proof that arbitrary dependencies are safe.
"""
from pathlib import Path
import re
import sys

RULES = {
    'remote network access': r'\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(',
    'input persistence': r'\b(?:localStorage|sessionStorage|indexedDB)\b|\bdocument\s*\.\s*cookie\b',
    'dynamic code execution': r'\beval\s*\(|\bnew\s+Function\s*\(',
    'unsafe HTML insertion': r'\bv-html\s*=|\.\s*(?:innerHTML|outerHTML)\s*=|\binsertAdjacentHTML\s*\(',
    'disabled type safety': r'@ts-(?:ignore|nocheck)|\bas\s+any\b|:\s*any\b',
    'embedded private key': r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
}
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs', '.vue'}


def inspect_source(text: str) -> list[tuple[int, str]]:
    return sorted((text.count('\n', 0, match.start()) + 1, name)
                  for name, pattern in RULES.items()
                  for match in re.finditer(pattern, text))


def check(root: Path) -> list[str]:
    sources = sorted(path for path in (root / 'src').rglob('*') if path.suffix in EXTENSIONS)
    if not sources:
        return ['No application source files found; static checks cannot pass an empty application']
    failures = []
    for path in sources:
        try:
            text = path.read_text(encoding='utf-8')
        except (OSError, UnicodeError) as exc:
            failures.append(f'{path.relative_to(root)}: unreadable source: {exc}')
            continue
        failures.extend(f'{path.relative_to(root)}:{line}: {reason}' for line, reason in inspect_source(text))
    return failures


def main(root: Path | None = None) -> int:
    failures = check(root or Path(__file__).resolve().parents[1])
    for failure in failures:
        print(f'ERROR: {failure}', file=sys.stderr)
    if failures:
        return 1
    print('Static privacy, safety, and type-suppression checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
