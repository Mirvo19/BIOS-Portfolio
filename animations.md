# Animations Guide — BIOS Portfolio

A plain-English + semi-technical breakdown of every animation in the portfolio.

---

## 🔄 The Big Picture

When someone visits the site, they see **three animation phases**:

1. **Boot Screen** — fake BIOS startup with scrolling text and a progress bar
2. **HUD Construction** — the main UI *draws itself* element-by-element, top to bottom
3. **Tab Switching** — when you click a nav tab, the new section's content draws in sequentially

### Design Philosophy: "Construct, Don't Pop"

Every animation follows one rule — **elements are drawn/traced/constructed into existence**, never popped, bounced, or flashed.

- **Clip-path reveals** — the core technique. Elements are masked and the visible region expands like a pen tracing a shape.
- **No `scale()`** — nothing ever grows from small to big. Size is constant from the start.
- **No `brightness(3+)`** — no blinding flashes. Elements simply become visible as they're drawn.
- **No overshoots/bounces** — motion is linear and purposeful, like a plotter or CRT beam.
- **Simple easing** — smooth `ease` curves, no springy `cubic-bezier` overshoot.

The visual metaphor: imagine a plotter pen drawing the UI onto screen, or a CRT beam tracing out each element left-to-right, top-to-bottom.

---

## Phase 1: Boot Screen

**What happens:** A fullscreen overlay shows a retro BIOS-style startup. Lines of text appear one by one (like a computer booting), and a progress bar fills up.

**How it works (JS — `runBootSequence()`):**

- There's an array called `bootMessages` — each entry has the text to display, a color type (`ok`, `warn`, `info`, `dim`), and a delay in milliseconds.
- A recursive function `showNext()` picks the next message, creates a `<div>` for it, appends it to the boot log, updates the progress bar width, then calls itself again after the message's delay.
- The progress percentage is calculated as `(currentIndex / totalMessages) * 100`.
- You can **skip** the boot by pressing any key or clicking — this calls `finishBoot()` immediately.

**How it works (CSS):**

- The boot screen is a fixed overlay (`position: fixed; inset: 0`) with `z-index: 5000` so it covers everything.
- The progress bar fill uses a `transition: width 0.1s linear` so it slides smoothly.
- When boot finishes, the overlay gets a `fade-out` class which triggers `opacity: 0` over 0.6 seconds.

---

## Phase 2: HUD Construction Sequence

**What happens:** After the boot screen fades out, the main BIOS UI is revealed. Instead of just appearing all at once, each piece of the interface is **drawn/traced** individually in order — like a plotter constructing a blueprint, or a CRT beam sketching the UI. The sequence is **fully sequential** (top to bottom, no parallel animations).

### The Timeline System

**How it works (JS — `runHudSequence()`):**

The core idea is simple:

1. A **running clock variable** `t` starts at `80` (milliseconds).
2. For each element, the function:
   - Tags the element with a `data-hud` attribute (e.g., `data-hud="header"`)
   - Records `{ element, delay: t }` into a timeline array
   - Advances `t` by a gap (e.g., `t += 100`)
3. After all elements are queued, it loops through the timeline and does `setTimeout(() => el.classList.add('hud-visible'), delay)` for each one.

The `data-hud` attribute serves **two purposes**:
- It **hides** the element initially (CSS rule: `[data-hud] { opacity: 0; visibility: hidden; }`)
- It tells CSS **which construction animation** to play when `hud-visible` is added

### The Order of Construction

