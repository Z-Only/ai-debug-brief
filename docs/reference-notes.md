# Evidence and limitations

The application prepares a prompt for the user's own external AI conversation. It does not execute an AI model, call model APIs, require API keys, run commands, or confirm a root cause. Findings are clues to investigate, grounded in the pasted text.

## Official references

- [Docker build context](https://docs.docker.com/build/concepts/context/): the selected context controls what files a build can access; `COPY` and `ADD` operate on available context files
- [Maven Surefire: skipping tests](https://maven.apache.org/surefire/maven-surefire-plugin/examples/skipping-tests.html): skipping test execution is distinct from a verified successful test run; use explicit verification rather than treating a skipped-test message as a code failure
- [Jenkins Credentials Binding](https://www.jenkins.io/doc/pipeline/steps/credentials-binding/): masking is best-effort and is not a complete security boundary; review logs and generated output before external sharing

## Input limits

The log limit is 1 MiB and 20,000 lines. Additional metadata is limited to 64 KiB. Custom redaction accepts up to 20 literal strings, each up to 200 characters. These bounds keep local processing responsive and predictable.

## Redaction limitations

Automated redaction can miss unfamiliar formats or sensitive context. Review the raw input and full generated brief, including titles, environment metadata, paths, identifiers, and excerpts, before copying. The tool does not transmit or automatically store input. Explicit copying can place content in a clipboard outside the application's control.

Examples and tests must remain synthetic. No real user logs or infrastructure identifiers belong in this repository.
