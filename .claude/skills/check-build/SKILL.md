---
name: check-build
description: Run code quality checks (lint + typecheck) to verify there are no errors before committing or building. This runs ESLint and TypeScript checks without doing a full build.
license: MIT
---

This skill runs code quality checks on the project to verify there are no errors.

## Commands to run:

Execute the following command to check for errors:
```bash
pnpm check
```

This will run:
- `pnpm lint` - ESLint to check code style and potential issues
- `pnpm typecheck` - TypeScript compiler to check type errors

## What to do:

1. Run the check command
2. Review any errors found
3. If there are errors, fix them and report back what was fixed
4. If no errors, confirm that everything is clean

## Important:

- This does NOT do a full build, so it's faster than `pnpm build`
- Use this before committing code to catch issues early
- Always run checks after making code changes
