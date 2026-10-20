#!/usr/bin/env python3
"""Spaced-repetition scheduler for the interview-prep question banks.

All state lives in schedule.md, next to this script: the settings Victor may edit by hand
(## Ajustes) and one row per question. A row's history is its only primary state; every other
column is recomputed from it on each write, so a change to the settings applies to the past too.

  hoy [--fecha AAAA-MM-DD]          today's reviews and new questions (re-reads the banks first)
  mas [N] [--fecha ...]             the next N new questions, for a day with time to spare
  registrar ID RESULTADO [--fecha ...] [--corregir]
                                    RESULTADO: aprendida | pass | borderline | fail
  calendario [--dias N] [--fecha ...]
                                    projected plan, assuming every review is a pass
  estado [--fecha ...]              progress per phase and per topic
  sincronizar [--fecha ...]         re-read the banks: add, drop and re-order the questions
  progreso [--escribir] [--fecha ...]
                                    the PROGRESS.md summary (--escribir writes it there and
                                    refreshes the generated sections of schedule.md)
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCHEDULE = HERE / "schedule.md"
PROGRESS = HERE.parents[2] / "PROGRESS.md"
BANKS = HERE.parent  # notes/interview-prep
GEN_START = "<!-- spaced.py: inicio de lo generado, no editar a mano -->"
GEN_END = "<!-- spaced.py: fin de lo generado -->"
GENERATED = re.compile(re.escape(GEN_START) + r".*?" + re.escape(GEN_END), re.DOTALL)
PROGRESS_START = "<!-- spaced.py: begin, generated — do not edit by hand -->"
PROGRESS_END = "<!-- spaced.py: end -->"
PROGRESS_BLOCK = re.compile(re.escape(PROGRESS_START) + r".*?" + re.escape(PROGRESS_END), re.DOTALL)
TABLE_HEADING = "## Preguntas"
COLUMNS = ["#", "ID", "Tema", "Fase", "Título", "Aprendida", "Racha", "Fallos", "Intervalo",
           "Próximo repaso", "Estado", "Historial"]
REVIEW_EVENTS = ("PASS", "BORDERLINE", "FAIL")
WEEKDAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

BOLD_LINE = re.compile(r"^\*\*\[([^\]]+)\]\s*(.+?)\*\*(.*)$")
INDEX_ENTRY = re.compile(r"^- \[\d{3} — (.+?)\]\(#([^)]+)\)")


# ---------------------------------------------------------------- settings

def number(text):
    return float(text.strip().replace(",", "."))


def parse_settings(head):
    values = dict(re.findall(r"^- ([^:\n]+): (.+)$", head, flags=re.MULTILINE))
    phases = {int(n): (stars.count("⭐"), name.strip(), level)
              for n, level, stars, name in
              re.findall(r"^- Fase (\d+): (\w+) \| (\S+) \| (.+)$", head, flags=re.MULTILINE)}
    sources = [(path, topic.strip(), int(phase), prio.strip())
               for path, topic, phase, prio in
               re.findall(r"^- Fuente: (\S+) \| ([^|]+) \| (\d+) \| (\S+)\s*$", head, flags=re.MULTILINE)]
    try:
        spans = {name: (number(a), number(b)) for name, a, b in
                 re.findall(r"(\w+) ([\d,.]+)[–-]([\d,.]+)", values["Reparto por prioridad"])}
        s = {
            "start": dt.date.fromisoformat(values["Inicio"].strip()),
            "sunday_off": values["Domingo libre"].strip().lower().startswith("s"),
            "new_per_day": int(values["Nuevas por día"]),
            "load": number(values["Carga del día"]),
            "review_pts": number(values["Puntos por repaso"]),
            "new_pts": number(values["Puntos por pregunta nueva"]),
            "first": int(values["Primer intervalo"]),
            "relearn": int(values["Intervalo tras un fallo"]),
            "max": int(values["Intervalo máximo"]),
            "ease0": number(values["Facilidad inicial"]),
            "ease_min": number(values["Facilidad mínima"]),
            "pen_borderline": number(values["Penalización borderline"]),
            "pen_fail": number(values["Penalización fail"]),
            "borderline_max": int(values["Repaso máximo tras borderline"]),
            "spans": spans,
            "phases": phases,
            "sources": sources,
            "levels": [x.strip() for x in values["Niveles"].split(",")],
        }
    except KeyError as missing:
        sys.exit(f"Falta el ajuste {missing} en {SCHEDULE.name}")
    order = [s["levels"].index(level) if level in s["levels"] else -1
             for _, (_, _, level) in sorted(phases.items())]
    if -1 in order or order != sorted(order):
        sys.exit("Cada fase debe ser de un nivel de «Niveles», y las fases deben ir en ese orden.")
    for path, topic, phase, prio in sources:
        if phase not in phases:
            sys.exit(f"La fuente {path} pide la fase {phase}, que no está definida.")
        if prio not in spans:
            sys.exit(f"La fuente {path} tiene la prioridad «{prio}», que no está en el reparto.")
    return s


# ---------------------------------------------------------------- rows and the rules

class Row:
    def __init__(self, order, qid, topic, phase, title, history=None):
        self.order = order
        self.qid = qid
        self.topic = topic
        self.phase = phase          # None = retired: no longer in any source
        self.title = title
        self.history = history or []  # list of (date, event)
        self.key = None             # study-order key, set by sync for pending rows

    def copy(self):
        r = Row.__new__(Row)
        r.__dict__ = dict(self.__dict__)
        r.history = list(self.history)
        return r

    # derived state, recomputed from the history
    def reset(self, s):
        self.learned = None
        self.streak = 0
        self.lapses = 0
        self.interval = 0
        self.ease = s["ease0"]
        self.next_review = None
        self._after_fail = False
        self._last = None

    @property
    def state(self):
        if self.phase is None:
            return "retirada"
        if self.learned is None:
            return "pendiente"
        if self.streak >= 3:
            return "consolidada"
        if self.streak == 2:
            return "verificada"
        return "en repaso"

    def verified(self):
        return self.learned is not None and self.streak >= 2

    def reviews_done(self):
        return sum(1 for _, event in self.history if event in REVIEW_EVENTS)


def rnd(x):
    return int(x + 0.5)


def skip_sunday(day, s):
    return day + dt.timedelta(days=1) if s["sunday_off"] and day.weekday() == 6 else day


def step(row, day, event, s):
    """Apply one history event to the derived state. The rules of ## Reglas, in code."""
    if event == "aprendida":
        row.learned, row.streak, row.interval, row._after_fail = day, 0, 1, False
    else:
        elapsed = (day - row._last).days
        # A late review that still passes proves the memory held longer: half the delay counts.
        held = elapsed if elapsed <= row.interval else row.interval + (elapsed - row.interval) / 2
        if event == "PASS":
            if row.streak == 0:
                floor = s["relearn"] if row._after_fail else s["first"]
                row.interval = max(floor, rnd(held * row.ease))
            else:
                row.interval = max(row.interval + 1, rnd(held * row.ease))
            row.interval = min(row.interval, s["max"])
            row.streak += 1
            row._after_fail = False
        elif event == "BORDERLINE":
            row.ease = max(s["ease_min"], row.ease - s["pen_borderline"])
            row.interval = max(1, min(s["borderline_max"], rnd(held / 2)))
        elif event == "FAIL":
            row.ease = max(s["ease_min"], row.ease - s["pen_fail"])
            row.streak, row.interval, row._after_fail = 0, 1, True
            row.lapses += 1
    row._last = day
    row.next_review = skip_sunday(day + dt.timedelta(days=row.interval), s)


