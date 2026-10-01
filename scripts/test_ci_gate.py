"""Integration tests of aggregate ordering and fail-closed shell behavior."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


class AggregateTests(unittest.TestCase):
    def run_gate(self, *, ci='', base='', fail=''):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'scripts').mkdir()
            shutil.copyfile(Path(__file__).with_name('ci_gate.sh'), root / 'scripts/ci_gate.sh')
            bin_dir = root / 'bin'
            bin_dir.mkdir()
            for name, body in {
                'bun': 'printf "bun %s\\n" "$*" >> "$TRACE"\n[[ "$*" != "$FAIL_STEP" ]]',
                'git': 'printf "git %s\\n" "$*" >> "$TRACE"\nprintf "empty-tree\\n"',
                'python3': 'printf "python3 %s\\n" "$*" >> "$TRACE"',
            }.items():
                command = bin_dir / name
                command.write_text('#!/usr/bin/env bash\nset -eu\n' + body + '\n')
                command.chmod(0o755)
            env = dict(os.environ, PATH=str(bin_dir) + os.pathsep + os.environ['PATH'],
                       TRACE=str(root / 'trace'), FAIL_STEP=fail, CI=ci, COVERAGE_BASE=base)
            result = subprocess.run(['bash', str(root / 'scripts/ci_gate.sh')], cwd='/', env=env,
                                    text=True, capture_output=True)
            return result.returncode, (root / 'trace').read_text().splitlines()

    def test_local_default_and_required_steps(self):
        code, trace = self.run_gate()
        self.assertEqual(code, 0)
        self.assertEqual(trace[:5], ['bun run check:static', 'bun run typecheck', 'bun run test:gate',
                                    'bun run test:coverage', 'bun run build'])
        self.assertTrue(trace[5].startswith('git hash-object -t tree'))
        self.assertIn('--base empty-tree', trace[-1])
        self.assertIn('--working-tree', trace[-1])
        self.assertIn('--total-min 95 --changed-min 95', trace[-1])

    def test_ci_uses_explicit_base_and_committed_source(self):
        code, trace = self.run_gate(ci='true', base='fixed-base')
        self.assertEqual(code, 0)
        self.assertFalse(any(line.startswith('git ') for line in trace))
        self.assertIn('--base fixed-base', trace[-1])
        self.assertNotIn('--working-tree', trace[-1])

    def test_failure_stops_later_checks(self):
        code, trace = self.run_gate(fail='run typecheck')
        self.assertNotEqual(code, 0)
        self.assertEqual(trace, ['bun run check:static', 'bun run typecheck'])


if __name__ == '__main__':
    unittest.main()
