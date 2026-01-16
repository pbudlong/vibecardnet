# VibeCard – Arc Hackathon Build Plan

**Last Updated:** January 16, 2026  
**Deadline:** January 23, 2026 (7 days remaining)  
**Tracks:** Best Vibecoded Application + Best Product Design

---

## 1. Project Overview

VibeCard implements a viral rewards system where **publishers** fund incentives and **content participants** (creators, sharers, remixers) earn USDC that accumulates on spendable virtual cards.

The core insight builds on Andrew Chen's viral loop mechanics: content flows through create → share → remix cycles. VibeCard adds financial incentives that reward early participants in viral chains, creating a "get in early" dynamic that amplifies sharing behavior.

**Demo Scope:**
- **Active demo (Circle Builder):** User wallet, viral actions, real USDC payments on Arc
- **Publisher demo (Replit):** Content platform with VibeCard tracking snippet integration
- **Mocked in presentation:** Publisher onboarding/commitment, virtual card issuance

---

## 2. Reward Structure: Viral Factor Model

### 2.1 Publisher Side (Demand)

Publishers fund rewards based on customer acquisition economics, not per-action costs:

```
┌─────────────────────────────────────────────────────────────┐
│                 PUBLISHER ECONOMICS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LTV = Lifetime Value of a customer         (e.g., $100)    │
│  CAC% = % of LTV willing to pay for acq.    (e.g., 20%)     │
│  Target CAC = LTV × CAC%                    (e.g., $20)     │
│                                                              │
│  N = Target new customers                   (e.g., 1,000)   │
│  Total Budget = N × Target CAC              (e.g., $20,000) │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 VibeCard Guidance Engine

VibeCard provides publishers with recommended parameters based on:
- **Network performance data:** Historical conversion rates by category
- **Publisher's category:** Some content types convert better than others
- **Publisher's tenure:** New publishers get conservative estimates; proven performers get optimized rates

```
┌─────────────────────────────────────────────────────────────┐
│              VIBECARD GUIDANCE FORMULA                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Inputs from Publisher:                                      │
│    Target CAC = $20                                          │
│                                                              │
│  VibeCard Network Intelligence:                              │
│    Expected actions per new customer = 5                     │
│    (Based on category benchmarks + publisher history)        │
│                                                              │
│  Calculated Parameters:                                      │
│    Reward per action = Target CAC / Actions per cust.        │
│                      = $20 / 5 = $4.00                       │
│                                                              │
│    VibeCard fee = 15% on top of reward budget                │
│    Total cost per action = $4.00 + 15% = $4.60              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Publisher commits to:**
1. Total reward budget cap (e.g., $20,000) + 15% fee to VibeCard
2. Target CAC (e.g., $20)
3. Integrating VibeCard tracking snippet into their platform

**VibeCard provides:**
1. Recommended actions-per-customer estimate based on their category
2. Automatic reward distribution at calculated rates
3. Real-time conversion tracking and optimization

### 2.3 Money Flow Per Action

For every viral action (share or remix):

```
┌─────────────────────────────────────────────────────────────┐
│              MONEY FLOW PER ACTION                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Publisher pays: $4.60 total                                 │
│       │                                                      │
│       ├──► VibeCard Fee: $0.60 (15% on top)                 │
│       │                                                      │
│       └──► Reward Pool: $4.00 (100% to participants)        │
│                 │                                            │
│                 ├──► Creator: 40% = $1.60                   │
│                 │    (Always gets 40% of every action)       │
│                 │                                            │
│                 ├──► Upstream Chain: 40% = $1.60            │
│                 │    (Split with decay among all upstream)   │
│                 │    (If no upstream, goes to Creator)       │
│                 │                                            │
│                 └──► Current Actor: 20% = $0.80             │
│                      (Person performing this action)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Card Owner Side: The Early Bird Model

The key incentive: **early participants in a viral chain earn more than later participants**. Original creator, first sharer, and first remixer always get a cut of everything downstream.

#### Decay Formula for Upstream Chain

The 40% upstream allocation ($1.60) is distributed using geometric decay:

```
For participant at depth d (where d=1 is closest to current action):

