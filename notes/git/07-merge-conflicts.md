# Merge Conflicts

**Official docs:** [Git Branching — Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

## What is a conflict?

A conflict happens when two branches modify the **same line** in the **same file**, and Git cannot automatically decide which version to keep. Git stops the merge and asks you to resolve it manually.

Conflicts are normal on a team. They are not errors — they are Git asking for a human decision.

---

## What triggers a conflict

- Two developers edit the same line of the same file on different branches
- One developer deletes a file that another developer modified
- Two branches add different content at the same location

---

## The conflict markers

When a conflict happens, Git marks the file:

```
<<<<<<< HEAD
  color: red;       ← your version (the branch you are merging INTO)
=======
  color: blue;      ← incoming version (the branch being merged)
>>>>>>> feat/new-design
```

- `<<<<<<< HEAD` — start of your current version
- `=======` — separator between the two versions
- `>>>>>>> branch-name` — end of the incoming version

---

## How to resolve a conflict

1. Run `git status` — it shows which files have conflicts
2. Open each conflicted file — search for `<<<<<<<`
3. Decide what the correct version is:
   - Keep your version
   - Keep the incoming version
   - Write a completely new version that combines both
4. Delete all three marker lines (`<<<<<<<`, `=======`, `>>>>>>>`)
5. Save the file
6. `git add filename` — mark the conflict as resolved
7. `git commit` — finish the merge (Git pre-fills the commit message)

---

## Aborting a merge

If you are not ready to resolve the conflicts and want to go back to the state before the merge:

```bash
git merge --abort
```

This puts everything back to how it was before you ran `git merge`.

---

## Avoiding conflicts

- Pull from the target branch often — the longer you wait, the more divergence accumulates
- Keep feature branches short-lived — small, focused changes conflict less
- Communicate with teammates about who is working in which files
- Break large files into smaller ones — fewer people touch the same file

---

## Useful tools

Most editors (VS Code, IntelliJ) show conflicts visually with buttons: "Accept Current", "Accept Incoming", "Accept Both". These just remove the markers and keep the version you chose — the result is the same as editing manually.