| Step | What appears | Gap (ms) | Animation |
|------|-------------|----------|-----------|
| 1 | Header bar | 100 | Top edge draws, then reveals downward (`drawDown`) |
| 2 | Header left / right zone | 70 / 60 | Typewriter trace left-to-right / trace from right edge |
| 3 | Brand text, separator, date, status | 40-60 each | Typewriter trace, line draw, fade-trace, expand from center |
| 4 | Navigation bar | 90 | Draws down from top edge |
| 5 | Each nav tab (MAIN, ABOUT, SKILLS...) | 50 each | Traced in from left edge |
| 6 | Each key-hint in nav | 32 each | Sketched in (quick trace) |
| 7 | Left panel container | 100 | Traced from left edge to right |
| 8 | Section title bars | 60 each | Traced left-to-right |
| 9 | Each info row (Name, Role, Status...) | 32 each | Traced left-to-right |
| 10 | Separator lines | 38 each | Line drawn left-to-right |
| 11 | Menu items (arrow → label → dots → value) | 14-22 each part | Quick sketch, typewriter trace, progressive dot draw, trace from right |
| 12 | Right panel container | 100 | Traced from right edge to left |
| 13 | Each right sidebar section + children | 12-28 each | Scan reveal top-to-bottom, trace right |
| 14 | Footer bar | 90 | Bottom edge draws, then reveals upward (`drawUp`) |
| 15 | Footer children + key hints | 30-55 each | Typewriter trace, sketch |

### The Animation Types (CSS `@keyframes`)

Each `data-hud` value maps to a specific CSS animation. All use **clip-path reveals** with **stepped progression** (6-8 keyframe stops) to create a hand-drawn/plotter feel — no scale, no bounce, no flash.

| Animation Name | Used For | Visual Effect |
|---------------|----------|---------------|
| `drawDown` | Header, Nav | Top edge traces first (10%), then progressive fill downward through 6 steps |
| `drawUp` | Footer | Bottom edge traces first, then progressive fill upward |
| `traceRight` | Left panel, title bars, info keys, nav tabs, mem bars | Visible area traces left→right through 7 stepped increments like a plotter pen |
| `traceLeft` | Right panel, header-right, info values, menu values | Same but right→left, 7 steps |
| `typeTrace` | Brand, footer spans, info keys, menu labels, form labels | Stepped left→right trace with 7 stops — mimics a typewriter cursor |
| `scanDown` | Right sections | Thin visible line sweeps top→bottom through 6 progressive steps |
| `drawLine` | Buttons, form inputs | Thin horizontal line extends left→right (48% inset), then element height expands |
| `sketchBox` | — (available) | Draws top edge as a line, then both sides expand down via polygon |
| `expandCenter` | Status dot, clock, status text | Visible area expands outward from center point |
| `sketchSmall` | Tab icons, title icons, kbd keys, key hints, tool chips, flag status | Quick trace for tiny elements |
| `drawDots` | Menu dots (.......) | Progressive trace from left, settles at 0.6 opacity |
| `constructBar` | CPU mini bar fills, skill bars | `scaleX(0)` → `scaleX(1)` from left origin, no overshoot |
| `constructClock` | Clock | Expands from center outward using clip-path |
| `drawSeparator` | Separator lines, header sep, footer sep | Drawn left→right, starts dim at 40% opacity |
| `constructNotice` | Dev notice box | Left edge traces, visible area sweeps right via polygon |
| `fadeTrace` | Date text, mini bar labels | Gentle opacity fade combined with clip-path trace |

### Technical: How CSS Animations Work Here

```css
/* 1. ALL data-hud elements start hidden */
[data-hud] {
    opacity: 0;
    visibility: hidden;
}

/* 2. When JS adds 'hud-visible', the element becomes visible */
[data-hud].hud-visible {
    visibility: visible;
}

/* 3. The specific data-hud value determines WHICH construction animation plays */
[data-hud="header"].hud-visible {
    animation: drawDown 0.5s ease forwards;
}
```

The `forwards` keyword means the element stays in its final animation state (fully visible) after the animation ends. Simple `ease` curves are used throughout — no bouncy overshoots.

### The Core Technique: `clip-path: inset()`

Almost every animation uses `clip-path: inset(top right bottom left)` to control which part of the element is visible:

```css
/* Start: fully clipped from the right = invisible */
clip-path: inset(0 100% 0 0);

/* End: no clipping = fully visible */
clip-path: inset(0 0 0 0);
```

By animating between these values, the element appears to be **drawn** or **traced** into existence. Different starting values create different draw directions:

- `inset(0 100% 0 0)` → traces **left to right**
- `inset(0 0 0 100%)` → traces **right to left**
- `inset(0 0 100% 0)` → draws **top to bottom**
- `inset(100% 0 0 0)` → draws **bottom to top**
- `inset(0 50% 0 50%)` → expands **from center**

