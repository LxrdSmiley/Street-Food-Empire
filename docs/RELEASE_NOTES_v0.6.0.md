# Release Notes - v0.6.0: Juice/Fun Feedback Pass

## Summary
v0.6.0 improves the feel of the existing cooking/tycoon loop without adding new gameplay content. The pass focuses on lightweight Phaser primitive and tween feedback around serving, rewards, streaks, goals, upgrades, day summaries, and stall level-ups.

## What's New

### Serve Feedback Polish
- Correct serves now feel clearer with a brief customer success state before the customer leaves.
- Successful serves now show stronger, stacked reward feedback without blocking the grill slots or customer order bubble.
- The HUD pulses key values after successful service.

### Coin / XP Feedback Polish
- Base coins, tips, and XP now appear as distinct floating feedback.
- Goal bonus coins and XP are shown separately at day end.
- Coin and progression HUD text pulse when rewards are applied.

### Streak Feedback
- Fast correct serves now show readable celebration callouts.
- Streak milestones show clearer messages such as `Streak x2` and `Hot Hands!`.
- Existing `StreakSystem` remains the source of truth; no new combo system was added.

### Goal Completion Feedback
- Session goal completions now show lightweight `Goal Complete!` and `Bonus Ready` feedback during active play.
- If the goals panel is open, it updates and pulses without interrupting cooking or serving.
- Goal rewards still award exactly once at day end through the existing systems.

### Upgrade Purchase Feedback
- Purchased upgrade rows flash briefly.
- Upgrade purchase feedback shows the upgrade name, level, and simple effect summary.
- Existing upgrade recommendation labels are preserved.

### Day Summary Polish
- Day summary now emphasizes shift quality, total earned, goal bonus breakdown, grade, current stall stage, and Next Target.
- Summary polish is display-only and does not duplicate or change rewards.

### Level-Up Feedback
- Stall level-up keeps the existing flash/text celebration and adds a very small camera shake.

## Save Compatibility
- No save schema change.
- Existing v0.5.0 saves load safely.
- No active feedback state is persisted.

## Scope Safety
- No new foods, customers, staff, daily rewards, backend, cloud saves, ads, IAP, multiplayer, public UGC, chat, new locations, or monetization.
- No external image/audio assets.
- No new dependencies.

## Known Limitations
- Feedback uses placeholder-safe primitive shapes and text; final art/audio polish is still future work.
- Effects are intentionally small to protect mobile readability and low-end performance.
- Browser-based LocalStorage security remains client-side casual anti-tamper only.
