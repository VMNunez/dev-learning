# Minimum Coverage — Git

Git concepts a junior or junior-mid developer must understand to work safely in an Angular and Spring Boot team, review changes, and recover from ordinary mistakes.

## Repository model and everyday inspection

- Git vs GitHub or GitLab — Git records distributed repository history; hosting platforms add remote storage, pull requests, permissions, and collaboration services
- Distributed repository model — each normal clone contains local history and can create commits without a network connection
- `git init` vs `git clone` — initialise a new local repository or copy an existing repository with its remote configuration and remote-tracking references ✅ 01-todo-list
- Working tree, index, and `HEAD` — distinguish current files, the staged next snapshot, and the currently checked-out commit ✅ 01-todo-list
- Snapshot and parent model — a commit identifies a staged project snapshot plus parent links rather than storing a simple chronological edit log
- Tracked, untracked, and ignored files — recognise whether Git already follows a path, has not added it, or excludes it through ignore rules
- Clean, unstaged, staged, and untracked states — read `git status` before deciding which inspection or mutation command is safe ✅ 01-todo-list
- `git diff` vs `git diff --staged` — inspect unstaged working-tree changes or the exact staged changes prepared for the next commit ✅ 01-todo-list
- Revision and branch comparison with `git diff` — compare two snapshots directly and use `base...feature` to diff the merge base against the feature tip
- `git add` and path scope — stage only intended files, directories, or pathspecs instead of accidentally including unrelated work ✅ 01-todo-list
- `git add -p` — select individual hunks to construct focused commits and exclude debug, formatting, or secret changes
- File deletion and rename tracking — stage removals and moves deliberately while recognising that `git mv` is a convenience and Git infers renames from content
- `git commit` — create a new snapshot from the index, not automatically from every modified working-tree file ✅ 01-todo-list
- `git log --oneline --graph --decorate --all` — read compact history, branch topology, and reference positions ✅ 01-todo-list
- `git log -- <path>` — trace the history that affected a specific file without treating unrelated commits as evidence
- `git show <commit>` — inspect one commit's metadata and patch to understand exactly what it introduced
- Revision selection — use commit hashes, branch names, tags, and `HEAD` to identify commits for inspection or operations
- Ancestry notation — read parent and first-parent-relative expressions such as `HEAD^` and `HEAD~2` without confusing them with branch names
- `git blame` with history inspection — use line attribution to find the introducing context, then inspect the relevant commit rather than assigning personal blame

## Commit discipline

