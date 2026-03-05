# Hackathon Presentation Template Guide

This project is a reusable hackathon presentation web app. It runs as a horizontal slide deck with animated transitions, keyboard navigation, and a professional design system. Below are pointers to the key files and instructions for adapting it to a new hackathon.

---

## Quick Start

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on a single port. The Replit workflow named **"Start application"** runs this command.

---

## Project Structure

```
├── client/src/
│   ├── App.tsx                          # Screen registration and ordering
│   ├── index.css                        # Color palette and CSS variables
│   ├── components/
│   │   ├── Presentation.tsx             # Slide engine (navigation, transitions, pagination)
│   │   ├── screens/                     # Individual slide components
│   │   │   ├── CoverScreen.tsx          # Title slide
│   │   │   ├── HighlightProblemScreen.tsx
│   │   │   ├── ValuePropsScreen.tsx
│   │   │   ├── WhyNowScreen.tsx
│   │   │   ├── SystemArchitectureScreen.tsx
│   │   │   ├── PublisherIntegrationScreen.tsx
│   │   │   ├── ViralProjectionScreen.tsx
│   │   │   ├── DemoPlaygroundScreen.tsx # Live demo (blockchain-specific, strip for reuse)
│   │   │   ├── NetworkVisionScreen.tsx
│   │   │   ├── LiveDemoScreen.tsx       # Unused/legacy — safe to delete
│   │   │   └── PlaceholderScreen.tsx    # Empty placeholder — safe to delete
│   │   └── ui/                          # shadcn/ui component library
│   ├── hooks/                           # use-toast, use-mobile
│   └── lib/                             # queryClient, utils
├── server/
│   ├── index.ts                         # Express server entry point
│   ├── routes.ts                        # API endpoints
│   ├── storage.ts                       # Storage interface
│   └── lib/                             # Backend integrations (blockchain-specific)
├── shared/
│   └── schema.ts                        # Drizzle ORM schema + Zod types
├── tailwind.config.ts                   # Tailwind theme (maps CSS variables)
└── vite.config.ts                       # Build config (don't modify)
```

---

## Presentation System

**File:** `client/src/components/Presentation.tsx`

The slide engine is a wrapper component that handles:

- **Keyboard navigation** — Arrow keys and Space to move between slides
- **Side arrows** — Fixed left/right chevron buttons at screen edges
- **Pagination dots** — Bottom row of clickable dots with current slide indicator
- **Animated transitions** — Framer Motion slide-in/slide-out (horizontal, 300ms)
- **Slide counter** — Shows "3 / 9" style indicator below dots

It accepts `children` as an array — each child is one slide. The `currentScreen` index and `onScreenChange` callback are passed as props from `App.tsx`.

Slide position is persisted to `localStorage` so the presentation resumes where you left off on refresh.

---

## Adding / Removing Screens

**File:** `client/src/App.tsx`

Screens are registered by placing them as children of `<Presentation>`. Order = position in the list.

**To add a screen:**

1. Create a new file in `client/src/components/screens/` (e.g. `MyNewScreen.tsx`)
2. Export a component — see Screen Anatomy below for the pattern
3. Import it in `App.tsx`
4. Add it as a child of `<Presentation>` in the position you want

**To remove a screen:**

1. Remove the `<ScreenName />` line from the `<Presentation>` children in `App.tsx`
2. Delete the screen file from `client/src/components/screens/`
3. Remove the import from `App.tsx`

**To reorder screens:**

Move the `<ScreenName />` lines up or down within the `<Presentation>` children.

**If a screen needs to know whether it's currently visible** (e.g. to trigger data fetching only when shown), pass an `isActive` prop:

```tsx
<MyScreen isActive={currentScreen === 3} />
```

---

## Screen Anatomy

Every screen follows the same basic structure:

```tsx
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function MyScreen() {
  return (
    <div className="w-full flex flex-col items-center justify-start px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Screen Title
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Subtitle or description text.
        </p>
      </motion.div>

      {/* Screen content — cards, grids, charts, etc. */}
    </div>
  );
}
```

**Key patterns:**
- Wrap everything in a `motion.div` with a fade-up animation for entrance
- Use `font-display` for headlines (Space Grotesk) and default sans for body (Inter)
- Use `text-foreground` for primary text, `text-muted-foreground` for secondary
- Use `Card` from shadcn for content blocks
- Stagger child animations with increasing `delay` values

**Reference files:**
- Simple content screen: `ValuePropsScreen.tsx`
- Cover/title screen: `CoverScreen.tsx` (receives an `onStart` callback prop)
- Complex interactive screen: `DemoPlaygroundScreen.tsx`

---

## Styling & Theming

### Color Palette

**File:** `client/src/index.css`

Colors are defined as HSL CSS variables in `:root` (light mode) and `.dark` (dark mode). The current theme is **forest green / money**:

| Variable | Light Mode | Purpose |
|----------|-----------|---------|
| `--primary` | `160 84% 31%` (deep green) | Buttons, active states |
| `--accent` | `84 81% 44%` (lime green) | Highlights, badges |
| `--background` | `0 0% 100%` (white) | Page background |
| `--foreground` | `144 61% 13%` (dark green) | Primary text |
| `--muted-foreground` | `150 10% 45%` | Secondary text |
| `--card` | `152 81% 96%` | Card backgrounds |

**To swap the palette:** Replace the HSL values in `:root` and `.dark` blocks. The format is `H S% L%` (space-separated, no `hsl()` wrapper). Every color in the app flows through these variables automatically.

### Fonts

Defined in `index.css` as CSS variables and mapped in `tailwind.config.ts`:

- **`font-sans`** → Inter (body text, UI elements)
- **`font-display`** → Space Grotesk (headlines, titles)
- **`font-mono`** → Menlo (code snippets, technical details)

### Dark Mode

Configured as `darkMode: ["class"]` in `tailwind.config.ts`. Adding the `dark` class to a parent element switches to the `.dark` variable set in `index.css`.

---

## UI Components

**Directory:** `client/src/components/ui/`

This project includes the full [shadcn/ui](https://ui.shadcn.com/) component library (New York style). Components are pre-installed — just import and use them.

Most-used components across the presentation screens:
- `Card` — Content containers
- `Badge` — Labels, tags, status indicators
- `Button` — CTAs and navigation
- `Tooltip` — Hover explanations

Import pattern:
```tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
```

Icons come from `lucide-react` (general icons) and `react-icons/si` (brand logos).

---

## Server Setup

The backend is a minimal Express server. For a presentation-only app, you may not need any custom routes — the server mostly exists to serve the frontend.

| File | Purpose |
|------|---------|
| `server/index.ts` | Express server entry, middleware, Vite dev integration |
| `server/routes.ts` | API endpoint definitions |
| `server/storage.ts` | Storage interface (`IStorage`) with in-memory implementation |
| `shared/schema.ts` | Drizzle ORM schema + Zod validation types |

If your hackathon project needs API endpoints (e.g. for a live demo), add routes in `server/routes.ts` and storage methods in `server/storage.ts`. The shared schema in `shared/schema.ts` keeps types consistent between frontend and backend.

---

## What to Strip Out

These files and features are specific to the VibeCard/Arc blockchain demo and should be removed or replaced for a new hackathon:

### Files to delete
- `server/lib/circle-wallets.ts` — Circle SDK integration
- `server/lib/x402-gateway.ts` — x402 payment protocol
- `client/src/components/screens/DemoPlaygroundScreen.tsx` — Live blockchain demo UI
- `client/src/components/ViralMindmapAnimation.tsx` — VibeCard-specific animation
- `yc-coding-session-live-demo.md` — Coding session transcript
- `presentation-script.md` — VibeCard presentation script

### Clean up `server/routes.ts`
Remove all VibeCard-specific routes and their imports. This includes everything under `/api/integrations/`, `/api/demo/`, `/api/circle/`, `/api/wallet`, `/api/wallets`, `/api/transactions/`, and any other blockchain-related endpoints. Also delete the import lines at the top of `routes.ts` that reference `circle-wallets` and `x402-gateway` — the server won't compile if those imports remain after deleting the lib files. You can replace the route contents with routes relevant to your new project, or leave `routes.ts` with just the `registerRoutes` function and `createServer` boilerplate.

### Environment variables no longer needed
- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CLOUDSMITH_TOKEN`

### Screens to remove from `App.tsx`
Remove the `<DemoPlaygroundScreen>` line and its import. Also delete the unused screen files (`LiveDemoScreen.tsx`, `PlaceholderScreen.tsx`) from the `screens/` directory. After stripping screens, verify there are no leftover imports in `App.tsx` referencing deleted files. All other screens can be kept and modified, or replaced entirely.

---

## Adapting for a New Hackathon — Checklist

1. **Update `CoverScreen.tsx`**
   - Change the title ("VibeCard" → your project name)
   - Change the subtitle ("Viral Growth Network" → your tagline)
   - Update the hackathon name badge
   - Update the track name
   - Update your name
   - Remove or update the winner badge

2. **Swap the color palette**
   - Edit HSL values in `:root` and `.dark` in `client/src/index.css`
   - Everything else updates automatically

3. **Add your content screens**
   - Create new screen components in `client/src/components/screens/`
   - Register them in `App.tsx` as children of `<Presentation>`

4. **Remove VibeCard-specific screens**
   - Delete screens you don't need
   - Remove their imports and `<Presentation>` entries from `App.tsx`

5. **Strip blockchain code** (if not needed)
   - Delete files listed in "What to Strip Out" above
   - Clean up `server/routes.ts`

6. **Add your backend** (if needed)
   - Define your data model in `shared/schema.ts`
   - Add storage methods to `server/storage.ts`
   - Add API routes to `server/routes.ts`

7. **Update `replit.md`**
   - Document your new project's architecture and dependencies
