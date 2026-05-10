# Undoing Changes

## The HEAD notation

`HEAD` is the current commit. `HEAD~1` means "one commit before HEAD". `HEAD~2` means two commits before, and so on.

```
A → B → C → D   (HEAD is D)

HEAD     = D
HEAD~1   = C
HEAD~2   = B
```

---

## Decision table

| Situation | Command | Safe? |
|-----------|---------|-------|
| Discard changes to a file (not staged) | `git restore filename` | ✅ |
| Unstage a file (keep the changes) | `git restore --staged filename` | ✅ |
| Undo the last commit, keep changes staged | `git reset --soft HEAD~1` | ✅ |
| Undo the last commit, keep changes unstaged | `git reset HEAD~1` | ✅ |
| Undo the last commit and discard changes | `git reset --hard HEAD~1` | ⚠️ data loss |
| Undo a commit that is already on GitHub | `git revert <commit-id>` | ✅ |

---

## git restore

Discards changes in the working directory or the staging area. Does not touch the commit history.

```bash
git restore filename             # discard working directory changes for one file
git restore .                    # discard all working directory changes
git restore --staged filename    # unstage a file (move from staging back to working directory)
```

`git restore` is the safe, everyday tool for "I changed this file but I do not want those changes".

---

## git reset

Moves HEAD backward to a previous commit.

```bash
git reset --soft HEAD~1    # move HEAD back, keep changes staged
git reset HEAD~1           # move HEAD back, keep changes in working directory (unstaged)
git reset --hard HEAD~1    # move HEAD back, discard all changes ⚠️
```

| Flag | Staging area | Working directory |
|------|-------------|-------------------|
| `--soft` | Keeps staged | Keeps files |
| (none / `--mixed`) | Clears staging | Keeps files |
| `--hard` | Clears staging | Discards files ⚠️ |

**Rule:** only use `git reset` on commits that have NOT been pushed to GitHub yet. If the commit is already on the remote, use `git revert` instead.

---

## git revert

Creates a **new commit** that undoes the changes of a previous commit. The original commit stays in the history — nothing is rewritten.

```bash
git revert a3f8c1d          # create a new commit that reverses commit a3f8c1d
git revert HEAD             # revert the last commit
```

Use `git revert` when:
- The commit is already on GitHub (shared with others)
- You want the history to show that something was undone (transparent)

```
Before: A → B → C
After:  A → B → C → C'    (C' is the revert commit — it undoes C)
```

---

## git reset vs git revert

| | git reset | git revert |
|---|-----------|------------|
| Rewrites history? | Yes | No |
| Safe on pushed commits? | No | Yes |
| New commit created? | No | Yes |
| Use when | Local only, not pushed | Already on GitHub |
