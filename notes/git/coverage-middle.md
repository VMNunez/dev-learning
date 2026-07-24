# Middle Coverage — Git

Concepts expected when a developer helps maintain team history, release flow, and repository automation.

## Investigation and release history

- Annotated tags and semantic versions — mark immutable release points with metadata tied to a release policy
- `git bisect` — use binary search over history to identify the first bad commit with a reproducible check
- Reflog-based recovery — recover locally reachable commits after destructive-looking branch or reset mistakes

## Team workflow design

- Git hooks — automate local checks while recognising that unshared hooks cannot enforce a team policy
- Trunk-based development vs Git Flow — choose branch lifetime and release structure from delivery constraints rather than habit
- `git worktree` — keep multiple checked-out branches without stashing or duplicating the repository
- CI workflows triggered by Git — connect push and pull-request events to reproducible checks without storing secrets in the repository
