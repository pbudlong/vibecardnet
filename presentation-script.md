# VibeCard Presentation Script

## Slide 1: Cover Screen

**Badge:** Agentic Commerce On Arc Hackathon - Jan 9 - 23, 2026

**Title:** VibeCard

**Subtitle:** Viral Rewards Network

**Button:** Start Demo

**Footer:**
- **Track: Best Gateway-Based Micropayments Integration**
- Pete Budlong
- 100% Vibecoded on Replit

---

## Slide 2: The Viral Problem

**Title:** The Viral Problem

### Point 1: The heyday of viral growth - Web 2.0 (2000s)
Systematically engineered viral loops drove exponential growth for Facebook, LinkedIn, YouTube through measurement and A/B testing.

### Point 2: Last decade mobile killed it
Email-based invite mechanics disappeared, spam filters rose, and SMS/contacts-based invites were throttled by anti-spam regs.

### Point 3: AI flash bringing it back but spiky
Same pattern repeating with ChatGPT wrappers, Midjourney, Lensa—fast viral spikes, low retention. Simple tools, explosive growth, spiky engagement.

### Point 4: Opportunity abounds - Andrew Chen (a16z)
Time to revive the discipline and **adapt it for modern product-led growth and AI-era growth loops.**

---

## Slide 3: The AI-era Solution (Value Props)

**Title:** The AI-era Solution

**Subtitle:** 
- The first viral growth network backed by stablecoins.
- Members get paid to create, share and remix.
- Powered by USDC on Arc.

### Visual Elements:

**Left Side - Network Diagram:**
- Outer Ring: Use Cases (Trackers, Teams, Planners, Dashboards, Calculators, Learning, Guides, Tools)
- Middle Ring: Platforms (Replit, Lovable, Bolt, Cursor, Claude, Circle App Builder)
- Center: VibeCard

**Right Side - Beachhead ICP Flywheel:**
1. Platform funds reward pool
2. Promotes to creators - "Add VibeCard to your app!"
3. Creators integrate snippet - Easy, platform-endorsed
4. Content shared with rewards:
   - Sharers earn USDC
   - Some convert to platform users
   - Some remix, create more content
5. Platform grows, funds more rewards, cycle accelerates, more platforms and creators join

---

## Slide 4: Why Now?

**Title:** Why Now?

**Subtitle:** The convergence of enabling technologies makes VibeCard possible today.

### Timeline:

| Year | Title | Status | Items |
|------|-------|--------|-------|
| **2017** | Stablecoins Emerge | Blocked | No mainstream adoption, No developer tooling, High gas fees |
| **2020** | USDC Gains Traction | Blocked | Still expensive to transact, No embedded wallet solutions, UX requires crypto expertise |
| **2023** | L2s Reduce Gas Costs | Partial | ✓ Transactions under $0.10, ✗ Still fragmented ecosystem, ✗ Bridge complexity |
| **2024** | Account Abstraction | Partial | ✓ Users don't need to understand crypto, ✓ Social login → wallet, ✗ Payment protocols immature |
| **2025** | All Pieces In Place | Ready | ✓ Native USDC chain (Arc), ✓ Embedded wallets (Circle), ✓ Micropayment protocol (x402), ✓ Gas costs ~$0.001 |

### The Cambrian Explosion of User-Generated Software (UGS)

**Content Growth:** Vibe coding platforms are creating 100,000+ new apps per day.

**Missing Reach:** These builders can ship in minutes but need help marketing.

**Crypto Leverage:** VibeCard creates the distribution layer for the long tail of UGS.

**Quote:** "UGS and robot money will kick off a new wave of exponential viral growth."

---

## Slide 5: System Architecture

**Title:** System Architecture

**Toggle:** Simple | Detailed

### Simple View:
End-to-end payment flow from campaign funding to participant rewards

**Flow:** Stripe Payments (Platform/Content Owner) → Arc Onramp (Fiat → USDC) → **VibeCard Onchain Core** (Reward Pool → Viral Network → x402 Splits → User Payouts) → Arc Onramp (USDC → Fiat) → Stripe Issuance (VibeCard Member)

**Legend:**
- Fiat Rails (Stripe purple)
- USDC Bridge (Circle sky blue)
- Onchain Core (Primary green)

### Detailed View:
End-to-end payment flow from reward pool funding to VibeCard spending

**ASCII-style diagram showing:**
- AI Creator's App / Artifact
- Three modules: Share Button (visual), Conversion Tracking (signup, purchase), Reward Status API (budget, trending)
- VibeCard Backend: Event Processor → Reward Calculator → x402 Payment Trigger
- Circle Gateway SDK (x402 atomic splits)
- Wallets: Creator Wallet, Sharer Wallet, Actor Wallet (Circle Non-custodial Wallets)
- Arc Blockchain (USDC Settlement)

