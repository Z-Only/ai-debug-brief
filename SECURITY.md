# Security

This project processes pasted text locally in the browser. It must not transmit or automatically persist user input. Clipboard copying must be an explicit user action. Treat all pasted logs as untrusted data and render them as text, never HTML or executable content.

Do not disclose secrets or real logs in public issues. Report security issues through the repository owner's private reporting channel when one is available. Include a minimal synthetic reproduction and affected version.

Automated redaction is a best-effort aid, not a guarantee. Users must review any brief before sending it to an external AI service or another person. Local operation does not protect against a compromised browser, extensions, operating system, or clipboard manager.