- Atomic commits — keep one coherent change independently reviewable and revertible instead of mixing unrelated work ✅ 01-todo-list
- Selective staging before commit — inspect and stage the intended scope so generated files, secrets, and drive-by edits do not enter history ✅ 01-todo-list
- Meaningful commit messages — write concise imperative subjects and add decision context when the reason is not evident from the change ✅ 01-todo-list
- Conventional Commits — recognise `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, and related types when the repository adopts that convention ✅ 01-todo-list

## User and repository configuration

- Git configuration scopes — distinguish system, global, and local settings and use repository-specific overrides when appropriate
- Author vs committer identity — configure `user.name` and `user.email` deliberately and recognise that rebasing or cherry-picking can preserve the author while recording a different committer ✅ 01-todo-list
- Line-ending policy — recognise CRLF/LF noise and follow repository configuration such as `.gitattributes` instead of committing mass rewrites
- Executable-bit changes — recognise permission-only diffs and avoid accidental file-mode changes across operating systems
- Signed Git objects awareness — recognise verified commit or tag requirements without treating signing infrastructure or hosting branch protection as junior ownership

## Branches, `HEAD`, and integration

- Branch reference — understand a branch as a movable name for a commit rather than a copy of the project ✅ 01-todo-list
- `HEAD` and the current branch — know that `HEAD` normally refers through the checked-out branch and moves when that branch gains a commit ✅ 01-todo-list
- Detached `HEAD` — recognise checkout at a commit rather than a branch and create or switch to a branch before work becomes difficult to retain
- `git branch` operations — create, list, rename, and delete local branch references deliberately ✅ 01-todo-list
- `git switch` vs branch-oriented `git checkout` — change branches while recognising the newer focused command and the older multi-purpose command
- Correct branch base — update and verify the intended base before creating a feature branch so it does not begin from stale or unrelated history
- Safe branch deletion — use `git branch -d` for merged work and treat `-D` as a deliberate discard that requires prior verification
- Fast-forward vs three-way merge — distinguish moving a branch reference forward from creating a merge commit from divergent histories ✅ 01-todo-list
- Merge commit parentage — recognise that a true merge commit normally has two parents and preserves the integration point
- `git merge` vs `git rebase` — choose history-preserving integration or private-history replay according to repository policy and collaboration risk
- Rebase mechanics — understand that Git replays commits onto a new base, creates new commit identities, and can pause once per replayed commit
- Shared-history rebase rule — do not rebase commits other people may have based work on without explicit coordination
- Interactive rebase — recognise squash, reword, reorder, and drop as private-history cleanup operations before sharing
- Stateful-operation controls — use `git status` to identify an in-progress merge, rebase, cherry-pick, or revert before choosing the matching continue, skip, or abort action
- `git cherry-pick` — apply one known commit to the current branch for a targeted workflow while recognising the duplicated history and conflict risk
- Lightweight vs annotated tags — recognise a direct commit label versus a tag object with metadata and optional signature, while release-policy ownership remains above junior
- Team branching policy recognition — follow the repository's feature-branch, trunk-based, GitFlow, release, or hotfix convention without treating one workflow as universal ✅ 01-todo-list

## Remotes and synchronisation

- Remote and `origin` — understand a remote as a named repository URL and `origin` as a conventional default name, not a branch or the cloud itself ✅ 01-todo-list
- Clone vs hosting-platform fork — distinguish making a local working copy from creating a server-side repository copy with its own collaboration remotes
- Remote inspection and configuration — list remote names and URLs and add, rename, or change a remote deliberately when diagnosing repository connectivity
- Local branch vs remote-tracking reference — distinguish writable local `main` from the last fetched observation `origin/main`
- Ahead, behind, and diverged tracking states — read whether local, remote, or both histories contain new commits before choosing push or integration
- `git fetch` — update remote-tracking references without integrating them into the current branch
- `git pull` — fetch and then integrate according to the configured merge or rebase policy, so inspect divergence when automatic integration is risky ✅ 01-todo-list
- `git push` — send reachable local objects and request a remote reference update rather than uploading arbitrary working-tree files ✅ 01-todo-list
- Upstream tracking — connect a local branch to its usual remote branch so status, pull, and push can infer their counterpart ✅ 01-todo-list
- Non-fast-forward push rejection — fetch and integrate remote work instead of bypassing the safety check with a blind force push
- Force-push safety — recognise shared-history danger and use `--force-with-lease` only when rewriting an explicitly authorised private branch

## Pull requests and hosted review

- Feature branch and pull-request flow — push isolated work, open a review request, address feedback, validate updates, and merge under repository policy ✅ 01-todo-list
- Pull request vs Git — recognise pull or merge requests as hosting-platform review objects built around Git branches and commits ✅ 01-todo-list
- Pull-request merge strategies — distinguish merge commit, squash merge, and rebase merge by their effect on final history
- Required reviews and status checks — recognise when branch protection blocks a merge, inspect failed checks, and update the same pull-request branch before trying again
- Diff-based code review — verify intended behaviour, tests, edge cases, secrets, generated files, format churn, and unrelated scope before approving
- Review-update strategy — add focused follow-up commits or perform policy-approved private cleanup without rewriting shared history unexpectedly
- Remote branch deletion — distinguish deleting a branch on the remote from deleting its local counterpart
- Remote-tracking cleanup — prune stale remote-tracking references after confirming their remote branches no longer exist
- Authentication failures vs history problems — separate HTTPS token or credential-helper and SSH-key permissions from merge, divergence, and push-history errors

## Conflict resolution

- Conflict causes — recognise incompatible edits such as same-region changes, modify/delete cases, renames, or competing file additions that Git cannot combine safely
- Conflict markers — read `<<<<<<<`, `=======`, and `>>>>>>>` as competing sides while using surrounding intent rather than choosing markers mechanically
- Conflict-resolution lifecycle — edit the correct result, remove markers, stage resolved paths, continue or commit the operation, and run relevant validation afterward
- Merge vs rebase conflict context — account for the operation when interpreting current and incoming sides because replay can invert an intuitive `ours`/`theirs` assumption
- Abort semantics — use the operation-specific abort command to return as closely as possible to the pre-operation state when resolution should not continue
- Conflict prevention — keep branches short-lived, integrate the target regularly, coordinate overlapping work, and review the diff before sharing

## Undo, recovery, and investigation

- `git restore` vs legacy path checkout or reset — use the focused command to restore working-tree content or unstage index changes while recognising older `git checkout -- <path>` and `git reset <path>` instructions
- Path restoration from a selected revision — use `git restore --source=<revision> -- <path>` to recover one path from a known snapshot without moving the branch or changing unrelated work
- `git reset --soft`, `--mixed`, and `--hard` — move the current branch when `HEAD` is attached, or `HEAD` itself when detached, while retaining changes staged, retaining them unstaged, or discarding tracked working-tree and index changes
- `git reset` vs `git revert` — rewrite a local reference or create an additive inverse commit, preferring revert for published shared history
- `git commit --amend` — replace the latest local commit's content or message and recognise that the commit identity changes
- `git reflog` recovery — locate recent local reference movements after reset, rebase, or branch deletion while treating retention as a recovery window, not durable backup
- `git bisect` basics — mark known good and bad points so binary search can isolate the first commit that introduced a reproducible regression
- `git reset --hard` vs `git clean` — distinguish discarding tracked index and working-tree changes from deleting untracked paths
- `git clean` preview and scope — use dry-run before selecting untracked directories or ignored paths for irreversible deletion
- Destructive-command risk — inspect scope and recoverability before `reset --hard`, `clean`, forced deletion, or history rewriting

## Temporary work

- `git stash` — save selected uncommitted state for a short context switch rather than use the stash as permanent storage
- `git stash list` and `git stash show` — identify saved entries and inspect their contents before restoration
- `git stash apply` vs `git stash pop` — restore while retaining the stash entry or restore and remove it only after a successful application
- Stashing untracked files — recognise that ordinary stash behaviour may omit untracked paths unless they are included deliberately
- Stash conflicts and cleanup — resolve application conflicts like other working-tree conflicts and drop entries only after confirming the work is retained

## Ignore and history boundaries

- `.gitignore` scope — prevent matching untracked paths from being offered for addition without assuming it removes files already tracked ✅ 02-weather-app
- Ignore patterns and negation — apply directory, wildcard, anchored, and `!` exception rules carefully because parent-directory exclusion affects reinclusion
- Generated-path policy — ignore build output, dependencies, and local IDE state according to the repository's actual toolchain ✅ 01-todo-list
- Local secret-file exclusion — ignore environment and credential files so they are not accidentally added, while recognising ignore rules are not a secret store ✅ 02-weather-app
- Already tracked ignored file — remove the path from the index when appropriate because adding a later ignore rule does not stop tracking it
- Committed-history boundary — deleting or ignoring the current file does not erase sensitive content from existing commits
