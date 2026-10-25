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
        section = re.search(r"^Coverage concepts:( none)?\n(.*?)(?=^[A-Z][^\n]*:|\Z)", body, re.M | re.S)
        if not section:
            raise ValueError("no concept list in block " + number)
        concepts = [clean(x) for x in re.findall(r"^- \[[ x]\] (.+)$", section.group(2), re.M)]
        if section.group(1) and concepts:
            raise ValueError("block " + number + " says Coverage concepts: none and lists concepts")
        blocks.append([number, title, field(body, "Spanish"), field(body, "Depends on"), concepts])
    scope = digest("\n".join(clean(x) for x in cov.split("\n")))
    structure = digest(json.dumps(blocks, ensure_ascii=False, separators=(",", ":")))
    return bullets, blocks, scope, structure, notes


def rows(content, heading):
    section = content.split("## " + heading + "\n", 1)[1].split("\n## ", 1)[0]
    return [[html.unescape(c.strip()) for c in line.strip().strip("|").split("|")]
            for line in section.splitlines() if line.startswith("| ")]


def table(content, heading):
    return rows(content, heading)[1:]


def waits(cell):
    return [] if cell == "—" else [w.strip() for w in cell.split(",")]


def resolve(root, topic, level, wait):
    """Why a stage's wait (standard §B, REC-401) does not resolve, or None when it does."""
    step = re.fullmatch(r"([0-9]{2}-[a-z0-9-]+) Step ([0-9]+[a-z]?)", wait)
    if step:
        path = root / f"projects/{step.group(1)}/PLANNING.md"
        if not path.is_file():
            return "waits for a project with no PLANNING.md: " + wait
        heading = r"^#{3,4} Step " + re.escape(step.group(2)) + " — "
        return None if re.search(heading, text(path), re.M) else "waits for a step its project does not plan: " + wait
    concept = re.fullmatch(r"([a-z][a-z-]*) ([A-Z][A-Z0-9]*)", wait)
    if not concept or concept.group(1) == topic:
        return "malformed wait, or a wait on its own route: " + wait
    path = root / f"practice/exercises/{concept.group(1)}/{level}/PLANNING-{level}.md"
    other = text(path) if path.is_file() else ""
    if "\n## Essential route\n" not in other:
        return "waits for a route with no published essential route: " + wait
    cid = concept.group(2)
    if not any(r[0] == cid and r[3] == "included" for r in table(other, "Concept mapping")):
        return "waits for a concept that route does not include: " + wait
    firsts = {r[0] for r in table(other, "Exercise inventory")
              if len(r) == 10 and r[3] == "first" and r[9] == "active" and r[2].strip() == cid}
    stages = rows(other, "Essential route")
    if not any(t.strip() in firsts for s in stages[1:] if len(s) > 2 for t in s[2].split(",")):
        return "waits for a concept whose first exercise that route's essential route does not list: " + wait
    if stages and len(stages[0]) == 4 and any(w.split(" ", 1)[0] == topic for s in stages[1:] if len(s) == 4 for w in waits(s[3])):
        return "waits for a route that waits for it: " + wait
    return None


def preserved(base, plan, errors):
    for heading, frozen in (("Concept mapping", (0, 2)), ("Exercise inventory", range(9))):
        new = {r[0]: r for r in table(plan, heading)}
        for old in table(base, heading):
            cur = new.get(old[0])
            if cur is None or len(cur) != len(old):
                errors.append("published ID deleted or malformed: " + old[0])
            elif any(cur[i] != old[i] for i in frozen) or (old[-1] == "retired" != cur[-1]):
                errors.append("published row rewritten: " + old[0])


def essential(plan, tasks, check, root, topic, level):
    """The mandatory essential route (standard §B, REC-375): closed, ordered, a ladder of stages,
    each wait outside the route resolved (REC-401)."""
    if "\n## Essential route\n" not in plan:
        check(False, "plan has no essential route (standard section B)")
        return {}
    lines = rows(plan, "Essential route")
    head, body = (lines[0], lines[1:]) if lines else ([], [])
    check(head[:3] == ["Stage", "Title", "Tasks"] and head[3:] in ([], ["Waits for"]),
          "essential route header must be Stage | Title | Tasks, optionally | Waits for")
    check(bool(body), "essential route has no stage")
    by_task = {r[0]: r for r in tasks}
    listed, stages, waiting = [], [], 0
    for row in body:
        check(len(row) == len(head), "essential route row needs one cell per header column")
        if len(row) != len(head) or len(row) < 3:
            continue
        stage, _, ids = row[:3]
        for wait in waits(row[3]) if len(row) == 4 else []:
            problem = resolve(root, topic, level, wait)
            check(problem is None, f"{problem} (stage {stage})")
        waiting += len(row) == 4 and row[3] != "—"
        check(bool(re.fullmatch(r"[0-9]{2}", stage)) and all(s < stage for s in stages), "invalid, duplicate or out-of-order essential stage: " + stage)
        stages.append(stage)
        ids = [x.strip() for x in ids.split(",") if x.strip()]
        check(bool(ids), "empty essential stage: " + stage)
        kinds = set()
        for tid in ids:
            row = by_task.get(tid)
            check(row is not None and row[9] == "active", "essential ID missing or not active: " + tid)
            check(tid not in listed, "essential ID listed twice: " + tid)
            if row is not None:
                deps = [] if row[5] == "none" else [d.strip() for d in row[5].split(",")]
                check(all(d in listed for d in deps), "essential ID depends on an unlisted or later task: " + tid)
                kinds.add(row[3])
            listed.append(tid)
        check("integration" in kinds, "essential stage has no integration: " + stage)
    concepts = {c.strip() for t in listed if t in by_task for c in by_task[t][2].split(",")}
    for cid in sorted(concepts):
        kinds = {by_task[t][3] for t in listed if t in by_task and by_task[t][3] != "integration"
                 and cid in [c.strip() for c in by_task[t][2].split(",")]}
        check({"first", "variant"} <= kinds, "essential concept lacks a listed first and variant: " + cid)
    return {"essential_stages": len(stages), "essential_tasks": len(listed), "essential_concepts": len(concepts),
            "essential_waiting_stages": waiting}


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
    route = essential(plan, tasks, check, root, topic, level)
    return errors, {"coverage_sha256": scope, "notes_structure_sha256": structure,
                    "coverage_concepts": len(heads), "included": sum(r[3] == "included" for r in concepts),
                    "excluded": sum(r[3] == "excluded" for r in concepts), "active_exercises": len(active),
                    **route}


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
