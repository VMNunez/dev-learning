# Git Workflow

## Branch structure

```
main
├── angular/01-todo-list        ← one branch per project
│   ├── feature/task-list
│   ├── feature/add-task
│   └── feature/delete-task
├── angular/02-weather-app
└── java/01-fundamentos
```

## Daily workflow

```bash
# 1. Start the day — update main and your project branch
git checkout main
git pull
git checkout angular/01-todo-list
git pull
```

```bash
# 2. Go to your feature branch (or create it)
git checkout feature/add-task
# If it does not exist yet:
git checkout -b feature/add-task
```

```bash
# 3. Work on your code, then stage and commit
git add .
git commit -m "feat: add task input component"
```

```bash
# 4. Push your feature branch to GitHub
git push -u origin feature/add-task
```

```bash
# 5. Open a Pull Request on GitHub → merge into angular/01-todo-list
```

```bash
# 6. After merging the feature, delete the feature branch
git checkout angular/01-todo-list
git pull
git branch -d feature/add-task
git push origin --delete feature/add-task
```

```bash
# 7. When the project is finished → PR from angular/01-todo-list into main
```

## Branch naming

| Type | Pattern | Example |
|------|---------|---------|
| Project | `technology/##-project-name` | `angular/01-todo-list` |
| Feature | `feature/short-description` | `feature/add-task` |
| Fix | `fix/short-description` | `fix/delete-button` |

## Commit messages — Conventional Commits

| Prefix | When to use | Example |
|--------|-------------|---------|
| `feat:` | new feature | `feat: add delete button` |
| `fix:` | bug fix | `fix: task not saving` |
| `style:` | CSS or visual changes | `style: update button color` |
| `refactor:` | code improvement, no new feature | `refactor: simplify task service` |
| `docs:` | documentation changes | `docs: update README` |
| `chore:` | maintenance tasks | `chore: install dependencies` |
| `test:` | adding or updating tests | `test: add task service tests` |
| `perf:` | performance improvement | `perf: reduce bundle size` |

## Useful commands

| Command | What it does |
|---------|--------------|
| `git status` | Show the current state of your files |
| `git log --oneline` | Show commit history in one line per commit |
| `git branch` | List all local branches |
| `git branch -a` | List all branches (local and remote) |
| `git diff` | Show changes not yet staged |
| `git stash` | Save changes temporarily without committing |
| `git stash pop` | Recover stashed changes |
