# Branches

## What is a branch?

A branch is an independent line of development. Changes on one branch do not affect other branches until you explicitly merge them.

Under the hood, a branch is just a pointer to a commit. Creating a branch is instant — Git just creates a new pointer, it does not copy any files.

---

## HEAD

`HEAD` is a pointer to the commit you are currently on — usually the tip of the current branch. When you switch branches, `HEAD` moves. When you make a new commit, `HEAD` moves forward.

```
main:         A → B → C          ← HEAD points here when on main
feat/add:     A → B → C → D → E  ← HEAD points here when on feat/add
```

You see `HEAD` in `git log` and in error messages. It always means "where you are right now".

**Detached HEAD**: if you checkout a specific commit ID instead of a branch name, HEAD points to a commit instead of a branch. New commits in this state are not attached to any branch. To fix it: `git checkout -b new-branch-name`.

---

## Creating and switching branches

```bash
# List all local branches
git branch

# List all branches (local + remote)
git branch -a

# Create a new branch (does not switch to it)
git branch feat/add-task

# Switch to an existing branch
git checkout feat/add-task
git switch feat/add-task      # modern equivalent (Git 2.23+)

# Create a new branch AND switch to it in one step
git checkout -b feat/add-task
git switch -c feat/add-task   # modern equivalent
```

---

## Deleting branches

```bash
# Delete a local branch (safe — fails if not merged)
git branch -d feat/add-task

# Delete a local branch (force — even if not merged)
git branch -D feat/add-task

# Delete a remote branch on GitHub
git push origin --delete feat/add-task
```

After a feature PR is merged, always delete both the local and remote branch to keep the repo clean.

---

## Branch naming convention

| Type | Pattern | Example |
|------|---------|---------|
| Project | `technology/##-project-name` | `angular/06-hr-portal` |
| Feature | `feat/short-description` | `feat/employee-crud` |
| Fix | `fix/short-description` | `fix/duplicate-email` |

---

## Three-level branch structure

```
main
├── angular/06-hr-portal        ← one branch per project
│   ├── feat/auth
│   ├── feat/employee-crud
│   └── feat/leave-requests
└── angular/07-finance-tracker
```

**Workflow:**
1. Feature done → PR from `feat/x` into `angular/06-hr-portal`
2. Project done → PR from `angular/06-hr-portal` into `main`
3. `main` only contains finished, reviewed code

---

## Daily branch workflow

```bash
# Start the day
git checkout main
git pull
git checkout angular/06-hr-portal
git pull

# Create your feature branch
git checkout -b feat/add-task

# Work, commit...
git add filename
git commit -m "feat: add employee form"

# Push the feature branch
git push -u origin feat/add-task

# After the PR is merged, clean up
git checkout angular/06-hr-portal
git pull
git branch -d feat/add-task
git push origin --delete feat/add-task
```
