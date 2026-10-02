## Index of this note

- [Memory Model — Stack, Heap, and Garbage Collection](#memory-model--stack-heap-and-garbage-collection)
- [The call stack — one frame per method call](#the-call-stack--one-frame-per-method-call)
  - [The frame on top is the only one running, so it is the only one that can fail](#the-frame-on-top-is-the-only-one-running-so-it-is-the-only-one-that-can-fail)
  - [Returning and throwing both remove frames, toward the method that made the call](#returning-and-throwing-both-remove-frames-toward-the-method-that-made-the-call)
  - [A method that calls itself gets one frame per call, and the stack can run out of room](#a-method-that-calls-itself-gets-one-frame-per-call-and-the-stack-can-run-out-of-room)
- [Pass-by-value — Java has no pass-by-reference](#pass-by-value--java-has-no-pass-by-reference)
  - [Case 1 — primitives: the copy is the value, so the caller never sees a change](#case-1--primitives-the-copy-is-the-value-so-the-caller-never-sees-a-change)
  - [Case 2 — objects: the copy is the reference, so mutation is visible but reassignment is not](#case-2--objects-the-copy-is-the-reference-so-mutation-is-visible-but-reassignment-is-not)
  - [Case 3 — a `String` argument: the object cannot be changed, so the caller never sees a change](#case-3--a-string-argument-the-object-cannot-be-changed-so-the-caller-never-sees-a-change)
  - [Case 4 — an array argument: an element changed inside the method is changed for the caller](#case-4--an-array-argument-an-element-changed-inside-the-method-is-changed-for-the-caller)
- [Stack vs heap — where variables and objects actually live](#stack-vs-heap--where-variables-and-objects-actually-live)
  - [An object outlives the frame that created it](#an-object-outlives-the-frame-that-created-it)
  - [Where a NullPointerException really comes from](#where-a-nullpointerexception-really-comes-from)
  - [Why the exception names the line that uses the `null`, not the line that stored it](#why-the-exception-names-the-line-that-uses-the-null-not-the-line-that-stored-it)
- [Garbage collection — automatic cleanup of unreachable objects](#garbage-collection--automatic-cleanup-of-unreachable-objects)
  - [What you need to know about garbage collection at this level, and why tuning and diagnosis are left for later](#what-you-need-to-know-about-garbage-collection-at-this-level-and-why-tuning-and-diagnosis-are-left-for-later)
- [Aliasing — two references to one object](#aliasing--two-references-to-one-object)
  - [Aliasing only causes a bug when the object can change](#aliasing-only-causes-a-bug-when-the-object-can-change)
  - [Where a second reference to an object comes from](#where-a-second-reference-to-an-object-comes-from)
  - [Arrays alias too, and a copy of an array of objects still shares the objects](#arrays-alias-too-and-a-copy-of-an-array-of-objects-still-shares-the-objects)
- [What you can do after this chapter](#what-you-can-do-after-this-chapter)

# Memory Model — Stack, Heap, and Garbage Collection

> 📖 [Baeldung — Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap)
> 📖 [Baeldung — Memory Management in Java Interview Questions (+Answers)](https://www.baeldung.com/java-memory-management-interview-questions)

[04-methods.md](04-methods.md) ended on three questions it left open on purpose. When you write `buildPage(title)`, does the method receive a copy of the `String` held in `title`, or that same `String`? When a method receives an object and changes it, does the object held by the code that called the method change too? And how does Java know which line to go back to when a method finishes? This chapter answers the three. The answers come from one fact you already have from [01-variables-types.md](01-variables-types.md): a variable holds either a value or a **reference**, which is the memory address of an object stored somewhere else.

Earlier chapters have already used that fact without showing the mechanism behind it. [01-variables-types.md](01-variables-types.md) drew a variable that holds an address instead of a value, and named the two areas of memory involved, the stack and the heap. [02-strings.md](02-strings.md) showed that `name = name.toUpperCase()` leaves the old `String` object with no variable pointing at it, and said that the JVM reclaims that object's memory later. [04-methods.md](04-methods.md) read a stack trace in which three method calls were open at the same time. This is the chapter where those pieces are explained together: how the JVM keeps track of the calls in progress, what is copied when a method is called, and where the object itself is stored.

It comes at this point, before you write your first class, because [06-oop-classes.md](06-oop-classes.md) builds objects that keep data inside them. To design one of those objects, you first have to be able to predict who can change it once a reference to it has been passed to a method or stored in a second variable. Interviewers ask about exactly that, because it separates someone who has written Java from someone who has only read it. They usually ask it as three questions: *"does the caller see the change if I modify an object inside a method?"*, *"where does a `NullPointerException` actually come from?"*, and *"how is memory freed in Java if you never free it yourself?"*.

The chapter starts with the **call stack**, the structure in which the JVM keeps one block of memory, called a frame, for every method call that has not finished yet. Next comes **pass-by-value**: what is copied into a parameter when you call a method with a primitive, with an object, with a `String` and with an array. After that, the **stack and the heap** are set side by side, to see where a local variable is stored and where the object it points at is stored, and from there what happens in memory when a `NullPointerException` is thrown. Then comes **garbage collection**, the mechanism by which the JVM frees the objects that the program can no longer reach. The chapter closes with **aliasing**, which is what you have when two variables hold a reference to the same object, together with the bug it produces when one of them changes that object.

**Two examples are used in this file.** The call stack section follows `Payroll`, a small program whose three methods only compute with numbers, so that every variable you follow in a frame holds a number. From the pass-by-value section on, the example is a `User` object with a single field, `name`, because that is the smallest object on which you can see the difference between changing an object and changing a variable.

> **Why you reason about memory in a language that manages it for you.** In a language like C, the programmer asks for the memory of each piece of data with a function called `malloc`, and has to give that memory back with another function called `free`. Java has neither: the JVM reserves the memory and releases it for you. That does not mean you can ignore where things are stored. Whether a method can change an object you passed to it, why a line throws a `NullPointerException`, and why changing an object through one variable changes what another variable reads are all decided by what each variable holds and by where the object is stored. You do not manage memory by hand in Java, but you need to know where things are stored to predict what your code does.

---

## The call stack — one frame per method call

> 📖 Docs: [Baeldung — The StackOverflowError in Java](https://www.baeldung.com/java-stack-overflow-error) → read: "Stack Frames and How StackOverflowError Occurs" — what a frame holds, and what happens when there is no room for one more.
> 📖 Docs: [Baeldung on Computer Science — The Call Stack](https://www.baeldung.com/cs/call-stack) → read: "The Call Stack" and "Simple Example" — the same mechanism outside Java, with a diagram of the frames.
> 📖 Docs: [The Java Virtual Machine Specification (SE 25) — §2.6 Frames](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.6) → read: the first two paragraphs — the official statement that a frame is created each time a method is invoked and destroyed when that invocation completes.

[04-methods.md](04-methods.md) showed you a stack trace with three lines, `slug`, `buildPage` and `main`, and said that each line was a method call that had started and not yet finished. What it left open is how the JVM keeps those unfinished calls. The problem the JVM has to solve is concrete. When `main` calls another method, `main` has not finished: it still has lines to run, and variables it will need again. So the JVM has to keep `main`'s variables intact while the other method runs, and it has to remember the exact point of `main` to continue from afterwards. The structure it uses for both things is the **call stack**.

This is the program the whole section follows. An employee was paid 800 for 40 hours, and the program works out what 5 hours of overtime are worth if each one is paid double:

```java
public class Payroll {
    static int hourlyRate(int pay, int hours) {
        int rate = pay / hours;                     // line 3
        return rate;                                // line 4
    }
    static int overtimeBonus(int pay, int hours, int extraHours) {
        int rate = hourlyRate(pay, hours);          // line 7
        int bonus = rate * extraHours * 2;          // line 8
        return bonus;                               // line 9
    }
    public static void main(String[] args) {
        int bonus = overtimeBonus(800, 40, 5);      // line 12
        System.out.println(bonus);                  // line 13 — prints 200
    }
}
```

Every time a method is called, the JVM reserves a block of memory for that one call. That block is called a **frame** (or *stack frame*). [01-variables-types.md](01-variables-types.md) named the frame in passing, in the section _The compiler will not let you read a local variable you never assigned_; this section shows what a frame holds, and in what order frames are created and removed. A frame holds what its call needs in order to run:

- **The parameters of the method**, each one holding a copy of the argument it was passed. In the call `hourlyRate(800, 40)`, the frame has a `pay` that holds `800` and an `hours` that holds `40`.
- **The local variables** declared in the body of the method, such as `rate`.
- **The point the call has reached in its own code.** For the method that is running right now, that point is the line being executed. For a method that has called another one and is waiting for it, that point is the call it is waiting on.
- **The partial results of the line in progress.** For example, in `rate * extraHours * 2` the result of `rate * extraHours` has to be kept somewhere until it is multiplied by `2`.

The JVM keeps the frames in a pile, and that pile is the call stack. A new frame always goes on top of the pile, which is called *pushing* it. The only frame that can be removed is the one on top, which is called *popping* it. So the last frame that went in is the first one that comes out: that order is called **LIFO**, *last in, first out*. It works like a stack of plates: you put a plate on top, and the only plate you can take without moving the others is the top one.

This is what happens to the stack when `Payroll` runs, step by step:

1. The JVM starts the program by calling `main`. It creates a frame for `main`, with its parameter `args` and room for its local variable `bonus`. The stack has one frame.
2. Line 12 calls `overtimeBonus(800, 40, 5)`. `main` cannot finish line 12 until that call gives it a value, so `main` stays paused on line 12. The JVM pushes a frame for `overtimeBonus` on top of `main`'s frame and copies the three arguments into its parameters: `pay` holds `800`, `hours` holds `40` and `extraHours` holds `5`.
3. Line 7 calls `hourlyRate(pay, hours)`. `overtimeBonus` stays paused on line 7, and the JVM pushes a third frame, whose `pay` holds `800` and whose `hours` holds `40`.
4. Line 3 runs in the frame on top: `800 / 40` gives `20`, and that `20` is stored in the `rate` of `hourlyRate`'s frame.
5. Line 4, `return rate;`, ends the call. The JVM hands the value `20` to the frame below, as the result of the call that frame was waiting on, and pops `hourlyRate`'s frame. Its `pay`, its `hours` and its `rate` stop existing.
6. `overtimeBonus` is on top again, and it continues exactly where it was paused. Line 7 stores the `20` in its own `rate`. Line 8 computes `20 * 5 * 2` and stores `200` in `bonus`.
7. Line 9 returns `200`. The JVM hands the `200` to `main`'s frame and pops `overtimeBonus`'s frame.
8. `main` continues on line 12 and stores the `200` in its own `bonus`. Line 13 prints `200`. `main` reaches its closing brace, the JVM pops its frame, the stack is empty and the program ends.

This is the stack at step 4, the moment it holds the most frames. The newest frame is drawn on top:

```
[top]     ┌─────────────────────────────────────────────────┐
          │ hourlyRate          running line 3              │
          │    pay = 800    hours = 40    rate = 20         │
          ├─────────────────────────────────────────────────┤
          │ overtimeBonus       paused on line 7            │
          │    pay = 800    hours = 40    extraHours = 5    │
          │    rate and bonus have no value yet             │
          ├─────────────────────────────────────────────────┤
          │ main                paused on line 12           │
          │    args    bonus has no value yet               │
[bottom]  └─────────────────────────────────────────────────┘
```

And this is the whole run. Read it from left to right: each column is the stack once that step has finished, with the newest frame at the top of the column. Steps 4 and 6 are not drawn because they neither push nor pop a frame:

```
 step 1     step 2            step 3            step 5            step 7     step 8

                              hourlyRate
            overtimeBonus     overtimeBonus     overtimeBonus
 main       main              main              main              main       (empty)
```

The frames come out in the opposite order to the one they went in: `hourlyRate` was the last to go in and is the first to come out, and `main` was the first to go in and is the last to come out. That answers the third question [04-methods.md](04-methods.md) left open, how Java knows which line to go back to when a method finishes. It does not have to look for it: the frame of the method that made the call is the one right below, and it has kept the point where it was paused.

> **Two variables called `rate` do not clash, and neither do the two called `bonus`.** `hourlyRate` declares a `rate` and so does `overtimeBonus`, but each one is stored in a different frame, so they are two different variables that only share a name. You can see it in steps 5 and 6: the `rate` of `hourlyRate` stops existing when its frame is popped, and right after that the `rate` of `overtimeBonus` receives the `20`. The same happens with `pay` and `hours`: `overtimeBonus` has its own, and `hourlyRate` received copies of them. It is the scope rule from [01-variables-types.md](01-variables-types.md), seen while the program runs: a local variable exists only inside its method because it is stored in the frame of one call to that method.

### The frame on top is the only one running, so it is the only one that can fail

At any moment, the JVM is executing a line of exactly one method: the one whose frame is on top of the stack. Every frame below it belongs to a method that is paused on a call, waiting for a result. A paused method does nothing, so it cannot fail while it waits. An error appears when a line that is being executed cannot do what it says, and the only line being executed is in the frame on top. That is why a failure always starts in the newest frame.

You can see it by making `Payroll` fail. Change line 12 so that the hours are `0`:

```java
int bonus = overtimeBonus(800, 0, 5);      // line 12
```

Line 3 now has to compute `800 / 0`, and dividing an `int` by zero throws an `ArithmeticException`, as you saw in [01-variables-types.md](01-variables-types.md). The program prints this and stops:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Payroll.hourlyRate(Payroll.java:3)
	at Payroll.overtimeBonus(Payroll.java:7)
	at Payroll.main(Payroll.java:12)
```

The first line names the failure: the type of the exception, `java.lang.ArithmeticException`, and its message, `/ by zero`. The three lines that start with `at` are the stack at the moment of the failure, one line per frame, with the newest frame first. It is the same pile as in the drawing of step 4, in the same order. Each of those lines names the method of that frame and, in parentheses, the file and the line that frame had reached. For the frame on top, that is the line that failed, line 3. For the other two, it is the call they were paused on: line 7 and line 12.

> **What `in thread "main"` means.** A **thread** is one sequence of instructions that the JVM executes one after another. A program can have several threads running at the same time, and each thread has its own call stack. The code of the programs in this chapter runs in a single thread, which the JVM creates to call `main` and which is called `main` too. So `Exception in thread "main"` tells you which stack the trace below it was taken from.

A method that was paused can still fail later, once the method it was waiting for has returned and its own frame is on top again. For example, go back to the original line 12, with 40 hours, and suppose line 8 were `int bonus = rate / (extraHours - 5);`. Since `extraHours` is `5`, that line divides by zero, and the failure happens in `overtimeBonus`. By then `hourlyRate` has already returned and its frame has been popped, so the stack trace has two `at` lines, `Payroll.overtimeBonus(Payroll.java:8)` and `Payroll.main(Payroll.java:12)`, and no line for `hourlyRate`.

### Returning and throwing both remove frames, toward the method that made the call

A call can end in two ways. It ends normally when it reaches a `return` or the closing brace of the method. It ends with an exception when one of its lines throws one and the method does not catch it. Catching an exception means stopping it with a `try/catch`, the construct whose shape [00-intro-java.md](00-intro-java.md) showed you. `Payroll` has no `try/catch` anywhere, so none of its methods catches anything. In both cases the JVM pops the frame, and in both cases what comes next concerns the method that made the call, which is the one in the frame right below. The difference is what that method receives.

This is what happens in the version of `Payroll` that divides by zero:

1. Line 3 cannot compute `800 / 0`. The JVM creates an `ArithmeticException` object and throws it in the frame on top, the frame of `hourlyRate`.
2. `hourlyRate` does not catch the exception, so the JVM pops its frame. Line 4 never runs, and the call returns no value.
3. The exception reaches `overtimeBonus` at line 7, the call it was paused on. `overtimeBonus` was waiting for a value and receives an exception instead. It does not catch it either, so the JVM pops its frame too. Lines 8 and 9 never run.
4. The same happens in `main` at line 12. Line 13 never runs, so the program prints no number.
5. No frame is left on the stack. The thread ends, and the JVM prints the exception with the stack trace you saw above.

The stack trace still lists the three frames, even though all three had been popped by the time it was printed. The reason is that the exception object recorded the stack at step 1, when it was created, and what the JVM prints at step 5 is that record.

The table sets the two endings side by side: what happens to the frame of the method that ends, what the method that called it receives, and whether that method carries on.

| | The method ends with `return` | The method ends with an exception it does not catch |
|---|---|---|
| Its frame | popped | popped |
| What the method that called it receives | the returned value, or nothing if the method is `void` | the exception, and no value |
| What the method that called it does next | it continues right after the call | it does not continue: its own frame is popped too, unless it catches the exception |

A method that does catch the exception keeps its frame and continues from its `catch` block, and the frames below it are not touched. How a `try/catch` is written, in which method it makes sense to catch, and how to read a long stack trace are explained in [11-exceptions.md](11-exceptions.md).

### A method that calls itself gets one frame per call, and the stack can run out of room

A frame belongs to one call, not to one method. If the same method is called three times one after another, it gets a frame three times, one after another. And if a method calls itself, which is called **recursion**, several frames of that same method are on the stack at once, each with its own parameters and local variables. The stack of each thread has a maximum size, so a method that calls itself without ever stopping fills it:

```java
public class Countdown {
    static int count(int n) {
        return count(n - 1);     // line 3 — calls itself, and nothing ever makes it stop
    }
    public static void main(String[] args) {
        count(3);
    }
}
```

`count(3)` calls `count(2)`, which calls `count(1)`, then `count(0)`, then `count(-1)`, and so on. None of those calls ever reaches the end of line 3, because each one is paused waiting for the next. So no frame is ever popped, and each call pushes one more, with its own `n`. When there is no room for another frame, the JVM throws a `StackOverflowError`:

```
Exception in thread "main" java.lang.StackOverflowError
	at Countdown.count(Countdown.java:3)
	at Countdown.count(Countdown.java:3)
	at Countdown.count(Countdown.java:3)
	...
```

The same `at` line is printed 1,024 times. That is the largest number of frames the JVM prints in a stack trace by default; the stack held many more. When you see one line repeated like this, look for a method that calls itself and check the condition that should make it stop. A correct recursive method has a branch that returns without calling itself again: here, for example, `if (n == 0) return 0;` before line 3.

---

## Pass-by-value — Java has no pass-by-reference

> Docs: https://www.baeldung.com/java-pass-by-value-or-pass-by-reference → read: the whole page, especially "Passing Object References"
> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → read: "Passing Primitive Data Type Arguments" and "Passing Reference Data Type Arguments" — the official tutorial says of both that they are passed *by value*.

The first section said that each parameter in a frame holds a copy of the argument it was passed. This section looks at what that copy is, because it decides what a method can change for the code that called it. The problem shows up as soon as you write a method that receives an object and changes it: sometimes the change is still there after the method returns, and sometimes it is not. It looks arbitrary until you know what was copied, and from then on you can predict it every time.

Two terms name the two ways a language can hand an argument to a method:

- **Pass-by-value**: the method receives a copy of what the variable of the calling code holds. The parameter is a separate variable, so assigning to the parameter never changes the variable of the calling code.
- **Pass-by-reference**: the method receives the variable of the calling code itself, under another name. Assigning to the parameter changes that variable.

Java is **always** pass-by-value, for primitives and for objects. Interviewers ask about it because many people answer the opposite, **"Java is pass-by-reference for objects"**, and that is wrong. The confusion comes from what the copied value is when you pass an object.

The rule is this, and the four cases below show it in code: **Java copies what the argument holds into the parameter. For a primitive, it copies the value. For an object, it copies the *reference*, which is the memory address of the object, and never the object itself.**

### Case 1 — primitives: the copy is the value, so the caller never sees a change

A variable of a primitive type, such as the `int`, `long`, `double` and `boolean` you saw in [01-variables-types.md](01-variables-types.md), holds its value directly. When you pass it to a method, Java copies that value into the parameter, and the method works with its own copy:

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

`main` prints `30`. The line `x = 999` looks as if it should change `age`, because `tryToChange` was called with `age`. It does not, because `x` and `age` are two different variables: `x` is a variable of `tryToChange` that received a copy of the `30`, and assigning `999` to `x` replaces that copy and nothing else. With the frames from the first section of this file, this is the stack at the moment `x = 999` runs:

```
[top]     ┌──────────────────────────────┐
          │ tryToChange                  │
          │    x = 999                   │   ← `x = 999` wrote here, over the copied 30
          ├──────────────────────────────┤
          │ main                         │
          │    age = 30                  │   ← no line of tryToChange can write here
[bottom]  └──────────────────────────────┘
```

`age` and `x` are stored in two different frames. The call copied the `30` from `main`'s frame into `tryToChange`'s frame, and from that moment nothing connects the two variables. The code of a method has no way to assign to a parameter or a local variable of another frame, so no assignment inside `tryToChange` can reach `age`. When `tryToChange` returns, its frame is popped and `x` stops existing, with its `999`.

> **Pass-by-value in one sentence: the method receives a copy of the value, not the variable of the code that called it.** That sentence is true in each of the four cases of this section. What changes from one case to the next is what the copied value is.

### Case 2 — objects: the copy is the reference, so mutation is visible but reassignment is not

A variable of an object type does not hold the object. It holds a **reference**: the memory address of the object, which is stored somewhere else in memory. The next section shows where. When you pass an object to a method, Java copies that reference into the parameter. From then on there are two variables, the one of the calling code and the parameter, and both point at the **same** object.

> **What is copied when you pass an object is its reference, which is far smaller than the object.** A reference is the value written inside the variable, as the diagram in [01-variables-types.md](01-variables-types.md) showed with the address `0x7f3a20`. It is a small value of a fixed size, and that size is the same whether the object it points at has one field or a thousand. That is all a call copies. The object itself is not copied, not moved and not touched by the call: once the call has started there is still one object, and there are two variables that hold its address. In the drawings of this section, each arrow is one of those references: it goes from the variable that holds the address to the object stored at that address.

A method that wants to change the object it received can do two different things, and the two have opposite results for the code that called it. Both are shown on the same example: a `User` whose `name` field can be changed.

```java
class User {
    String name;
    User(String name) { this.name = name; }
}
```

> **`User` is written with three things that [06-oop-classes.md](06-oop-classes.md) explains in full.** You have read the first two before, in the `Calculator` class of [04-methods.md](04-methods.md). `String name;` is a **field**: a variable that belongs to each `User` object and holds one of its pieces of data. `User(String name) { this.name = name; }` is the **constructor**: the code that runs when you write `new User("Alice")`, and that stores `"Alice"` in the `name` field of the object being created. The third is `user.name`, which reads or changes that field from outside the class: you write the variable that points at the object, a dot and the name of the field. `Calculator` did not allow that, because its fields were declared `private`. The field of `User` is not declared `private` on purpose, so that the examples can write `user.name = ...` directly. Why real classes do not allow that is explained in [06-oop-classes.md](06-oop-classes.md), with encapsulation.

**Action A — mutation: the method changes a field of the object → the caller SEES it.** The parameter and the variable of the calling code point at the same object, so changing a field through the parameter changes the only object there is.

```java
static void rename(User u) {
    u.name = "Bob";           // changes the object both variables point at
}

public static void main(String[] args) {
    User user = new User("Alice");
    rename(user);
    System.out.println(user.name);   // Bob — the caller sees it
}
```

**Action B — reassignment: the method assigns another object to the parameter → the caller does NOT see it.** The assignment stores another reference in the parameter, which is the method's own copy. The variable of the calling code still holds the reference to the original object.

```java
static void replace(User u) {
    u = new User("Bob");      // only THIS method's parameter now points at a new object
}

public static void main(String[] args) {
    User user = new User("Alice");
    replace(user);
    System.out.println(user.name);   // Alice — unchanged
}
```

The drawings show why the two actions differ. When the method starts, the variable `user` of `main` and the parameter `u` hold the same reference, so both point at the same `User` object, the one named Alice:

```
main's `user`   ──┐
                  ├──►  [ User: name="Alice" ]      (one object, two references)
method's `u`    ──┘
```

**Action A** (`u.name = "Bob"`) goes to the object `u` points at and changes its field. It is the same object `user` points at:

```
main's `user`   ──┐
                  ├──►  [ User: name="Bob" ]        ← main sees "Bob"
method's `u`    ──┘
```

**Action B** (`u = new User("Bob")`) creates a second object and stores its reference in `u`. Only the parameter changes. The variable `user` of `main` still holds the reference to the first object:

```
main's `user`   ──────►  [ User: name="Alice" ]     ← main still sees "Alice"

method's `u`    ──────►  [ User: name="Bob" ]        ← nothing points at it once the method ends
```

That answers the second question [04-methods.md](04-methods.md) left open. When a method receives an object and changes it, the object held by the code that called the method changes too, because it is the same object. What the method cannot do is make the variable of that code point at another object.

> **The one test that answers "does the caller see the change?"** Ask: *did the line change the object, or did it change the parameter?* A line that changes something inside the object the parameter points at (`u.name = ...`, `u.setName(...)`, `list.add(...)`) changes the one object both variables share, so the change is **visible** to the calling code. A line that assigns to the parameter itself (`u = ...`) changes only which object the parameter points at, so it is **invisible** to the calling code. That one distinction answers every version of this question.

> **Why Action B proves that Java is not pass-by-reference.** In a language that passes by reference, the parameter is the variable of the calling code under another name. C++ is one of them: there, a parameter declared with `&` works that way. In such a language, Action B *would* change the variable of the calling code: after `replace(user)`, `user` would point at the `User` named Bob. In Java, `main` still prints `Alice`, so `u` was a separate variable that held a copy. The two terms are easy to mix up because the word *reference* means a different thing in each one. In *pass-by-reference*, it means the variable of the calling code. In Java, a reference is the address of an object, and that address is the value that gets copied. "Pass-by-value, where the value is a reference" is the precise way to say it, and it is the answer interviewers expect.

> **JavaScript passes arguments in exactly the same way.** Assigning to a parameter inside a function does not affect the variable of the code that called it, and changing a property of the object it received does:
>
> ```javascript
> function rename(u)  { u.name = "Bob"; }        // the caller sees it
> function replace(u) { u = { name: "Bob" }; }   // the caller does not
>
> const user = { name: "Alice" };
> replace(user);   // user.name is still "Alice"
> rename(user);    // user.name is now "Bob"
> ```
>
> If you already had that intuition from JavaScript, it carries over to Java unchanged.

### Case 3 — a `String` argument: the object cannot be changed, so the caller never sees a change

Case 2 used a `User`, an object whose field can be changed. A `String` is an object too, so it is passed exactly like the `User`: the method receives a copy of the reference, and the parameter points at the same `String` object as the caller's variable. That answers the first question [04-methods.md](04-methods.md) left open: in `buildPage(title)`, the method does not receive a copy of the text, it receives a copy of the reference to that same `String`.

What changes is what the method can do with it. Action A does not exist for a `String`, because a `String` is immutable: no method can change its text, as you saw in [02-strings.md](02-strings.md). The only thing left is Action B, and Action B is never visible to the caller:

```java
// ❌ MAL — the new String never reaches main
static void shout(String text) {
    text = text.toUpperCase();    // builds a new String, and only this method's parameter points at it
}

public static void main(String[] args) {
    String name = "ana";
    shout(name);
    System.out.println(name);     // ana — unchanged
}
```

This is what happens, step by step:

1. The call copies the reference held in `name` into the parameter `text`. Both variables point at the same `String` object, `"ana"`.
2. `text.toUpperCase()` does not change that object. It creates a new `String` object, `"ANA"`, and returns a reference to it.
3. `text = ...` stores that new reference in `text`, which is in the frame of `shout`. The variable `name`, in the frame of `main`, still holds the reference to `"ana"`.
4. `shout` returns and its frame is popped. `text` was the only variable that pointed at `"ANA"`, so nothing points at that object any more.

A method cannot make a variable of the calling code point at a different object. What it can do is return the new object, so that the calling code stores it in its own variable:

```java
// ✅ BIEN — the method returns the new String, and main stores it
static String shout(String text) {
    return text.toUpperCase();    // returns the reference to the new String
}

String name = "ana";
name = shout(name);               // main makes its own variable point at the new String
System.out.println(name);         // ANA
```

> **Why a `String` looks as if it were passed "like a primitive".** The result is the same as in Case 1: whatever the method does, the caller's variable keeps what it had. The cause is different. In Case 1 the method received a copy of the value. Here it received a copy of the reference, and the object that reference points at cannot be modified. The same applies to every immutable object. `BigDecimal` is one, as you saw in [01-variables-types.md](01-variables-types.md), and so are the wrappers from that same file, such as `Integer` and `Long`: no method changes the number an `Integer` object holds. For example, in a method `static void addOne(Integer n) { n = n + 1; }`, the line `n = n + 1` does not change the `Integer` object the caller holds. It stores in `n` a reference to another `Integer` object, the one that holds `6`. After `Integer count = 5; addOne(count);`, `count` is still `5`.

### Case 4 — an array argument: an element changed inside the method is changed for the caller

The last case is the array, and it is kept apart from Case 2 because its elements can be primitives. An array is an object, whatever the type of its elements. An `int[]` holds primitives in its positions, but the array itself is an object, and a variable of type `int[]` holds a reference to it. So an array is passed like the `User` of Case 2, and the two actions give the same two results:

```java
import java.util.Arrays;

public class Timesheet {
    static void clearFirst(int[] hours) {
        hours[0] = 0;                      // Action A: writes inside the array both variables point at
    }

    static void replaceAll(int[] hours) {
        hours = new int[] {0, 0, 0};       // Action B: only this method's parameter points at the new array
    }

    public static void main(String[] args) {
        int[] weekHours = {8, 8, 6};

        clearFirst(weekHours);
        System.out.println(Arrays.toString(weekHours));   // [0, 8, 6] — the caller sees the change

        replaceAll(weekHours);
        System.out.println(Arrays.toString(weekHours));   // [0, 8, 6] — still the same array
    }
}
```

`Arrays.toString(...)` returns the elements of an array as text; it is here only to print them. `clearFirst` writes a `0` in position 0 of the one array that exists, so `main` reads that `0` afterwards. `replaceAll` creates a second array and stores its reference in its own parameter, so `weekHours`, in the frame of `main`, still points at the first array. It writes `new int[] {0, 0, 0}` and not just `{0, 0, 0}` because the short form is only allowed in the line that declares the array variable, as in `int[] weekHours = {8, 8, 6};`. In an assignment to a variable that already exists, the values have to come after `new int[]`.

> **This is the case that surprises people who have learnt "primitives are copied".** The elements of an `int[]` are primitives, and it is tempting to conclude that a method cannot change them for the caller. What is passed is not the elements but the array, and the array is an object. Only its reference is copied, so the method reaches the same positions the caller reaches.

The table puts the four cases together. Read it by its last column, which answers the question of the whole section:

| What you pass | What is copied into the parameter | Can the method change what the caller sees? |
|---|---|---|
| A primitive (`int`, `double`, `boolean`…) | the value | No |
| An object whose contents can change (a `User`, a `List`, a `StringBuilder`) | the reference | Yes, by changing the contents of the object. Never by assigning to the parameter |
| An immutable object (a `String`, an `Integer`, a `BigDecimal`) | the reference | No: nothing inside the object can be changed |
| An array, of primitives or of objects | the reference | Yes, by changing its elements. Never by assigning to the parameter |

These four rows cover every argument you can pass in Java, because every type is either a primitive type or a reference type, and an array is one more kind of object.

> **The classic interview check: a `swap` method that swaps nothing.**
>
> ```java
> static void swap(User a, User b) {
>     User tmp = a;
>     a = b;
>     b = tmp;
> }
>
> User first = new User("Alice");
> User second = new User("Bob");
> swap(first, second);
> System.out.println(first.name + " " + second.name);   // Alice Bob
> ```
>
> The three lines of `swap` are three assignments to variables of its own frame: `tmp`, `a` and `b`. All three are Action B. When `swap` returns, `first` still points at the `User` named Alice and `second` at the one named Bob. A method cannot exchange two variables of the code that called it. What it can exchange is the contents of the two objects, with Action A: for example, by swapping the values of `a.name` and `b.name`.

---

## Stack vs heap — where variables and objects actually live

> Docs: https://www.baeldung.com/java-stack-heap → read: "Stack Memory in Java" and "Heap Space in Java"

The previous section kept saying that an object is stored "somewhere else in memory" and that a variable only holds its address. This section names the two places. The JVM, the program that runs your compiled Java, as you saw in [00-intro-java.md](00-intro-java.md), divides the memory it uses for your program's data into two areas, and each one has a different job:

- **The stack** is where the frames are. It holds the parameters and the **local variables** of every call in progress. A variable of a primitive type has its value written there. A variable of an object type has a **reference** written there, never the object.
- **The heap** is where the objects are. Every object is stored there, whichever method created it. The heap is not divided by calls: an object in it belongs to no method, and any code that holds a reference to it can use it.

The stack is the **call stack** from the first section of this file, [The call stack — one frame per method call](#the-call-stack--one-frame-per-method-call), with `main` at the bottom and `overtimeBonus` and `hourlyRate` on top of it. As you saw there, when a method returns its frame is popped, and its parameters and local variables stop existing.

**The object on the heap does not stop existing when a method returns.** What is popped is the frame, and with it the variable that held the reference. That is why an object can still be used after the method that created it has finished, and why it can be passed from one method to another. This is the `User` example with both areas drawn at once:

```java
public static void main(String[] args) {
    int count = 3;                       // primitive → the value is on the stack
    User user = new User("Alice");       // reference on the stack, object on the heap
}
```

```
        STACK (one frame per call)               HEAP (shared by every call)
   ┌──────────────────────────────┐        ┌──────────────────────────┐
   │ main() frame:                │        │                          │
   │    count = 3                 │        │  [ User: name="Alice" ]  │
   │    user  = ●─────────────────┼───────►│                          │
   └──────────────────────────────┘        └──────────────────────────┘
   `count` holds its value directly.        The object itself is stored here.
   `user` holds only a reference,           The reference held in `user` is
   drawn as the arrow.                      what leads to it.
```

This drawing is the reason behind the rule of the previous section. Passing an argument copies what the variable holds in its frame. For `count`, that is a number, so the parameter receives a number. For `user`, that is a reference, so the parameter receives a reference, and the two references point at the same object on the heap. Action A goes through the reference to that one object, which is why `main` sees the change. Action B writes another reference in the parameter, which is in the frame of the method that was called, so no other frame is affected.

> **Why two areas instead of one?** Because the two kinds of data stop being needed at different moments, and that decides how their memory can be released.
>
> 1. A parameter or a local variable is needed only while its call is running. Calls finish in the reverse order to the one they started in, so the memory of the last call that started is always the first that can be released. That is exactly what a stack gives you: releasing the memory of a call is popping its frame, with nothing to search for and nothing to decide.
> 2. An object can be needed after the call that created it has finished, as `createUser` shows in the next subsection, and several variables in several frames can point at it at the same time. If the object were stored in the frame of the call that created it, it would stop existing when that frame is popped, and the other variables would be left holding the address of something that is no longer there.
> 3. So objects are stored in a separate area, the heap, where nothing is released when a method returns. The price is that the JVM needs another way to find out when an object is no longer needed. That way is the garbage collector, which has its own section further down in this file.

> **There is one stack per thread, and one heap for the whole program.** The first section of this file said that each thread has its own call stack. The heap is the opposite: there is a single heap, and every thread of the program creates its objects in it. That is the reason behind a rule [02-strings.md](02-strings.md) gave you, that a `StringBuilder` must be a local variable and never a field of a shared object. A local variable is stored in a frame, the frame is in the stack of one thread, and no other thread can read that stack. So while the only reference to the builder is in that local variable, no other thread has any way to reach the builder, even though the builder itself is on the shared heap.

> **A field is not a local variable: it is stored inside its object, on the heap.** The drawing of the stack and the heap, earlier in this section, writes `name="Alice"` inside the `User` box to keep it short. In full, the `name` field is part of the `User` object, and what the field holds is a reference to a `String` object, which is a second object on the heap:
>
> ```
>         STACK                           HEAP
>    ┌──────────────────┐
>    │ main() frame:    │
>    │    count = 3     │
>    │    user  = ●─────┼────►  [ User:  name = ●──────►  [ String "Alice" ] ]
>    └──────────────────┘
> ```
>
> So "primitives on the stack, objects on the heap" is a rule about local variables only. A field, primitive or not, is stored inside the object it belongs to. [01-variables-types.md](01-variables-types.md) explained it in the section _The compiler will not let you read a local variable you never assigned_, together with the default value a field starts with.

### An object outlives the frame that created it

Earlier in this section you read that the object on the heap does not stop existing when a method returns. This subsection traces that statement on a method that creates a `User` and returns it:

```java
static User createUser(String name) {
    User created = new User(name);     // the object goes on the heap, its reference in createUser's frame
    return created;                    // the reference is handed to the frame below
}

public static void main(String[] args) {
    User user = createUser("Alice");
    System.out.println(user.name);     // Alice
}
```

1. `main` calls `createUser("Alice")`, and the JVM pushes a frame for `createUser`.
2. `new User(name)` creates the object on the heap. Its reference is stored in the local variable `created`, in the frame of `createUser`.
3. `return created;` hands a copy of that reference to `main`'s frame, exactly as step 5 of the `Payroll` trace handed over the `20`. Then the JVM pops the frame of `createUser`, and `created` stops existing.
4. `main` stores the reference it received in `user`. The object was never in the popped frame, so it is still on the heap, and now `user` points at it.

```
   while createUser is running                    after createUser has returned

      STACK                HEAP                      STACK                HEAP
 ┌─────────────────┐                            ┌─────────────────┐
 │ createUser      │                            │ main            │
 │   created = ●───┼──►  [ User "Alice" ]       │   user = ●──────┼──►  [ User "Alice" ]
 ├─────────────────┤                            └─────────────────┘
 │ main            │
 │   user (no      │
 │   value yet)    │
 └─────────────────┘
```

What decides whether the object can still be used is not the frame it was created from, but whether some variable still holds a reference to it. If `main` had written `createUser("Alice");` on a line by itself, without storing the result, the returned reference would have been discarded. No variable would point at the object, and it would be left on the heap with no way to reach it. What the JVM does with an object in that state is the subject of the next section, on garbage collection.

### Where a NullPointerException really comes from

> 📖 Docs: [Baeldung — Helpful NullPointerExceptions in Java](https://www.baeldung.com/java-14-nullpointerexception) → read: "Detailed Exception Message" — how the message is built from the operation that failed and the reference that was `null`.

[04-methods.md](04-methods.md) showed you what this failure looks like and in which method to reject the `null`. With the stack and the heap you can now see what happens in memory, which is also a very common interview question. A variable of an object type does not have to point at an object. When it points at none, the value it holds is `null`:

```
        STACK                              HEAP
   ┌──────────────────┐
   │ user = null      │   ✗  points at nothing — no object on the heap
   └──────────────────┘
```

`null` is not an object, and holding it is not an error: it is a legal value for a variable of an object type. The failure happens when a line uses that variable to reach the object, by calling a method on it or by reading one of its fields. [04-methods.md](04-methods.md) called that operation **dereferencing**. With `null` there is no address to go to, and no object at the other end:

```java
User user = null;
System.out.println(user.name);   // NullPointerException
```

The program stops with this message, which names the operation that failed and the variable that was `null`:

```
Exception in thread "main" java.lang.NullPointerException: Cannot read field "name" because "user" is null
```

> **A `NullPointerException` does not mean that an object is broken: it means that there is no object.** The variable exists and holds a legal value, `null`. What is missing is on the heap: the line needs an object to read the field from, or to run the method on, and no object is there. That is why the protections you saw in [04-methods.md](04-methods.md) all come down to making sure there is an object before a line uses the reference. `Objects.requireNonNull` stops the method on its first line if the object is missing. A plain `if (user != null)` checks the reference before using it. And `Optional`, which you will see in [09-generics.md](09-generics.md), states in the return type of a method that the value may be missing.

### Why the exception names the line that uses the `null`, not the line that stored it

[04-methods.md](04-methods.md) showed you the behaviour: a `NullPointerException` is thrown where the `null` is used, and its stack trace does not show where the `null` came from. With frames and references you can now see why it cannot be any other way. In this program a method looks for a user, finds nobody and returns `null`, and another method uses the result:

```java
public class Greeter {
    static User findUser(String name) {
        return null;                           // line 3 — nobody has that name
    }
    static String greet(User u) {
        return "Hello, " + u.name;             // line 6
    }
    public static void main(String[] args) {
        User user = findUser("Bob");           // line 9
        String text = greet(user);             // line 10
        System.out.println(text);              // line 11
    }
}
```

```
Exception in thread "main" java.lang.NullPointerException: Cannot read field "name" because "u" is null
	at Greeter.greet(Greeter.java:6)
	at Greeter.main(Greeter.java:10)
```

The `null` was produced on line 3, and neither that line nor the method it belongs to, `findUser`, appears anywhere in the output. This is what happened, step by step:

1. Line 9 calls `findUser("Bob")`, and the JVM pushes a frame for it. Line 3 returns `null`. Returning `null` is handing over a value like any other: the reference that points at no object. Nothing is checked, because no operation has needed an object yet. The JVM pops the frame of `findUser`.
2. `main` stores that `null` in `user`. It is a copy of a value into a variable, and it needs no object either.
3. Line 10 calls `greet(user)`. Pass-by-value copies the `null` held in `user` into the parameter `u`. It is still only a copy.
4. Line 6 evaluates `u.name`. This is the first operation that needs the object: to read the field `name`, the JVM has to go to the address held in `u` and look inside the object there. `u` holds `null`, so there is no address to go to. The JVM cannot complete the line, and it throws a `NullPointerException` in the frame that is running, the frame of `greet`.
5. The stack trace lists the frames that were on the stack at that moment: `greet`, on line 6, and `main`, paused on line 10.

Two facts from this chapter explain why line 3 cannot appear:

- **A reference does not record where it came from.** The `null` held in `u` is only a value. Nothing in the variable says which line produced that value, in the same way that an `int` holding `0` does not say which line computed it. So when line 6 fails, the JVM knows which variable is `null`, and the message says so (`because "u" is null`), but it has no way to know that the `null` was first written on line 3.
- **The stack only holds calls that have not finished.** The call to `findUser` finished at step 1 and its frame was popped. A stack trace is a list of the frames on the stack, so a method that has already returned cannot be in it. That is the difference from the `Report` example in [04-methods.md](04-methods.md), where the method that created the `null` was `main` and was still on the stack. Even there, the trace showed the line `main` was paused on, never the line that created the `null`.

The JVM does not check earlier because, until line 6, nothing is wrong. As the previous subsection said, `null` is not an error by itself: it is a legal value for any reference variable, and a program is allowed to store it, pass it and return it. What is not possible is to use an object that is not there. The table shows which operations on a variable that holds `null` need the object and which do not. It lists the operations you will meet most often, not every one the language has:

| Operation on a variable that holds `null` | Does it need the object? | Result |
|---|---|---|
| Assign it: `User other = user;` | No | `other` holds `null` too |
| Pass it as an argument: `greet(user)` | No | the parameter holds `null` |
| Return it: `return user;` | No | the calling code receives `null` |
| Compare it: `user == null`, `user != null` | No | `true` or `false` |
| Concatenate it: `"Hello, " + user` | No | the text `"Hello, null"` |
| Read or write a field: `user.name` | Yes | `NullPointerException` |
| Call a method on it: `user.getName()` | Yes | `NullPointerException` |
| Read an element or the length of an array: `weekHours[0]`, `weekHours.length` | Yes | `NullPointerException` |
| Unbox it: `int n = count;` when `count` is an `Integer` that holds `null` | Yes | `NullPointerException` |

The first five rows only copy or compare the reference, and a reference that is `null` can be copied and compared like any other. The last four have to reach the object, and that is where the exception is thrown. The last row is the only one in which you write no dot and no brackets. [01-variables-types.md](01-variables-types.md) explained it in the section _Autoboxing and unboxing_: the compiler adds a call to `intValue()` that you did not write, and that call is the one that needs the object.

---

## Garbage collection — automatic cleanup of unreachable objects

> Docs: https://www.baeldung.com/java-memory-management-interview-questions → read: Q2 "What Is Garbage Collection and What Are Its Advantages?", Q8 "When Does an Object Become Eligible for Garbage Collection?" and Q9 "How Do You Trigger Garbage Collection from Java Code?"
> 📖 Docs: [Oracle Docs — Using Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/usingobject.html) → read: "The Garbage Collector" — three paragraphs: when an object becomes eligible, and that all the references to it have to be dropped first.

Every object you create takes room on the heap, and the heap has a limited size. A program that only created objects and never released any would end up filling it. In a language like C, releasing memory is the programmer's job: each piece of memory the program asked for has to be given back with a call to `free`, the function the introduction of this file mentioned, and that call is written by hand. If the programmer forgets it, that memory is never given back. If the call is made while some variable still points at that memory, the variable is left holding the address of something that is no longer there. Java has no `free()` and nothing equivalent: you never write code to release an object.

The JVM does it instead, with the **garbage collector** (often shortened to **GC**): a part of the JVM that runs from time to time, on its own, while your program runs. Its rule is the answer to the interview question *"how is memory managed in Java?"*: **the garbage collector reclaims an object once the program can no longer reach it.** An object is **reachable** while some chain of references leads to it. The chain starts in a variable the program can use at that moment: a parameter or a local variable of a frame that is on the stack, or a static field. A static field is a variable that belongs to a class and not to one of its objects, and it is explained in [06-oop-classes.md](06-oop-classes.md). From that first variable, the chain can go on through the fields of the objects it gets to. When the last reference that led to an object is gone, the object is **unreachable**, and it becomes eligible to be reclaimed. You do not start that process and you cannot know when it will run. You stop referring to an object, and the JVM reclaims it at some later moment.

This is an object becoming unreachable, with the same `User`:

```java
User user = new User("Alice");   // the object is created, and one reference points at it
user = new User("Bob");          // user now points at a new object
```

After the second line, the `User` named Alice is still on the heap, but **no reference points at it any more**: the only one was in `user`, and the second line overwrote it.

```
        STACK                       HEAP
   ┌──────────────┐          [ User: name="Alice" ]   ← unreachable → GC will reclaim it
   │ user = ●─────┼───────►  [ User: name="Bob"   ]   ← reachable, in use
   └──────────────┘
```

No line of the program can use that object again, because no variable leads to it, so the room it takes on the heap is wasted. At some later moment the garbage collector finds that it is unreachable and reclaims that room, without any code of yours.

A `String` that you rebuild leaves the same kind of garbage: [02-strings.md](02-strings.md) showed, in its section _Accumulating text — when `+` becomes the wrong tool_, that `report += ...` inside a loop abandons one `String` object on every pass, and each of those abandoned objects is an unreachable object like `Alice`: it takes up room on the heap until the garbage collector runs, and finding it and reclaiming it is work the garbage collector has to do.

Reclaiming an object does not erase it. As [01-variables-types.md](01-variables-types.md) explained in the section _The compiler will not let you read a local variable you never assigned_, the JVM marks the space that object took on the heap as available, and gives that space to a later `new`.

> **Why Java can free memory for you, and why it does not let you do it by hand.** A program can only use an object through a reference, and the JVM knows where every reference is: in the frames that are on the stacks, in the static fields and in the fields of the objects. So the garbage collector can do what the definition of *reachable* says: start from the variables of the frames and from the static fields, follow each reference to its object, and from that object follow the references held in its fields. Every object it gets to that way can still be used by some line of the program. Every object it does not get to can never be used again, because no variable leads to it, so freeing it is safe. That includes an object that is only referenced from another unreachable object. For example, if the only reference to a `User` is inside an array, and no variable points at that array any more, then neither the array nor the `User` can be reached, and both are garbage.
>
> A `free()` written by hand would break that guarantee. If you could free an object while another variable still pointed at it, that variable would hold the address of memory that no longer contains the object. Java rules that case out: a reference either is `null` or points at an object that exists.

> **Can you run the garbage collector yourself?** There is a method for it, `System.gc()`, and all it does is ask. Its documentation says that calling it *suggests* that the JVM make an effort to reclaim unused objects, and that there is no guarantee that it will reclaim any particular number of them, or that it will finish at any particular time, if at all. Application code does not call it. The JVM decides when to collect, normally when it needs room on the heap for new objects.

> **A memory leak in Java is an object that is still reachable and that nobody needs any more.** The garbage collector only reclaims what is unreachable. It cannot know that you have finished with an object while some variable still leads to it. For example, if you add objects to a `List` that exists for as long as the program runs, and you never remove them, every one of them stays reachable through that list, and the garbage collector can never reclaim them. A program that keeps doing that uses more and more of the heap. So the garbage collector frees you from releasing memory by hand, but not from this: once you no longer need an object, no reference of yours should still lead to it.

### What you need to know about garbage collection at this level, and why tuning and diagnosis are left for later

Garbage collection is in this chapter as a mechanism to recognise, because the questions of this chapter end in it: what happens to an object that the program can no longer reach. For the code you write at this level, four things are enough:

1. An object becomes garbage once it is unreachable, and the JVM frees it automatically at some later moment. You write no code to free it.
2. You do not decide when that happens, and no line of your code may depend on it having happened.
3. An object that you no longer need but that is still reachable is never freed. That is a memory leak, as the last note above this subsection describes, and avoiding it is your job.
4. Each of the two areas of memory has its own error when it runs out of room, and you should be able to tell them apart from their first line.

The table shows those two errors: which area ran out of room in each, and what usually causes it.

| Error named in the first line of the output | The area that ran out of room | The usual cause |
|---|---|---|
| `java.lang.StackOverflowError` | the call stack of a thread | a method that calls itself and never stops, so frames are pushed and none is popped |
| `java.lang.OutOfMemoryError: Java heap space` | the heap | too many objects that are still reachable, so the garbage collector cannot free any of them |

What this chapter leaves out is everything about how the garbage collector does its work and how it is adjusted: the different collectors the JVM offers, how the heap is divided internally, the options that set the size of the heap and of the stack, and how a memory leak is diagnosed in an application that is running. It is left out for two reasons. The first is that none of it changes how you write a method or a class: the JVM chooses those settings by itself, and a project runs with them until somebody measures a problem. The second is that adjusting them is work done on an application in production, with measuring tools, when there is a real memory problem to solve, and in these notes that belongs to a later professional level. The part of garbage collection that does change how you write code is already in this section: do not keep references to objects you no longer need, and do not create thousands of throwaway objects inside a loop when a single one is enough.

---

## Aliasing — two references to one object

> 📖 Docs: [Oracle Docs — Creating Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html) → read: "Initializing an Object" — the sentence "an object can have multiple references to it" and the figure that follows it, where two references point at the same `Point` object.
> 📖 Docs: [Baeldung — How to Make a Deep Copy of an Object in Java](https://www.baeldung.com/java-deep-copy) → read: "Shallow Copy" — the bug this section describes, on a `User` that shares an `Address` object with its copy.

In the pass-by-value section, a second reference to an object appeared when you called a method: the parameter. No method call is needed for that. A plain assignment between two variables does the same, and it produces a bug that nobody writes on purpose. In this fragment, a program keeps one `User` to use as the starting point for every new user:

```java
// ❌ MAL — alice and bob are not copies of the template: they are the template itself
User template = new User("New user");

User alice = template;               // the intention: start Alice from the template
alice.name = "Alice";

User bob = template;                 // the intention: start Bob from the template
System.out.println(bob.name);        // Alice
System.out.println(template.name);   // Alice — the template itself has been renamed
```

No line in that code says "rename the template", and each line looks correct when you read it on its own. Still, Bob starts out with Alice's name, and so will every user created from the template after this.

The cause is what `=` does. An assignment copies what the variable on the right holds into the variable on the left. With two `int` variables, `int b = a;` copies the number, and from then on the two variables are independent. With two variables of an object type the rule is the same, and what the variable on the right holds is a reference. So `User alice = template;` copies the reference, not the object. Count the `new` in the fragment: there is one, so there is one `User` object. There are three variables, and the three hold the same reference:

```
        STACK                              HEAP
   ┌──────────────────────┐
   │ main() frame:        │
   │    template = ●──────┼────┐
   │    alice    = ●──────┼────┼────►  [ User: name="Alice" ]
   │    bob      = ●──────┼────┘
   └──────────────────────┘
```

When two or more references point at the same object, each one is called an **alias** of the others, and the situation is called **aliasing**. The line `alice.name = "Alice"` does not write in a `User` that belongs to Alice, because no such object exists. It writes in the only `User` object there is, and `template` and `bob` read that same object.

You can check whether two variables are aliases with `==`. [01-variables-types.md](01-variables-types.md) told you that, between two variables of an object type, `==` compares the memory addresses they hold, which are their references. So it answers exactly this question: do both point at the same object?

```java
System.out.println(alice == template);   // true — one object
```

What it means for two different objects to be equal is another question. It is explained in [06-oop-classes.md](06-oop-classes.md), together with the cases in which `==` is the wrong comparison to write.

Which changes does the other alias see? The test is the one from the pass-by-value section: did the line change the object, or did it change the variable? The table applies it to the operations you will write most often:

| What the code does through one alias | Does the other alias see it? | Why |
|---|---|---|
| Writes a field: `alice.name = "Alice";` | Yes | the field is inside the one object both point at |
| Calls a method that changes the object: `names.add("Ana");` on a list | Yes | the method changes that same object |
| Writes an element of an array: `backup[0] = 0;` | Yes | the element is inside the one array both point at |
| Assigns another object to the variable: `alice = new User("Alice");` | No | only the variable `alice` changes; the other alias still points at the first object |
| Assigns `null` to the variable: `alice = null;` | No | the object is not touched, and the other alias still points at it |

The fix is to create a second object when what you want is a second object. With this `User`, that means calling `new` and passing it the data of the template:

```java
// ✅ BIEN — each user is a new object that starts with the data of the template
User template = new User("New user");

User alice = new User(template.name);    // a second object, which starts with the same name
alice.name = "Alice";

User bob = new User(template.name);      // a third object
System.out.println(bob.name);            // New user
System.out.println(template.name);       // New user
System.out.println(alice == template);   // false — two different objects
```

> **Aliasing is not a bug in itself.** Sharing an object is often exactly what you want. In the pass-by-value section, `rename(user)` worked because the parameter `u` was an alias of the variable `user`: Action A is aliasing used on purpose. The bug appears when code treats an alias as if it were an independent copy, as the template example did. So the question to ask every time you assign one object variable to another, or pass an object to a method, is whether a change made through one reference should be seen through the other. If it should, share the reference. If it should not, create a second object.

### Aliasing only causes a bug when the object can change

The fixed version above still contains an alias, and it is harmless. `new User(template.name)` copies into the new object's `name` field the reference held in `template.name`, so for a moment the two `User` objects point at the same `String` object, `"New user"`. That shared `String` can cause no bug, because a `String` is immutable: no operation through one reference can change what the other reference reads. The line `alice.name = "Alice"` does not change that `String`. It stores in the field of the second `User` a reference to another `String`.

The same happens with two local variables:

```java
String first = "ana";
String second = first;              // two references to the same String
second = second.toUpperCase();      // creates another String, and only `second` points at it
System.out.println(first);          // ana
```

[02-strings.md](02-strings.md) gave this as the first advantage of immutability: a `String` can be shared safely, because no code that receives it can alter it.

So an aliasing bug needs three things at the same time: two references to the same object, an object whose contents can change, and code that changes it through one reference while other code still relies on what it read through the other. Take any one of the three away and the bug cannot happen, which gives the three ways to avoid it:

- **Copy the object**, as the fixed version above does, so that there are two objects and no alias.
- **Use an object that cannot change**, as `String` does. How to write a class whose objects cannot be changed after they are created is explained in [06-oop-classes.md](06-oop-classes.md).
- **Do not change an object you were given unless that is the stated job of your method.** A method called `clearFirst` or `rename` announces the change in its name. A method that receives an array only to find its largest value, and sorts the array to find it, leaves the array of the code that called it in a different order, and nothing in the call says so.

### Where a second reference to an object comes from

Every alias is a copy of a reference. In everyday code, a reference is copied in four places:

1. **An assignment between two variables**, like `User alice = template;` in this section.
2. **Passing the object as an argument.** The parameter is an alias of the variable of the calling code, as you saw in Case 2 of the pass-by-value section.
3. **Returning the object from a method.** In [04-methods.md](04-methods.md), in the section _Return types_, `getMembers()` returned a reference to the very list a `Team` object keeps, and the code that called it added an element to that list from outside.
4. **Storing the object inside another object, an array or a collection.** A field, an array position and a list each hold a reference to the object, not the object. After `team[0] = alice;`, position 0 of the array and the variable `alice` are two aliases of one `User`.

These four are all the ways a reference gets copied in the code you will write at this level.

### Arrays alias too, and a copy of an array of objects still shares the objects

> 📖 Docs: [Baeldung — How to Copy an Array in Java](https://www.baeldung.com/java-array-copy) → read: "Array Copy With Object.clone()" — the two results below: an independent copy with primitives, and shared objects with an array of objects.

An array is an object, so two array variables can be aliases like any others. The typical case is a "backup" that is not one:

```java
// ❌ MAL — backup and weekHours are the same array
int[] weekHours = {8, 8, 6};
int[] backup = weekHours;            // the intention: keep the original values
weekHours[2] = 0;
System.out.println(backup[2]);       // 0 — the "backup" changed too
```

There is one array and two variables that point at it. To get a second array, call `clone()`, a method every array has. It creates a new array of the same length and copies each position of the original into it:

```java
// ✅ BIEN — clone() creates a second array
int[] weekHours = {8, 8, 6};
int[] backup = weekHours.clone();    // a second array, with the same three numbers
weekHours[2] = 0;
System.out.println(backup[2]);       // 6
```

> **`clone()` copies what each position holds, and in an array of objects each position holds a reference.** With an `int[]`, each position holds the number itself, so the two arrays are fully independent. With an array of objects, each position holds a reference, and `clone()` copies those references. The result is two arrays whose positions point at the same objects:
>
> ```java
> User[] team = { new User("Alice"), new User("Bob") };
> User[] teamCopy = team.clone();               // a second array, with copies of the two references
>
> teamCopy[0].name = "Zoe";
> System.out.println(team[0].name);             // Zoe — both arrays point at the same User
> System.out.println(team == teamCopy);         // false — the two arrays are different objects
> System.out.println(team[0] == teamCopy[0]);   // true — position 0 of both points at the same User
> ```
>
> A copy like this one, which copies the first level and shares the objects that level points at, is called a **shallow copy**. A copy that also creates new objects for everything below is called a **deep copy**. Lists behave the same way as arrays here: how to copy a list, and what the copy shares with the original, is explained in [10-collections.md](10-collections.md).

---

## What you can do after this chapter

Up to the previous chapter you could write a method and say whether a call to it compiles. You could not say what happens to the values once the call is made. Now you can follow a call in memory: which frame each variable is in, what is copied into it, and which object each reference points at. In practice, you can now:

- Trace a chain of calls as frames. You can say which frames are on the stack at a given line, what each one holds, and in which order they are popped, whether a method returns or throws an exception. And you can read a stack trace as that same pile, with the newest frame first.
- Predict what a method can change for the code that calls it. It can never change a variable of the calling code, whatever it assigns to its own parameters. It can change the contents of an object or an array it receives, because its parameter holds a copy of the reference to that same object. With a `String`, or any other immutable object, it can change nothing.
- Say where each thing is stored: parameters and local variables in the frame of their call, objects on the heap, and fields inside the object they belong to.
- Explain why a `NullPointerException` is thrown on the line that uses the `null` and not on the line that stored it, and why the stack trace cannot show where the `null` came from.
- Explain what makes an object garbage, which is that no reference leads to it any more, why you never free it yourself, and why keeping a reference you no longer need is a memory leak.
- Recognise aliasing, two references to the same object, decide whether the two should share that object, and create a second object when they should not.

Look again at the `User` of this chapter. Its `name` field can be written by any code that holds a reference to the object: `rename` did it from another method, and `alice.name = "Alice"` did it through an alias. Nothing in the class can refuse a change, and nothing stops a `User` from being created with `null` as its name. That was deliberate, because it let you study references in isolation: what holding one allows a piece of code to do.

[06-oop-classes.md](06-oop-classes.md) uses those references to build classes whose state stays valid. There you will write a class in full, with fields that only its own methods can change and a constructor that rejects the data that should never get in. That chapter also answers the question that `alice == template` left open in this one: `==` tells you whether two references point at the same object, and what it means for two different objects to be equal is defined there.
