# Guideline — Producing a Code Walkthrough Video Shot List

Use this to generate a video shot list for any app that maps a **narration script** to **exact code locations**, so the recording is a smooth, queued-up scroll through the real code. This is the same method used to build VibeCard's `grant-video-shotlist.md`.

The end goal: a single `*-video-shotlist.md` in the project root that the presenter reads straight off while screen-recording.

---

## Step 1 — Start from the narration script

Get (or write) the narration script first. Break it into **beats** — one beat per claim the video makes ("here's where we use X", "this is our payment split", "no custom contracts", etc.). Each beat becomes one **Shot**.

If there's no script yet, list the 4–7 most important technical claims the video must prove, in the order they should appear.

---

## Step 2 — Find the real code for each beat (don't guess)

For every beat, locate the **actual file and line range** that proves it. Never invent line numbers — search the codebase:

```bash
# Find where an SDK / integration is called
rg -n "createWallet|createWalletSet|<sdk-method>" path/to/lib

# Find a specific protocol/config value (chain id, contract address, etc.)
rg -rn "5042002|0x3600|eip155" --glob '!node_modules' --glob '!dist'

# Find where a UI panel/feature is rendered
rg -rln "For Judges|Integration Details" client/src
```

Then open the file to confirm the exact range:

```bash
# or use your editor's read tool with offset/limit
sed -n '300,360p' path/to/file
```

Record the precise `Lxxx–Lyyy` range for each beat. Prefer a tight range (10–40 lines) that fits on one screen.

---

## Step 3 — Be honest about what the code does

A grant/judge audience values accuracy. Explicitly call out:
- What you actually built vs. what you reuse (e.g. "no custom smart contract — we call the existing token contract").
- Where logic lives (app/server orchestration vs. on-chain vs. third-party SDK).

Add a short **"Verified facts"** block at the top listing the true, checkable claims (network, contract addresses, "no custom contracts deployed", etc.). Confirm each against the code before writing it down.

---

## Step 4 — Build quick-access links

Get the GitHub remote so you can make clickable, line-anchored permalinks:

```bash
git --no-optional-locks remote -v
git --no-optional-locks branch --show-current
```

GitHub permalink format (lands on exact lines):
```
https://github.com/<owner>/<repo>/blob/<branch>/<path>#L<start>-L<end>
```

List one link per shot in an "open these tabs first" section, in recording order.

> Replit editor deep-links (`replit.com/@owner/slug#path`) are unreliable and can't target a line — skip them. Use GitHub permalinks, and note that the same line numbers apply if recording from the live editor (jump with Ctrl/Cmd+G).

---

## Step 5 — Assemble the shot list file

Use this structure for `<project>-video-shotlist.md`:

```markdown
# <Project> — Video Shot List

<one line: what the video covers + script time range>

**Verified facts (real, present in this codebase):**
- <network / chain / contract / "no custom contracts" — each checked against code>

---

## Quick-access links — open these tabs first
1. [<label> — `file` Lxx–Lyy](<github permalink>)
2. ...

---

## Shot 1 — <beat title>

> **Narration:** "<exact script line>"

**File: `path/to/file`**

| What to show | Lines | Narration anchor |
|---|---|---|
| <code element to highlight> | **Lxx–Lyy** | "<short on-screen note>" |

<one-sentence tip on what detail to point at>

---

## Shot 2 — ...
( repeat per beat )

---

## Suggested scroll order (one continuous take)
1. file Lxx–Lyy — <beat>
2. ...

---

## <Integration / credentials details for judges>
- <key facts, addresses, IDs — nothing secret>
```

---

## Rules of thumb

- **One beat = one shot = one tight line range.** If a beat needs three ranges, list them but keep them in one file.
- **Narration verbatim.** Paste the exact script line as a `> **Narration:**` quote so the presenter reads off the doc.
- **Recording order is a feature.** End with a numbered "one continuous take" scroll order so the screen-record flows without hunting.
- **Verify every number.** Chain IDs, contract addresses, and line ranges must match the code at record time. If the code changes, re-check the ranges.
- **Never put secrets in the doc.** API keys/entity secrets should be referred to as "configured", not pasted.
- **Keep it in the project root** so it's easy to find and lives next to the code it describes.