Share(d) = Base × (0.5)^(d - 1)

Where Base is normalized so all shares sum to 100% of upstream pool
```

#### Worked Example: 3 Viral Actions

**Scenario:** Creator publishes → Alice shares → Bob remixes → Carol shares

```
Action 1: Alice shares Creator's content
├── VibeCard:  $0.60 (15% fee on top)
├── Creator:   $1.60 (40%) + $1.60 (40% upstream, no one else) = $3.20
├── Alice:     $0.80 (20%)
└── Total:     $4.60

Action 2: Bob remixes from Alice's share
├── VibeCard:  $0.60 (15% fee on top)
├── Creator:   $1.60 (40%)
├── Alice:     $1.60 (40% upstream, all to her)
├── Bob:       $0.80 (20%)
└── Total:     $4.60

Action 3: Carol shares Bob's remix
├── VibeCard:  $0.60 (15% fee on top)
├── Creator:   $1.60 (40%)
├── Upstream:  $1.60 (40%) split with decay:
│   ├── Bob (depth 1):   $1.07 (66.7% of upstream)
│   └── Alice (depth 2): $0.53 (33.3% of upstream)
├── Carol:     $0.80 (20%)
└── Total:     $4.60
```

#### Cumulative Earnings After 3 Actions ($13.80 Total Publisher Spend)

| Participant | Role | Action 1 | Action 2 | Action 3 | Total |
|-------------|------|----------|----------|----------|-------|
| VibeCard    | Platform fee | $0.60 | $0.60 | $0.60 | **$1.80** |
| Creator     | Original publisher | $3.20 | $1.60 | $1.60 | **$6.40** |
| Alice       | First sharer | $0.80 | $1.60 | $0.53 | **$2.93** |
| Bob         | First remixer | — | $0.80 | $1.07 | **$1.87** |
| Carol       | Second sharer | — | — | $0.80 | **$0.80** |
| **Total**   | | $4.60 | $4.60 | $4.60 | **$13.80** |

### 2.5 Customer Acquisition Economics

Now let's connect this back to what the publisher actually cares about:

```
┌─────────────────────────────────────────────────────────────┐
│              PUBLISHER OUTCOME TRACKING                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Scenario A: VibeCard guidance was accurate                  │
│  ─────────────────────────────────────────                   │
│  Expected: 5 actions per new customer                        │
│  Actual: 5 actions, 1 new customer acquired                  │
│  Publisher spent: 5 × $4.60 = $23.00                        │
│  Actual CAC: $23.00 (hit target + 15% VibeCard fee)         │
│                                                              │
│  Scenario B: Content performed better than expected          │
│  ─────────────────────────────────────────                   │
│  Expected: 5 actions per new customer                        │
│  Actual: 3 actions, 1 new customer acquired                  │
│  Publisher spent: 3 × $4.60 = $13.80                        │
│  Actual CAC: $13.80 ✓ (beat target!)                        │
│                                                              │
│  Scenario C: Content underperformed                          │
│  ─────────────────────────────────────────                   │
│  Expected: 5 actions per new customer                        │
│  Actual: 8 actions, 1 new customer acquired                  │
│  Publisher spent: 8 × $4.60 = $36.80                        │
│  Actual CAC: $36.80 ✗ (missed target)                       │
│  → VibeCard adjusts guidance for next campaign               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key insight for our demo:** We show 3 actions resulting in $13.80 total spend ($12 rewards + $1.80 VibeCard fee). If this resulted in 1 new customer acquisition, the publisher achieved a $13.80 CAC vs. their $23 target — a win enabled by VibeCard's viral mechanics.

### 2.6 The K-Factor: How Rewards Accelerate Virality

