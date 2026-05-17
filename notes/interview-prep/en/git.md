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

**What is interactive rebase and when do you use it?**
Interactive rebase (`git rebase -i`) lets you edit, squash, reorder, or delete commits before pushing them. The most common use is squashing — if I made three small "fix typo" commits while developing a feature, I combine them into one clean commit before opening the PR. The key rule: only use it on commits that have not been pushed yet. Rewriting pushed commits breaks everyone who has pulled those commits.

> **Junior tip:** mention squash as the most common use case, and always say you only use it on local commits. That shows you understand the risk.
> **Consejo de entrevista:** menciona squash como el caso de uso más habitual y di siempre que solo lo usas en commits locales. Eso demuestra que entiendes el riesgo.

Red flag answer: "I never use rebase" — shows you are not thinking about how your commit history looks to reviewers.

**What is a detached HEAD state and how do you fix it?**
Detached HEAD means HEAD is pointing to a specific commit instead of a branch name. It happens when you run `git checkout <commit-hash>` directly. Any new commits you make in this state are not attached to any branch — if you switch away, you lose them. The fix: `git checkout -b new-branch-name` creates a branch at that commit and HEAD is back on a branch. Your commits are now safe.

> **Junior tip:** tell the interviewer the fix before they ask — it shows you know the recovery pattern, not just the problem.
> **Consejo de entrevista:** di la solución al entrevistador antes de que la pida — demuestra que conoces el patrón de recuperación, no solo el problema.

Red flag answer: "I just switch to another branch to fix it" — switching away without creating a branch loses any commits you made while detached.

**Why do you prefer merge commits over squash-and-merge for feature PRs?**
Because the merge commit acts as a clear boundary in the history — every commit between two merge commits belongs to one feature. If a bug appears after a merge, I can trace exactly which feature introduced it. Squash-and-merge gives a cleaner single-commit line but loses the granular steps and the connection to the feature branch. In my projects, a history that is honest and traceable matters more than one that looks minimal.

Red flag answer: "I just use the default button" — shows you have never thought about how the merge strategy affects the project history.

**Why do you follow the three-level branch structure instead of working directly on main?**
Because `main` must always represent finished, reviewed code. Without a project branch like `angular/06-hr-portal`, every feature PR would target `main` directly — one broken PR would make `main` unstable. The project branch acts as a buffer: features land there through PRs, get tested together, and only the complete project moves to `main`. On a team this pattern is even more important because multiple features run in parallel.

Red flag answer: "I commit everything to main" — immediately disqualifying at a consultancy; shows no awareness of team workflow.

**When do you decide a feature branch is ready to open a PR?**
When the feature does exactly what it was supposed to do, the commits are clean and atomic, and there are no obvious bugs. I do a self-review first — I read my own diff as if I am a reviewer seeing it for the first time. If there are "fix typo" commits from development, I squash them with interactive rebase before opening the PR. The PR description is the last check — if I cannot explain the "Why" clearly, the feature is not ready.

Red flag answer: "When it compiles" — compiling is the minimum bar, not a quality check.

---

## Pull Requests

**What is a Pull Request?**
A request to merge one branch into another, with a description of what changed and why. On a team, other developers review the code before it is merged. In my own projects I write PR descriptions for every feature — it is good practice and makes the portfolio history readable.

**What do you include in a Pull Request description?**
A title, a bullet list of changes under `## Changes`, and a `## Why` section explaining the main decision behind the change. The description should make sense to someone who has not seen the code — it is documentation that lives permanently with the commit history.

**What is the difference between merge commit, squash and merge, and rebase and merge on GitHub?**
All three merge the PR but affect the history differently. **Merge commit** creates a merge commit — the history shows exactly when the feature was integrated. **Squash and merge** combines all PR commits into one — cleaner history but you lose the individual steps. **Rebase and merge** replays each commit on top of the base branch — perfectly linear, no merge commit. I use merge commit for feature PRs because it acts as a clear boundary: everything between two merge commits belongs to one feature.

> **Junior tip:** the interviewer wants to know if you have thought about this choice, not just whether you know the three options. Always say which one you use and why.
> **Consejo de entrevista:** el entrevistador quiere saber si has reflexionado sobre esta elección. Di siempre cuál usas y por qué.

Red flag answer: "I just click the green button" — shows you have never thought about what merge strategy means for the project history.

**What do you look for when reviewing a PR?**
I check: does the code do what the PR description says; are there obvious bugs or edge cases not handled; are names clear and readable; are there security issues like unvalidated input or hardcoded secrets; are there tests for new logic. I always start with the PR description to understand the intent before reading any code. In my own projects I do a self-review before merging — reading the diff catches small mistakes I missed while writing.

> **Junior tip:** start by understanding the intent of the PR, not by reading code line by line. Interviewers want to see you think about the big picture first.
> **Consejo de entrevista:** empieza por entender la intención del PR, no leyendo línea por línea. Los entrevistadores quieren ver que piensas primero en el panorama general.

Red flag answer: "I check that the tests pass" — tests can pass with broken architecture; a reviewer must read the code.

