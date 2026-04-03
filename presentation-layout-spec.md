# Presentation Layout Spec
## Exact measurements, sizing, and structure to replicate this demo app

> All values are Tailwind class names unless otherwise noted. Tailwind default: `1 unit = 0.25rem = 4px`.

---

## 1. Overall Shell

**File:** `client/src/components/Presentation.tsx`

```
<div class="relative h-screen w-screen overflow-y-auto bg-background">
```

- Full viewport: `h-screen w-screen`
- Vertical scroll allowed: `overflow-y-auto` (slides taller than viewport can scroll)
- Background color from CSS variable `--background`

Each slide is wrapped in a Framer Motion `motion.div`:

```
className="min-h-screen flex flex-col"
```

- `min-h-screen` — slide is at least one screen tall, but grows with content
- `flex flex-col` — content fills top, pagination flows naturally to the bottom
- The `flex-1` div wraps `children[currentScreen]`, pushing pagination to the bottom

**Slide transition animation:**
```js
initial={{ x: 100, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
exit={{ x: -100, opacity: 0 }}
transition={{ duration: 0.3, ease: "easeInOut" }}
```
Slides enter from the right, exit to the left. 300ms duration.

---

## 2. Pagination Bar

Positioned at the bottom of each slide's `flex flex-col` layout — not fixed, flows naturally below content.

```
<div class="py-3 flex flex-col items-center gap-2">
```

- `py-3` = 12px top/bottom padding
- `gap-2` = 8px between the dot row and the `n / total` counter

**Dot row:**
```
<div class="flex items-center gap-3">
```
- `gap-3` = 12px between prev-arrow, dots, next-arrow

**Individual dots:**
- Active: `h-2 w-8 rounded-full bg-primary` (8px tall, 32px wide, pill shape)
- Inactive: `h-2 w-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50`
- Gap between dots: `gap-2` (8px)
- Transition: `transition-all duration-300`

**Prev/Next chevrons in the dot row** (small, inline):
```
class="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
```
- Icon size: `h-4 w-4` (ChevronLeft / ChevronRight)
- Only rendered when not at the first/last slide

**Slide counter** (below dots):
```
<span class="text-xs text-muted-foreground">
  {currentScreen + 1} / {totalScreens}
</span>
```

---

## 3. Fixed Side Navigation Arrows

Two large circular buttons fixed to the left and right viewport edges, vertically centered. These are separate from the pagination dots.

```
class="fixed left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg z-50"
```

- Left arrow: `left-4` (16px from left edge)
- Right arrow: `right-4` (16px from right edge)
- Vertically centered: `top-1/2 -translate-y-1/2`
- Size: `h-12 w-12` (48×48px)
- Glass effect: `bg-background/80 backdrop-blur-sm`
- Border + shadow: `border border-border shadow-lg`
- Always above content: `z-50`
- Icon size: `h-6 w-6` (ChevronLeft / ChevronRight)
- Prev arrow hidden on slide 0; Next arrow hidden on last slide

---

## 4. Keyboard Navigation

```js
ArrowRight or Space → goNext()
ArrowLeft          → goPrev()
```

Listener on `window`, `e.preventDefault()` called to suppress native scroll on Space.

---

## 5. State Persistence

Current slide index saved to localStorage:

```js
key: 'vibecard-current-screen'
default: 0
```

Read on app load, written on every slide change.

---

## 6. Screen Registration (App.tsx)

Screens are children of `<Presentation>` in order. Position = slide index.

```tsx
<Presentation currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
  <CoverScreen onStart={handleStart} />          {/* index 0 */}
  <HighlightProblemScreen />                      {/* index 1 */}
  <ValuePropsScreen />                            {/* index 2 */}
  <WhyNowScreen />                                {/* index 3 */}
  <SystemArchitectureScreen />                    {/* index 4 */}
  <PublisherIntegrationScreen />                  {/* index 5 */}
  <ViralProjectionScreen />                       {/* index 6 */}
  <DemoPlaygroundScreen isActive={currentScreen === 7} />  {/* index 7 */}
  <NetworkVisionScreen />                         {/* index 8 */}
</Presentation>
```

Screens that need to know they're visible receive `isActive={currentScreen === N}`.

---

## 7. Typography System