Andrew Chen's viral factor formula:

```
K = i × c

Where:
  i = invitations sent per user
  c = conversion rate per invitation
  
If K > 1, content grows exponentially
If K < 1, content dies out
```

**How VibeCard amplifies K:**

```
┌─────────────────────────────────────────────────────────────┐
│              WITHOUT VIBECARD (Baseline)                     │
├─────────────────────────────────────────────────────────────┤
│  User shares content because:                                │
│  • They like it                                              │
│  • Social signaling                                          │
│                                                              │
│  Typical K ≈ 0.3 - 0.7 (most content dies)                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              WITH VIBECARD (Incentivized)                    │
├─────────────────────────────────────────────────────────────┤
│  User shares content because:                                │
│  • They like it                                              │
│  • Social signaling                                          │
│  • IMMEDIATE REWARD ($0.80 USDC)               +i boost     │
│  • POTENTIAL WINDFALL if it goes viral         +i boost     │
│  • "Get in early" psychology                   +c boost     │
│                                                              │
│  Boosted K ≈ 0.8 - 1.5+ (content can go viral)              │
└─────────────────────────────────────────────────────────────┘
```

**The mechanics of K amplification:**

| Factor | Without VibeCard | With VibeCard | Why |
|--------|------------------|---------------|-----|
| Invitations (i) | Low (share if love it) | Higher (share = earn) | Immediate + potential rewards |
| Conversion (c) | Low (ignore most shares) | Higher (FOMO on early) | "Get in early" windfall psychology |
| **K-Factor** | ~0.5 | ~1.2 | Crosses the viral threshold |

**Path to 1,000 downstream actions:**

```
Without VibeCard (K = 0.5):
  Action 1 → 0.5 new actions → 0.25 → 0.125 → dies at ~2 total

With VibeCard (K = 1.2):
  Action 1 → 1.2 → 1.44 → 1.73 → 2.07 → ...
  After 10 rounds: ~6 actions per round
  After 20 rounds: ~38 actions per round
  After 30 rounds: ~237 actions per round
  Total actions: 1,000+ reached around round 25-30
```

**The windfall effect reinforces sharing:**

```
┌─────────────────────────────────────────────────────────────┐
│  If Alice gets in at Action 1 and content reaches 1,000:    │
│                                                              │
│  Alice's earnings = $0.80 (her action)                       │
│                   + upstream share from subsequent actions   │
│                                                              │
│  Rough calculation (assuming average 3-deep chains):        │
│  Alice appears in upstream of ~300 actions at various       │
│  decay levels → earnings ≈ $200-400 USDC                    │
│                                                              │
│  Creator earnings = (40% × $4.00) × 1,000 actions           │
│                   = $1,600 USDC                              │
└─────────────────────────────────────────────────────────────┘
```

This "lottery ticket" psychology is the key K-factor booster: users share not just for $0.80, but for the chance at a $300+ USDC windfall.

### 2.7 Platform Economics Summary

