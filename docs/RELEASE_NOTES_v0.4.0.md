# Release Notes — v0.4.0: Session Goals + Retention Loop

## Summary
v0.4.0 adds a lightweight session-goal system to give each day a clearer purpose and motivate short play sessions.

## New Features

### Session Goals
- Each day generates 3 randomly-selected goals from a pool of 6 goal types.
- Goal types: serve correct orders, earn coins, reach a streak, end with high satisfaction, avoid wrong orders, serve two-item orders.
- Goals are tuned to be achievable within a single 6-customer day.
- Higher stall levels introduce harder targets and additional goal types.

### Goals Panel
- New "Goals" button in the HUD bottom action row.
- Opens a compact overlay showing today's goals with progress indicators, checkmarks, and reward amounts.
- Can be toggled on/off at any time during a day.
- Goals panel auto-opens briefly (~2s) at day start for orientation, then auto-closes.

### Goal Rewards
- Completed goals award bonus coins and XP at day end.
- Rewards are claimed exactly once per completed day.
- Save is written immediately after reward claim to prevent reload exploitation.
- Bonus coins go through EconomySystem; bonus XP goes through ProgressionSystem.

### Next Target Display
- Day summary now shows a motivational "Next Target" string.
- Based on the player's current state: next affordable upgrade, next stall stage, or a play challenge.

## Technical Details
- `SessionGoalSystem` is the source of truth for goal state. It does not mutate coins or XP directly.
- `MainScene` coordinates events between systems (correct serve, wrong order, coins earned, streak change).
- Offline rewards, welcome-back rewards, and burnt food cleanup do NOT count toward session goals.
- Wrong order is only triggered by actually serving the wrong food, not by clearing burnt food.

## Placeholder-Safe
- No external assets, images, fonts, or libraries added.
- All visuals use existing Phaser primitives and text.

## Save Compatibility
- v0.3.0 saves load normally. Session goals are ephemeral (generated fresh each day, not persisted in save).

## Retention-Loop Improvement
- Generates motivation at day end with a targeted milestone string ("Next Target") that suggests next progression steps (e.g. buying a specific upgrade, reaching a level).
- Gives immediate feedback at day start via the auto-preview, establishing a clear shift-objective.

## No Ads / IAP / Backend
- Stays true to scope: no ads, no in-app purchases, and no server-side connections. All calculations and save data remain strictly local.

## Known Limitations
- Session goals do not persist across hard reloads mid-day. Hard-reloading in the middle of a day resets that day's goals and progress. This is intended to keep the save schema clean and avoid unnecessary state synchronization.

