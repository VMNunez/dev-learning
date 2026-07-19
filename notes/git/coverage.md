# Minimum Coverage — Git

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from the projects. Focus on daily workflow, team collaboration, and the concepts that come up in code reviews and interviews.

## Core workflow

- `init`, `clone` — `init` starts a repo from scratch locally; `clone` downloads an existing remote repo; interviewers ask: "how would you start working on this project on a new machine?" (answer: clone, not init)
- The three areas — working directory, staging area, repository; interviewers ask "what is the staging area for?" — it exists so you can commit part of your changes, not everything at once
- `add`, `commit` — staging specific files and saving a snapshot; a common question is "why do you stage before committing?" and "what is the difference between `git add .` and `git add filename`?"
- `git add -p` (patch staging) — stages selected hunks within one file, so a working tree where two changes got mixed together still produces two atomic commits; the standard answer to "you wrote two unrelated changes in the same file, how do you commit them separately?"
- `push`, `pull`, `fetch` — `push` sends commits to the remote; `pull` downloads and merges; `fetch` downloads without merging; interviewers ask the pull vs fetch difference every time
- `status`, `log --oneline`, `diff --staged` — essential inspection commands; `diff --staged` shows what will go into the next commit (not what is just modified); `log --oneline` is the standard compact view
- `git log` flags (`--graph`, `--all`, `--author`, `filename`) — reading the full history of a project; interviewers may show a branched log and ask to explain it; `--graph --all` makes the branch structure visible
- `git show <commit>` — displays the full diff of one specific commit; the fast way to answer "what exactly did this commit change?" without scrolling through `git log -p`; used constantly when explaining your own commit history in a technical interview
- `user.email` set globally vs per repository — the cause of commits landing in a client's repo under the wrong identity, which matters at a consultancy where your commits are attributed across several accounts; `git log --format='%an %ae'` is how you notice

## The Git model — commits, branches, and HEAD

- A commit is an immutable snapshot with a parent pointer — it stores the whole tree state plus a link back to the commit it came from, and history is that chain of backward links; interviewers ask you to draw the history after three commits and expect arrows pointing at the parent, not forward
- The commit ID is a hash of its content — the SHA is computed over the snapshot, message, author *and parent ID*, which is the single fact that explains why rebase, amend and cherry-pick all produce new IDs
- Commits are never modified — every apparent edit writes a new commit object and moves a pointer to it; interviewers ask "can you change an old commit message?" and expect "you replace the commit, you do not edit it"
- Rewriting one commit changes every commit after it — because a commit's ID includes its parent's ID, the change cascades downstream; interviewers ask "you reworded commit 5 of 10, how many IDs changed?"
- A branch is a movable pointer, not a container of files — it is a reference holding a single commit ID, which is why creating a branch is instant and costs nothing, and why committing simply advances that pointer
- `HEAD` pointer — marks your current position in the history; always points to the tip of the current branch; you see it in `git log` and error messages — understanding it is required to read them correctly
- `HEAD` names a branch, and the branch names a commit — that indirection is what detached HEAD removes; interviewers use it to check you can explain why commits made while detached belong to no branch
- `HEAD~1`, `HEAD~2` notation — "one commit before HEAD", "two commits before HEAD"; used in `git reset HEAD~1` and `git rebase -i HEAD~3`; interviewers show a reset or rebase command and ask "what does this do?"
- `HEAD^` vs `HEAD~` — `^n` selects the n-th *parent* and is only meaningful on a merge commit, while `~n` walks n commits back along the first parent; interviewers write `HEAD^2` and ask what it selects
- Ancestor and descendant — B descends from A if you can walk parent links from B back to A; the definition that makes fast-forward precise, since it is possible only when the target is a descendant of the current tip
- Detached HEAD — happens when you checkout a specific commit ID instead of a branch; new commits are not attached to any branch and can be lost; fix with `git checkout -b new-branch-name`
- A commit can be on many branches at once — "being on a branch" means reachable by walking parents from that branch's tip, not owned by it; explains why a merged feature's commits all appear in `git log main`

## Branching and merging