```
┌─────────────────────────────────────────────────────────────┐
│                   MONEY FLOW                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Publisher                                                   │
│      │                                                       │
│      ▼ Pays $4.60 per action                                │
│  ┌────────────┐                                              │
│  │  VibeCard  │                                              │
│  │  Treasury  │ ◄─── Takes 15% fee = $0.60 per action       │
│  └────────────┘                                              │
│      │                                                       │
│      ▼ Distributes $4.00 reward pool per action             │
│  ┌────────────────────────────────────────┐                 │
│  │  Creator  │  Upstream │  Actor         │                 │
│  │   40%     │   40%     │   20%          │                 │
│  │  $1.60    │  (decay)  │  $0.80         │                 │
│  └────────────────────────────────────────┘                 │
│      │                                                       │
│      ▼ USDC accumulates in Circle Wallets                    │
│  ┌────────────┐                                              │
│  │  Virtual   │ (mocked for demo)                           │
│  │   Card     │ USDC → USD conversion (fees apply)          │
│  └────────────┘                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**VibeCard's value proposition to publishers:**
- "Pay only for actual viral engagement, not impressions"
- "Our guidance engine optimizes your CAC based on real network data"
- "Better conversion rates than traditional paid acquisition"

**VibeCard's value proposition to users:**
- "Get paid for the content you already share"
- "Early bird advantage: get in early on viral content for bigger rewards"
- "One wallet, earnings from every integrated platform"

---

## 3. Architecture

### 3.1 Component Responsibilities

| Component | What It Does | What It Demonstrates |
|-----------|--------------|---------------------|
| **Arc + USDC** | Settlement layer, real micropayments | Required tech |
| **Circle Builder** | User-facing app: wallet display, balance updates, viral action triggers, x402 payments | "Best Vibecoded Application" track |
| **Replit** | Hackathon presentation/demo guide, publisher content sharing platform, VibeCard tracking snippet + reward calculation API | Publisher integration + viral content demo |

### 3.2 Why We Need Replit

Replit serves three purposes:

1. **Hackathon presentation framework** — Houses the demo guide and presentation flow
2. **Publisher integration demo** — Shows the VibeCard tracking snippet that publishers embed to capture share/remix events
3. **Viral content demo** — The actual content platform where users publish, share, and remix (demonstrating what gets tracked)

This positions Replit as "what a publisher builds" rather than "our hidden backend."

### 3.3 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEMO FLOW                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PUBLISHER PLATFORM (Replit)                  │   │
│  │                                                           │   │
│  │  • Simple content site (blog posts, images, etc.)         │   │
│  │  • VibeCard tracking snippet embedded                     │   │
│  │  • Tracks: publish, share, remix events                   │   │
│  │  • Reward calculation engine                              │   │
│  │  • Calls Circle Builder / x402 to trigger payments        │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ Events + payment triggers         │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              VIBECARD APP (Circle Builder)                │   │
│  │                                                           │   │
│  │  • User wallet display (Circle Wallets)                   │   │
│  │  • Real-time USDC balance updates                         │   │
│  │  • Transaction history / event log                        │   │
│  │  • x402 payment execution                                 │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ARC (Layer 1)                          │   │
│  │              USDC Settlement + Native Gas                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MOCKED IN PRESENTATION                        │
│                                                                  │
│  • Publisher onboarding (setting LTV, CAC, budget)              │
│  • Publisher snippet installation flow                           │
│  • Virtual card issuance (USDC → USD, fees noted)               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Data Flow for a Viral Action

```
1. User clicks "Share" on Publisher Platform (Replit)
                    │
                    ▼
2. Tracking snippet fires event to Replit backend app
   Event: { content_id, actor_id, action_type, referrer_chain }
                    │
                    ▼
3. Replit backend app calculates rewards using decay formula
   Result: { creator: $1.60, alice: $0.53, bob: $1.07, carol: $0.80 }
                    │
                    ▼
4. Replit backend app triggers x402 payments via Circle Builder
   Multiple micropayments to each participant's Circle Wallet
   (VibeCard fee of $0.60 collected separately)
                    │
                    ▼
5. Circle Builder updates UI with new USDC balances
   User sees: "You earned 0.80 USDC from sharing!"
