"""Read-only checks for one short-exercise route. Python 3, standard library only."""
import argparse
import html
import hashlib
import json
import re
from pathlib import Path


def text(path):
    return path.read_text(encoding="utf-8-sig").replace("\r", "")


def clean(line):
    line = re.sub(r" ✅ [0-9]{2}-[a-z0-9-]+( — .*)?$", "", line)
    return re.sub(r" ✅ sql:[0-9]{2}-[a-z0-9-]+$", "", line)


def digest(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def field(content, name):
    m = re.search(r"^" + re.escape(name) + r": (.+)$", content, re.M)
    if not m:
        raise ValueError("missing field: " + name)
    return m.group(1)


def sources(root, topic, level):
    cov = text(root / f"notes/{topic}/coverage/{level}.md")
    notes = text(root / f"notes/{topic}/coverage/notes-plan-{level}.md")
    bullets = [clean(x[2:]) for x in cov.splitlines() if x.startswith("- ")]
    blocks = []
    for m in re.finditer(r"^## (\d+) — ([^\n]+)\n(.*?)(?=^## |\Z)", notes, re.M | re.S):
        number, title, body = m.groups()
        section = re.search(r"^Coverage concepts:\n(.*?)(?=^[A-Z][^\n]*:|\Z)", body, re.M | re.S)
        if not section:
            raise ValueError("no concept list in block " + number)
        concepts = [clean(x) for x in re.findall(r"^- \[[ x]\] (.+)$", section.group(1), re.M)]
        blocks.append([number, title, field(body, "Spanish"), field(body, "Depends on"), concepts])
    scope = digest("\n".join(clean(x) for x in cov.split("\n")))
    structure = digest(json.dumps(blocks, ensure_ascii=False, separators=(",", ":")))
    return bullets, blocks, scope, structure, notes


def table(content, heading):
    section = content.split("## " + heading + "\n", 1)[1].split("\n## ", 1)[0]
    return [[html.unescape(c.strip()) for c in line.strip().strip("|").split("|")]
            for line in section.splitlines() if line.startswith("| ")][1:]


def preserved(base, plan, errors):
    for heading, frozen in (("Concept mapping", (0, 2)), ("Exercise inventory", range(9))):
        new = {r[0]: r for r in table(plan, heading)}
        for old in table(base, heading):
            cur = new.get(old[0])
            if cur is None or len(cur) != len(old):
                errors.append("published ID deleted or malformed: " + old[0])
            elif any(cur[i] != old[i] for i in frozen) or (old[-1] == "retired" != cur[-1]):
                errors.append("published row rewritten: " + old[0])


def validate(root, topic, level, candidate=None, baseline=None):
    path = candidate or root / f"practice/exercises/{topic}/{level}/PLANNING-{level}.md"
    plan = text(path)
    bullets, blocks, scope, structure, notes = sources(root, topic, level)
    errors = []
    def check(ok, message):
        if not ok:
            errors.append(message)
    check(field(notes, "Plan status") == "current", "notes plan is not current")
    check(field(notes, "Coverage SHA-256") == scope, "notes coverage digest differs (markers stripped)")
    check(field(plan, "Plan status") == "current", "exercise plan is not current")
    check(field(plan, "Coverage SHA-256") == scope, "exercise coverage digest differs (markers stripped)")
    check(field(plan, "Notes structure SHA-256") == structure, "notes structure digest differs")
    check(field(plan, "Topic") == topic and field(plan, "Level") == level, "route identity differs")
    check(field(plan, "Coverage") == f"notes/{topic}/coverage/{level}.md", "coverage path differs")
    check(field(plan, "Notes plan") == f"notes/{topic}/coverage/notes-plan-{level}.md", "notes path differs")
    field(plan, "Generated")
    heads = [b.split(" — ", 1)[0] for b in bullets]
    assigned = [c for b in blocks for c in b[4]]
    check(sorted(assigned) == sorted(bullets), "notes assignments do not match all full coverage bullets exactly once")
    check(len(set(heads)) == len(heads), "ambiguous duplicate coverage heads")
    if baseline:
        preserved(text(baseline), plan, errors)
    concepts = table(plan, "Concept mapping")
    tasks = table(plan, "Exercise inventory")
    check(all(len(r) == 5 for r in concepts), "concept row needs five cells")
    check(all(len(r) == 10 for r in tasks), "task row needs ten cells")
    if errors and (any(len(r) != 5 for r in concepts) or any(len(r) != 10 for r in tasks)):
        return errors, {}
    check(len({r[0] for r in concepts}) == len(concepts), "duplicate concept ID")
    check(len({r[0] for r in tasks}) == len(tasks), "duplicate exercise ID")
    current = [r for r in concepts if r[3] != "retired"]
    check(sorted(r[2] for r in current) == sorted(heads), "current concepts do not cover exactly the coverage heads")
    by_head = {c.split(" — ", 1)[0]: b[0] for b in blocks for c in b[4]}
    by_concept = {r[0]: r for r in concepts}
    by_task = {r[0]: r for r in tasks}
    active = [r for r in tasks if r[9] == "active"]
    check(len({r[6] for r in active}) == len(active), "duplicate planned basename")
    for r in concepts:
        check(r[3] in ("included", "excluded", "retired"), "invalid concept disposition " + r[0])
        if r[3] != "retired":
            check(by_head.get(r[2]) == r[1], "concept assigned to wrong block: " + r[0])
        if r[3] == "excluded":
            check(r[4] not in ("", "—", "none"), "exclusion needs reason: " + r[0])
    earlier = set()
    for r in tasks:
        tid, block, refs, kind, difficulty, after, filename, task, passed, state = r
        ids = [c.strip() for c in refs.split(",")]
        check(state in ("active", "retired"), "invalid task state: " + tid)
        if state == "retired":
            earlier.add(tid)
            continue
        check(kind in ("first", "variant", "integration"), "invalid kind: " + tid)
        check(difficulty in ("foundation", "transfer", "integration"), "invalid difficulty: " + tid)
        check(len(ids) == len(set(ids)), "duplicate concept reference: " + tid)
        check(len(ids) == 1 if kind != "integration" else 2 <= len(ids) <= 3, "invalid concept cardinality: " + tid)
        check(all(c in by_concept and by_concept[c][3] == "included" for c in ids), "unknown or excluded concept: " + tid)
        check(bool(task) and bool(passed), "missing task/pass condition: " + tid)
        check(bool(re.fullmatch(r"[A-Za-z][A-Za-z0-9_]*\.java", filename)) if topic == "java" else "/" not in filename and "\\" not in filename, "unsafe basename: " + tid)
        deps = [] if after == "none" else [x.strip() for x in after.split(",")]
        check(all(d in earlier and by_task[d][9] == "active" for d in deps), "dependency is missing, retired, forward or cyclic: " + tid)
        if kind in ("variant", "integration"):
            covered = {c.strip() for d in deps if d in by_task for c in by_task[d][2].split(",")}
            check(set(ids) <= covered, "variant/integration lacks concept dependencies: " + tid)
        earlier.add(tid)
    for cid, _, _, disposition, _ in concepts:
        if disposition == "included":
            kinds = {r[3] for r in active if cid in [x.strip() for x in r[2].split(",")]}
            check({"first", "variant"} <= kinds, "concept lacks first and transfer practice: " + cid)
    return errors, {"coverage_sha256": scope, "notes_structure_sha256": structure,
                    "coverage_concepts": len(heads), "included": sum(r[3] == "included" for r in concepts),
                    "excluded": sum(r[3] == "excluded" for r in concepts), "active_exercises": len(active)}


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("topic"); p.add_argument("level", choices=["junior", "middle", "senior"])
    p.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[5])
    p.add_argument("--plan", type=Path, help="Validate a scratch candidate against this repository's sources")
    p.add_argument("--baseline", type=Path, help="Published route a reconciled candidate must preserve")
    args = p.parse_args()
    try:
        errors, result = validate(args.root, args.topic, args.level, args.plan, args.baseline)
    except (OSError, ValueError, IndexError) as exc:
        errors, result = [str(exc)], {}
    print(json.dumps({"status": "FAIL" if errors else "PASS", **result, "errors": errors}, ensure_ascii=False))
    raise SystemExit(bool(errors))