- `branch`, `checkout`, `switch` — creating and switching branches; `switch` is the modern alternative to `checkout` for branches (Git 2.23+); interviewers may ask which you prefer and why
- `git branch -d` vs `git branch -D` — `-d` is a safe delete (fails if the branch has unmerged changes); `-D` is a force delete; interviewers ask "what happens if you try to delete a branch that hasn't been merged?"
- Deleting a branch does not delete its commits — it removes a pointer, and the commits survive unreferenced until garbage collection; interviewers ask "did I lose my work when I deleted that branch?"
- Branch naming conventions — `feat/`, `fix/`, `technology/##-project-name`; tested in team process questions: "how do you organise branches in a team?"
- A ticket ID in the branch name — `feat/PROJ-123-add-login` links the branch to the board item, which is how a consultancy keeps traceability from a client requirement down to a commit; interviewers ask why the convention exists beyond tidiness
- `merge` — joins branches; creates a merge commit when both branches have advanced since they split; the merge commit has two parents and preserves the full history
- Fast-forward merge vs three-way merge — fast-forward: pointer just moves forward (no divergence, no extra commit); three-way: both branches have new commits, so Git creates a merge commit with two parents; interviewers ask when each one happens
- The merge base (common ancestor) — the most recent commit reachable from both branches; a three-way merge compares each side against it to decide what genuinely changed and what is a conflict; the concept underneath "diverged" and "unrelated histories" alike
- `--no-ff` merge — forces a merge commit even where a fast-forward was possible, so a whole feature stays visible as one unit in the history; interviewers ask why a team would require it
- `git cherry-pick` — applies a specific commit from another branch onto the current one; used to apply a hotfix to main without merging the whole feature branch; use sparingly — it duplicates commits and can confuse the history
- When `cherry-pick` is legitimate — porting a single fix between release lines; anywhere else it is a smell signalling that the branching model is not doing its job

## Rebase

- What `rebase` does — replays your commits on top of another branch as if you had started from there; the rebased commits get new IDs; result is a linear history with no merge commit
- `rebase` vs `merge` — rebase gives a cleaner, linear history; merge preserves exactly when branches diverged; teams pick one convention and stick to it; interviewers ask "what does your team use and why?"
- The golden rule of rebase — never rebase a branch that other people are working on; rebasing rewrites commit IDs — anyone who pulled those commits will have a broken history
- `git rebase -i` (interactive rebase) — opens an editor to squash, reword, reorder, or drop commits; the standard way to clean up a messy local history before opening a PR; only safe on commits not yet pushed
- Resolving a conflict during rebase — Git pauses on the first conflicting commit instead of stopping the whole operation; fix the file, `git add`, then `git rebase --continue` to move to the next commit, or `git rebase --abort` to cancel and return to the state before the rebase started; interviewers ask this to check you understand rebase replays commits one at a time, unlike a merge conflict which happens once
- Noticing a bad rebase one command too late — once the rebase has finished, `--abort` is no longer available and the way back is `git reset --hard ORIG_HEAD`; interviewers ask what you do when you realise the mistake after the operation completed
- `git rebase --skip` — drops the commit currently being replayed, which is what you need when a conflict resolution leaves that commit empty; the third exit juniors never name beside continue and abort
- Which side is "ours" during a rebase — inverted compared with a merge, because the upstream branch is checked out and your commits are replayed on top of it; interviewers use it to test whether you know what rebase mechanically does
- Refreshing a stale branch: merge `main` in vs rebase onto `main` — merging is safe while a PR is open but leaves noise commits, rebasing keeps the branch clean but rewrites IDs; interviewers ask which you do and why the answer changes once review has started
- Rebasing a branch with an open PR — rewriting the IDs detaches existing review comments from their commits and forces a re-read; the real cost behind an "always rebase" convention
- `git merge --abort` vs `git rebase --abort` — both cancel the operation in progress and restore the pre-operation state; the names mirror each other but apply to different commands; interviewers ask "what do you do if a merge or rebase goes wrong halfway through?" expecting you to know the matching abort command exists for each

## Merge conflicts