def replay(row, s):
    row.reset(s)
    for day, event in row.history:
        step(row, day, event, s)


def record(row, day, event, s):
    row.history.append((day, event))
    step(row, day, event, s)


# ---------------------------------------------------------------- file model

def split_cells(line):
    cells = re.split(r"(?<!\\)\|", line.strip())[1:-1]
    return [c.strip().replace("\\|", "|") for c in cells]


def cell(text):
    return str(text).replace("|", "\\|")


def load():
    if not SCHEDULE.exists():
        sys.exit(f"No existe {SCHEDULE}.")
    text = SCHEDULE.read_text(encoding="utf-8")
    head, _, table = text.partition(TABLE_HEADING)
    head = GENERATED.sub(GEN_START + "\n" + GEN_END, head)
    s = parse_settings(head)
    rows = []
    for line in table.splitlines():
        if not line.startswith("|") or line.startswith("|---") or line.startswith("| #"):
            continue
        c = split_cells(line)
        history = []
        for item in filter(None, (part.strip() for part in c[11].split("·"))):
            date_text, event = item.split(" ", 1)
            history.append((dt.date.fromisoformat(date_text), event.strip()))
        phase = int(c[3]) if c[3].isdigit() else None
        row = Row(int(c[0]), c[1], c[2], phase, c[4], history)
        replay(row, s)
        rows.append(row)
    return head, s, rows


