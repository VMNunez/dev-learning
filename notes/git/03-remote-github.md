# Remote and GitHub

**Official docs:** [Git Basics — Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

## What is a remote?

A remote is a copy of your repository hosted somewhere else — usually GitHub. When you clone a repo, Git automatically sets up a remote called `origin` that points to the URL you cloned from.

```bash
git remote -v              # show what URL origin points to
git remote add origin URL  # manually link a local repo to a remote (after git init)
```

---

## origin

`origin` is just the default name Git gives to the remote. It is an alias for the full URL. You could call it anything, but `origin` is the universal convention.

```bash
git push origin feat/add-task    # push to GitHub
git pull origin main             # pull from GitHub
git push origin --delete feat/x  # delete a remote branch
```

---

## git push

Uploads your local commits to the remote repository on GitHub.

```bash
git push origin feat/add-task   # push a specific branch
git push                         # push the current branch (after -u is set)
git push origin --delete feat/x  # delete a branch on GitHub
```

### The -u flag

`-u` sets the **upstream tracking** between your local branch and the remote branch. After this, Git knows which remote branch corresponds to your local one.

```bash
git push -u origin feat/add-task  # first push of a new branch
git push                          # every push after that — no need to type the branch name
```

Only needed once, on the first push of a new branch.

---

## git pull

Downloads commits from GitHub and merges them into your current local branch. It is `git fetch` + `git merge` in one command.

```bash
git pull                    # pull the current branch (after -u is set)
git pull origin main        # pull main from GitHub
```

Use `git pull` at the start of every session to make sure you have the latest version before writing new code.

---

## git fetch

Downloads commits from GitHub but does **not** apply them to your local branch. You can inspect what changed before merging.

```bash
git fetch origin
git log --oneline origin/main  # see what is on GitHub without merging yet
```

**pull vs fetch:**
- `git pull` — download + merge immediately
- `git fetch` — download only, merge manually when you are ready

In practice, `git pull` is used for daily work. `git fetch` is useful when you want to check what changed on GitHub before merging.

---

## Setting up a new project on GitHub

```bash
# 1. Create the repo on GitHub (empty, no README)
# 2. Link your local project
git remote add origin https://github.com/you/repo.git

# 3. Push for the first time
git push -u origin main
```

After this, `git push` and `git pull` work without typing the full branch name.