- What causes a conflict — two branches modify the same line of the same file; Git stops the merge and asks you to decide which version to keep; conflicts are not errors, they are Git asking for a human decision
- Conflict markers (`<<<<`, `====`, `>>>>`) — `<<<< HEAD` is your version; `>>>> branch-name` is the incoming version; `====` is the separator; you delete all three markers after choosing the final version
- Git treats a conflict as resolved the moment the path is staged — it never checks that you removed the markers, which is why `<<<<<<<` reaches a codebase often enough to be a standard review catch
- `git checkout --ours` / `--theirs` — takes one entire side of a conflicted file; the shortcut that silently discards everything the other side did, and the reason reviewers distrust a merge resolved with it
- A wrongly resolved conflict still compiles — keeping both sides or dropping the incoming change produces valid code with duplicated or missing logic; interviewers ask how you know your resolution was actually correct
- Semantic conflict — both branches merge cleanly and the result is still wrong, because one side renamed a method or changed a contract the other side relies on; the proof that "no conflict" never means "correct merge"
- Resolving a conflict on someone else's branch — the resolution is committed as your work in the merge commit, so `git blame` attributes the reconciled lines to whoever resolved them rather than to either original author; interviewers ask who shows up in blame after a conflicted merge
- `git merge --abort` — cancels an in-progress merge and returns to the state before you ran `git merge`; use when the conflicts are too complex to resolve right now
- Previewing what a merge will bring in — `git log --oneline HEAD..<branch>` lists the commits that would arrive before you run the merge; the antidote to "the merge pulled in forty commits I did not expect"
- Avoiding conflicts — pull from the target branch frequently; keep feature branches short-lived; communicate with teammates about which files each person is touching

## Undoing changes

- `git restore` — discards changes in the working directory without touching history; `--staged` unstages a file; the safe everyday tool for "I changed this but I don't want to keep it"
- `git reset --soft` vs `--mixed` vs `--hard` — soft: undo commit, keep changes staged; mixed: undo commit, keep changes unstaged; hard: undo commit and discard changes permanently; `--hard` causes data loss
- `reset` in graph terms — it moves the branch pointer to another commit and leaves the abandoned commits untouched but unreferenced; the difference between destroying history and losing the path back to it
- The reset rule — only use `git reset` on commits that have NOT been pushed to GitHub; if the commit is already on the remote, use `git revert` instead; breaking this rule causes problems for everyone who pulled
- `git revert` — creates a new commit that undoes a previous one; the original commit stays visible in the history; safe on shared branches because it does not rewrite history
- `git reset` vs `git revert` — reset rewrites history (local only, before push); revert creates a new commit (safe on shared branches, after push); interviewers ask this pair specifically and consistently
- `git revert -m 1` on a merge commit — a merge has two parents, so Git cannot infer which side to keep; `-m 1` means "keep the branch I merged into"; the question that follows "you merged a broken PR into main, now what?"
- The reverted-merge trap — after reverting a merge, merging the same branch again brings nothing back, because those commits are still ancestors of HEAD; you have to revert the revert
- `ORIG_HEAD` — the position HEAD held before a merge, rebase or reset; `git reset --hard ORIG_HEAD` is the one-step undo of a merge that pulled in the wrong thing
- `git reflog` — records every position HEAD has been at, including after `git reset --hard`; keeps data for 90 days; the recovery tool when you think you lost commits with a hard reset

## Remote and collaboration

