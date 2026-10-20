#!/usr/bin/env python3
"""Spaced-repetition scheduler for the essential interview questions.

All state lives in schedule.md, next to this script. Commands:

  hoy [--fecha AAAA-MM-DD]             today's reviews and new questions (syncs the banks first)
  registrar ID RESULTADO [--fecha ...]  RESULTADO: aprendida | pass | borderline | fail
  calendario [--dias N] [--fecha ...]   projected plan, assuming every review is a pass
  estado                                progress per topic
  sincronizar                           append new three-star questions from the source banks
  iniciar --origen TEXTO                build schedule.md from the source banks (only once)
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCHEDULE = HERE / "schedule.md"
BANKS = HERE.parent  # notes/interview-prep
TABLE_HEADING = "## Preguntas"
COLUMNS = ["#", "ID", "Tema", "Título", "Origen", "Aprendida", "Racha",
           "Próximo repaso", "Estado", "Historial"]
REVIEW_EVENTS = ("PASS", "BORDERLINE", "FAIL")
WEEKDAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

BOLD_LINE = re.compile(r"^\*\*\[([^\]]+)\]\s*(.+?)\*\*(.*)$")
INDEX_ENTRY = re.compile(r"^- \[\d{3} — (.+?)\]\(#([^)]+)\)")


# ---------------------------------------------------------------- file model

class Row:
    def __init__(self, order, qid, topic, title, origin,
                 learned=None, streak=0, next_review=None, history=None):
        self.order = order
        self.qid = qid
        self.topic = topic
        self.title = title
        self.origin = origin
        self.learned = learned
        self.streak = streak
        self.next_review = next_review
        self.history = history or []  # list of (date, event)

    @property
    def state(self):
        if self.learned is None:
            return "pendiente"
        if self.streak >= 3:
            return "consolidada"
        if self.streak == 2:
            return "verificada"
        return "en repaso"

    def reviews_done(self):
        return sum(1 for _, event in self.history if event in REVIEW_EVENTS)

    def copy(self):
        return Row(self.order, self.qid, self.topic, self.title, self.origin,
                   self.learned, self.streak, self.next_review, list(self.history))


def parse_date(text):
    return dt.date.fromisoformat(text.strip()) if text.strip() else None


def split_cells(line):
    cells = re.split(r"(?<!\\)\|", line.strip())[1:-1]
    return [cell.strip().replace("\\|", "|") for cell in cells]


def cell(text):
    return str(text).replace("|", "\\|")


def load():
    if not SCHEDULE.exists():
        sys.exit(f"No existe {SCHEDULE}. Ejecuta primero: spaced.py iniciar --origen \"...\"")
    text = SCHEDULE.read_text(encoding="utf-8")
    head, _, table = text.partition(TABLE_HEADING)
    settings = parse_settings(head)
    rows = []
    for line in table.splitlines():
        if not line.startswith("|") or line.startswith("|---") or line.startswith("| #"):
            continue
        c = split_cells(line)
        history = []
        for item in filter(None, (part.strip() for part in c[9].split("·"))):
            date_text, event = item.split(" ", 1)
            history.append((parse_date(date_text), event.strip()))
        rows.append(Row(int(c[0]), c[1], c[2], c[3], c[4], parse_date(c[5]),
                        int(c[6] or 0), parse_date(c[7]), history))
    return head, settings, rows


def parse_settings(head):
    values = dict(re.findall(r"^- ([^:\n]+): (.+)$", head, flags=re.MULTILINE))
    sources = re.findall(r"^- Fuente: (\S+) \| (.+)$", head, flags=re.MULTILINE)
    try:
        return {
            "start": dt.date.fromisoformat(values["Inicio"].strip()),
            "new_per_day": int(values["Nuevas por día"]),
            "block": float(values["Minutos del bloque"]),
            "new_min": float(values["Minutos por pregunta nueva"].replace(",", ".")),
            "review_min": float(values["Minutos por repaso"].replace(",", ".")),
            "intervals": [int(x) for x in values["Intervalos (días)"].split(",")],
            "sources": [(path, topic.strip()) for path, topic in sources],
        }
    except KeyError as missing:
        sys.exit(f"Falta el ajuste {missing} en {SCHEDULE.name}")


def save(head, rows):
    lines = [TABLE_HEADING, "",
             "| " + " | ".join(COLUMNS) + " |",
             "|" + "|".join("---" for _ in COLUMNS) + "|"]
    for r in sorted(rows, key=lambda r: r.order):
        history = " · ".join(f"{d.isoformat()} {e}" for d, e in r.history)
        values = [r.order, r.qid, r.topic, cell(r.title), r.origin,
                  r.learned.isoformat() if r.learned else "", r.streak,
                  r.next_review.isoformat() if r.next_review else "", r.state, history]
        lines.append("| " + " | ".join(str(v) for v in values) + " |")
    SCHEDULE.write_text(head.rstrip() + "\n\n" + "\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- scheduling

def skip_sunday(day):
    return day + dt.timedelta(days=1) if day.weekday() == 6 else day


def schedule_next(day, streak, intervals):
    gap = intervals[min(streak, len(intervals) - 1)]
    return skip_sunday(day + dt.timedelta(days=gap))


def apply(row, event, day, intervals):
    if event == "aprendida":
        row.learned, row.streak = day, 0
        row.next_review = schedule_next(day, 0, intervals)
    elif event == "PASS":
        row.streak += 1
        row.next_review = schedule_next(day, row.streak, intervals)
    elif event == "BORDERLINE":
        row.next_review = skip_sunday(day + dt.timedelta(days=1))
    elif event == "FAIL":
        row.streak = 0
        row.next_review = skip_sunday(day + dt.timedelta(days=1))
    row.history.append((day, event))


def plan_for(day, rows, s):
    """Reviews due on `day` (oldest first) and the new questions that still fit."""
    due = sorted((r for r in rows if r.learned and r.next_review and r.next_review <= day),
                 key=lambda r: (r.next_review, r.order))
    learned_today = sum(1 for r in rows if r.learned == day)
    reviewed_today = sum(1 for r in rows for d, e in r.history if d == day and e in REVIEW_EVENTS)
    budget = s["block"] - s["review_min"] * (len(due) + reviewed_today) - s["new_min"] * learned_today
    fit = max(0, int(budget // s["new_min"]))
    allowed = max(0, min(s["new_per_day"] - learned_today, fit))
    pending = sorted((r for r in rows if r.learned is None), key=lambda r: r.order)
    return due, pending[:allowed], learned_today, reviewed_today


def study_day(requested, s):
    """The day the plan speaks about: never a Sunday, never before the start."""
    notes = []
    day = requested
    if day.weekday() == 6:
        notes.append("Hoy es domingo: libre. Esto es lo del lunes.")
        day = skip_sunday(day)
    if day < s["start"]:
        notes.append(f"El plan empieza el {fmt(s['start'])}. Esto es lo de ese día.")
        day = skip_sunday(s["start"])
    return day, notes


def fmt(day):
    return day.strftime("%d/%m/%Y")


def label(day):
    return f"{WEEKDAYS[day.weekday()]} {fmt(day)}"


# ---------------------------------------------------------------- source banks

def read_bank(path, topic):
    lines = (BANKS / path).read_text(encoding="utf-8").splitlines()
    titles = {}
    for line in lines:
        m = INDEX_ENTRY.match(line)
        if m:
            titles.setdefault(m.group(2), m.group(1).strip())
    found = []
    for line in lines:
        m = BOLD_LINE.match(line)
        if m and "⭐⭐⭐" in m.group(3):
            qid, question = m.group(1), m.group(2).strip()
            title = titles.get(qid) or (question[:80] + ("…" if len(question) > 80 else ""))
            found.append((qid, topic, title))
    return found


def three_star_questions(s):
    return {path: read_bank(path, topic) for path, topic in s["sources"]}


def sync(head, s, rows, today):
    banks = three_star_questions(s)
    known = {r.qid for r in rows}
    in_banks = {qid for found in banks.values() for qid, _, _ in found}
    added = []
    next_order = max((r.order for r in rows), default=0) + 1
    for found in banks.values():
        for qid, topic, title in found:
            if qid not in known:
                rows.append(Row(next_order, qid, topic, title, f"añadida {today.isoformat()}"))
                known.add(qid)
                added.append(qid)
                next_order += 1
    gone = [r.qid for r in rows if r.qid not in in_banks]
    if added:
        save(head, rows)
    return added, gone


# ---------------------------------------------------------------- commands

def cmd_hoy(args):
    head, s, rows = load()
    today = args.fecha or dt.date.today()
    added, gone = sync(head, s, rows, today)
    day, notes = study_day(today, s)
    due, new, learned_today, reviewed_today = plan_for(day, rows, s)

    print(f"Interview-prep · {label(day)}")
    for note in notes:
        print(note)
    if added:
        print(f"Añadidas desde los bancos: {', '.join(added)}")
    if gone:
        print(f"Ya no son ⭐⭐⭐ o no existen en los bancos (se conservan): {', '.join(gone)}")
    if learned_today or reviewed_today:
        print(f"Ya hecho este día: {learned_today} nuevas, {reviewed_today} repasos.")

    print(f"\n1) Repasa primero ({len(due)}):")
    for i, r in enumerate(due, 1):
        late = f", atrasado desde el {fmt(r.next_review)}" if r.next_review < day else ""
        print(f"   {i}. {r.qid} · {r.topic} · {r.title} — repaso nº {r.reviews_done() + 1}{late}")
    if not due:
        print("   Nada que repasar.")

    print(f"\n2) Después estudia ({len(new)} nuevas):")
    for i, r in enumerate(new, 1):
        print(f"   {i}. {r.qid} · {r.topic} · {r.title}")
    if not new:
        pending = sum(1 for r in rows if r.learned is None)
        print("   Ninguna más hoy." if pending else "   Ya no quedan preguntas nuevas.")

    minutes = s["review_min"] * len(due) + s["new_min"] * len(new)
    print(f"\nTiempo estimado: {minutes:g} de {s['block']:g} min.")
    print_progress(rows)


def cmd_registrar(args):
    head, s, rows = load()
    day = args.fecha or dt.date.today()
    row = next((r for r in rows if r.qid.lower() == args.id.lower()), None)
    if row is None:
        sys.exit(f"No encuentro {args.id} en {SCHEDULE.name}.")
    result = args.resultado.lower()
    if result == "aprendida":
        if row.learned:
            sys.exit(f"{row.qid} ya se aprendió el {fmt(row.learned)}. Registra un repaso.")
        apply(row, "aprendida", day, s["intervals"])
    else:
        event = result.upper()
        if row.learned is None:
            sys.exit(f"{row.qid} aún no está aprendida. Registra primero 'aprendida'.")
        same_day = any(d == day for d, _ in row.history)
        if same_day and not args.forzar:
            sys.exit(f"{row.qid} ya tiene un registro el {fmt(day)}: solo cuenta un intento por "
                     "día. Usa --forzar si es una corrección.")
        if row.next_review and row.next_review > day:
            print(f"Aviso: el repaso tocaba el {fmt(row.next_review)}; se registra adelantado.")
        apply(row, event, day, s["intervals"])
    save(head, rows)
    nxt = f"próximo repaso {label(row.next_review)}" if row.next_review else "sin repaso"
    print(f"{row.qid}: {result} el {fmt(day)} · racha {row.streak} · {row.state} · {nxt}")


def cmd_calendario(args):
    _, s, rows = load()
    sim = [r.copy() for r in rows]
    day, notes = study_day(args.fecha or dt.date.today(), s)
    for note in notes:
        print(note)
    print(f"{'Fecha':<22}{'Repasos':>8}{'Nuevas':>8}{'Min':>6}  Preguntas nuevas")
    last_new = None
    for _ in range(args.dias):
        due, new, learned_today, reviewed_today = plan_for(day, sim, s)
        minutes = s["review_min"] * (len(due) + reviewed_today) + s["new_min"] * (len(new) + learned_today)
        print(f"{label(day):<22}{len(due):>8}{len(new):>8}{minutes:>6g}  {' '.join(r.qid for r in new)}")
        for r in due:
            apply(r, "PASS", day, s["intervals"])
        for r in new:
            apply(r, "aprendida", day, s["intervals"])
            last_new = day
        day = skip_sunday(day + dt.timedelta(days=1))
    pending = sum(1 for r in sim if r.learned is None)
    if pending:
        print(f"\nQuedan {pending} preguntas sin empezar al final de este periodo.")
    elif last_new:
        print(f"\nÚltima pregunta nueva prevista: {label(last_new)} (si todos los repasos salen bien).")


def print_progress(rows):
    total = len(rows)
    learned = sum(1 for r in rows if r.learned)
    verified = sum(1 for r in rows if r.streak >= 2)
    consolidated = sum(1 for r in rows if r.streak >= 3)
    annex = [r for r in rows if r.origin.startswith("anexo")]
    annex_ok = sum(1 for r in annex if r.streak >= 2)
    print(f"Progreso: {learned}/{total} aprendidas · {verified} verificadas · "
          f"{consolidated} consolidadas · criterio E {annex_ok}/{len(annex)}")


def cmd_estado(args):
    _, s, rows = load()
    print(f"{'Tema':<14}{'Total':>6}{'Aprendidas':>12}{'Verificadas':>13}{'Consolidadas':>14}")
    for topic in dict.fromkeys(r.topic for r in sorted(rows, key=lambda r: r.order)):
        group = [r for r in rows if r.topic == topic]
        print(f"{topic:<14}{len(group):>6}{sum(1 for r in group if r.learned):>12}"
              f"{sum(1 for r in group if r.streak >= 2):>13}{sum(1 for r in group if r.streak >= 3):>14}")
    today = dt.date.today()
    late = sum(1 for r in rows if r.next_review and r.next_review < today)
    print()
    print_progress(rows)
    print(f"Repasos atrasados: {late}")


def cmd_sincronizar(args):
    head, s, rows = load()
    added, gone = sync(head, s, rows, args.fecha or dt.date.today())
    print(f"Añadidas: {', '.join(added) if added else 'ninguna'}")
    if gone:
        print(f"Ya no son ⭐⭐⭐ o no existen en los bancos (se conservan): {', '.join(gone)}")


def cmd_iniciar(args):
    if not SCHEDULE.exists():
        sys.exit(f"Crea antes {SCHEDULE.name} con su cabecera y sus ajustes.")
    head, s, rows = load()
    if rows:
        sys.exit(f"{SCHEDULE.name} ya tiene preguntas; usa 'sincronizar' para añadir nuevas.")
    banks = three_star_questions(s)
    # Interleave the banks so every study day mixes topics: each question is placed at its
    # relative position inside its own bank, ties broken by the order of the sources.
    ranked = []
    for priority, (path, _) in enumerate(s["sources"]):
        found = banks[path]
        for i, (qid, topic, title) in enumerate(found):
            ranked.append(((i + 0.5) / len(found), priority, qid, topic, title))
    ranked.sort(key=lambda item: (item[0], item[1]))
    rows = [Row(n, qid, topic, title, args.origen)
            for n, (_, _, qid, topic, title) in enumerate(ranked, 1)]
    save(head, rows)
    print(f"{len(rows)} preguntas escritas en {SCHEDULE.name}.")


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

    p = sub.add_parser("registrar")
    p.add_argument("id")
    p.add_argument("resultado", choices=["aprendida", "pass", "borderline", "fail"])
    p.add_argument("--fecha", **date_arg)
    p.add_argument("--forzar", action="store_true", help="permite un segundo registro el mismo día")
    p.set_defaults(func=cmd_registrar)

    p = sub.add_parser("calendario")
    p.add_argument("--dias", type=int, default=12)
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_calendario)

    sub.add_parser("estado").set_defaults(func=cmd_estado)

    p = sub.add_parser("sincronizar")
    p.add_argument("--fecha", **date_arg)
    p.set_defaults(func=cmd_sincronizar)

    p = sub.add_parser("iniciar")
    p.add_argument("--origen", required=True)
    p.set_defaults(func=cmd_iniciar)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