| Class | Font | Usage |
|-------|------|-------|
| `font-display` | Space Grotesk | All headings (h1, h2, h3) |
| `font-sans` | Inter | Body text, labels, UI |
| `font-mono` | Menlo | Code, numbers, tx hashes |

Defined as CSS variables in `index.css`:
```css
--font-sans: Inter, sans-serif;
--font-display: Space Grotesk, sans-serif;
--font-mono: Menlo, monospace;
```

---

## 8. Standard Screen Container Pattern

All content screens use this outer wrapper:

```tsx
<div className="w-full flex flex-col items-center justify-start px-[4-8] py-[4-8]">
```

- `w-full` — full width
- `flex flex-col items-center` — centered column
- `justify-start` — content anchors to top (no vertical centering)
- Padding varies per screen (see individual specs below)

**Standard heading block** (used on most screens):
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-center mb-[6-10]"
>
  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
    Screen Title
  </h1>
  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
    Subtitle text.
  </p>
</motion.div>
```

---

## 9. Screen-by-Screen Layout Specs

---

### Screen 0 — Cover

**File:** `CoverScreen.tsx`

**Outer container:**
```
class="relative w-full pt-20 pb-4 flex items-center justify-center"
```
- `pt-20` (80px top) / `pb-4` (16px bottom) — asymmetric: extra top space pushes content slightly above center

**Inner column:**
```
class="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl -mt-6"
```
- `max-w-4xl` = 896px max width
- `-mt-6` (−24px) nudges content upward from center

**Element stack (top to bottom), each wrapped in `motion.div` with staggered `delay`:**

| Element | Classes | Delay |
|---------|---------|-------|
| Hackathon badge | `mb-6` | 0s |
| h1 title | `font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-4` | 0.1s |
| h2 subtitle | `font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-12` | 0.2s |
| CTA button | `px-8 py-6 text-lg font-semibold gap-2` | 0.4s |
| Footer meta | `mt-12 flex flex-col items-center gap-1 text-sm text-muted-foreground` | 0.6s |

**Animation:** `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`, `duration: 0.6`

---

### Screen 1 — Highlight Problem

**File:** `HighlightProblemScreen.tsx`

**Outer container:** `px-8 py-8`

**Heading block:** `mb-8`
- h1: `font-display text-4xl md:text-5xl font-bold text-foreground`

**Content:** Single column, `max-w-4xl`, `space-y-4`

**Each card:**
```tsx
<Card className="p-5">
  <div className="flex items-start gap-4">
    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h3 className="font-display font-bold text-foreground text-xl mb-1">Era title</h3>
      <p className="text-muted-foreground text-base">Description</p>
    </div>
  </div>
