# Remix App — Live Demo Iframe Setup

This guide sets up the VibeCard live demo as a full-screen webview (iframe) in your remixed presentation app. The demo runs on the original deployed app — you don't need any Circle API keys, Arc wallets, or USDC. You just point an iframe at the live URL.

---

## Step 1 — Get the deployed demo URL

The standalone demo endpoint on the original app is:

```
https://VibeCardNet.replit.app/demo
```

Open that URL in a browser first to confirm it loads the live demo full-screen before wiring up the iframe.

---

## Step 2 — Create the iframe demo screen

Create a new file in your remix at `client/src/components/screens/LiveDemoScreen.tsx`:

```tsx
interface LiveDemoScreenProps {
  isActive: boolean;
}

export function LiveDemoScreen({ isActive }: LiveDemoScreenProps) {
  const DEMO_URL = "https://VibeCardNet.replit.app/demo";

  if (!isActive) {
    return <div className="h-screen w-screen bg-background" />;
  }

  return (
    <div className="w-full h-screen">
      <iframe
        src={DEMO_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="VibeCard Live Demo"
        allow="clipboard-write"
      />
    </div>
  );
}
```

Replace `<original-app-name>` with the actual Replit app subdomain.

---

## Step 3 — Register it in App.tsx

In your remix's `App.tsx`, swap out the old `DemoPlaygroundScreen` import for `LiveDemoScreen`:

```tsx
import { LiveDemoScreen } from "@/components/screens/LiveDemoScreen";
```

Then in the `<Presentation>` children, replace:

```tsx
<DemoPlaygroundScreen isActive={currentScreen === 7} />
```

with:

```tsx
<LiveDemoScreen isActive={currentScreen === 7} />
```

Remove the old `DemoPlaygroundScreen` import line entirely — you no longer need it in the remix.

---

## How it works

- When the user navigates to slide 7, `isActive` becomes `true` and the iframe loads
- When `isActive` is `false` (any other slide), a blank placeholder renders — this avoids the iframe loading in the background and consuming resources while the user is on other slides
- The demo runs entirely inside the original app's security context — all Circle API calls, Arc blockchain transactions, and secrets stay on the original server
- No CORS configuration needed — the iframe is a full page load, not a cross-origin API call

---

## Sizing notes

The iframe is `h-screen` (100vh) because it sits inside the presentation shell's `min-h-screen flex flex-col` wrapper. The demo renders with its own internal padding and layout — no additional wrapper padding needed on your side.

---

## What lives where

| Concern | Lives in |
|---------|----------|
| Circle API keys | Original app (secrets) |
| Arc wallets & USDC | Original app (Circle account) |
| Demo UI & logic | Original app (served at `/demo`) |
| Presentation slides 0–6, 8 | Your remix |
| Slide 7 shell | Your remix (`LiveDemoScreen`) |
| Blockchain transactions | Arc testnet via original app |

---

## Troubleshooting

**Iframe shows blank / refuses to connect**
- Confirm the original app is deployed and the `/demo` URL loads in a regular browser tab
- Check that the original app is not paused (Replit deployments stay live; dev mode sleeps)

**Demo loads but looks cut off**
- Make sure the `LiveDemoScreen` wrapper has no extra padding — the demo has its own internal padding
- Confirm the parent slide div allows `h-screen` to propagate (the default Presentation shell does)

**"Refused to display in a frame" browser error**
- This should not happen — the original app explicitly sets `X-Frame-Options: ALLOWALL`
- If it does appear, check that the deployed version includes that header (deploy after the header change was made)
