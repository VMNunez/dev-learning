# Useful Commands

## Quick reference

| Command | What it does |
|---------|--------------|
| `git status` | Show the state of working directory and staging area |
| `git log --oneline` | Compact commit history — one line per commit |
| `git log --oneline --graph --all` | History as an ASCII tree, all branches |
| `git diff` | Changes not yet staged |
| `git diff --staged` | Changes staged for the next commit |
| `git branch` | List all local branches |
| `git branch -a` | List all branches (local + remote) |
| `git remote -v` | Show what URL origin points to |
| `git stash` | Save changes temporarily without committing |
| `git stash pop` | Recover stashed changes |
| `git stash list` | See all saved stashes |
| `git rm --cached filename` | Stop tracking a file (keeps it on disk) |
| `git push origin --delete branch` | Delete a remote branch |
| `git checkout -` | Switch back to the previous branch |

---

## git stash

Saves your uncommitted changes temporarily and resets the working directory to the last commit.

```bash
git stash                    # save everything
git stash save "wip: form"  # save with a name
git stash list              # see all stashes
git stash pop               # restore the last stash and remove it from the list
git stash apply             # restore without removing from the list
git stash drop              # delete the last stash without restoring
```

**When to use:** you are in the middle of a change and need to switch branches immediately but are not ready to commit. Stash the work, switch branches, do what you need, switch back, `git stash pop`.

---

## git log — useful flags

```bash
git log --oneline                    # compact, one line per commit
git log --oneline -5                 # last 5 commits only
git log --oneline --all              # all branches
git log --oneline --graph --all      # ASCII tree — visualise branch structure
git log --oneline --author="Victor"  # commits by a specific author
git log --oneline --since="1 week"   # commits from the last week
git log filename                     # commits that touched a specific file
```

---

## git blame

Shows who last modified each line of a file, and in which commit.

```bash
git blame filename
```

Useful when you find a line you do not understand and want to know when it was added and why — then you look at that commit message.

---

## git cherry-pick

Applies the changes from a specific commit onto the current branch, without merging the whole branch.

```bash
git cherry-pick a3f8c1d    # apply one commit from another branch
```

**When to use:** a bug was fixed on `feat/x` but you need that fix on `main` right now, before the whole feature is ready. Cherry-pick just that fix commit.

Use it sparingly — it duplicates commits and can make the history confusing if overused.

---

## git shortlog

Shows a summary of commits grouped by author — useful for seeing who contributed what.

```bash
git shortlog -sn    # count of commits per author, sorted by number
```
