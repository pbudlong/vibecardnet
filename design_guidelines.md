# VibeCard Rewards Networks - Design Guidelines

## Design Approach

**Reference-Based Fintech/Web3 Hybrid**

Drawing inspiration from:
- **Stripe**: Clean data visualization, sophisticated gradients, trusted fintech aesthetics
- **Linear**: Sharp typography, purposeful spacing, modern SaaS polish
- **Coinbase**: Clear hierarchy for financial information, accessible crypto UX
- **Notion**: Elegant database views, intuitive information architecture

This project requires dual personalities: **professional credibility** for publishers and **engaging simplicity** for participants.

---

## Typography System

**Font Families** (Google Fonts):
- **Primary**: Inter (400, 500, 600, 700) - All UI, body text, data
- **Display**: Space Grotesk (600, 700) - Headlines, hero sections, marketing emphasis

**Scale**:
- Hero headlines: text-6xl/text-7xl (Space Grotesk 700)
- Section headers: text-4xl/text-5xl (Space Grotesk 600)
- Card titles: text-xl/text-2xl (Inter 600)
- Body text: text-base/text-lg (Inter 400)
- Data/metrics: text-sm/text-base (Inter 500, tabular numbers)
- Labels/captions: text-sm (Inter 500)

---

## Layout System

**Spacing Primitives**: Use Tailwind units 2, 4, 8, 12, 16, 20, 24
- Component internal: p-4, p-6, gap-4
- Section padding: py-16, py-20, py-24
- Card spacing: p-6, p-8
- Grid gaps: gap-6, gap-8

**Containers**:
- Marketing pages: max-w-7xl
- Dashboard content: max-w-6xl
- Form content: max-w-2xl
- Data tables: w-full with horizontal scroll

**Grid Systems**:
- Feature showcases: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard cards: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3
- Stats display: grid-cols-2 md:grid-cols-4

---

## Component Library

### Navigation
**Publisher Dashboard**: Top nav with logo left, wallet connection right, minimal menu items (Dashboard, Campaigns, Analytics, Settings)
**Marketing Site**: Transparent-to-solid on scroll, CTAs in nav (Login, Get Started)

### Cards & Data Display
**Earnings Cards**: Rounded-2xl with subtle shadows, clear metric hierarchy (large numbers, small labels), micro-trend indicators
**Campaign Cards**: Include status badges, progress bars, key metrics in grid layout
**Transaction Lists**: Table format with alternating row treatments, inline status badges, clear timestamp formatting

### Financial Components
**Balance Display**: Large, prominent numbers with currency symbols, secondary balance info below
**Wallet Connection**: Metamask-style button with network indicator and truncated address
**Payment Flow**: Step indicator, clear confirmation states, transaction hash display

### Forms & Inputs
**Publisher Onboarding**: Multi-step wizard with progress indicator, generous field spacing
**Campaign Creation**: Guided form with inline calculations, real-time CAC projections
**Input Style**: Rounded-lg, ample padding (px-4 py-3), clear focus states

### Viral Chain Visualization
**Flow Diagram**: Horizontal timeline showing Creator → Alice → Bob → Carol with connecting lines, earnings annotations at each node
**Decay Visualization**: Gradient bars showing reward distribution with percentages
**Network Graph**: For showing viral spread patterns (use D3.js or similar)

### CTAs & Buttons
**Primary**: Large (px-8 py-4), rounded-lg, bold weight
**Secondary**: Outlined variant, same sizing
**Hero CTAs**: Extra large (px-10 py-5, text-lg), blurred backgrounds when over images

### Modals & Overlays
**Confirmation Dialogs**: Centered, max-w-md, clear action hierarchy
**Transaction Confirmation**: Show all details before commit, loading states during processing

---

## Page Layouts

### Marketing Landing Page

**Hero Section** (80vh):
- Large hero image showing viral network visualization or happy creators/users
- Headline emphasizing "Get paid to share" concept
- Dual CTAs: "For Publishers" and "For Creators"
- Trust indicator: "Backed by USDC on Arc"

**How It Works** (3 columns):
- Publisher commits budget
- Creators share & earn
- Rewards flow automatically
Each with icon and brief explanation

**Economics Showcase**:
- Interactive calculator showing CAC vs Viral Factor
- Live example with actual numbers from viral chain scenario

**Viral Chain Demo**:
- Animated visualization of the 3-action example
- Show money flow with actual dollar amounts
- Highlight "early bird" advantage

**For Publishers Section** (2 columns):
- Left: Benefits list with checkmarks
- Right: Dashboard preview screenshot/mockup

**For Creators Section**:
- Card-based layout showing earning potential
- Example earnings from viral participation
- "Get Started" CTA

**Footer**:
- Newsletter signup
- Links: Docs, API, Support, Terms
- Social links
- Hackathon badge

### Publisher Dashboard

**Header**: Balance + Campaign Stats (4-column grid)
**Active Campaigns**: Table view with status, spend, conversions, CAC performance
**Analytics Section**: Charts showing viral factor over time, top performers, conversion funnel

### Creator Dashboard  

**Hero Card**: Total earnings + Card balance (large, prominent)
**Recent Activity**: Transaction feed with chain visualization
**Active Content**: Grid of shared/remixed content with earnings-to-date

---

## Images

**Hero Image**: Abstract network visualization with nodes/connections representing viral spread, overlaid with subtle gradient (suggest purple-to-blue fintech vibe matching Arc/USDC branding)

**How It Works Icons**: Simple line icons from Heroicons (currency-dollar, share, chart-bar)

**Dashboard Mockups**: In "For Publishers" section, show clean analytics interface

**Creator Photos**: In testimonial/social proof section if included, authentic creator photos

No other images required - data visualizations and UI components carry the experience.