- `remote`, `origin` — `origin` is the default alias for the remote URL; every `push` and `pull` uses it; interviewers ask "what is origin?" — the answer is an alias for the remote URL, not a branch name
- `origin/main` is a remote-tracking pointer — a *local*, read-only reference recording where the remote's branch was at your last fetch; interviewers ask "what is `origin/main`?" and reject "the branch on GitHub"
- Remote-tracking refs are only as fresh as your last fetch — nothing updates them in the background, so `git status` can confidently report "up to date" against a week-old snapshot; the reason `fetch` is the first diagnostic step
- What `fetch` changes — it downloads new objects and moves your remote-tracking pointers, never touching your branch or working directory; that is precisely why it is the safe half of `pull`
- `git pull` = `fetch` + `merge` by default — the reason a merge commit appears on a junior's feature branch without them ever typing `git merge`; interviewers ask where that "Merge branch 'main' of…" commit came from
- `git pull --rebase` (and the `pull.rebase` config) — replays your local commits on top of the fetched ones instead of merging, which is the standard team convention and the fix for a history full of sync-merge noise
- `git push -u` (upstream tracking) — `-u` links your local branch to the remote branch; after setting it once, `git push` alone works; interviewers ask "what does the `-u` flag do?"
- `git fetch --prune` — deletes remote-tracking refs for branches that no longer exist on the server; explains why `git branch -r` keeps listing branches everyone else deleted months ago
- Starting from a colleague's remote branch — `git switch --track origin/feature` creates a local branch tracking theirs; asked when they check whether you can join a feature already in flight

## Pull requests and code review

- Pull requests — a request to merge a branch with a description of what changed and why; the place for code review before changes reach main; the merge does not happen automatically
- PR description format — `## Changes` lists what changed; `## Why` explains the main decision; must make sense to someone who has not read the code; this is documentation that lives permanently with the commit history
- PR merge strategies — squash (all PR commits become one), merge commit (full PR history preserved), rebase merge (replays commits linearly, no merge commit); interviewers ask "what merge strategy does your team use and why?"
- What squashing costs — the PR collapses into one revertible commit, but the reasoning trail disappears and `git blame` attributes every line of the feature to a single commit and author; the tradeoff behind choosing a strategy
- Code review — checking that the code does what the PR says, handles edge cases, is readable, has no obvious security issues, and includes tests; even in solo projects, reading your own diff before merging catches bugs
- PR size decides whether review happens at all — a small diff gets read, a two-thousand-line diff gets approved unread, so review quality collapses with size; interviewers ask what you do with a huge PR and expect "split it", not "review it anyway"
- Self-review before requesting review — reading your own `git diff main...HEAD` first strips debug statements, commented-out blocks and stray files; interviewers probe this when a junior's PR contains a leftover `console.log`
- Review comment vs blocking objection — a suggestion can be discussed or declined while a blocking objection must be resolved before the merge button works; the concept is who owns the decision, and interviewers ask how you respond to feedback you disagree with
- A PR that silently contains another branch's commits — caused by branching off a feature branch instead of `main`; you spot it because the diff shows files you never touched, and you fix it by rebasing onto the right base
- Draft pull request — opens the PR for visibility while keeping the merge blocked, which is how work in progress becomes reviewable without becoming mergeable

## Commit quality

