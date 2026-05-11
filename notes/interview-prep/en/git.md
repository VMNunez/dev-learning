# Git — Interview Questions

## Basics

**What is Git and why do developers use it?**
Git is a version control system — it tracks every change to your code, lets you go back to any previous state, and allows multiple people to work on the same project without overwriting each other's work. Without it, collaboration is nearly impossible on a real team.

**What is the difference between Git and GitHub?**
Git is the tool that runs on your machine and tracks changes. GitHub is a cloud platform that hosts Git repositories so you can share them and collaborate. You can use Git without GitHub, but GitHub needs Git.

**What is a commit?**
A snapshot of your changes at a specific point in time, with a message explaining what changed. Each commit has a unique ID. I follow Conventional Commits format — `feat: add employee form`, `fix: duplicate email check` — so the history reads like a changelog.

**What is `git status` and when do you use it?**
It shows the current state of your files — what is staged, what is modified, and what is untracked. I run it constantly to make sure I am committing exactly what I intend to, nothing more.

**What is the difference between `git pull` and `git fetch`?**
`git fetch` downloads changes from the remote but does not apply them to your local branch — you can inspect them first. `git pull` fetches and then merges automatically. I use `git pull` at the start of the day to bring my branch up to date.

**What is `.gitignore` and what do you put in it?**
A file that tells Git to ignore certain files and folders — they never get committed. I always ignore `node_modules/`, environment files with API keys (`.env`), and editor config files. Without it you would push thousands of dependency files to GitHub on every commit.

**What is the staging area and why does Git have it?**
The staging area sits between the working directory and the commit history. When you edit a file it goes into the working directory. When you run `git add` it moves to the staging area. When you run `git commit` it becomes a permanent snapshot. The staging area lets you select exactly which changes go into a commit — if you edited three files but only two are ready, you stage those two and commit. The third waits for the next commit.

**What is HEAD?**
HEAD is a pointer to the commit you are currently on — usually the tip of the current branch. When you switch branches, HEAD moves. When you make a new commit, HEAD moves forward. You see it in `git log` and error messages — it always means "where you are right now". `HEAD~1` means one commit before the current one.

**What is the difference between `git init` and `git clone`?**
`git init` creates a new empty repository on your machine from scratch — you use it when starting a new project locally. `git clone` downloads an existing repository from GitHub to your machine, including the full commit history and the remote already set up. In practice: `git init` when I start fresh, `git clone` when the project already exists on GitHub.

---

## Branches

**What is a branch and why do you use them?**
A branch is an independent line of development — changes on one branch do not affect others. I use branches so I can work on a new feature without breaking the stable version. When the feature is done, I merge it back through a Pull Request.

**What branch structure do you follow?**
`main` is the top-level branch — only finished, reviewed code lands there. Each project has its own branch from `main` — `angular/06-hr-portal`. Each feature inside a project gets its own branch from the project branch — `feat/auth`, `feat/employee-crud`. When the feature is done, I open a PR into the project branch. When the whole project is done, I open a PR into `main`.

**Why do you use feature branches instead of committing directly to main?**
Because `main` must always be in a working state. If I commit a half-finished feature directly to `main` and something breaks, the whole project is broken. Feature branches isolate the change — if something goes wrong, only that branch is affected. They also make code review possible: the PR gives a clear view of exactly what changed before it lands in `main`.

**What does `git push -u origin branch` do and why do you use `-u`?**
It pushes the local branch to GitHub and sets the upstream tracking — Git now knows that your local branch corresponds to that remote branch. After this first push, you can just type `git push` and `git pull` without specifying the branch name every time. The `-u` is only needed once, on the first push of a new branch.

**What is the difference between `git merge` and `git rebase`?**
`merge` combines two branches and creates a merge commit — the history shows exactly when branches joined. `rebase` replays your commits on top of another branch, making the history linear. I use merge for project PRs — the merge commit documents when a feature was integrated. Rebase is useful to clean up local commits before pushing, but I avoid it on shared branches.

**What is a fast-forward merge?**
It happens when the target branch has no new commits since the feature branch was created — Git simply moves the pointer forward without creating a merge commit. The history stays completely linear. A three-way merge happens when both branches have diverged and Git needs to create a new commit to tie them together.

**What is a merge conflict and how do you resolve it?**
It happens when two branches modify the same line in the same file and Git cannot decide which version to keep. Git marks the conflict in the file with `<<<<<<<`, `=======`, and `>>>>>>>`. You open the file, decide what the correct version is, remove the markers, stage the file, and commit. The key is not to panic — read both versions carefully before choosing.

---