**Why do you include a "Why" section in your PR descriptions instead of just listing what changed?**
Because the WHAT is already visible in the diff — anyone can see what lines changed. The WHY is what the code cannot tell you: why this pattern was chosen, what problem it solves, what alternatives were considered. In my HR portal, I explained why I used the dual-mode dialog pattern for the employee form — without that note, a reviewer knows what was built but not why that was the right approach. The "Why" section is what makes a PR useful as documentation six months later.

Red flag answer: "I just write a quick summary of what I changed" — shows PRs are seen as a formality, not as documentation.

---

## Conventional Commits

**What is Conventional Commits and why do you follow it instead of writing whatever you want?**
Because the commit history is documentation. Six months later, when you need to understand why a line changed, you read the history — and `feat: add duplicate email check` tells you exactly what and why, while `fix stuff` tells you nothing. It also makes it easy to group changes by type when reviewing a PR. Spanish consultancies use it as a standard on their teams.

**What are the main prefixes and when do you use each?**
`feat` for new features, `fix` for bug fixes, `style` for CSS and visual changes, `refactor` for code improvements with no new feature, `docs` for documentation, `chore` for maintenance tasks like installing dependencies, `test` for adding tests. Each commit should only do one thing — if you need two prefixes, it should be two commits.

**What does "atomic commits" mean?**
One logical change per commit, even if it is small. You never group unrelated changes. If you fix a bug and add a feature in the same commit, the history becomes hard to read and hard to revert safely. A reviewer must be able to read the commit history and understand what changed and why, without reading the code.

**Why did you start following Conventional Commits from your very first solo project, even without a team?**
Because I wanted the habit to be automatic before joining a team where it is expected from day one. Writing `fix stuff` in solo projects builds bad habits that are hard to break later. Also, reading a project history months later — `feat: add duplicate email check` tells a story I can trace back to a decision. Spanish consultancies use Conventional Commits as a standard; arriving with the habit already built means one less thing to learn.

Red flag answer: "I follow it because it is in the project conventions" — following rules without understanding them is not the same as making a decision.

**How do you decide where to stop and make a commit? What makes a change "atomic"?**
I commit when one named, logical idea is complete — not when a file is done, not when it compiles. For example, in the HR portal I committed the auth guard separately from the admin guard, even though they are related — each solves a different problem and one could work without the other. The practical test: if I need the word "and" in my commit message, that is a sign to split into two commits.

Red flag answer: "I commit when the feature is done" — that is one large unreviewed commit that is impossible to revert safely without affecting other changes.

---

## Undoing changes

**What is the difference between `git revert` and `git reset`?**
`git reset` moves HEAD backward and rewrites history — it is only safe on commits that have not been pushed yet. `git revert` creates a new commit that undoes a previous one, without touching the history — it is safe on commits that are already on GitHub. Rule: if the commit is already pushed, always use `git revert`.

**What does `git restore` do?**
It discards changes in the working directory or unstages files. `git restore filename` throws away your edits and returns the file to the last commit. `git restore --staged filename` moves the file back from the staging area to the working directory without losing the changes. It does not touch the commit history.

**How do you undo a pushed commit without losing the history?**
With `git revert <commit-id>`. It creates a new commit that reverses the changes of the specified commit — the original commit stays in the history and you can see that the change was made and then undone. Never use `git reset --hard` on a pushed commit — it rewrites history and breaks anyone else who has those commits.

**What is the difference between `git reset --soft`, `git reset --mixed`, and `git reset --hard`?**
All three move HEAD backward to a previous commit, but they differ in what they leave behind. `--soft` keeps all changes staged — useful when you want to redo the commit message or add one more file. `--mixed` (the default with no flag) unstages the changes but keeps the files — useful when you want to reorganise changes into different commits. `--hard` discards everything — only use this on local commits you are sure you no longer need.

> **Junior tip:** interviewers ask this to check if you understand git reset beyond "it goes back". Name all three flags and what each one leaves behind — staged, unstaged, or discarded.
> **Consejo de entrevista:** los entrevistadores hacen esta pregunta para comprobar si entiendes git reset en profundidad. Nombra los tres flags y qué deja intacto cada uno: staged, sin stage, o eliminado.

Red flag answer: "git reset --hard removes the last commit" — technically true but shows no understanding of the three modes.

**What is `git reflog` and when would you use it?**
`git reflog` records every position HEAD has been at, including after `git reset --hard`. It is your safety net when you think you lost work. If you reset too far or accidentally deleted a branch, `git reflog` shows the commit hash from before and you can recover with `git reset --hard <hash>`. Git keeps this log for 90 days on your local machine — it does not exist on GitHub, only locally.

> **Junior tip:** mention that reflog is local only — it exists on your machine, not on the remote. This shows you understand its limits. Also mention the 90-day window.
> **Consejo de entrevista:** menciona que el reflog es local — está en tu máquina, no en el remoto. Eso demuestra que entiendes sus límites. Menciona también la ventana de 90 días.

Red flag answer: "I don't know what reflog is" — it is in every serious git interview and shows a gap in recovery knowledge.

