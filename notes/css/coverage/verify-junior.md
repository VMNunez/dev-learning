# Coverage Verify — CSS Junior

Verdict: gaps
Coverage SHA-256: 468238bfe85341142c156d7496620390168da5ed1f7ca42b3efd45ccf19b0b1d
Junior prerequisite SHA-256: n/a
Middle prerequisite SHA-256: n/a
Verified: 2026-08-01

## Open gaps

- [junior] Floats and clearing — recognise that a floated box leaves normal block flow while inline content wraps around it, and contain or clear legacy floats with `flow-root` or `clear` instead of using float as a modern layout system [Display and layout]
- [junior] Percentage heights — understand that `height: 100%` needs a definite containing-block height, while `min-height` with a viewport unit is often the robust choice for a page that must fill the screen [Sizing]
- [junior] `:is()` vs `:where()` — both group selector alternatives, but `:is()` takes the specificity of its most specific argument while `:where()` always contributes zero specificity [Selectors and specificity]
- [junior] Cascade origins — distinguish user-agent, user, and author declarations and know that origin and importance are resolved before specificity, so a more specific selector does not always win [Cascade and inheritance]
- [junior] `align-items` vs `align-content` — `align-items` positions items within a flex line, while `align-content` distributes multiple wrapped lines and has no visible effect when there is only one line [Flexbox]
- [junior] Visual order vs DOM order — flex and grid reordering can change visual placement without changing DOM, reading, or keyboard-focus order, so source order must remain meaningful [Flexbox]
- [junior] Interpolated vs discrete properties — properties such as `opacity` and `transform` can interpolate smoothly, while `display` changes discretely and should not be treated as an ordinary fade transition [Transitions and animations]
- [junior] Contrast and non-colour cues — keep text and controls readable against their backgrounds and never make colour the only signal for status, validation, or interaction state [Colors and transparency]

## Locked placement conflicts

*(none)*