</Card>
```

**Animation:** `initial={{ opacity: 0, x: -30 }}`, stagger `delay: 0.2 + index * 0.15`

---

### Screen 2 — Value Props

**File:** `ValuePropsScreen.tsx`

**Outer container:** `px-8 py-6`

**Heading block:** `mb-8`
- h1: `font-display text-4xl md:text-5xl font-bold text-foreground mb-3`
- Subtitle: `text-lg text-muted-foreground max-w-2xl mx-auto`

**Two-column layout:**
```
class="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-center"
```
- `max-w-5xl` = 1024px max width
- Stack on mobile, side-by-side on md+

**Left column — Orbit diagram:**
- Container: `flex-1 flex items-center justify-center`
- SVG canvas: `width: 380px; height: 380px` (fixed inline style)
- Center circle: `w-28 h-28 rounded-full` with `border-2 border-primary`
- Middle ring radius: `105px`, 6 items at `360/6` degree intervals
- Outer ring radius: `170px`, 8 items

**Right column — Flywheel steps:**
- Container: `flex-1 flex flex-col items-center`
- h2: `font-display text-xl font-bold text-foreground mb-3`
- Step cards: `px-3 py-2 bg-card border text-center w-64`
- Arrows between steps: `ChevronDown h-4 w-4 text-primary`

---

### Screen 3 — Why Now

**File:** `WhyNowScreen.tsx`

**Outer container:** `px-8 py-8`

**Heading block:** `mb-10`
- h1: `font-display text-4xl md:text-5xl font-bold text-foreground mb-3`
- Subtitle: `text-lg text-muted-foreground max-w-2xl mx-auto`

**Timeline row:**
```
class="flex gap-2 md:gap-4 justify-center mb-3 overflow-x-auto pb-2"
```
- 5 cards, each `flex-shrink-0`
- Card size: `p-3 w-36 md:w-40`
- Active card (2025): `border-primary border-2 bg-primary/5`
- Year badge: `text-base font-display font-bold px-2 py-0.5`
- Title: `font-semibold text-xs text-center mb-2 leading-tight`
- List items: `flex items-start gap-1.5 text-xs`, icon `h-3.5 w-3.5`
- Animation: stagger `delay: index * 0.1`

**Enabler cards row:**
- 3 cards, `flex flex-wrap justify-center gap-6`
- Each card: `p-5 w-72 text-left`
- h3: `font-display font-bold text-lg text-primary mb-2`
- p: `text-sm text-muted-foreground`

**Closing quote:** `text-center text-lg font-medium text-muted-foreground italic`

---

### Screen 4 — System Architecture

**File:** `SystemArchitectureScreen.tsx`

**Outer container:** `px-4 py-4` (tighter than other screens — more content)

**Heading block:** `mb-4` (tighter)
- h1: `font-display text-3xl md:text-4xl font-bold text-foreground mb-2` (one size smaller than others)
- Subtitle: `text-sm text-muted-foreground max-w-2xl mx-auto mb-3`

**Toggle buttons:** Simple / Detailed, `Button size="sm"`, `gap-2` between

**Simple View — 3-column horizontal layout:**
```
<div class="flex justify-center gap-3">
  <!-- Left column (self-start mt-[42px]) -->
  <!-- Center column (border-2 border-primary) -->
  <!-- Right column (self-end mb-[4px]) -->
