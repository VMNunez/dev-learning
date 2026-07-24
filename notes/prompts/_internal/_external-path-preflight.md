# External-path preflight

Apply this contract before any prompt reads or writes a path outside the current repository.

1. Resolve every required external path to an absolute path.
2. Check that each required input exists and is readable.
3. Check that each output parent exists and is writable without creating or modifying the target.
4. Record the resolved paths in the run report without exposing secrets.
5. If any required path fails, stop before the first write, stage, commit, or partial artifact.
6. Report the missing capability and the exact path category needed; do not silently substitute a
   different repository, stale copy, or guessed location.

For output-only prompts, a successful preflight does not count as a produced artifact. The close-out
must still verify the output created during this run using the prompt's declared check.