---

## Phase 3: Tab-Switch Animations

**What happens:** When you click a nav tab (e.g., ABOUT, SKILLS), the new section's content doesn't just appear — every sub-element is individually drawn in with a staggered delay, same construct/sketch philosophy as the HUD but faster.

**How it works (JS — `animateSectionIn()`):**

1. It walks through every child element inside the section and breaks them into the smallest visible pieces:
   - `.section-title-bar` → icon (`t-titleicon`) then text (`t-title`)
   - `.info-row` → key label (`t-infokey`) then value (`t-infoval`)
   - `.menu-item` → arrow (`t-menuarrow`) → label (`t-menulabel`) → dots (`t-menudots`) → value (`t-menuval`)
   - `.bio-line` → whole line (`t-bio`)
   - `.flag-item` → status bracket (`t-flagstatus`) then name (`t-flagname`)
   - `.skill-entry` → name (`t-skillname`) → bar (`t-skillbar`) → percentage (`t-skillpct`)
   - `.tool-chip` → each chip individually (`t-chip`)
   - `.form-row` → label (`t-formlabel`) then input (`t-forminput`)
   - `.bios-btn` → draw-line expand (`t-btn`)
2. Each element is hidden, then revealed with a **16ms stagger** between elements.

**How it works (CSS):**

Each type class triggers a reused construction keyframe — the same `traceRight`, `typeTrace`, `sketchSmall`, `constructBar` etc. from the HUD system, just with shorter durations (~0.08-0.22s) so tab switching feels snappy. The construct philosophy is identical everywhere.

---

## Other Animations

### Grid Overlay Flash
When the HUD sequence starts, a faint **cyan grid overlay** briefly pulses across the screen and fades. This is the `.hud-grid-overlay` element — it uses two repeating gradients (horizontal + vertical lines) and a `hudGridPulse` animation that flashes to 0.8 opacity and fades to 0 over 2.5 seconds.

### Blinking Elements
- **Cursor blink** (`.blink-text`): On/off every 1 second using `step-end` timing
- **Status dot** (`.blink-dot`): Pulses between full opacity with glow and dim, every 1.2 seconds

### Skill Bars
When you open the Skills tab, the skill bar widths animate from 0% to their target percentage using `transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1)` — a smooth ease-out curve. This only happens once (tracked by `skillBarsAnimated` flag).

### CPU Load Bars (Right Panel)
The mini bars in the sidebar use `animation: fillBar 2s 1.5s ease forwards` — they animate from 0% to their `--target` CSS variable width. The `1.5s` delay ensures they start filling after the HUD construction reaches them.

### Typing Effect
In the About section, a phrase types out character by character, pauses, then deletes and types the next phrase. This is pure JS — `initTypingEffect()` manipulates `textContent` with `setTimeout` calls (55ms per character typing, 30ms per character deleting).

### Scanlines
A fixed overlay (`position: fixed; inset: 0`) with a repeating linear gradient that creates thin dark lines every 4px across the entire screen, giving the retro CRT monitor look. It's always on, purely decorative, and has `pointer-events: none` so it doesn't block clicks.

---

## Quick Reference: File Responsibilities

| File | What it handles |
|------|----------------|
| `script.js` | Boot sequence logic, HUD timeline scheduling, tab switching, typing effect, GitHub API, contact form |
| `styles.css` | All `@keyframes` definitions, `[data-hud]` selectors, responsive breakpoints, all visual styling |
| `index.html` | DOM structure, overlay elements (grid, scanlines, popup) |

---

## Tips for Modifying

- **Speed up/slow down HUD**: Change the gap numbers in `runHudSequence()` — they're in milliseconds between each element.
- **Change animation style for an element**: Find its `[data-hud="..."].hud-visible` CSS rule and swap the `animation` property.
- **Add a new animated element**: Give it a `data-hud="something"` in JS, create a `[data-hud="something"].hud-visible` CSS rule, and add a `@keyframes` for it.
- **Speed up tab switches**: Change the `delay += 16` value in `animateSectionIn()` — lower = faster.
- **New draw direction**: Use `clip-path: inset()` with different starting values (see "The Core Technique" section above).
