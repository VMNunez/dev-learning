# Staging and Commits

## The three areas — in practice

```
Working directory  →  Staging area  →  Repository
   edit files          git add           git commit
   git restore         git restore       git reset
                       --staged
```

Changes flow left to right. Every command you use moves changes between these three areas.

---

## git status

Shows the current state of your three areas — what is modified, what is staged, and what is untracked.

```bash
git status
```

Run this constantly. Before every `git add`. Before every `git commit`. It tells you exactly what will happen next.

```
On branch feat/add-task
Changes to be committed:        ← staged (will go into next commit)
  modified:   src/app/app.ts

Changes not staged for commit:  ← modified but not staged
  modified:   src/app/app.html

Untracked files:                ← brand new file, Git does not know it yet
  src/app/new-component.ts
```

---

## git add

Moves changes from the working directory into the staging area.

```bash
git add filename.ts          # stage one specific file
git add src/app/             # stage everything in a folder
git add .                    # stage all changes in the current directory
git add -p                   # stage parts of a file interactively (patch mode)
```

`git add .` is common but be careful — it stages everything, including files you may not want to commit. Always run `git status` after to confirm.

---

## git commit

Takes everything in the staging area and saves it as a permanent snapshot in the repository.

```bash
git commit -m "feat: add employee form"
```

Each commit has:
- A unique ID (hash) — `a3f8c1d`
- The author and date
- The message you wrote
- A pointer to the previous commit

**A good commit message** explains what changed and why, not how. `"feat: add duplicate email check on submit"` is good. `"fix stuff"` is not useful.

---

## git log

Shows the commit history — every snapshot that has been saved.

```bash
git log                    # full history with author, date, message
git log --oneline          # compact — one line per commit
git log --oneline --graph  # adds an ASCII tree showing branches
git log --oneline -5       # show only the last 5 commits
git log --oneline --all    # show all branches, not just the current one
```

Example output of `git log --oneline`:
```
a3f8c1d feat: add duplicate email check
7b2e9f0 feat: add employee form
c1d4a2e feat: set up employee list page
```

---

## git diff

Shows the differences between areas.

```bash
git diff                   # working directory vs staging area (unstaged changes)
git diff --staged          # staging area vs last commit (what will go into next commit)
git diff main feat/add-task  # compare two branches
```

Use `git diff --staged` right before committing to do a final review of what you are about to save.
