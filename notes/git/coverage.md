# Minimum Coverage — Git

Git as used in a professional team environment.
Focus on daily workflow and concepts that come up in interviews and code reviews.

## Core workflow
- `init`, `clone` — starting a repository from scratch or from an existing remote
- `add`, `commit` — staging specific files and saving a snapshot with a message; interviewers ask why you stage before committing
- `push`, `pull`, `fetch` — `push` sends your commits; `fetch` downloads remote changes without merging; `pull` does both
- `status`, `log`, `diff` — understanding what has changed and why; `git log --oneline` for a quick history

## Branching
- `branch`, `checkout`, `switch` — creating and moving between branches; `switch` is the modern alternative to `checkout` for branches
- Branch naming conventions — `feat/`, `fix/`, `angular/`, `feat/short-description`; interviewers ask "how do you organise branches in a team?"
- `merge` — joining branches; creates a merge commit that preserves the full history of both branches
- Fast-forward merge vs merge commit — fast-forward happens when the target has no new commits (no divergence); a merge commit happens when both branches have advanced

## Rebase
- What `rebase` does — replays your commits on top of another branch; produces a linear history without merge commits
- `rebase` vs `merge` — rebase gives a cleaner history; merge preserves exactly what happened; teams usually choose one convention and stick to it
- Interactive rebase: squashing commits before a PR — combining several small commits into one clean commit before opening a pull request

## Remote and collaboration
- `remote`, `origin` — `origin` is the default name for the remote; where `push` and `pull` point
- Pull requests — a request to merge a branch; the place for code review and discussion before changes go to the main branch
- Code review — what to check: does it do what the description says, are there edge cases, is it readable, are there obvious bugs
- Resolving merge conflicts — reading the conflict markers (`<<<<`, `====`, `>>>>`), choosing the correct version, and marking it as resolved

## Stash
- `stash`, `stash pop`, `stash list` — saving uncommitted changes to a temporary stack so you can switch branches without committing unfinished work

## Undoing things
- `restore` — discard changes in the working directory without committing; safe because it only touches uncommitted work
- `reset --soft` vs `reset --mixed` vs `reset --hard` — soft keeps changes staged; mixed unstages them; hard discards them permanently; `--hard` is destructive
- `revert` — creates a new commit that undoes a previous commit; safe to use on shared branches because it does not rewrite history

## .gitignore
- What it does — tells Git to ignore specific files and folders; they are never staged or committed
- Common entries: `node_modules/`, `target/`, `.env`, `*.class` — what each ignores and why it must not be committed

## Commit quality
- Conventional Commits format: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:` — the standard used in professional teams; interviewers ask "how do you write a commit message?"
- What makes a good commit message — atomic (one logical change), explains why not what, readable without the code
- Why small, frequent commits are better than one large commit — easier to review, easier to revert, clearer history
