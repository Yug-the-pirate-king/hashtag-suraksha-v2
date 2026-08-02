# AI Fix — Issue #4: Cleanup: Remove dead code and unused imports

**Issue body:**

This is an automated issue created by the AI agent to track planned code quality improvements. The AI will fix this in a subsequent run.

---

**AI-proposed fix:**

### Root cause

The issue is straightforward code-cleanup debt: over time the codebase has accumulated unused imports, commented-out/dead functions, stale constants, and other unreachable code. These artifacts don’t affect runtime behavior, but they:

- increase maintenance surface area,
- slow down lint/type-check/compile cycles,
- confuse new contributors,
- and can hide real bugs by obscuring intent.

This typically happens when features are refactored iteratively without a linter or automated cleanup step.

---

### Exact code changes needed

Because I don’t have the live repository contents here, I can’t give the literal file paths for this specific repo. Run the commands below on a fresh checkout to get the precise files and line numbers, then apply the removals.

#### 1. Detect & remove unused imports

**Python**

```bash
# install if needed
pip install autoflake

# dry-run: shows what would be deleted
autoflake --in-place --remove-all-unused-imports --remove-unused-variables \
          --recursive --check .

# if the diff looks safe, remove --check to apply
autoflake --in-place --remove-all-unused-imports --remove-unused-variables \
          --recursive .
```

Files you should expect to see touched will look like e.g. `src/<module>/<file>.py`. A typical diff:

```diff
 # src/security/scan.py
-import os
-import json
-from typing import List
-
-def process_hashtags(hashtags):
-    unused_var = 42
+def process_hashtags(hashtags):
     return [h.lower() for h in hashtags]
```

**JavaScript / TypeScript**

```bash
npx eslint . --ext .js,.jsx,.ts,.tsx --rule 'no-unused-vars: error' --rule 'no-duplicate-imports: error'
```

Remove any imports flagged `no-unused-vars` / `no-duplicate-imports`.

**Java / Kotlin / other JVM languages**

Use the IDE action **Code → Optimize Imports** or run `google-java-format -a -i` after configuring it to drop unused imports.

#### 2. Detect dead code (functions, classes, constants)

**Python**

```bash
pip install vulture
vulture . --min-confidence 80
```

Review each item:

- If it’s truly dead → delete it.
- If it’s a false positive (e.g. a public API used by external callers) → add `# noqa` or a `__all__` entry, then move on.

**JavaScript / TypeScript**

```bash
npx depcheck          # unused dependencies
npx eslint . --rule 'no-unreachable: error'
```

**Java / others**

Use your IDE’s **Analyze → Inspect Code** “Unused declaration” inspection, or run SonarQube/PMD.

#### 3. Delete commented-out code blocks

Search for stale blocks and remove them:

```bash
# Python
git grep -n -E '^\s*#.*(def |class |import |print\(|TODO|FIXME)' -- '*.py'

# JS/TS
git grep -n -E '^\s*//.*(function|const|import|console\.log|TODO|FIXME)' -- '*.{js,ts,tsx}'
```

Only keep comments that explain **why**, not commented-out implementations. If a block documents an alternative approach, convert it to a one-line note rather than leaving dead code.

#### 4. Remove unused files / modules

```bash
# list files that have not been touched in a long time or have no references
git ls-files | while read f; do git log -1 --format='%ai %h' -- "$f"; done | sort
```

Cross-check any suspicious files with `git grep` to confirm they are not imported anywhere.

---

### Follow-up actions

1. **Add linting to CI** so dead code cannot re-enter the repo.
   - Python: `flake8` / `ruff` / `pylint` job.
   - JS/TS: `eslint` job with `no-unused-vars` enabled.
   - Java: `checkstyle` / SpotBugs / SonarCloud job.

2. **Add a pre-commit hook** to catch unused imports before commit.
   - Python: `pre-commit` with `autoflake`, `isort`, `black`.
   - JS/TS: `lint-staged` + `eslint --fix`.

3. **Run this cleanup as its own PR** with a clear title, e.g. `chore: remove dead code and unused imports (#4)`. Do not mix it with feature changes so the diff is easy to review.

4. **After merging, verify tests, type checks, and the build still pass.** Dead-code removal is usually safe, but import side effects or `__all__` can occasionally break things.

If you paste the output of `autoflake --check -r .` and `vulture .`, I can convert the findings into the exact file-by-file patch for the PR.