</div>
```
- Left/right aligned to top/bottom to create diagonal feel
- Left column starts at `mt-[42px]` (aligned to Reward Pool row)
- Right column ends at `mb-[4px]` (aligned to User Payouts row)
- Input/output cards: `p-4 w-36` (left) and `p-4 w-32` (circle onramp)
- Center core card: `p-4 border-2 border-primary bg-primary/5`
- Internal step boxes: `w-36 px-3 py-2`, `ArrowDown h-3 w-3 text-primary/60`
- Section badge: `absolute -top-3 left-1/2 -translate-x-1/2`

**Legend:** `mt-8 flex gap-6 text-xs text-muted-foreground`, colored circles `h-3 w-3 rounded-full`

---

### Screen 5 — Publisher Integration / Content Tracking

**File:** `PublisherIntegrationScreen.tsx`

**Outer container:** `px-8 py-6`

**Heading block:** `mb-6`
- h1: `font-display text-4xl md:text-5xl font-bold text-foreground mb-3`
- Subtitle: `text-lg text-muted-foreground max-w-2xl mx-auto`

**Two-column grid:**
```
class="w-full max-w-5xl grid md:grid-cols-2 gap-6"
```

**Left column — Content examples:**
- Flex column, `gap-4`
- Top card: `p-4 overflow-hidden`, image `w-full h-32 object-cover object-bottom`
- Bottom card: `p-0 overflow-hidden bg-slate-950 border-slate-800`, image `w-full h-60 object-cover object-top`
- Both columns animate: left `x: -30 → 0`, right `x: 30 → 0`, same `delay: 0.2`

**Right column — Code block:**
```
<Card class="p-4 bg-slate-950 border-slate-800 h-full">
```
- macOS traffic light dots: `w-3 h-3 rounded-full` in red/yellow/green
- Filename label: `text-xs text-slate-400 ml-2`
- Code: `<pre>` with `text-[9px] md:text-[11px] text-slate-300 overflow-x-auto`

---

### Screen 6 — Viral Projections

**File:** `ViralProjectionScreen.tsx`

**Outer container:** `px-6 py-4`

**Heading block:** `mb-12` (larger bottom margin — the content below is compact)
- h1: `font-display text-3xl md:text-4xl font-bold text-foreground mb-1` (slightly smaller)
- Subtitle: `text-base text-muted-foreground max-w-2xl mx-auto`

**Content area:** `w-full max-w-6xl flex flex-col gap-0`

**Top row:** `grid grid-cols-1 lg:grid-cols-2 gap-2 items-start`
- Left: K-Factor card `p-4`, bars `h-3 rounded-full`, animated width from 0
- Right: `ViralMindmapAnimation` component, container `min-h-[220px] flex items-start justify-center`

**Bottom row:** `grid grid-cols-1 lg:grid-cols-2 gap-2 items-end` with `style={{ marginTop: '-20px' }}`
- Negative margin overlaps slightly with the top row for compact layout
- Left: Projection table `p-4`, `text-xs` throughout, `font-mono` for numbers
- Right: Windfall cards `p-4`, each row `flex items-center justify-between p-2 rounded-lg bg-muted/30`
- Earnings figure: `font-display text-lg font-bold text-foreground`

---

### Screen 7 — Demo Playground

**File:** `DemoPlaygroundScreen.tsx`

This is the live demo screen with blockchain integration. Skip for template reuse — replace with your own interactive screen using the same outer container pattern: `px-4 py-4` or `px-6 py-6`.

---

### Screen 8 — Network Vision

**File:** `NetworkVisionScreen.tsx`

**Outer container:** `px-8 py-6`

**Heading block:** `mb-6`
- h1: `font-display text-4xl md:text-5xl font-bold text-foreground mb-2`
- Subtitle: `text-lg text-muted-foreground max-w-2xl mx-auto`

**Content area:** `w-full max-w-5xl`

**Hub diagram card:** `p-6 mb-6`
- Inner layout: `flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6`
- Platform chips: `p-3 rounded-lg bg-muted/50 w-20`, icon `h-6 w-6`, label `text-xs`
- Connector arrows: `ArrowRight h-8 w-8 text-primary`
- Hub node: `p-4 rounded-xl bg-primary/10 border-2 border-primary`, icon `h-8 w-8`
- Wallet node: `p-4 rounded-xl bg-accent/10 border-2 border-accent`

**GTM Progression card:** `p-3 mb-6`
- h2: `font-display text-xl font-bold text-foreground mb-3 text-center`
- Grid: `grid grid-cols-2 md:grid-cols-4 gap-3`
- Active phase: `bg-primary/10 border-2 border-primary p-3 rounded-lg text-center`
- Inactive phases: `bg-muted/30 p-3 rounded-lg text-center`

**Closing card:** `p-4 bg-primary/5 border-primary border-2`
- h2: `font-display text-xl font-bold text-foreground mb-2`
- p: `text-muted-foreground text-sm mb-3 max-w-xl mx-auto`
- Badge row: `flex flex-wrap justify-center gap-2`

---

## 10. Standard Animation Patterns

**Fade up (headings and blocks):**
```js
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

**Slide in from left:**
```js
initial={{ opacity: 0, x: -30 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5, delay: 0.2 }}
```

**Slide in from right:**
```js
initial={{ opacity: 0, x: 30 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5, delay: 0.2 }}
```

**Scale in (diagrams, cards):**
```js
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.5, delay: 0.15 }}
```

**Staggered list items:**
```js
transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
```

**Delayed fade (closing quotes, legends):**
```js
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.5, delay: 1.0 }}
```

---

## 11. Color Variables (index.css)

All colors use HSL format: `H S% L%` (space-separated, no `hsl()` wrapper).

**Light mode (`:root`):**
```css
--background:         0 0% 100%;
--foreground:         144 61% 13%;
--primary:            160 84% 31%;
--primary-foreground: 0 0% 100%;
--accent:             84 81% 44%;
--muted:              152 81% 96%;
--muted-foreground:   150 10% 45%;
--card:               152 81% 96%;
--border:             152 44% 89%;
```

**Dark mode (`.dark`):**
```css
--background:   0 0% 7%;
--foreground:   0 0% 98%;
--primary:      262 83% 58%;
--card:         0 0% 9%;
--border:       0 0% 15%;
```

`tailwind.config.ts` maps these to Tailwind utilities so `bg-primary`, `text-foreground`, etc. all pull from the CSS variables automatically.

---

## 12. Card Component Pattern

`Card` from `@/components/ui/card` renders as:
```
border border-border bg-card rounded-lg
```
Padded by the consuming component (e.g. `p-3`, `p-4`, `p-5`, `p-6`). Never hard-code colors on cards — they inherit from the theme automatically.
