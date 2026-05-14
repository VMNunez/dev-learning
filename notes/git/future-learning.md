# Git — Future Learning Roadmap

Topics to study once the current 11 files are solid. Nothing here is needed for the first interview — needed to work comfortably in a professional team and grow into a mid-level developer.

---

## Phase 1 — After landing the first job

Things you will encounter in the first weeks. Not needed for the interview, but you will be asked to do them.

### Interactive rebase — `git rebase -i`

Clean up local commits before pushing: squash several commits into one, rename a commit message, reorder commits, or drop an accidental commit.

```bash
git rebase -i HEAD~3    # open an editor to edit the last 3 commits
```

In the editor, each commit has a command in front of it:

| Command | What it does |
|---------|-------------|
| `pick` | keep the commit as-is |
| `squash` / `s` | merge this commit into the one above it |
| `reword` / `r` | keep the commit but edit the message |
| `drop` / `d` | delete the commit entirely |

**Rule:** only use `git rebase -i` on commits that have NOT been pushed yet — it rewrites history.

Why it matters: many professional teams require clean history before a PR is merged. A feature that took 8 commits to develop (including "wip", "fix typo", "fix previous fix") should look like 2 or 3 clean commits in the shared history.

### Git tags and semantic versioning

Tags mark a specific commit as a release. Unlike branches, tags do not move.

```bash
git tag -a v1.0.0 -m "First stable release"    # annotated tag (preferred)
git push origin v1.0.0                          # push the tag to GitHub
git push origin --tags                          # push all local tags at once
git tag                                         # list all tags
```

Semantic versioning format: `MAJOR.MINOR.PATCH`
- `v1.0.0` → `v1.0.1`: bug fix (patch)
- `v1.0.0` → `v1.1.0`: new feature, backwards compatible (minor)
- `v1.0.0` → `v2.0.0`: breaking change (major)

You will see tags on every professional project. You will be asked to tag releases once you own a piece of the codebase.

### PR merge strategies — squash, merge commit, rebase

When merging a PR on GitHub, there are three options:

| Strategy | What it does | History |
|----------|-------------|---------|
| **Merge commit** | Creates a merge commit | Shows all commits + the merge commit |
| **Squash and merge** | Combines all PR commits into one | Clean — one commit per feature |
| **Rebase and merge** | Replays commits on top of main | Linear, no merge commit |

Each team picks one strategy and applies it consistently. You need to know which one your team uses and why — squash is common in teams that want one commit per PR, merge commit is common when teams want full commit history preserved.

### `git bisect` — find the commit that broke something

Binary search through the commit history to find which specific commit introduced a bug.

```bash
git bisect start
git bisect bad                  # current commit is broken
git bisect good v1.2.0          # this version was working

# git checks out a commit in the middle — you test it
git bisect good                 # this one was fine — search the later half
git bisect bad                  # this one was broken — search the earlier half
# ... repeat until git tells you which commit introduced the bug

git bisect reset                # return to the original HEAD
```

Useful when a bug appeared "at some point" and you do not know which commit caused it. Much faster than reading each commit manually.

---

## Phase 2 — After 6–12 months

### Git hooks — automate checks before commit and push

Scripts that run automatically at specific points in the git workflow. They live in `.git/hooks/` but are usually managed by a tool.

Common hooks:

| Hook | When it runs | Common use |
|------|-------------|-----------|
| `pre-commit` | Before a commit is created | Run linter, formatter, type check |
| `commit-msg` | After you write the commit message | Enforce Conventional Commits format |
| `pre-push` | Before pushing to remote | Run tests to block broken pushes |

In JavaScript / Angular projects, hooks are typically managed with **Husky**:

```bash
npm install --save-dev husky
npx husky init
```

In Spring Boot projects, hooks can be plain shell scripts or configured with Maven plugins.

Why it matters: professional teams use hooks to enforce standards automatically. A pre-commit hook that runs the linter means nobody can commit code that fails the style guide — the check happens before the commit, not in CI after the fact.

### Branching strategies — Git flow vs trunk-based development

Two approaches to managing branches in a team:

**Git flow** — formal model with long-lived branches:
```
main           ← only tagged releases
develop        ← integration branch
feature/*      ← feature branches off develop
release/*      ← stabilisation before merging to main
hotfix/*       ← bug fixes applied directly to main
```
Used in teams with scheduled releases. Adds overhead but gives explicit control over what goes to production.

**Trunk-based development** — everyone merges to main frequently:
```
main           ← always deployable
feature/*      ← short-lived (1–2 days max), merged directly to main
```
Used in teams that deploy continuously. Requires good CI and feature flags to hide incomplete work.

You already use a model closer to trunk-based. Knowing the vocabulary matters when a tech lead explains the team's branching strategy on day one.

### `git worktree` — multiple branches at the same time

Check out a second branch in a separate folder without stashing or switching:

```bash
git worktree add ../project-hotfix hotfix/payment-crash
# now you have:
# /project           ← your current branch
# /project-hotfix    ← hotfix branch in a separate folder

git worktree remove ../project-hotfix    # clean up when done
```

Useful when you are in the middle of a feature and need to test or fix something on another branch without interrupting your work.

---

## Phase 3 — Mid-level

### GitHub Actions — CI/CD triggered by git events

Workflows defined in `.github/workflows/` that run automatically on git events:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Common uses: run tests on every PR, build and deploy on merge to main, run the linter on every push. Understanding that these are just scripts triggered by git events makes them much less mysterious.

### Monorepo patterns

Some large companies keep multiple projects (Angular frontend, Spring Boot backend, shared libraries) in one git repository. Git commands work the same, but the scale changes — filtering commits by path, sparse checkouts, and careful `.gitignore` management become important.

---

## What NOT to study prematurely

- **`git filter-repo`** — rewrites the entire git history to remove a file or credential. Only needed in a disaster. It can destroy a shared repository if used incorrectly. Learn it only when you actually need it.
- **Git internals (objects, trees, blobs)** — understanding what is literally inside the `.git` folder. Interesting but has no practical application at junior or mid level.
- **Git LFS (Large File Storage)** — storing binary files (images, videos, datasets) in git. Only relevant in specific domains (game dev, data science). Not needed in Angular + Spring Boot projects.
- **Git submodules** — nesting one repository inside another. Complex, fragile, and increasingly replaced by package managers. Avoid until you are forced to use them.