---

## Slide 6: Content Tracking (Publisher Integration)

**Title:** Content Tracking

**Subtitle:** Platforms and creators can add viral rewards to projects in minutes.

### Left Side - Example Projects:

**Solar System Visualization**
- Interactive 3D solar system visualization
- Created by Matt P.
- Buttons: View App, Remix Template (highlighted)
- Stats: 3,214 views, 6 forks

**3iAtlas Provenance Tracker**
- Screenshot with share bar highlighted

### Right Side - Code Snippet:

```typescript
// Initialize VibeCard for your project
import { VibeCard } from '@vibecard/sdk';

const vibe = new VibeCard({
  publisherId: 'your-project-id',
  budget: 1000,  // USDC budget
});

// Track a remix action
vibe.trackRemix({
  originalId: 'project-123',
  remixId: 'remix-456',
  remixerId: user.walletAddress,
  upstreamRef: referralCode,
});

// Track a share action
vibe.trackShare({
  contentId: 'project-123',
  sharerId: user.walletAddress,
  upstreamRef: referralCode,
});

// Track a conversion (triggers x402 payout)
vibe.trackConversion({
  contentId: 'project-123',
  userId: user.walletAddress,
  value: 10.00,  // USDC value
});
```

---

## Slide 7: Viral Growth Projections

**Title:** Viral Growth Projections

**Subtitle:** Paid sharing boosts the k-factor. The earlier you get in, the more you get.

### K-Factor Comparison:
| Scenario | K-Factor | Description |
|----------|----------|-------------|
| Without VibeCard | K = 0.5 | Viral decay, limited reach |
| With VibeCard | K = 1.2 | Viral growth, exponential reach |

**Note:** K > 1 = Each share generates more than one new share

### Viral Tree Animation:
- Interactive visualization showing Creator (purple), Remix (teal), Share (gold) nodes
- Click to regrow

### Path to 1,000 Actions:
| Initial | Without | With VibeCard |
|---------|---------|---------------|
| 1 | 1 | 1 |
| 10 | 5 | 12 |
| 50 | 18 | 89 |
| 100 | 32 | 248 |
| 500 | 87 | 1,847 |
| 1000 | 156 | 8,932 |

### Windfall Potential (1,000 conversions @ $10):
| Role | Earnings | Description |
|------|----------|-------------|
| Creator | $1,600 | 40% of all conversions |
| First Sharer | $320 | Highest upstream share |
| Early Adopters (top 10) | $80-160 each | Upstream decay rewards |

---

## Slide 8: Live Demo

**Title:** Live Demo Playground

**Subtitle:** Real USDC transactions on Arc Network testnet

### Left Side - Integration Status Console:
- Circle Wallets: Connected
- Circle x402 Gateway: Connected
- Arc Network: Connected (Chain 5042002)
- Conversion Tracking: Enabled
- Treasury Funded: $X.XX USDC

### Center - Viral Reward Demo:
**Test Scenario:** A user watched a video, clicked share link, and signed up

**Buttons:**
- Trigger x402 Payout
- Reset Demo & Recover USDC

**Wallet Payouts:**
| Role | Amount | Address | Status |
|------|--------|---------|--------|
| Creator | $X.XX | 0x... | Link to Arc Explorer |
| Remixer | $X.XX | 0x... | Link to Arc Explorer |
| Sharer | $X.XX | 0x... | Link to Arc Explorer |

### Right Side - Treasury Flow:
- Treasury Balance display
- Circular flow visualization
- Arc Treasury wallet address

---

## Slide 9: The Network Vision

**Title:** The Network Vision

**Subtitle:** One wallet, all rewards. Cross-platform earnings unified by USDC.

### Platform Hub Diagram:
**Platforms:** Replit, Bolt, Cursor, ChatGPT → **Network (Rewards Hub)** → **Your Wallet (USDC → USD)**

### GTM Progression:

| Phase | Title | Description | Status |
|-------|-------|-------------|--------|
| Phase 1 | Platform Partners | Integrated into AI platforms | Current |
| Phase 2 | Individual Creators | Any vibecoder can publish | Next |
| Phase 3 | Major Publishers | Alternative organic channel | Future |
| Phase 4 | Agent-to-Agent | When robot money takes over | Future |

### Closing Message:

**Title:** Built for Arc Hackathon

VibeCard demonstrates the power of native USDC, embedded wallets, and atomic micropayments. This wasn't possible before Arc. Now it's inevitable.

**Tech Badges:**
- Arc Native USDC
- Circle Wallets
- x402 Protocol
