# What is Git

## Version control

Version control is a system that records every change you make to your files over time. You can go back to any previous state, compare versions, and see who changed what and when.

Without version control:
- You save files like `app_v2_final_FINAL.js` — messy and unreliable
- One wrong change and you lose work permanently
- Two people editing the same file overwrite each other's work

With Git:
- Every version is saved automatically with a message
- Going back is one command
- Multiple people can work on the same project at the same time

---

## Git vs GitHub

| | Git | GitHub |
|---|-----|--------|
| What it is | A tool that runs on your machine | A cloud platform that hosts repositories |
| What it does | Tracks changes locally | Stores and shares your Git history online |
| Can you use one without the other? | Yes — Git works offline | No — GitHub needs Git |

**Git** is the technology. **GitHub** is one place to store and share Git repositories. There are others (GitLab, Bitbucket) — but they all use Git underneath.

---

## The three areas

Every Git project has three areas. Understanding these is the key to understanding every Git command.

```
Working directory  →  Staging area  →  Repository (commits)
   (your files)        (git add)         (git commit)
```

| Area | What it is | How you move files in |
|------|-----------|----------------------|
| Working directory | Files on disk, as you edit them | Just edit the file |
| Staging area | Changes you have selected for the next commit | `git add filename` |
| Repository | Permanent history of snapshots | `git commit` |

**Why have a staging area?** So you can commit only part of your changes. If you edited three files but only two are ready, you stage only those two and commit — the third stays in the working directory for the next commit.

---

## git init

Creates a new Git repository in the current folder. Creates a hidden `.git/` folder where Git stores everything.

```bash
git init
```

Use this when you start a new project from scratch on your machine.

---

## git clone

Downloads an existing repository from a remote (like GitHub) to your machine. Creates a new folder with the full project history.

```bash
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-folder  # clone into a custom folder name
```

Use this when you want to work on an existing project that is already on GitHub.

**git init vs git clone:**
- `git init` — you are starting from zero locally
- `git clone` — the project already exists on GitHub
