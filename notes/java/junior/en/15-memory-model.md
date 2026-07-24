# Memory Model — Stack, Heap, and Garbage Collection

> 📖 [Baeldung — Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap)
> 📖 [Baeldung — Java Memory Management](https://www.baeldung.com/java-memory-management)

Every file so far has quietly leaned on how Java stores things in memory without ever naming it. When you learned that a variable of a parent type can hold any subclass object (file [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md), dynamic dispatch), or that a `List<User>` holds a bunch of `User` objects (file [07-collections.md](07-collections.md)), or that `result += name` in a loop is slow because each `+` makes a *new* `String` (file [01-variables-types.md](01-variables-types.md)) — all three of those facts are really statements about *where objects live* and *how references point at them*. This is the file where those pieces finally fit together.

The reason this comes last is that you needed to have seen objects, references, and the call stack in action before the memory picture means anything. Now you have. This file answers three questions that interviewers ask precisely because they separate someone who has written Java from someone who has only read it: *"does the caller see the change if I modify an object inside a method?"*, *"where does a `NullPointerException` actually come from?"*, and *"how is memory freed in Java if there's no `free()`?"*. All three have the same root: the split between the **stack** and the **heap**.

> **Why you should care about memory in a language that manages it for you.** Java hides memory management — you never call `malloc` or `free` like in C. But "hidden" is not "gone". The stack/heap split is what makes pass-by-value behave the way it does, what makes `null` possible, and what makes `StringBuilder` faster than `+` in a loop. You don't manage memory by hand, but you reason about it constantly — every one of those interview questions is really a memory question in disguise.

---

## Pass-by-value — Java has no pass-by-reference

> Docs: https://www.baeldung.com/java-pass-by-value-or-pass-by-reference → read: the whole page, especially "Passing Object Types"

This is the single most misunderstood thing in Java, and interviewers ask it exactly *because* it's misunderstood. The claim they want you to react to is: **"Java is pass-by-reference for objects."** It is not. Java is **always** pass-by-value — for primitives *and* for objects. The confusion comes from what the "value" actually is when you pass an object.

Start with the pain. You write a method that takes an object, changes it, and you're not sure whether the change survives after the method returns. Sometimes it does, sometimes it doesn't, and the rule feels arbitrary until you see the mechanism. Once you do, it's completely predictable.

Here is the rule in one sentence, and the rest of the section proves it: **Java copies the argument into the parameter. For a primitive, it copies the value. For an object, it copies the *reference* (the arrow pointing at the object) — never the object itself.**

### Case 1 — primitives: the copy is the value, so the caller never sees a change

A primitive variable (`int`, `long`, `boolean`, `double` — the types from file [01-variables-types.md](01-variables-types.md)) *is* its value. When you pass it to a method, Java copies that value into the parameter. The method works on its own copy; the original is untouched.

```java
public class Demo {
    static void tryToChange(int x) {
        x = 999;              // changes only this method's copy
    }

    public static void main(String[] args) {
        int age = 30;
        tryToChange(age);
        System.out.println(age);   // 30 — NOT 999
    }
}
```

The caller sees `30`. Inside `tryToChange`, `x` is a brand-new variable holding a *copy* of `30`; assigning `999` to it overwrites the copy and nothing else. The `age` in `main()` was never in the room.

> **Why isn't this obvious?** Because in a single method, `x = 999` obviously changes `x`. What's non-obvious is that `x` and `age` are two *different* variables that briefly held the same number. The `=` only ever rebinds the local name. This is the whole idea of pass-by-value in one line: **the method gets a copy of the value, not the caller's variable.**

### Case 2 — objects: the copy is the reference, so mutation is visible but reassignment is not

Objects live somewhere in memory, and your variable doesn't hold the object — it holds a **reference**, an arrow pointing at where the object lives. (The next section draws exactly where.) When you pass an object to a method, Java copies *the arrow*. Now two arrows — the caller's and the method's parameter — point at the **same** object.

This produces the behaviour that trips everyone up, so we split it into the two things a method can do with that object. Use one running example: a `User` with a mutable `name` field.

```java
class User {
    String name;
    User(String name) { this.name = name; }
}
```

**Action A — mutate the object's fields → the caller SEES it.** Because both arrows point at the same object, changing a field *through* the parameter changes the one shared object.

```java
static void rename(User u) {
    u.name = "Bob";           // follows the arrow, edits the shared object
}

public static void main(String[] args) {
    User user = new User("Alice");
    rename(user);
    System.out.println(user.name);   // Bob — the caller sees it
}
```

**Action B — reassign the parameter → the caller does NOT see it.** Pointing the parameter at a *new* object only re-aims the method's own copy of the arrow. The caller's arrow still points at the original.

```java
static void replace(User u) {
    u = new User("Bob");      // re-aims only THIS method's arrow
}

public static void main(String[] args) {
    User user = new User("Alice");
    replace(user);
    System.out.println(user.name);   // Alice — unchanged
}
```

Here is why the two cases differ, drawn out. On entry to the method, both arrows point at the same `Alice` object:

```
main's `user`   ──┐
                  ├──►  [ User: name="Alice" ]      (one object, two arrows)
method's `u`    ──┘
```

**Action A** (`u.name = "Bob"`) follows the arrow and edits the object both arrows share:

```
main's `user`   ──┐
                  ├──►  [ User: name="Bob" ]        ← main sees "Bob"
method's `u`    ──┘
```

**Action B** (`u = new User("Bob")`) makes a second object and re-aims *only* the method's arrow at it. The caller's arrow never moved:

```
main's `user`   ──────►  [ User: name="Alice" ]     ← main still sees "Alice"

method's `u`    ──────►  [ User: name="Bob" ]        ← thrown away when method ends
```

> **The one test that answers "does the caller see the change?"** Ask: *did I follow the arrow, or did I re-aim the arrow?* Editing a field (`u.name = ...`, `list.add(...)`, `u.setName(...)`) follows the arrow → **visible**. Assigning the parameter itself (`u = ...`) re-aims the copied arrow → **invisible**. That single distinction resolves every version of this question.

> **Why this proves Java is not pass-by-reference.** In a true pass-by-reference language (like C++ with `&`), Action B *would* change the caller's variable, because the method would hold the caller's actual variable, not a copy of its arrow. Java's Action B provably does not — so the arrow must have been copied. The value that got copied happened to be a reference, but it was still copied by value. "Pass-by-value where the value is a reference" is the precise, correct phrasing, and it's the answer interviewers are listening for.

> **Anchor to JS/TS — this one is genuinely identical.** JavaScript behaves exactly the same way: reassigning a parameter inside a function doesn't affect the caller, but mutating an object's property does. If you already had this intuition from JS, it transfers directly — Java just makes the stack/heap reason for it explicit, which is what the next section draws.

---

## Stack vs heap — where variables and objects actually live

> Docs: https://www.baeldung.com/java-stack-heap → read: "Stack Memory in Java" and "Heap Space in Java"

The section above kept saying "the object lives somewhere" and "the variable holds an arrow." Now we name the two places. The JVM (the program that runs your compiled Java — introduced in the exception hierarchy section of file [08-exceptions.md](08-exceptions.md)) splits the memory it manages into two regions with completely different jobs:

- **The stack** — a per-method scratchpad. It holds each method's **local variables**: primitives store their actual value here, and object variables store the **reference** (the arrow) here.
- **The heap** — one big shared pool. Every object you create with `new` lives here. The heap has no notion of "which method" — objects on it are shared by whoever holds an arrow to them.

You already met the stack in file [08-exceptions.md](08-exceptions.md): it's the same **call stack** where each method call is stacked on top of the previous one and removed (LIFO) when the method returns. The exact stack from that file — `main()` at the bottom, `methodA()`, `methodB()` on top — is the structure we're talking about. Each of those stacked frames carries that method's local variables. When the method returns and its frame is popped off, all of *that frame's* locals vanish with it. (If you want the full call-stack mechanism again, it's the first section of `08-exceptions.md` — no need to reread it to follow this.)

Here's the crucial part: **the object on the heap does not vanish when a method returns.** Only the frame — and the arrow it held — goes away. This is the whole reason objects can outlive the method that created them and be passed around. Take the `User` example and draw both regions at once:

```java
public static void main(String[] args) {
    int count = 3;                       // primitive → value lives on the stack
    User user = new User("Alice");       // arrow on the stack, object on the heap
}
```

```
        STACK (per-method, LIFO)                 HEAP (shared pool)
   ┌──────────────────────────────┐        ┌──────────────────────────┐
   │ main() frame:                │        │                          │
   │    count = 3                 │        │  [ User: name="Alice" ]  │
   │    user  = ●─────────────────┼───────►│                          │
   └──────────────────────────────┘        └──────────────────────────┘
   `count` holds its value directly.        The object itself lives here,
   `user` holds only an arrow (a            reachable through the arrow on
   reference) into the heap.                the stack.
```

This one diagram explains everything from the previous section: pass-by-value copies the *stack slot*. For `count`, the slot holds a number, so you copy a number. For `user`, the slot holds an arrow, so you copy an arrow — and both arrows land on the same heap object. Mutation reaches across the arrow to the shared heap object (visible); reassignment only overwrites the arrow in the local stack slot (invisible). The rule and the picture are the same fact.

> **Why two regions instead of one?** Speed and lifetime. Stack allocation is trivially fast — pushing and popping a frame is just moving a pointer, and a variable's lifetime is exactly its method's execution, so cleanup is automatic (pop the frame). The heap must survive across methods and be shared, so it can't be tied to any single frame's lifetime — which is exactly why it needs a separate cleanup mechanism, the garbage collector in the next section.

### Where a NullPointerException really comes from

This is the concrete pay-off, and it's a guaranteed interview question (it's also listed in `08-exceptions.md` as the most common runtime failure — here's the memory-level *why* behind it). A reference variable on the stack does not have to point at anything. When it points at nothing, its value is `null` — an arrow aimed at empty space.

```
        STACK                              HEAP
   ┌──────────────────┐
   │ user = null      │   ✗  points at nothing — no object on the heap
   └──────────────────┘
```

`null` is not an object and not an error by itself — a stack slot is allowed to hold "no arrow". The failure happens the instant you try to **follow** an arrow that points at nothing — i.e. dereference it — by calling a method or reading a field on it:

```java
User user = null;
System.out.println(user.name);   // NullPointerException
```

The exact runtime message in modern Java is precise about it:

```
Exception in thread "main" java.lang.NullPointerException:
    Cannot read field "name" because "user" is null
```

> **So a `NullPointerException` is not "a broken object" — it's "no object at all".** The variable exists (it's a valid stack slot), but there's nothing on the heap at the other end of the arrow to run the method on. That's why the fixes you saw in `08-exceptions.md` all come down to *guaranteeing there's an object before you follow the arrow*: `Optional` makes the "might be null" explicit in the type, `Objects.requireNonNull` fails loudly at the boundary, and a plain `if (user != null)` checks the arrow before dereferencing it. Same mechanism, three ways to avoid it.

> **`==` vs `.equals()`, revisited from memory.** Now you can see *why* `==` compares "memory addresses" (the phrase from file [01-variables-types.md](01-variables-types.md)). `==` on two object variables compares the two arrows — are they aimed at the *same* heap object? `.equals()` follows both arrows and compares the objects' *contents*. That's the whole reason `==` on two different-but-equal `String` objects is `false`: two arrows, two heap objects, same text.

---

## Garbage collection — automatic cleanup of unreachable objects

> Docs: https://www.baeldung.com/java-memory-management → read: "Garbage Collection"

The heap fills up as you create objects, but a program that ran long enough would eventually exhaust it — unless something reclaims objects you're done with. In C or C++ *you* do it by hand: every `new`/`malloc` needs a matching `delete`/`free`, and forgetting one leaks memory while doing it twice corrupts it. Java takes that job away from you entirely. There is **no `free()` and no `delete`** in Java — you never write cleanup code for objects.

Instead the JVM runs a background process called the **garbage collector (GC)**. Its rule is simple and worth memorising because it's the exact answer to *"how is memory managed in Java?"*: **the GC reclaims a heap object once nothing can reach it any more.** "Reachable" means there's still some chain of arrows leading to it — starting from a live stack frame's local variable, a static field, and so on. The moment the last arrow pointing at an object disappears, the object is **unreachable**, and it becomes eligible to be freed. You don't trigger this and you can't predict exactly when it runs — you just stop referencing an object and trust the GC to notice.

Watch an object become unreachable using the same `User`:

```java
User user = new User("Alice");   // heap object created, one arrow to it
user = new User("Bob");          // arrow re-aimed at a new object
```

After the second line, the `Alice` object still sits on the heap but **no arrow points at it any more** — the only reference was overwritten:

```
        STACK                       HEAP
   ┌──────────────┐          [ User: name="Alice" ]   ← unreachable → GC will reclaim it
   │ user = ●─────┼───────►  [ User: name="Bob"   ]   ← reachable, in use
   └──────────────┘
```

Nothing can ever touch the `Alice` object again, so keeping it wastes memory. The GC will eventually spot that it's unreachable and reclaim the space — no code from you required.

### Why `result += name` in a loop is wasteful — the whole point, finally explained

Back in file [01-variables-types.md](01-variables-types.md) you learned that `String` is immutable: every operation returns a *new* `String` instead of changing the original, and that `result += name` in a loop "performs badly." Now you have the mechanism to see *why* it's bad, and it's a garbage-collection story.

Because `String` is immutable, `result += name` cannot edit `result` in place. It builds a **brand-new** `String` object on the heap (the old text plus the new text), and re-aims `result` at it. The previous object is now unreachable — instant garbage. Do that a thousand times in a loop and you create a thousand throwaway heap objects, each one abandoned the moment the next `+=` runs:

```java
// MAL — one new String per iteration, 999 of them left for the GC
String result = "";
for (String name : names) {   // say names has 1000 entries
    result += name;           // each += builds a new String, abandons the old one
}
```

```
iteration 1:  "A"          ← garbage after iter 2
iteration 2:  "AB"         ← garbage after iter 3
iteration 3:  "ABC"        ← garbage after iter 4
   ...        (997 more abandoned objects) ...
```

The fix is `StringBuilder` (file [01-variables-types.md](01-variables-types.md)) — a single mutable buffer you keep appending to, so there's **one** object the whole time instead of a fresh one per iteration:

```java
// BIEN — one StringBuilder, appended in place, no per-iteration garbage
StringBuilder sb = new StringBuilder();
for (String name : names) {
    sb.append(name);          // edits the same buffer, no new object
}
String result = sb.toString();   // one final String at the end
```

> **What "wasteful" actually costs.** It's two costs, not one. First, *allocation*: building 1000 short-lived objects takes time and heap space. Second, *collection*: every one of those abandoned objects is work the GC now has to do to reclaim. `StringBuilder` removes both — one allocation, nothing to collect. This is why the advice is "loops, not single-line concatenation": a one-off `a + b` makes one object either way and the compiler already turns it into a `StringBuilder` under the hood; only the *repeated* case in a loop piles up garbage.

> **Automatic doesn't mean free, and doesn't mean leak-proof.** The GC saves you from `free()`, but it isn't magic. If you *keep* a reference to an object you no longer need — say you add objects to a `List` that lives for the whole program and never remove them — the object stays reachable, so the GC can never reclaim it. That's a memory leak in Java: not a missing `free()`, but an accidental arrow you forgot to drop. Junior-level takeaway: the GC collects the *unreachable*; keeping things reachable forever is still your responsibility.

---

## How this closes out the Java notes

That's the whole language surface you need to read, write, and reason about Spring Boot code — and this file is the floor the rest of it stood on. The memory model ties the topic together: objects and references (files 04–06) are stack arrows into heap objects; collections (file 07) are heap objects holding more arrows; immutability and `StringBuilder` (file 01) are a garbage story; and the two failures the JVM throws when a region runs out — `StackOverflowError` when the call stack has no room left to push another frame (runaway recursion), and `OutOfMemoryError` when the heap is full of reachable objects the GC can't reclaim — now read as exactly what they say. Those two live in the exception hierarchy in file [08-exceptions.md](08-exceptions.md); go back to that section now and it should land harder, because you finally know what a "stack" and a "heap" physically are.

From here the path leaves pure Java and moves into Spring Boot, where every one of these concepts reappears wearing a framework hat: beans are heap objects Spring creates and holds arrows to for you, dependency injection is Spring handing your constructor the right arrow, and `NullPointerException` is still the failure you'll debug most. The Java foundation is complete.
