# Git Junior Notes Plan

Plan status: current
Coverage: notes/git/coverage/junior.md
Coverage SHA-256: bb6eefef62cc36a63b873d8f06eafdb7395fb814745e39beb7754b00cef0d0f7
Generated: 2026-07-24

## 01 — Core workflow

Status: pending
Action: audit
English: notes/git/junior/en/02-staging-commits.md
Spanish: notes/git/junior/es/02-staging-commits.md
Depends on: none

Coverage concepts:

- `init`, `clone` — `init` starts a repo from scratch locally; `clone` downloads an existing remote repo; interviewers ask: "how would you start working on this project on a new machine?" (answer: clone, not init)
- The three areas — working directory, staging area, repository; interviewers ask "what is the staging area for?" — it exists so you can commit part of your changes, not everything at once
- `add`, `commit` — staging specific files and saving a snapshot; a common question is "why do you stage before committing?" and "what is the difference between `git add .` and `git add filename`?"
- `push`, `pull`, `fetch` — `push` sends commits to the remote; `pull` downloads and merges; `fetch` downloads without merging; interviewers ask the pull vs fetch difference every time
- `status`, `log --oneline`, `diff --staged` — essential inspection commands; `diff --staged` shows what will go into the next commit (not what is just modified); `log --oneline` is the standard compact view
- `git log` flags (`--graph`, `--all`, `--author`, `filename`) — reading the full history of a project; interviewers may show a branched log and ask to explain it; `--graph --all` makes the branch structure visible
- `git show <commit>` — displays the full diff of one specific commit; the fast way to answer "what exactly did this commit change?" without scrolling through `git log -p`; used constantly when explaining your own commit history in a technical interview
- `git blame` — shows who last modified each line of a file and in which commit; used to find context for unfamiliar code; interviewers ask "how do you find out when this line was added and by whom?"
- Conventional Commits format — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`, `perf:`; the standard in professional teams; interviewers ask "how do you write a commit message?" — they expect this format, not "fixed bug"
- Atomic commits — one logical change per commit; interviewers ask "what does atomic mean?" — one commit = one thing that can be reverted independently; the opposite is a commit that mixes five unrelated changes
- Good commit message — present tense, explains WHY not what, short; the history must be readable without the code; interviewers ask "show me a commit from your project and explain why you wrote it that way"

Rationale: These concepts form the coherent coverage group “Core workflow, Commit quality”.

## 02 — Branching and HEAD

Status: pending
Action: audit
English: notes/git/junior/en/05-branches.md
Spanish: notes/git/junior/es/05-branches.md
Depends on: 01

Coverage concepts:

- `HEAD` pointer — marks the currently checked-out commit, usually through the current branch name;
  in detached HEAD it points directly to a commit that may not be a branch tip
- `HEAD~1`, `HEAD~2` notation — "one commit before HEAD", "two commits before HEAD"; used in `git reset HEAD~1` and `git rebase -i HEAD~3`; interviewers show a reset or rebase command and ask "what does this do?"
- Detached HEAD — happens when you checkout a specific commit ID instead of a branch; new commits are not attached to any branch and can be lost; fix with `git checkout -b new-branch-name`
- `branch`, `checkout`, `switch` — creating and switching branches; `switch` is the modern alternative to `checkout` for branches (Git 2.23+); interviewers may ask which you prefer and why
- `git branch -d` vs `git branch -D` — `-d` is a safe delete (fails if the branch has unmerged changes); `-D` is a force delete; interviewers ask "what happens if you try to delete a branch that hasn't been merged?"
- Branch naming conventions — `feat/`, `fix/`, `technology/##-project-name`; tested in team process questions: "how do you organise branches in a team?"
- `merge` — joins branches; creates a merge commit when both branches have advanced since they split; the merge commit has two parents and preserves the full history
- Fast-forward merge vs three-way merge — fast-forward: pointer just moves forward (no divergence, no extra commit); three-way: both branches have new commits, so Git creates a merge commit with two parents; interviewers ask when each one happens
- `git cherry-pick` — applies a specific commit from another branch onto the current one; used to apply a hotfix to main without merging the whole feature branch; use sparingly — it duplicates commits and can confuse the history

Rationale: These concepts form the coherent coverage group “Branching and HEAD”.

## 03 — Rebase

Status: pending
Action: audit
English: notes/git/junior/en/06-merge-rebase.md
Spanish: notes/git/junior/es/06-merge-rebase.md
Depends on: 02

Coverage concepts:

- What `rebase` does — replays your commits on top of another branch as if you had started from there; the rebased commits get new IDs; result is a linear history with no merge commit
- `rebase` vs `merge` — rebase gives a cleaner, linear history; merge preserves exactly when branches diverged; teams pick one convention and stick to it; interviewers ask "what does your team use and why?"
- The golden rule of rebase — never rebase a branch that other people are working on; rebasing rewrites commit IDs — anyone who pulled those commits will have a broken history
- `git rebase -i` (interactive rebase) — opens an editor to squash, reword, reorder, or drop commits; the standard way to clean up a messy local history before opening a PR; only safe on commits not yet pushed
- Resolving a conflict during rebase — Git pauses on the first conflicting commit instead of stopping the whole operation; fix the file, `git add`, then `git rebase --continue` to move to the next commit, or `git rebase --abort` to cancel and return to the state before the rebase started; interviewers ask this to check you understand rebase replays commits one at a time, unlike a merge conflict which happens once
- `git merge --abort` vs `git rebase --abort` — both cancel the operation in progress and restore the pre-operation state; the names mirror each other but apply to different commands; interviewers ask "what do you do if a merge or rebase goes wrong halfway through?" expecting you to know the matching abort command exists for each