```

---

## 4. Technology Stack

| Component | Role | Why |
|-----------|------|-----|
| **Circle AI App Builder** | User-facing wallet app, balance display, x402 payment execution | Required for "Vibecoded" track |
| **Circle Wallets** | User wallet creation and management | Recommended by hackathon |
| **x402** | Micropayment protocol for reward distribution | Recommended by hackathon |
| **Replit** | Publisher demo platform + reward calculation backend | You're familiar with it; demonstrates publisher integration |
| **Arc (L1)** | Settlement layer | Required by hackathon |
| **USDC** | Payment currency (users earn USDC, not USD) | Required by hackathon |

---

## 5. Demo Script

### Scene 1: Publisher Platform (Replit)
*"Here's a content platform that's integrated VibeCard's tracking snippet..."*

- Show simple blog/content site
- Point out embedded snippet code
- Show publisher dashboard with budget/metrics (can be static)

### Scene 2: Creator Publishes (Replit → Circle Builder)
*"When a creator publishes content, they see an option to opt into the reward program..."*

- Creator publishes a post and opts in
- Circle Builder shows creator's wallet with 0 USDC balance

### Scene 3: First Share (Live Demo)
*"Now Alice shares this content to her network..."*

- Alice clicks Share on Replit
- Circle Builder shows:
  - Creator: +3.20 USDC (40% + 40% upstream with no chain)
  - Alice: +0.80 USDC (20%)
- Real USDC on Arc testnet
- (VibeCard collects $0.60 fee in background)

### Scene 4: Remix and Cascade (Live Demo)
*"Bob remixes Alice's share, creating derivative content..."*

- Bob clicks Remix
- Payment cascade:
  - Creator: +1.60 USDC (now 4.80 total)
  - Alice: +1.60 USDC (now 2.40 total)
  - Bob: +0.80 USDC

### Scene 5: Second Share (Live Demo)
*"Carol shares Bob's remix..."*

- Carol clicks Share
- Payment cascade with decay:
  - Creator: +1.60 USDC (now 6.40 total)
  - Bob: +1.07 USDC (now 1.87 total)
  - Alice: +0.53 USDC (now 2.93 total)
  - Carol: +0.80 USDC

### Scene 6: Viral Projection (Presentation)
*"Now imagine this goes viral with 1,000 downstream actions..."*

- Show K-factor math (how rewards boost K from 0.5 to 1.2+)
- Show path to 1,000 actions
- VibeCard revenue: $600 USDC (1,000 × $0.60)
- Creator windfall: ~$1,600 USDC
- First sharer windfall: ~$200-400 USDC
- "Get in early" narrative
- Note: If this resulted in 200 new customers (5 actions per customer), publisher spent $4,600 in rewards+fees for $23 CAC — right on target

### Scene 7: VibeCard as Network Hub (Presentation)
*"VibeCard sits at the center, connecting publishers and users across the web..."*

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│      ┌─────────┐     ┌─────────┐     ┌─────────┐               │
│      │ Blog A  │     │ News B  │     │ Social C│               │
│      │(snippet)│     │(snippet)│     │(snippet)│               │
│      └────┬────┘     └────┬────┘     └────┬────┘               │
│           │               │               │                     │
│           └───────────────┼───────────────┘                     │
│                           │                                     │
│                           ▼                                     │
│                    ┌─────────────┐                              │
│                    │             │                              │
│                    │  VIBECARD   │                              │
│                    │   NETWORK   │                              │
│                    │             │                              │
│                    │  15% fee    │                              │
│                    │  1.80 USDC  │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│           ┌───────────────┼───────────────┐                     │
│           │               │               │                     │
│           ▼               ▼               ▼                     │
│      ┌─────────┐     ┌─────────┐     ┌─────────┐               │
│      │  User   │     │  User   │     │  User   │               │
│      │  Alice  │     │   Bob   │     │  Carol  │               │
│      │ Wallet  │     │ Wallet  │     │ Wallet  │               │
│      │2.93 USDC│     │1.87 USDC│     │0.80 USDC│               │
│      └─────────┘     └─────────┘     └─────────┘               │
│                                                                  │
│  "One wallet. Rewards from every integrated platform."          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

- Multiple publishers can integrate
- Users earn USDC across all platforms into single wallet
- VibeCard earns 15% fee on top of all rewards
- Network effects: more publishers = more earning opportunities = more users = more attractive for publishers

### Scene 8: Virtual Card (Mocked Presentation)
*"Users can convert their USDC to a virtual card for spending..."*

- Show mockup of card issuance flow
- Note: USDC → USD conversion fees apply
- "Coming in production with card issuance partner"

---

## 6. Build Schedule (7 Days)

### Day 1 (Jan 16): Foundation

| Task | Environment | Goal |
|------|-------------|------|
| Set up Circle Builder project | Circle Builder | Basic app scaffold |
| Set up Replit publisher demo | Replit | Basic content site |
| Get Arc testnet USDC | Faucet | Funds for testing |
| Implement Circle Wallets | Circle Builder | User wallet creation |

**Milestone:** User can create wallet and see USDC balance in Circle Builder

### Day 2 (Jan 17): Tracking + Rewards

| Task | Environment | Goal |
|------|-------------|------|
| Build tracking snippet | Replit | Capture publish/share/remix events |
| Implement reward calculation engine | Replit | Decay formula working |
| Connect Replit → Circle Builder | Both | Events trigger UI updates |

**Milestone:** Viral action on Replit shows calculated rewards in Circle Builder (no payments yet)

### Day 3 (Jan 18): x402 Payments

| Task | Environment | Goal |
|------|-------------|------|
| Implement x402 payment flow | Circle Builder | Payments execute on Arc |
| Multi-recipient payment splits | Both | Creator + chain all get paid |
| Test full payment cascade | Both | 3-level chain works |

**Milestone:** Real USDC payments on Arc testnet for viral actions

### Day 4 (Jan 19): Polish + Edge Cases

| Task | Environment | Goal |
|------|-------------|------|
| Build transaction history UI | Circle Builder | Users see earning history |
| Publisher dashboard (static) | Replit | Budget/metrics display |
| Edge case handling | Both | Graceful failures |

**Milestone:** Full flow polished and reliable

### Day 5 (Jan 20): Demo Flow

| Task | Environment | Goal |
|------|-------------|------|
| Refine demo script | Both | Smooth 3-minute walkthrough |
| UI polish | Circle Builder | Clean, professional look |
| Test with fresh wallets | Both | Demo works from scratch |

**Milestone:** Demo runs smoothly end-to-end

### Day 6 (Jan 21): Presentation

| Task | Environment | Goal |
|------|-------------|------|
| Build presentation slides | — | Publisher onboarding mockup, K-factor math |
| Create network hub diagram | — | Scene 7 visualization |
| Create virtual card mockups | — | USDC → USD flow |
| Record demo video | — | Backup for submission |

**Milestone:** Complete presentation package

### Day 7 (Jan 22-23): Submit

| Task | Goal |
|------|------|
| Write project description | Clear use case, viral mechanics |
| Final testing | Everything works |
| **Submit by EOD Jan 23** | lablab.ai |

---

## 7. Tracking Snippet Specification

The snippet publishers embed:

```javascript
// vibecard-snippet.js
(function() {
  const VIBECARD_API = 'https://your-replit-app.replit.app/api';
  
  window.VibeCard = {
    // Called when content is published
    publish: async function(contentId, creatorId) {
      await fetch(`${VIBECARD_API}/events`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'publish',
          content_id: contentId,
          actor_id: creatorId,
          timestamp: Date.now()
        })
      });
    },
    
    // Called when content is shared
    share: async function(contentId, sharerId, referrerId) {
      await fetch(`${VIBECARD_API}/events`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'share',
          content_id: contentId,
          actor_id: sharerId,
          referrer_id: referrerId,
          timestamp: Date.now()
        })
      });
    },
    
    // Called when content is remixed
    remix: async function(originalContentId, newContentId, remixerId, referrerId) {
      await fetch(`${VIBECARD_API}/events`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'remix',
          original_content_id: originalContentId,
          new_content_id: newContentId,
          actor_id: remixerId,
          referrer_id: referrerId,
          timestamp: Date.now()
        })
      });
    }
  };
})();
```

---

## 8. Reward Calculation Engine (Replit)

```javascript
// reward-calculator.js