- Conventional Commits format — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`, `perf:`; the standard in professional teams; interviewers ask "how do you write a commit message?" — they expect this format, not "fixed bug"
- Conventional Commits as machine input — the prefix is what changelog and version-bump tooling parses, which is the answer to "why this exact format and not free text?"
- Atomic commits — one logical change per commit; interviewers ask "what does atomic mean?" — one commit = one thing that can be reverted independently; the opposite is a commit that mixes five unrelated changes
- Good commit message — present tense, explains WHY not what, short; the history must be readable without the code; interviewers ask "show me a commit from your project and explain why you wrote it that way"
- Subject line vs body — the short subject says what changed, and the body after a blank line carries the why and the alternatives rejected; interviewers ask where the reasoning goes when a junior puts everything in a single `-m`
- Spotting a mixed-concern commit from its file list — a commit touching a controller, a `.gitignore` and a stylesheet is almost never one logical change, and the file list gives it away faster than the message does
- `fixup!` and "fix typo" commits — commits that only patch an earlier commit on the same branch should be squashed before review; interviewers ask what you do with a PR whose eleven commits include six saying "fix"
- Why granular commits still matter under a squash convention — commits are written for the reviewer, not only for the permanent history, and they are what makes a regression traceable to one small change later
- A ticket ID in the commit message — the string the board matches on to link the commit to its story and move the card; the second half of the traceability convention interviewers probe at consultancies

## `.gitignore` and files that must never be committed

- What it does — tells Git to never track specific files; files listed here never appear in `git status`, never get staged, and never get committed
- Common entries: `node_modules/`, `target/`, `.env`, `.angular/`, `*.class` — what each ignores and why it must not be committed; interviewers ask "why is `.env` in `.gitignore`?" (security — it contains API keys and secrets that must never be pushed)
- Commit inputs, ignore outputs — `package-lock.json` and `pom.xml` are tracked so every machine resolves identical dependency versions, while `dist/` and `target/` are generated and excluded; juniors regularly get this rule backwards
- Build artefacts and IDE folders in a diff — `target/`, `dist/`, `node_modules/`, `.idea/`, `.vscode/` produce enormous, permanently conflicting diffs; spotting them in a PR file list is a standard reviewer catch
- Project `.gitignore` vs a global gitignore — project build output belongs in the committed file that the whole team shares, while editor and OS noise (`.idea/`, `.DS_Store`) belongs in your personal global ignore rather than in everyone's repo
- `git rm --cached` — stops tracking a file that was already committed by mistake; the file stays on disk but Git stops watching it; the correct command after you realise `.env` was committed before `.gitignore` was created
- Creating `.gitignore` before the first commit — if you add a file to `.gitignore` after it was already committed, Git keeps tracking it; you must use `git rm --cached` first to stop tracking it
- Purging a file from the entire history — removing a committed secret for real means rewriting every commit that contains it (`git filter-repo`, BFG) and forcing every collaborator to re-clone; a junior is expected to know it is possible, disruptive, and never the first response

## Reading Git's output when something fails

- `git status` as the primary diagnostic — its output names the state the repo is in (merging, rebasing, detached, diverged) and prints the commands out of it; interviewers describe a broken repo and listen for whether you read the tool before reaching for a memorised command
- `! [rejected] ... (non-fast-forward)` on push — the remote branch holds commits yours does not contain, so moving its pointer to yours would drop them; the most common junior push failure, and the moment interviewers check you integrate rather than force
- "Your branch and 'origin/x' have diverged, and have N and M different commits each" — both histories advanced past the shared ancestor; interviewers ask for the three legal exits (merge, rebase, or reset to the remote) and what each does to your N commits
- `error: Your local changes to <file> would be overwritten by merge` — Git aborts before touching anything because the operation would destroy uncommitted work; the three safe exits are commit, stash, or discard
- `You have unmerged paths` — the repo is mid-merge with conflicted files in the index, and nothing else can be committed until every conflicted path is staged
- `fatal: refusing to merge unrelated histories` — the two branches share no common ancestor, so there is no merge base to compare against; typically a local `init` repo pushed at a remote that was created with its own README
- `fatal: The current branch has no upstream branch` — a local branch with no tracking ref, which is why `git status` cannot report ahead or behind until `push -u` creates it
- `Everything up-to-date` when you expected commits to go — you never committed, or you are on a different branch than you think; a pressure question that exposes a fuzzy grasp of branch versus working tree

## Recovering from a bad state

- Commit reachability — a commit survives as long as some ref (branch, tag, HEAD, or the reflog) can reach it; nothing is deleted by `reset`, only unreferenced, which is the mechanism behind every reflog recovery answer
- Garbage collection and the reflog expiry window — an unreachable commit is pruned once its reflog entry expires (90 days by default), which is why "the reflog will save you" carries a deadline rather than a guarantee
- What the reflog cannot recover — work that was never committed, since unstaged edits killed by `restore` or a `reset --hard` on a dirty tree never became objects at all; interviewers use it to separate real understanding from "reflog fixes everything"
- Commits made in detached HEAD are unreferenced, not lost — you find them in `git reflog` and rescue them with `git branch <name> <sha>`; interviewers use this to test the pointer model, because the instinctive junior belief is that the work is gone
- Restoring a deleted branch — `git reflog` gives you the old tip's SHA and `git branch <name> <sha>` re-creates the pointer at it; interviewers want the two concrete commands, not "the commits are still there somewhere"
- A commit made on the wrong branch — point the correct branch at the current commit, then reset the wrong branch back; interviewers ask it because the naive answer (copy the files somewhere) reveals no model of branches as pointers
- Commits already pushed to the wrong branch — reset is no longer available because the branch is shared, so the fix becomes a revert on the wrong branch plus a cherry-pick onto the right one
- `git stash pop` on a conflict — the changes are applied with markers and the stash entry is kept, so nothing is lost; interviewers ask whether a failed pop deletes the stash
- Recovering a dropped stash — stashes are commits too, so a dropped or popped one stays reachable through the stash reflog until garbage collection

## History rewriting and its blast radius

- `git commit --amend` — replaces the last commit with a new object carrying a new SHA; safe only before pushing, and the reason the next push is rejected after amending something already on the remote
- `git push --force` vs `--force-with-lease` — plain force moves the remote pointer regardless, erasing commits a colleague pushed since your last fetch; `--force-with-lease` refuses if the remote moved, which is why it is the one teams allow
- When a force-push is legitimate — only on a branch nobody else builds on, such as your own PR branch after an interactive rebase; never on `main` or any shared branch
- Recovering a colleague's commits erased by a force-push — the machine that had them still holds the old tip in its reflog, so the branch can be re-pointed and pushed back; the follow-up to "have you ever broken a repo?"
- Wrong author identity on a commit — the name and email are baked into the commit object, so correcting them rewrites the commit and changes its ID; `git log --format='%an %ae'` is how you notice
- What every collaborator must do after a shared branch is rewritten — their local branch still points at the old tip, so a plain `pull` merges the discarded commits straight back in; the fix is `git reset --hard origin/<branch>`, and interviewers ask why "just pull" makes the situation worse

## Branch protection and what reaches `main`

- Branch protection rules — repository settings that block direct pushes, force-pushes and deletion on `main`; interviewers ask what actually stops someone pushing straight to main, and the answer is a server-side rule, not team goodwill
- Why `main` must always be deployable — it is the branch a pipeline or a client deploys from, so anything half-finished on it blocks the whole team; the reason work in progress lives on branches at all
- Required pull request review — a protection setting that keeps the merge button disabled until the approvals exist; interviewers ask what enforces code review and expect "the repository, not the process document"
- Required status checks — the build and tests must pass before merging is possible, which is the mechanism that turns "tests pass" from a suggestion into a gate
- "Branch is out of date with base" — a protection option demanding your branch include the latest `main` before merging, which is why you refresh a branch even when nothing conflicts
- Force-push protection — protected branches reject a rewrite outright, which is what makes the golden rule of rebase enforceable rather than merely agreed
- `CODEOWNERS` — a file mapping paths to the people whose review is mandatory for changes there; also how you discover who owns an area of an unfamiliar codebase
- Delete branch on merge — merged branches are removed automatically so the remote reflects live work only; interviewers probe how a shared repo avoids accumulating dozens of dead branches

## Branching models and team conventions

- Git Flow — `main` plus `develop`, `feature/`, `release/` and `hotfix/` branches; the model most Spanish consultancies still run in legacy projects, so interviewers ask what `develop` is for and why newer teams dropped it
- GitHub Flow — one long-lived `main` plus short-lived feature branches merged through pull requests; the model behind Victor's own repositories, and he must be able to name it as the one he uses
- Trunk-based development — everyone integrates small changes into `main` many times a day behind very short-lived branches and feature flags; interviewers expect a named model, not "we make branches"
- Choosing a model by release cadence — continuous deployment favours trunk-based or GitHub Flow while scheduled versioned releases justify Git Flow's overhead; interviewers probe whether you picked a model for a reason or by habit
- Branch per feature vs branch per developer — per-feature keeps the branch's scope reviewable and its revert atomic, while per-developer mixes unrelated work into one PR
- Short-lived branches — the longer a branch lives the further it diverges and the more expensive the eventual conflicts, which is the concrete reason behind "integrate often" rather than a slogan
- What a branching model costs as the team grows — more parallel long-lived branches means far more conflict surface and integration debt; asked as "what would you change if the team went from five to fifty?"
- The hotfix path to production — an urgent fix branches from the released state rather than the feature line, and is merged back into both `main` and the development line so the next release does not silently drop it

## Releases and tags

- `git tag` — a permanent name pinned to one commit, marking exactly what was released; the answer to "how does the team know which commit is in production right now?"
- Lightweight vs annotated tags — an annotated tag carries author, date and message and is what release tooling expects, while a lightweight one is just a name; the confusable pair for tags
- Unlike a branch, a tag does not move — both are pointers to a commit, but a tag is meant to stay fixed while a branch advances with every commit
- `git log <tag>..<tag>` — lists every commit between two releases, which is how release notes and "what shipped this sprint" are produced from the repository itself
- Release branch vs a tag on `main` — a tag suffices while only one version is live, but a release branch becomes necessary once you must patch an old version while `main` has moved on
- `git describe` — names the current commit relative to the nearest tag (`v1.3.0-14-gabc1234`), telling you how far a build has drifted from a release

## Reading a history you did not write

- `git log --follow <file>` — keeps tracing a file across renames, which plain `git log <file>` stops at; Git stores no rename, it infers one from content similarity, and interviewers probe this the moment you claim you can read a legacy repo
- `git log -S "text"` (the pickaxe) — finds the commits where a string appeared or disappeared; the way to locate when a constant or config key was introduced when it no longer exists in HEAD
- `git log -S` vs `-G` — `-S` reports commits that changed the number of occurrences, `-G` matches any diff line touching the pattern; a confusable pair that shows whether you actually search history or just grep the working tree
- `git log -L :function:file` — shows the evolution of a single function rather than the whole file; the answer to reviewing one method's history inside a two-thousand-line class
- `git log --no-merges` and `--merges` — separates real work from integration commits, since the default log in a merge-heavy repo is unreadable
- `git log --first-parent` — follows only the mainline so each merged PR appears as a single entry; the concept that lets you answer "what landed on main last sprint"
- `git blame` — shows who last modified each line of a file and in which commit; used to find context for unfamiliar code; interviewers ask "how do you find out when this line was added and by whom?"
- `git blame -w` — ignores whitespace-only changes, so a re-indent or a bracket move stops rewriting the blame of every line it touched
- `git blame --ignore-rev <sha>` (and `blame.ignoreRevsFile`) — skips a known reformatting commit so blame reports the last meaningful author instead of whoever ran the formatter; the follow-up interviewers add straight after the basic blame question
- `git show` on a merge commit prints no diff by default — a merge is compared against two parents at once, so Git needs to be asked for a combined diff; the gotcha that reveals whether you understand parents
- `git branch --contains <commit>` — tells you which branches already include a given commit, which is exactly how you verify that a hotfix reached production

## Comparing points in history

- Two-dot `A..B` — everything reachable from B but not from A, which is what B added since they diverged
- Three-dot `A...B` in `git diff` — compares against the merge base rather than against A's current tip, so it shows only your branch's own changes; the exact confusion behind "why does my PR show files I never touched?"
- `git diff main..feature` (two dots) on a stale branch — it also reports `main`'s newer commits, inverted, which is why the two-dot diff of a branch is almost never the thing you meant to review
- `git diff <tag>..<tag>` — what a release actually contained; the standard answer when a client asks what went out on Friday
- `git log -p <file>` vs `git show <commit>` — the full patch history of one file versus the complete diff of one commit; interviewers ask which you reach for when blame points at a huge refactor
- Reading `git log --graph --all` — telling which vertical line is which branch, where a branch forked and where it merged back; interviewers put a graph on screen and ask you to narrate it

## Stash

- `git stash`, `git stash pop` — saves uncommitted changes to a temporary stack so you can switch branches without committing unfinished work; `pop` restores and removes the stash from the list
- `git stash apply` vs `git stash pop` — `apply` restores the stash but keeps it in the list; `pop` restores and deletes it; interviewers ask the difference when you say you use stash regularly
- `git stash list` — shows all saved stashes with an index and name; important when you have multiple stashes and need to restore a specific one with `git stash pop stash@{1}`
- `git stash` skips untracked files by default — the "my new file did not come back" case, fixed with `-u`; an apparent data loss that is really a misunderstanding of what stash captures
