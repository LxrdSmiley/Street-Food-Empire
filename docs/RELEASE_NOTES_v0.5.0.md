# Release Notes — v0.5.0: First-Time Player Onboarding + Early Balance Pass

## Summary
v0.5.0 introduces an interactive onboarding tutorial for first-time players, adds visual recommendations for upgrades, and balances early-game pacing to ensure a smooth, rewarding, and fair initial session.

## New Features

### First-Time Tutorial Onboarding
- **Guided Gameplay Steps:** A short callout sequence that automatically progresses when the player completes the required action (Welcome → Start Day → Read Order → Cook Jerk Chicken → Wait for Ready → Select Ready Food → Serve Customer → Open Goals → Play Shift → Upgrades panel callout).
- **Interactive UI Overlay:** Custom overlays drawn using primitive shapes. Includes directional pointers, "Skip Tutorial" buttons, and contextual "Next" buttons.
- **Goals Panel Coordination:** Prevents goals auto-panel overlays from conflicting with active tutorial steps. Automatically delays goals auto-preview if the tutorial is running.
- **Skippable:** Players can skip the tutorial at any time to enter normal gameplay instantly.

### Upgrade Panel Recommendations
- High-priority, early-game upgrades (e.g. Hotter Grill) are dynamically highlighted in the upgrades panel with a yellow `(Recommended)` visual indicator.
- Automatically adjusts based on player progress and affordability, guiding new players toward optimal investments.

### Early Game Balance Pass
- **Understandable Progression:** Increased Level 1 XP requirement to `45` (exactly 3 clean customer serves).
- **Lower Upgrades Cost:** Decreased Hotter Grill first upgrade cost from `30` to `25` coins, ensuring it is achievable on Day 1.
- **More Forgiving Pacing:** Increased `local_regular` patience from 12s to 14s to prevent early frustration and penalties.

## Technical Details & Save Compatibility
- **Backward Compatible:** Old v0.4.0 saves load normally. The `tutorialCompleted` setting is added to `GameSettings` and automatically defaults to `false` for old saves without triggering anti-tamper resets.
- **Safe Persistence:** Tutorial skips and completions write directly to the game settings and save immediately to LocalStorage.
- **No External Assets:** 100% placeholder-safe and built with Phaser primitive graphics and standard text styles.
- **No Ads / IAP / Backend / Staff:** Built entirely locally to stay within production scope limits.

## Known Limitations
- Mid-shift reloads: Reloading the page in the middle of the first shift resets active tutorial state to the beginning of the day (Welcome), but does not break progression or saves.
