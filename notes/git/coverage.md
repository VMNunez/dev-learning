# Minimum Coverage — Git

Git as used in a professional team environment. Focus on daily workflow and concepts that come up in interviews.

## Core workflow
- [ ] `init`, `clone` — starting a repo
- [ ] `add`, `commit` — staging and saving changes
- [ ] `push`, `pull`, `fetch` — syncing with the remote
- [ ] `status`, `log`, `diff` — understanding what has changed

## Branching
- [ ] `branch`, `checkout`, `switch` — creating and moving between branches
- [ ] Branch naming conventions (feature/, fix/, etc.)
- [ ] `merge` — joining branches, what a merge commit looks like
- [ ] Fast-forward merge vs merge commit — the difference and when each happens

## Rebase
- [ ] What `rebase` does — replaying commits on top of another branch
- [ ] `rebase` vs `merge` — which produces a cleaner history and when to use each
- [ ] Interactive rebase: squashing commits before a PR

## Remote and collaboration
- [ ] `remote`, `origin` — what the remote is
- [ ] Pull requests — what they are, why teams use them, how to write a good description
- [ ] Code review — what to check when reviewing someone else's PR
- [ ] Resolving merge conflicts — how to read the conflict markers and choose the right version

## Stash
- [ ] `stash`, `stash pop`, `stash list` — saving work in progress without committing

## Undoing things
- [ ] `restore` — discard working directory changes
- [ ] `reset --soft`, `reset --mixed`, `reset --hard` — the difference and the risk
- [ ] `revert` — undoing a commit safely in a shared branch

## `.gitignore`
- [ ] What it does and how to write patterns
- [ ] Common entries: `node_modules/`, `target/`, `.env`, `*.class`

## Commit quality
- [ ] Conventional Commits format: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`
- [ ] What makes a good commit message — atomic, explains why not what
- [ ] Why small, frequent commits are better than one large commit
