# Merge and Rebase

## git merge

Combines two branches. The changes from one branch are brought into another.

```bash
git checkout angular/06-hr-portal   # switch to the target branch
git merge feat/add-task             # bring feat/add-task into it
```

### Fast-forward merge

Happens when the target branch has no new commits since the feature branch was created. Git simply moves the pointer forward — no merge commit needed. The history stays linear.

```
Before:  main → A → B
                     └── feat: C → D

After:   main → A → B → C → D      (HEAD just moved forward)
```

### Three-way merge

Happens when both branches have new commits since they split. Git creates a new **merge commit** that ties both histories together.

```
Before:  main → A → B → E
                     └── feat: C → D

After:   main → A → B → E → M      (M is the merge commit)
                     └── C → D ──┘
```

The merge commit has two parents — it documents exactly when and where the branches joined.

---

## git rebase

Replays your commits on top of another branch, as if you had started from there. The result is a linear history with no merge commit.

```bash
git checkout feat/add-task
git rebase main               # replay feat/add-task commits on top of main
```

```
Before:  main → A → B → E
                     └── feat: C → D

After:   main → A → B → E → C' → D'   (C and D are recreated as new commits)
```

Note: the rebased commits get new IDs (`C'`, `D'`) — they are technically new commits, even if the content is the same.

---

## When to use each

| Situation | Use |
|-----------|-----|
| Merging a feature into the project branch (PR) | `merge` — the merge commit documents when the feature was integrated |
| Cleaning up local commits before pushing | `rebase` — rewrites history to look cleaner |
| A shared branch that others are using | Always `merge` — never rebase shared branches |

**The golden rule of rebase:** never rebase a branch that other people are working on. Rebasing rewrites commit IDs — anyone else who has those commits will have a broken history.

---

## merge vs rebase — summary

| | merge | rebase |
|---|-------|--------|
| History | Shows exactly when branches joined | Linear, no merge commits |
| Safe on shared branches? | Yes | No |
| Commit IDs changed? | No | Yes |
| When to use | PRs, integrating features | Cleaning up local commits |