const REWARD_POOL = 4.00;        // USDC per action (100% to participants)
const VIBECARD_FEE_RATE = 0.15;  // 15% fee on top
const VIBECARD_FEE = REWARD_POOL * VIBECARD_FEE_RATE;  // $0.60

const CREATOR_SHARE = 0.40;  // 40% of reward pool = $1.60
const UPSTREAM_SHARE = 0.40; // 40% of reward pool = $1.60
const ACTOR_SHARE = 0.20;    // 20% of reward pool = $0.80
const DECAY_FACTOR = 0.5;

function calculateRewards(event, referrerChain, creatorId) {
  const rewards = {
    vibecard_fee: VIBECARD_FEE  // $0.60 (collected separately)
  };
  
  // Creator always gets 40% of reward pool
  rewards[creatorId] = REWARD_POOL * CREATOR_SHARE;  // $1.60
  
  // Actor gets 20% of reward pool
  rewards[event.actor_id] = (rewards[event.actor_id] || 0) + 
                            REWARD_POOL * ACTOR_SHARE;  // $0.80
  
  // Upstream chain gets 40% of reward pool with decay
  if (referrerChain.length > 0) {
    const upstreamPool = REWARD_POOL * UPSTREAM_SHARE;  // $1.60
    const shares = calculateDecayShares(referrerChain.length);
    
    referrerChain.forEach((referrerId, index) => {
      const depth = index + 1;
      rewards[referrerId] = (rewards[referrerId] || 0) + 
                           upstreamPool * shares[depth];
    });
  } else {
    // No upstream chain: 40% goes to creator
    rewards[creatorId] += REWARD_POOL * UPSTREAM_SHARE;  // +$1.60
  }
  
  return rewards;
}