## Pull Requests

**What is a Pull Request?**
A request to merge one branch into another, with a description of what changed and why. On a team, other developers review the code before it is merged. In my own projects I write PR descriptions for every feature — it is good practice and makes the portfolio history readable.

**What do you include in a Pull Request description?**
A title, a bullet list of changes under `## Changes`, and a `## Why` section explaining the main decision behind the change. The description should make sense to someone who has not seen the code — it is documentation that lives permanently with the commit history.

---

## Conventional Commits

**What is Conventional Commits and why do you follow it instead of writing whatever you want?**
Because the commit history is documentation. Six months later, when you need to understand why a line changed, you read the history — and `feat: add duplicate email check` tells you exactly what and why, while `fix stuff` tells you nothing. It also makes it easy to group changes by type when reviewing a PR. Spanish consultancies use it as a standard on their teams.

**What are the main prefixes and when do you use each?**
`feat` for new features, `fix` for bug fixes, `style` for CSS and visual changes, `refactor` for code improvements with no new feature, `docs` for documentation, `chore` for maintenance tasks like installing dependencies, `test` for adding tests. Each commit should only do one thing — if you need two prefixes, it should be two commits.

**What does "atomic commits" mean?**
One logical change per commit, even if it is small. You never group unrelated changes. If you fix a bug and add a feature in the same commit, the history becomes hard to read and hard to revert safely. A reviewer must be able to read the commit history and understand what changed and why, without reading the code.

---

## Undoing changes

**What is the difference between `git revert` and `git reset`?**
`git reset` moves HEAD backward and rewrites history — it is only safe on commits that have not been pushed yet. `git revert` creates a new commit that undoes a previous one, without touching the history — it is safe on commits that are already on GitHub. Rule: if the commit is already pushed, always use `git revert`.

**What does `git restore` do?**
It discards changes in the working directory or unstages files. `git restore filename` throws away your edits and returns the file to the last commit. `git restore --staged filename` moves the file back from the staging area to the working directory without losing the changes. It does not touch the commit history.

**How do you undo a pushed commit without losing the history?**
With `git revert <commit-id>`. It creates a new commit that reverses the changes of the specified commit — the original commit stays in the history and you can see that the change was made and then undone. Never use `git reset --hard` on a pushed commit — it rewrites history and breaks anyone else who has those commits.

---

## Useful commands

**What does `git stash` do and when is it useful?**
It saves your uncommitted changes temporarily and resets the working directory to the last commit. Useful when you need to switch branches quickly but are not ready to commit — `git stash pop` brings the changes back. I use it when I am in the middle of something and need to check another branch without committing half-finished work.

**What does `git log --oneline` show?**
A compact view of the commit history — one line per commit with the short ID and message. I use it to check that my commits are in order and have clear messages before pushing.

**What does `git diff` show and what is the difference with `git diff --staged`?**
`git diff` shows changes in the working directory that are not yet staged — what you have edited but not `git add`-ed yet. `git diff --staged` shows changes that are staged and ready to commit — what will go into the next `git commit`. I use `git diff --staged` right before committing to do a final review of exactly what I am saving.

**What is `git blame` and when is it useful?**
It shows who last modified each line of a file and in which commit. When I find a line I do not understand, I run `git blame filename` to find out when it was added — then I read that commit message to understand why. On a team it is also useful to know who to ask about a specific piece of code.

**What is `git cherry-pick` and when would you use it?**
It applies the changes from a specific commit onto the current branch, without merging the whole branch — `git cherry-pick a3f8c1d`. The typical use case: a bug is fixed on a feature branch but you need that fix on `main` right now, before the whole feature is ready. You cherry-pick just that one fix commit. I use it sparingly — it duplicates commits and can make the history confusing if overused.

---

## Pressure questions

**You pushed a commit that contains an API key. What do you do?**
First, remove the key from the code and push a new commit — but that is not enough, because the key is still in the history. The correct steps: invalidate the key immediately in the provider (so it stops working), rotate it to get a new one, then either rewrite the history with `git filter-branch` or use a tool like `git-filter-repo` to remove the key from all commits. On a team, I would warn the rest of the team and follow the company's incident process. The lesson is to always use environment variables for keys and never commit them.

**You ran `git reset --hard` and lost changes you needed. What do you do?**
`git reflog` — it records every position HEAD has been at, even after a hard reset. I can find the commit I was on before the reset and recover it with `git checkout` or `git reset --hard <commit-id>`. Reflog saves you in most situations where you think you lost work. This is why `git reset --hard` on pushed commits is dangerous — there is no reflog on someone else's machine.