def ordered(rows):
    """Learned questions first (in the order they were learned), then the study route, then the
    retired ones. The # column is this position."""
    learned = sorted((r for r in rows if r.phase is not None and r.learned),
                     key=lambda r: (r.learned, r.order))
    pending = sorted((r for r in rows if r.phase is not None and not r.learned),
                     key=lambda r: (r.phase, r.key if r.key is not None else float("inf"), r.order))
    retired = sorted((r for r in rows if r.phase is None), key=lambda r: r.order)
    result = learned + pending + retired
    for n, r in enumerate(result, 1):
        r.order = n
    return result


def save(head, s, rows, today):
    rows = ordered(rows)
    block = GEN_START + "\n\n" + generated_sections(s, rows, today) + "\n" + GEN_END
    head = GENERATED.sub(lambda _: block, head) if GEN_START in head else head.rstrip() + "\n\n" + block
    lines = [TABLE_HEADING, "",
             "| " + " | ".join(COLUMNS) + " |",
             "|" + "|".join("---" for _ in COLUMNS) + "|"]
    for r in rows:
        history = " · ".join(f"{d.isoformat()} {e}" for d, e in r.history)
        values = [r.order, r.qid, r.topic, r.phase if r.phase is not None else "—", cell(r.title),
                  r.learned.isoformat() if r.learned else "", r.streak if r.learned else "",
                  r.lapses if r.learned else "", r.interval if r.learned else "",
                  r.next_review.isoformat() if r.learned and r.phase is not None else "",
                  r.state, history]
        lines.append("| " + " | ".join(str(v) for v in values) + " |")
    SCHEDULE.write_text(head.rstrip() + "\n\n" + "\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- the source banks

def read_bank(path, stars):
    """The questions of one bank carrying exactly `stars` stars, in the order the file holds them."""
    lines = (BANKS / path).read_text(encoding="utf-8").splitlines()
    titles = {}
    for line in lines:
        m = INDEX_ENTRY.match(line)
        if m:
            titles.setdefault(m.group(2), m.group(1).strip())
    found = []
    for line in lines:
        m = BOLD_LINE.match(line)
        if m and m.group(3).count("⭐") == stars:
            qid, question = m.group(1), m.group(2).strip()
            found.append((qid, titles.get(qid) or (question[:80] + ("…" if len(question) > 80 else ""))))
    return found


def sync(rows, s):
    """Make the schedule match the banks: add new questions, drop pending ones that left them,
    retire learned ones that left them, and recompute the study order of everything pending.

    Each source spreads its questions evenly, in bank order, over a stretch of its phase
    ("Reparto por prioridad"): a high-priority bank starts first and finishes earliest, so the route
    front-loads what matters most for the job while every day still mixes topics. Positions are
    taken over the bank's whole list, learned questions included, so a question a rebuilt bank gains
    in an early section comes up next."""
    known = {r.qid: r for r in rows}
    seen, unreadable, report = set(), set(), {"añadidas": [], "quitadas": [], "retiradas": [],
                                              "reactivadas": [], "avisos": []}
    for index, (path, topic, phase, prio) in enumerate(s["sources"]):
        try:
            found = read_bank(path, s["phases"][phase][0])
        except FileNotFoundError:
            found = []
        if not found:
            unreadable.add(topic)
            report["avisos"].append(f"{path}: no se puede leer o no tiene preguntas de la fase {phase}; "
                                    "sus filas se dejan como estaban")
            continue
        for i, (qid, title) in enumerate(found):
            begin, end = s["spans"][prio]
            key = begin + (i + 0.5) / len(found) * (end - begin) + index * 1e-6
            row = known.get(qid)
            if row is None:
                row = Row(0, qid, topic, phase, title)
                replay(row, s)
                rows.append(row)
                known[qid] = row
                report["añadidas"].append(qid)
            elif row.phase is None:
                report["reactivadas"].append(qid)
            row.topic, row.phase, row.title, row.key = topic, phase, title, key
            seen.add(qid)
    for row in list(rows):
        if row.qid in seen or row.topic in unreadable or row.phase is None:
            continue
        if row.learned:
            row.phase = None
            report["retiradas"].append(row.qid)
        else:
            rows.remove(row)
            report["quitadas"].append(row.qid)
    return report


def print_sync(report):
    labels = {"añadidas": "Añadidas desde los bancos", "quitadas": "Quitadas (ya no están en ninguna fase)",
              "retiradas": "Retiradas con su historial (aprendidas, pero ya no están en ninguna fase)",
              "reactivadas": "Reactivadas (vuelven a una fase)"}
    for key, text in labels.items():
        if report[key]:
            print(f"{text}: {', '.join(report[key])}")
    for warning in report["avisos"]:
        print(f"Aviso: {warning}")


# ---------------------------------------------------------------- planning

def level_of(phase, s):
    return s["phases"][phase][2]


def consolidated(row):
    return row.learned is not None and row.streak >= 3


def phase_open(phase, rows, s):
    """A phase opens when every question of the earlier phases of its level is verified and every
    question of an earlier level is consolidated; once one of its questions is learned it stays
    open."""
    if any(r.phase == phase and r.learned for r in rows):
        return True
    level = level_of(phase, s)
    return all(r.verified() if level_of(r.phase, s) == level else consolidated(r)
               for r in rows if r.phase is not None and r.phase < phase)


def candidates(rows, s):
    pending = [r for r in rows if r.phase is not None and r.learned is None]
    open_phases = {p for p in {r.phase for r in pending} if phase_open(p, rows, s)}
    return sorted((r for r in pending if r.phase in open_phases),
                  key=lambda r: (r.phase, r.key if r.key is not None else float("inf"), r.order))


def due_on(day, rows):
    """Reviews due on `day`, the most at risk first: days late measured against the interval."""
    due = [r for r in rows if r.phase is not None and r.learned and r.next_review <= day]
    return sorted(due, key=lambda r: (-(day - r.next_review).days / max(r.interval, 1),
                                      r.next_review, r.order))


def plan_for(day, rows, s):
    due = due_on(day, rows)
    learned_today = sum(1 for r in rows if r.learned == day)
    reviewed_today = sum(1 for r in rows for d, e in r.history if d == day and e in REVIEW_EVENTS)
    points = (s["load"] - s["review_pts"] * (len(due) + reviewed_today)
              - s["new_pts"] * learned_today)
    allowed = max(0, min(s["new_per_day"] - learned_today, int(points // s["new_pts"])))
    return due, candidates(rows, s)[:allowed], learned_today, reviewed_today


def study_day(requested, s):
    notes, day = [], requested
    if s["sunday_off"] and day.weekday() == 6:
        notes.append("Hoy es domingo: libre. Esto es lo del lunes.")
        day = skip_sunday(day, s)
    if day < s["start"]:
        notes.append(f"El plan empieza el {fmt(s['start'])}. Esto es lo de ese día.")
        day = skip_sunday(s["start"], s)
    return day, notes


def simulate(rows, s, day, max_days):
    """Project the plan day by day, assuming every review is a pass. Returns the days and, per
    phase, the day its last new question is learned and the day it is fully verified."""
    sim = [r.copy() for r in rows]
    days, last_new, all_verified = [], {}, {}
    phases = sorted({r.phase for r in sim if r.phase is not None})
    for _ in range(max_days):
        due, new, learned_today, reviewed_today = plan_for(day, sim, s)
        days.append((day, due, new))
        for r in due:
            record(r, day, "PASS", s)
        for r in new:
            record(r, day, "aprendida", s)
            last_new[r.phase] = day
        for p in phases:
            group = [r for r in sim if r.phase == p]
            if p not in all_verified and group and all(r.verified() for r in group):
                all_verified[p] = day
        if len(all_verified) == len(phases):
            break
        day = skip_sunday(day + dt.timedelta(days=1), s)
    return days, last_new, all_verified


def fmt(day):
    return day.strftime("%d/%m/%Y")


def label(day):
    return f"{WEEKDAYS[day.weekday()]} {fmt(day)}"


def current_phase(rows, s):
    pending = candidates(rows, s)
    if pending:
        return pending[0].phase
    active = [r for r in rows if r.phase is not None]
    waiting = [r.phase for r in active if r.learned is None]
    if waiting:
        nxt = min(waiting)
        level = level_of(nxt, s)
        blocking = [r.phase for r in active if r.phase < nxt and not (
            r.verified() if level_of(r.phase, s) == level else consolidated(r))]
        if blocking:
            return min(blocking)
    unverified = sorted({r.phase for r in active if not r.verified()})
    return unverified[0] if unverified else (max((r.phase for r in active), default=None))


def phase_stats(rows, s):
    out = []
    for p, (stars, name, level) in sorted(s["phases"].items()):
        group = [r for r in rows if r.phase == p]
        out.append({
            "phase": p, "stars": "⭐" * stars, "name": name, "level": level, "total": len(group),
            "learned": sum(1 for r in group if r.learned),
            "verified": sum(1 for r in group if r.verified()),
            "consolidated": sum(1 for r in group if consolidated(r)),
            "open": bool(group) and phase_open(p, rows, s),
            "topics": list(dict.fromkeys(t for _, t, ph, _ in s["sources"] if ph == p)),
        })
    return out


def current_level(rows, s):
    phase = current_phase(rows, s)
    return level_of(phase, s) if phase else s["levels"][0]


def level_line(rows, s, spanish=True):
    level = current_level(rows, s)
    later = s["levels"][s["levels"].index(level) + 1:]
    if spanish:
        return (f"**Nivel actual: {level}.**" + (f" Después vendrán {' y '.join(later)}." if later else "")
                + " Un nivel no empieza hasta que todas las preguntas del anterior estén consolidadas.")
    return (f"**Current level: {level}.**" + (f" Then {' and '.join(later)}." if later else "")
            + " A level starts only once every question of the one before is consolidated.")


def pct(part, whole):
    return f"{round(100 * part / whole)}%" if whole else "—"


def hard(rows):
    return [r for r in rows if r.phase is not None and r.lapses >= 2]


# ---------------------------------------------------------------- generated sections

def generated_sections(s, rows, today):
    day, _ = study_day(today, s)
    days, last_new, all_verified = simulate(rows, s, day, 500)
    overdue = sum(1 for r in rows if r.phase is not None and r.learned and r.next_review < today)
    out = ["## Estado", "", f"_Calculado por `spaced.py` el {fmt(today)}._", "",
           level_line(rows, s), "",
           "| Fase | Preguntas | Aprendidas | Verificadas | Consolidadas | Situación |",
           "|---|---|---|---|---|---|"]
    stats = phase_stats(rows, s)
    for i, st in enumerate(stats):
        p = st["phase"]
        new_level = i > 0 and stats[i - 1]["level"] != st["level"]
        if not st["total"]:
            situation = "por planificar contigo cuando termine la fase anterior"
        elif st["verified"] == st["total"]:
            situation = "completa"
        elif st["open"]:
            situation = (f"abierta · última nueva prevista {fmt(last_new[p])}" if p in last_new
                         else "abierta · todas aprendidas") + (
                f" · verificada entera hacia el {fmt(all_verified[p])}" if p in all_verified else "")
        else:
            situation = (f"se abre cuando estén consolidadas todas las del nivel {stats[i - 1]['level']}"
                         if new_level else "se abre cuando estén verificadas todas las de la fase anterior") + (
                f" (previsto: empieza hacia el {fmt(min(d for d, _, new in days if any(r.phase == p for r in new)))})"
                if any(r.phase == p for _, _, new in days for r in new) else "")
        out.append(f"| {p} · {st['level']} · {st['stars']} {st['name']} | {st['total']} | "
                   f"{st['learned']} ({pct(st['learned'], st['total'])}) | {st['verified']} | "
                   f"{st['consolidated']} | {situation} |")
    difficult = hard(rows)
    out += ["", f"Repasos atrasados: {overdue} · Difíciles (2 fallos o más): "
                f"{', '.join(r.qid for r in difficult) if difficult else 'ninguna'}", "",
            "### Por tema", "",
            "| Tema | Fase | Prioridad | Preguntas | Aprendidas | Verificadas | Consolidadas |",
            "|---|---|---|---|---|---|---|"]
    for path, topic, phase, prio in s["sources"]:
        group = [r for r in rows if r.topic == topic and r.phase is not None]
        out.append(f"| {topic} | {phase} | {prio} | {len(group)} | {sum(1 for r in group if r.learned)} | "
                   f"{sum(1 for r in group if r.verified())} | "
                   f"{sum(1 for r in group if r.learned and r.streak >= 3)} |")
    out += ["", "## Próximos días", "",
            "Previsión suponiendo que todos los repasos salen bien; se recalcula con cada resultado.", "",
            "| Día | Repasos | Nuevas | Preguntas nuevas |", "|---|---|---|---|"]
    for d, due, new in days[:6]:
        out.append(f"| {label(d)} | {len(due)} | {len(new)} | {' · '.join(r.qid for r in new) or '—'} |")
    out += ["", "## Evolución", "", "Una fila por semana de estudio, sacada del historial de cada pregunta.", ""]
    events = [(d, e) for r in rows for d, e in r.history]
    if not events:
        out.append("Aún sin actividad.")
        return "\n".join(out) + "\n"
    out += ["| Semana del | Nuevas | Repasos | PASS | BORDERLINE | FAIL | Aprendidas (acum.) | Verificadas (acum.) |",
            "|---|---|---|---|---|---|---|---|"]
    first, last = min(d for d, _ in events), max(d for d, _ in events)
    week = first - dt.timedelta(days=first.weekday())
    while week <= last:
        end = week + dt.timedelta(days=6)
        inside = [e for d, e in events if week <= d <= end]
        learned = sum(1 for r in rows if r.learned and r.learned <= end)
        verified = 0
        for r in rows:
            past = r.copy()
            past.history = [(d, e) for d, e in r.history if d <= end]
            replay(past, s)
            verified += past.verified()
        out.append(f"| {fmt(week)} | {inside.count('aprendida')} | "
                   f"{sum(1 for e in inside if e in REVIEW_EVENTS)} | {inside.count('PASS')} | "
                   f"{inside.count('BORDERLINE')} | {inside.count('FAIL')} | {learned} | {verified} |")
        week += dt.timedelta(days=7)
    return "\n".join(out) + "\n"


def progress_block(s, rows, today):
    """The summary PROGRESS.md carries, in English like the rest of that file."""
    day, _ = study_day(today, s)
    _, last_new, all_verified = simulate(rows, s, day, 500)
    lines = [level_line(rows, s, spanish=False), "",
             "| Phase | Level | Scope | Questions | Learned | Verified | Consolidated | Status |",
             "|---|---|---|---|---|---|---|---|"]
    stats = phase_stats(rows, s)
    for i, st in enumerate(stats):
        p = st["phase"]
        scope = f"{st['stars']} — {', '.join(st['topics'])}" if st["topics"] else st["stars"]
        if not st["total"]:
            lines.append(f"| {p} | {st['level']} | {scope} | — | — | — | — | to be planned with Victor when phase {p - 1} ends |")
            continue
        if st["verified"] == st["total"]:
            status = "complete"
        elif st["open"]:
            status = "open" + (f" · last new projected {last_new[p].isoformat()}" if p in last_new else "") + (
                f" · fully verified ~{all_verified[p].isoformat()}" if p in all_verified else "")
        elif i > 0 and stats[i - 1]["level"] != st["level"]:
            status = f"locked until every {stats[i - 1]['level']} question is consolidated"
        else:
            status = f"locked until phase {p - 1} is fully verified"
        lines.append(f"| {p} | {st['level']} | {scope} | {st['total']} | {st['learned']}/{st['total']} "
                     f"({pct(st['learned'], st['total'])}) | {st['verified']} | {st['consolidated']} | {status} |")
    overdue = sum(1 for r in rows if r.phase is not None and r.learned and r.next_review < today)
    difficult = hard(rows)
    lines += ["", f"Overdue reviews: {overdue} · Hard questions (2+ fails): "
                  f"{', '.join(r.qid for r in difficult) if difficult else 'none'} · "
                  f"Updated {today.isoformat()}."]
    return "\n".join(lines)


# ---------------------------------------------------------------- commands

def print_progress(rows, s):
    parts = []
    for st in phase_stats(rows, s):
        if st["total"] and (st["open"] or st["learned"]):
            parts.append(f"fase {st['phase']}: {st['learned']}/{st['total']} aprendidas · "
                         f"{st['verified']} verificadas · {st['consolidated']} consolidadas")
    print("Progreso: " + " | ".join(parts) if parts else "Progreso: sin fases abiertas.")


def cmd_hoy(args):
    head, s, rows = load()
    today = args.fecha or dt.date.today()
    report = sync(rows, s)
    if any(report[k] for k in ("añadidas", "quitadas", "retiradas", "reactivadas")):
        save(head, s, rows, today)
    day, notes = study_day(today, s)
    due, new, learned_today, reviewed_today = plan_for(day, rows, s)
    phase = current_phase(rows, s)

    name = s["phases"].get(phase, (0, ""))[1] if phase else ""
    print(f"Interview-prep · {label(day)} · nivel {current_level(rows, s)}"
          + (f" · fase {phase}: {name}" if phase else ""))
    for note in notes:
        print(note)
    print_sync(report)
    if learned_today or reviewed_today:
        print(f"Ya hecho este día: {learned_today} nuevas, {reviewed_today} repasos.")

    print(f"\n1) Repasa primero ({len(due)}):")
    for i, r in enumerate(due, 1):
        late = (day - r.next_review).days
        late_text = f", atrasado {late} día{'s' if late != 1 else ''}" if late > 0 else ""
        print(f"   {i}. {r.qid} · {r.topic} · {r.title} — repaso nº {r.reviews_done() + 1}{late_text}")
    if not due:
        print("   Nada que repasar.")

    print(f"\n2) Después estudia ({len(new)} nuevas):")
    for i, r in enumerate(new, 1):
        print(f"   {i}. {r.qid} · {r.topic} · {r.title}")
    if not new:
        waiting = candidates(rows, s)
        pending = [r for r in rows if r.phase is not None and r.learned is None]
        if waiting and learned_today >= s["new_per_day"]:
            print("   Ya has hecho las nuevas de hoy. Si te sobra tiempo: `spaced.py mas`.")
        elif waiting:
            print(f"   Hoy ninguna: los repasos ya llenan el día. Ponte al día primero; "
                  f"si aun así te sobra tiempo: `spaced.py mas`.")
        elif pending:
            nxt = min(r.phase for r in pending)
            level = level_of(nxt, s)
            earlier = [r for r in rows if r.phase is not None and r.phase < nxt]
            blocking = [r.qid for r in earlier
                        if not (r.verified() if level_of(r.phase, s) == level else consolidated(r))]
            rule = ("estén consolidadas todas las del nivel anterior"
                    if any(level_of(r.phase, s) != level for r in earlier)
                    else "estén verificadas todas las de la fase anterior")
            print(f"   Ninguna: la fase {nxt} ({level}) se abre cuando {rule}. "
                  f"Faltan {len(blocking)}: {', '.join(blocking[:12])}{' …' if len(blocking) > 12 else ''}")
        else:
            last = max(s["phases"]) if s["phases"] else 0
            print("   Ya no quedan preguntas nuevas en las fases planificadas."
                  + (f" Toca planificar con Víctor la fase {last + 1}." if all(
                      r.verified() for r in rows if r.phase is not None) else ""))
    else:
        print("   Si terminas y te sobra tiempo: `spaced.py mas`.")
    print()
    print_progress(rows, s)


def cmd_mas(args):
    head, s, rows = load()
    report = sync(rows, s)
    if any(report[k] for k in ("añadidas", "quitadas", "retiradas", "reactivadas")):
        save(head, s, rows, args.fecha or dt.date.today())
    print_sync(report)
    nxt = candidates(rows, s)[:args.n]
    if not nxt:
        print("No hay más preguntas nuevas abiertas ahora mismo.")
        return
    print(f"Siguientes {len(nxt)} nuevas en el orden de estudio:")
    for i, r in enumerate(nxt, 1):
        print(f"   {i}. {r.qid} · {r.topic} · {r.title}")


def cmd_registrar(args):
    head, s, rows = load()
    day = args.fecha or dt.date.today()
    row = next((r for r in rows if r.qid.lower() == args.id.lower()), None)
    if row is None:
        sys.exit(f"No encuentro {args.id} en {SCHEDULE.name}.")
    if args.corregir:
        if not any(d == day for d, _ in row.history):
            sys.exit(f"{row.qid} no tiene ningún registro el {fmt(day)} que corregir.")
        row.history = [(d, e) for d, e in row.history if d != day]
        replay(row, s)
    result = args.resultado.lower()
    if result == "aprendida":
        if row.learned:
            sys.exit(f"{row.qid} ya se aprendió el {fmt(row.learned)}. Registra un repaso.")
        if row.phase is not None and row not in candidates(rows, s)[:s["new_per_day"]]:
            print(f"Aviso: {row.qid} no era la siguiente en el orden de estudio; se registra igual.")
        record(row, day, "aprendida", s)
    else:
        if row.learned is None:
            sys.exit(f"{row.qid} aún no está aprendida. Registra primero 'aprendida'.")
        if any(d == day for d, _ in row.history):
            sys.exit(f"{row.qid} ya tiene un registro el {fmt(day)}: solo cuenta un intento por día. "
                     "Usa --corregir si el veredicto se anotó mal.")
        if row.next_review > day:
            print(f"Aviso: el repaso tocaba el {fmt(row.next_review)}; se registra adelantado.")
        record(row, day, result.upper(), s)
    save(head, s, rows, day)
    print(f"{row.qid}: {result} el {fmt(day)} · racha {row.streak} · fallos {row.lapses} · "
          f"{row.state} · próximo repaso {label(row.next_review)} (en {row.interval} "
          f"día{'s' if row.interval != 1 else ''})")


def cmd_calendario(args):
    head, s, rows = load()
    sync(rows, s)
    day, notes = study_day(args.fecha or dt.date.today(), s)
    for note in notes:
        print(note)
    days, last_new, all_verified = simulate(rows, s, day, 500)
    print(f"{'Fecha':<22}{'Repasos':>8}{'Nuevas':>8}  Preguntas nuevas")
    for d, due, new in days[:args.dias]:
        print(f"{label(d):<22}{len(due):>8}{len(new):>8}  {' '.join(r.qid for r in new)}")
    for p in sorted(s["phases"]):
        if p in last_new:
            print(f"\nFase {p}: última nueva prevista {label(last_new[p])}"
                  + (f"; verificada entera hacia el {label(all_verified[p])}" if p in all_verified else "")
                  + " (si todos los repasos salen bien).")


def cmd_estado(args):
    head, s, rows = load()
    sync(rows, s)
    today = args.fecha or dt.date.today()
    print(generated_sections(s, ordered(rows), today).split("## Próximos días")[0].rstrip())


def cmd_sincronizar(args):
    head, s, rows = load()
    report = sync(rows, s)
    save(head, s, rows, args.fecha or dt.date.today())
    print_sync(report)
    if not any(report[k] for k in ("añadidas", "quitadas", "retiradas", "reactivadas")):
        print("Sin cambios en las preguntas; orden de estudio recalculado.")


def cmd_progreso(args):
    head, s, rows = load()
    today = args.fecha or dt.date.today()
    report = sync(rows, s)
    block = progress_block(s, ordered(rows), today)
    if not args.escribir:
        print(block)
        return
    save(head, s, rows, today)  # refreshes Estado, Próximos días and Evolución in schedule.md
    print_sync(report)
    text = PROGRESS.read_text(encoding="utf-8")
    newline = "\r\n" if "\r\n" in text else "\n"
    if PROGRESS_START not in text:
        sys.exit(f"No encuentro el bloque del repaso espaciado en {PROGRESS}.")
    new_text = PROGRESS_BLOCK.sub(
        lambda _: newline.join([PROGRESS_START, "", *block.split("\n"), "", PROGRESS_END]), text)
    if new_text == text:
        print("PROGRESS.md ya estaba al día.")
        return
    PROGRESS.write_text(new_text, encoding="utf-8", newline="")
    print("PROGRESS.md actualizado:\n" + block)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    date_arg = {"type": dt.date.fromisoformat, "help": "fecha AAAA-MM-DD (por defecto, hoy)"}

    p = sub.add_parser("hoy")
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_hoy)

    p = sub.add_parser("mas")
    p.add_argument("n", nargs="?", type=int, default=2)
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_mas)

    p = sub.add_parser("registrar")
    p.add_argument("id")
    p.add_argument("resultado", choices=["aprendida", "pass", "borderline", "fail"])
    p.add_argument("--fecha", **date_arg)
    p.add_argument("--corregir", action="store_true",
                   help="sustituye el registro de ese día para esa pregunta (veredicto mal anotado)")
    p.set_defaults(func=cmd_registrar)

    p = sub.add_parser("calendario")
    p.add_argument("--dias", type=int, default=12)
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_calendario)

    p = sub.add_parser("estado")
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_estado)

    p = sub.add_parser("sincronizar")
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_sincronizar)

    p = sub.add_parser("progreso")
    p.add_argument("--escribir", action="store_true", help="escribe el resumen en PROGRESS.md")
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_progreso)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