function calculateDecayShares(chainLength) {
  // Geometric decay: each level gets half of previous
  const raw = [];
  for (let d = 1; d <= chainLength; d++) {
    raw[d] = Math.pow(DECAY_FACTOR, d - 1);
  }
  
  // Normalize to sum to 1
  const sum = raw.reduce((a, b) => a + (b || 0), 0);
  const shares = {};
  for (let d = 1; d <= chainLength; d++) {
    shares[d] = raw[d] / sum;
  }
  
  return shares;
}
```

---

## 9. Judging Criteria Alignment

### 🧱 Best Vibecoded Application

| Criteria | How We Address |
|----------|----------------|
| Uses AI App Builder | VibeCard user app built entirely in Circle Builder |
| Demonstrates agentic commerce | Autonomous multi-party micropayments |
| Working demo | Full viral cascade with real USDC on Arc |

### 🎨 Best Product Design

| Criteria | How We Address |
|----------|----------------|
| Seamless transactions | One-click actions, instant USDC balance updates |
| Intuitive user flows | Clear earning notifications, transaction history |
| Beautiful design | Clean UI, real-time feedback |

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Circle Builder limitations | Replit handles reward calculation; Circle Builder focuses on wallet UI |
| x402 integration issues | Start Day 3; Thirdweb docs as reference |
| Time crunch | Cut publisher dashboard polish first; core demo is priority |

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Full viral cascade demo works | ✓ |
| Real USDC payments on Arc | ✓ |
| Multi-party splits accurate | ✓ |
| Math adds up correctly | ✓ |
| Demo video < 3 minutes | ✓ |
| Submitted by Jan 23 | ✓ |

---

## 12. Production Roadmap (For Pitch)

Features to highlight as "coming next":

1. **Virtual card issuance** — Partner integration for USDC → USD spending (conversion fees apply)
2. **Publisher self-service** — Onboarding portal for setting LTV/CAC/budget
3. **Advanced analytics** — K-factor tracking, viral tree visualization
4. **Multi-publisher support** — Single wallet, rewards from multiple platforms
5. **Governance** — Community voting on reward parameters

---

*Plan v6 created: January 16, 2026*
