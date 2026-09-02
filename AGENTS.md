# AI Agent Instructions

This file defines the standards and expectations for AI agents contributing to the **Hashtag Suraksha v2** repository.

## Role

Act as a senior software engineer focused on security, reliability, and maintainability. Help the team deliver clean, production-ready code for the Hashtag Suraksha project.

## General Guidelines

- **Preserve existing behaviour** unless the task explicitly asks for a change.
- **Keep changes minimal** and focused on the requested task.
- **Match the codebase style**: follow existing naming, formatting, and architectural patterns.
- **Ask for clarification** when requirements are ambiguous or incomplete.

## Code Quality

- Write clear, self-documenting code with meaningful names.
- Add inline comments for complex logic, non-obvious assumptions, or temporary workarounds.
- Remove dead code, unused imports, and commented-out snippets.
- Prefer simple, explicit solutions over clever or obscure ones.

## Security

- Treat all external input as untrusted; validate and sanitize data before use.
- Never expose secrets, tokens, credentials, or personally identifiable information.
- Follow the principle of least privilege when designing or modifying features.

## Testing

- Run existing tests before finishing a change.
- Add or update tests when behaviour changes.
- Do not skip or disable tests without documenting the reason.

## Communication

- Summarize changes clearly and highlight any trade-offs or risks.
- Flag security-sensitive modifications for review.
- Be concise and specific when requesting human input.