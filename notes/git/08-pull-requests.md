# Pull Requests

## What is a Pull Request?

A Pull Request (PR) is a request to merge one branch into another, with a description of what changed and why. It is the main way code gets reviewed and integrated on a team.

The name comes from GitHub — you are asking the repo maintainer to "pull" your changes in. GitLab calls them Merge Requests (MR), but the concept is the same.

---

## The PR workflow

```
feat/add-task  →  PR  →  angular/06-hr-portal  →  PR  →  main
   (feature)        (review)    (project branch)   (review)  (production)
```

1. Push your feature branch to GitHub
2. Open a PR from `feat/add-task` into `angular/06-hr-portal`
3. Add a description of what changed and why
4. On a team: wait for code review; in solo projects: self-review then merge
5. After merge: delete the feature branch

---

## PR description format

Every PR needs a description. This is documentation that lives permanently with the commit history.

```markdown
## Changes
- Add employee creation form with name, email, department, and role fields
- Add duplicate email check before submit
- Add form validation with error messages on each field

## Why
Used the dual-mode dialog pattern so the same component handles both add and edit — avoids duplicating the form logic.
```

- `## Changes` — bullet list of what changed (the WHAT)
- `## Why` — one or two lines on the main decision (the WHY)

The description must make sense to someone who has not seen the code.

---

## Merging strategies on GitHub

| Strategy | What it does | When to use |
|----------|-------------|-------------|
| **Merge commit** | Creates a merge commit that ties both branches | Feature PRs — the commit documents when it was integrated |
| **Squash and merge** | Combines all PR commits into one commit | When the PR has many small/messy commits and you want one clean entry |
| **Rebase and merge** | Replays commits on top of main, no merge commit | When you want a perfectly linear history |

In this project: use **Merge commit** for feature PRs and project PRs. It keeps the history honest.

---

## Code review — what to look for

When you review someone else's code (or your own in a self-review):

- Does it do what the PR description says?
- Are there obvious bugs or edge cases not handled?
- Is the code readable — good names, not overly complex?
- Are there any security issues (unvalidated input, exposed keys)?
- Are there tests for the new logic?

Leave comments on specific lines, not just a general "looks good". Even in solo projects, reading your own diff before merging catches mistakes.
