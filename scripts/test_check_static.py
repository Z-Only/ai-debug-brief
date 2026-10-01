"""Regression tests for the conservative static guardrails."""
import contextlib
import io
from pathlib import Path
import tempfile
import unittest

import check_static as guard


class StaticTests(unittest.TestCase):
    def test_safe_source(self):
        self.assertEqual(guard.inspect_source('export const value: string = "safe"\n'), [])

    def test_all_rule_categories(self):
        samples = {
            'remote network access': ['fetch("/")', 'new XMLHttpRequest()', 'new WebSocket("/")', 'new EventSource("/")', 'navigator.sendBeacon("/")'],
            'input persistence': ['localStorage.setItem("a", "b")', 'sessionStorage.clear()', 'indexedDB.open("x")', 'document.cookie = "x"'],
            'dynamic code execution': ['eval("1")', 'new Function("return 1")'],
            'unsafe HTML insertion': ['<p v-html="value"/>', 'element.innerHTML = value', 'element.outerHTML = value', 'element.insertAdjacentHTML("beforeend", value)'],
            'disabled type safety': ['// @ts-ignore', '// @ts-nocheck', 'value as any', 'value: any'],
            'embedded private key': ['-----BEGIN PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN EC PRIVATE KEY-----', '-----BEGIN OPENSSH PRIVATE KEY-----'],
        }
        self.assertEqual(set(samples), set(guard.RULES))
        for category, examples in samples.items():
            for example in examples:
                with self.subTest(example=example):
                    self.assertIn((2, category), guard.inspect_source('// header\n' + example))

    def test_directory_and_exit_status(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.assertTrue(guard.check(root))
            (root / 'src').mkdir()
            (root / 'src/main.ts').write_text('export const ready = true\n')
            (root / 'src/style.css').write_text('fetch("ignored non-executable style")')
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(guard.main(root), 0)
                (root / 'src/main.ts').write_text('fetch("/")\n')
                self.assertEqual(guard.main(root), 1)
                (root / 'src/main.ts').write_bytes(b'\xff')
                self.assertEqual(guard.main(root), 1)
            self.assertIn('unreadable source', guard.check(root)[0])


if __name__ == '__main__':
    unittest.main()