Rationale: These concepts form the coherent coverage group “Rebase”.

## 04 — Remote and collaboration

Status: pending
Action: audit
English: notes/git/junior/en/03-remote-github.md
Spanish: notes/git/junior/es/03-remote-github.md
Depends on: 03

Coverage concepts:

- `remote`, `origin` — `origin` is the default alias for the remote URL; every `push` and `pull` uses it; interviewers ask "what is origin?" — the answer is an alias for the remote URL, not a branch name
- `git push -u` (upstream tracking) — `-u` links your local branch to the remote branch; after setting it once, `git push` alone works; interviewers ask "what does the `-u` flag do?"
- Pull requests — a request to merge a branch with a description of what changed and why; the place for code review before changes reach main; the merge does not happen automatically
- PR description format — `## Changes` lists what changed; `## Why` explains the main decision; must make sense to someone who has not read the code; this is documentation that lives permanently with the commit history
- PR merge strategies — squash (all PR commits become one), merge commit (full PR history preserved), rebase merge (replays commits linearly, no merge commit); interviewers ask "what merge strategy does your team use and why?"
- Code review — checking that the code does what the PR says, handles edge cases, is readable, has no obvious security issues, and includes tests; even in solo projects, reading your own diff before merging catches bugs

Rationale: These concepts form the coherent coverage group “Remote and collaboration”.

## 05 — Merge conflicts

Status: pending
Action: audit
English: notes/git/junior/en/07-merge-conflicts.md
Spanish: notes/git/junior/es/07-merge-conflicts.md
Depends on: 04

Coverage concepts:

- What causes a conflict — two branches modify the same line of the same file; Git stops the merge and asks you to decide which version to keep; conflicts are not errors, they are Git asking for a human decision
- Conflict markers (`<<<<`, `====`, `>>>>`) — `<<<< HEAD` is your version; `>>>> branch-name` is the incoming version; `====` is the separator; you delete all three markers after choosing the final version
- `git merge --abort` — cancels an in-progress merge and returns to the state before you ran `git merge`; use when the conflicts are too complex to resolve right now
- Avoiding conflicts — pull from the target branch frequently; keep feature branches short-lived; communicate with teammates about which files each person is touching

Rationale: These concepts form the coherent coverage group “Merge conflicts”.

## 06 — Stash

Status: pending
Action: create
English: notes/git/junior/en/12-stash.md
Spanish: notes/git/junior/es/12-stash.md
Depends on: 05

Coverage concepts:

- `git stash`, `git stash pop` — saves uncommitted changes to a temporary stack so you can switch branches without committing unfinished work; `pop` restores and removes the stash from the list
- `git stash apply` vs `git stash pop` — `apply` restores the stash but keeps it in the list; `pop` restores and deletes it; interviewers ask the difference when you say you use stash regularly
- `git stash list` — shows all saved stashes with an index and name; important when you have multiple stashes and need to restore a specific one with `git stash pop stash@{1}`

Rationale: These concepts form the coherent coverage group “Stash”.

## 07 — Undoing changes

Status: pending
Action: audit
English: notes/git/junior/en/10-undoing-changes.md
Spanish: notes/git/junior/es/10-undoing-changes.md
Depends on: 06

Coverage concepts:

- `git restore` — discards changes in the working directory without touching history; `--staged` unstages a file; the safe everyday tool for "I changed this but I don't want to keep it"
- `git reset --soft` vs `--mixed` vs `--hard` — soft: undo commit, keep changes staged; mixed: undo commit, keep changes unstaged; hard: undo commit and discard changes permanently; `--hard` causes data loss
- The reset rule — only use `git reset` on commits that have NOT been pushed to GitHub; if the commit is already on the remote, use `git revert` instead; breaking this rule causes problems for everyone who pulled
- `git revert` — creates a new commit that undoes a previous one; the original commit stays visible in the history; safe on shared branches because it does not rewrite history
- `git reset` vs `git revert` — reset rewrites history (local only, before push); revert creates a new commit (safe on shared branches, after push); interviewers ask this pair specifically and consistently
- `git reflog` — records recent local ref movements and can recover commits after a reset; retention
  is configurable and unreachable entries commonly expire sooner than reachable ones, so it is a
  recovery opportunity rather than a 90-day guarantee

Rationale: These concepts form the coherent coverage group “Undoing changes”.

## 08 — .gitignore

Status: pending
Action: audit
English: notes/git/junior/en/04-gitignore.md
Spanish: notes/git/junior/es/04-gitignore.md
Depends on: 07

Coverage concepts:

- What it does — tells Git to never track specific files; files listed here never appear in `git status`, never get staged, and never get committed
- Common entries: `node_modules/`, `target/`, `.env`, `.angular/`, `*.class` — what each ignores and why it must not be committed; interviewers ask "why is `.env` in `.gitignore`?" (security — it contains API keys and secrets that must never be pushed)
- `git rm --cached` — stops tracking a file that was already committed by mistake; the file stays on disk but Git stops watching it; the correct command after you realise `.env` was committed before `.gitignore` was created
- Creating `.gitignore` before the first commit — if you add a file to `.gitignore` after it was already committed, Git keeps tracking it; you must use `git rm --cached` first to stop tracking it

Rationale: These concepts form the coherent coverage group “.gitignore”.

## Unassigned existing notes

- notes/git/junior/en/01-what-is-git.md — no junior coverage group is assigned to this legacy file.
- notes/git/junior/en/08-pull-requests.md — no junior coverage group is assigned to this legacy file.
- notes/git/junior/en/09-conventional-commits.md — no junior coverage group is assigned to this legacy file.
- notes/git/junior/en/11-useful-commands.md — no junior coverage group is assigned to this legacy file.
