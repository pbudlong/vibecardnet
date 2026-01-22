# VibeCard - Viral Rewards Network

## Overview

VibeCard is a viral rewards platform that pays content participants (creators, sharers, remixers) in USDC for driving engagement and conversions. Publishers fund incentive pools, and rewards are distributed through crypto payment rails using atomic multi-party splits (x402 protocol). The project is built for the Arc Hackathon (Jan 9-23, 2026) targeting "Best Vibecoded Application" and "Best Product Design" tracks.

The current implementation is a presentation/pitch deck application showcasing the VibeCard concept with animated slides explaining the value proposition, integration flow, viral mechanics, and network vision.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom build configuration
- **Styling**: Tailwind CSS with CSS variables for theming (forest green/money theme)
- **UI Components**: shadcn/ui component library (New York style)
- **Animation**: Framer Motion for slide transitions and micro-interactions
- **State Management**: TanStack React Query for server state, React useState for local state

### Presentation System
The app is structured as a slideshow presentation with these screens:
1. Cover Screen - Title and hackathon info
2. Why Now Screen - Timeline showing crypto infrastructure maturity
3. Value Props Screen - Benefits for publishers and participants
4. Publisher Integration Screen - SDK code snippet showcase
5. Live Demo Screen - Interactive viral reward simulation
6. Viral Projection Screen - K-factor comparison and growth metrics
7. Network Vision Screen - Multi-platform roadmap

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Session Management**: express-session with PostgreSQL store option

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Current Schema**: Basic users table (id, username, password)
- **Storage Pattern**: Abstracted storage interface (`IStorage`) with in-memory implementation for development

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── screens/    # Presentation slides
│   │   │   └── ui/         # shadcn components
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
├── server/           # Express backend
├── shared/           # Shared types and schema
└── attached_assets/  # Design docs and planning
```

### Design System
- **Typography**: Inter (UI) + Space Grotesk (display/headlines)
- **Theme**: Forest green color palette representing money/growth
- **Reference Style**: Stripe + Linear + Coinbase hybrid aesthetic
- **Component Philosophy**: Professional credibility for publishers, engaging simplicity for participants

## External Dependencies

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- Drizzle Kit for migrations (`db:push` script)

### Frontend Libraries
- @tanstack/react-query - Data fetching and caching
- framer-motion - Animations
- react-icons - Icon library
- embla-carousel-react - Carousel functionality
- react-day-picker - Date picking
- recharts - Charting library
- react-hook-form + zod - Form validation

### Backend Libraries
- express-session + connect-pg-simple - Session management
- drizzle-orm + drizzle-zod - Database ORM and validation
- passport + passport-local - Authentication (not yet implemented)

### Build & Development
- Vite with React plugin
- esbuild for server bundling
- @replit/vite-plugin-runtime-error-modal - Error overlay
- @replit/vite-plugin-cartographer - Replit integration

### Active Integrations (Working)
- **Circle Wallets SDK** - Non-custodial wallets on Arc testnet
- **x402 Protocol** - Custom implementation for atomic multi-party payment splits
- **Arc Network** - Real USDC transfers with zero gas fees (Chain ID: 5042002)
- **USDC Contract**: 0x3600000000000000000000000000000000000000 (native on Arc)

### Payment Flow
1. **x402 Payment Trigger** - `/api/x402/pay` endpoint executes atomic splits
2. **Circle SDK** - `transferUSDC()` executes ERC-20 contract calls
3. **Arc Blockchain** - Sub-second finality, gasless USDC transfers

### Arc Wallets
- **Treasury**: Arc Treasury (0xb5277158cc64d6ac19e4704c2729e157c2ee12b4)
- **User Wallets**: Matt Arc, Pete Arc, Manny Arc

### Technical Notes
- **Arc USDC Precision**: Native balance uses 18 decimals, ERC-20 interface uses 6 decimals (same underlying balance)
- **USDC is Gas Token**: Every transaction costs USDC (including failed ones)
- **Transfer Limits**: Large single transfers (>$2) may fail; use chunked transfers ($1 max per transaction)
- **Reset Flow**: Uses `getArcUsdcBalanceBaseUnits()` for exact balance, `transferUSDCExact()` for precision, transfers in $1 chunks with 3-second delays
- **Gas Buffer**: $0.01 left in user wallets to cover potential gas costs
- Faucet: https://faucet.circle.com (20 USDC per 2 hours)

### Payment Flows
- **Forward (Treasury → Users)**: Works perfectly with ~15s confirmation
- **Reset (Users → Treasury)**: Works with chunked $1 transfers (~3s per chunk)

### Planned Integrations
- Virtual card issuance for spending rewards (Stripe Issue)