**When would you use `git reset --soft` instead of `git reset --mixed`?**
I use `--soft` when I want to undo the last commit but keep the changes ready to commit again immediately — for example, I realised the commit message was wrong, or I want to add one more file to the same logical change. The files stay staged so I just run `git commit` again with the corrected message. I use `--mixed` when I want to unstage the changes and reorganise them into separate commits — for example, I accidentally grouped two unrelated changes in one commit.

Red flag answer: "I always use --hard to be safe" — --hard is the most destructive option; always defaulting to it means losing work eventually.

**You pushed a commit with a wrong message. What do you do?**
It depends on where the commit is. On a local feature branch not yet shared with anyone, I use `git commit --amend` to fix the message and then `git push --force-with-lease` — the `--force-with-lease` flag fails if someone else pushed to the branch, which makes it safer than plain `--force`. If the commit is on a shared branch like `main`, I leave the message as is — rewriting history on a shared branch breaks anyone who has pulled those commits.

Red flag answer: "I just git push --force" — using --force without --lease can silently overwrite someone else's work.

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

**What is `git tag` and when do companies use it?**
A tag marks a specific commit as important — usually a release point. Companies create a tag on `main` every time they deploy to production — `v1.0.0`, `v1.2.3`. The version follows semantic versioning: MAJOR for breaking changes, MINOR for new backwards-compatible features, PATCH for bug fixes only. Annotated tags (`-a`) also store the author, date, and a message — preferred for formal releases. If something breaks in production, the team rolls back by checking out the previous tag.

> **Junior tip:** you may not have used tags in your own projects, but explain what they are and why companies use them. It shows you understand the deployment lifecycle, not just the development workflow.
> **Consejo de entrevista:** puede que no hayas usado tags en tus proyectos, pero explica qué son y por qué las usan las empresas. Demuestra que entiendes el ciclo de despliegue, no solo el de desarrollo.

Red flag answer: "I have never used tags" without explaining what they are — shows a gap in production awareness.

**When would you use `git stash` instead of making a WIP commit?**
I use `git stash` when I need to switch context immediately and I know I will come back to the same work soon. A WIP commit would pollute the history with a message like "wip: unfinished form" — it is better to stash and never commit unfinished code. The rule: if I am coming back in minutes or hours to the same branch, stash. If the interruption will last more than a day, a separate WIP branch is safer than relying on stash.

Red flag answer: "I commit everything with a wip message and rewrite it later" — messy history, risks amending pushed commits, and shows stash is not understood.

---

## Pressure questions

**You pushed a commit that contains an API key. What do you do?**
First, remove the key from the code and push a new commit — but that is not enough, because the key is still in the history. The correct steps: invalidate the key immediately in the provider (so it stops working), rotate it to get a new one, then either rewrite the history with `git filter-branch` or use a tool like `git-filter-repo` to remove the key from all commits. On a team, I would warn the rest of the team and follow the company's incident process. The lesson is to always use environment variables for keys and never commit them.

**You ran `git reset --hard` and lost changes you needed. What do you do?**
`git reflog` — it records every position HEAD has been at, even after a hard reset. I can find the commit I was on before the reset and recover it with `git checkout` or `git reset --hard <commit-id>`. Reflog saves you in most situations where you think you lost work. This is why `git reset --hard` on pushed commits is dangerous — there is no reflog on someone else's machine.

**Your PR was merged and deployed to production, and it caused a regression. What do you do?**
First, I communicate immediately with the team — I do not try to fix it silently. Then I assess the fastest safe fix: if the issue is clear and a revert is safe, I run `git revert` on the merge commit and open an emergency PR — this keeps the history honest and is fast to review. If reverting is complex, the team may roll back the deployment using the previous release tag while I work on a proper fix branch. The lesson: always tag releases so you always have a known good state to roll back to.

Red flag answer: "I push a hotfix directly to main" — bypassing review under pressure makes things worse on a real team.

**You are in the middle of a feature and your team lead asks you to fix a critical bug on main immediately. How do you handle it without losing your work?**
I run `git stash` to save my current changes, switch to `main`, pull the latest, create a `fix/critical-bug` branch, fix the bug, push and open an emergency PR. Once it is merged, I switch back to my feature branch and run `git stash pop` to restore my work exactly where I left off. No unfinished code ever touches `main`, and I did not lose a single line of my feature. This is the exact situation `git stash` is designed for.

Red flag answer: "I commit the unfinished feature to main so I can switch" — never commit half-finished work to a shared branch.

**What would you change about your git workflow if you joined a team of 20 developers?**
A few things. First, I would follow the team's existing branching strategy — large teams often use trunk-based development with short-lived branches instead of long-lived project branches. Second, feature branches would be much shorter — merge more often to avoid large divergences and painful conflicts. Third, interactive rebase would be more important — cleaning up local commits before the PR keeps reviews fast. Fourth, I would use `git fetch` and inspect before merging, rather than `git pull` directly. I would also follow the team's code review process, not just open PRs and merge immediately.

Red flag answer: "I would do the same thing" — shows no awareness of how team size and company process change git practice.
