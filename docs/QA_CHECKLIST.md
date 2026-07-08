# Street Food Empire: Kingston Rush QA Checklist - v0.2.1

Use this checklist before sharing a demo build to verify all core systems, mobile layouts, and save migrations function as expected.

## 1. Fresh Start & Initialization
- [ ] Clear or reset the local save from title screen or DevTools.
- [ ] Load the game and confirm the title scene appears in default state.
- [ ] Press `Start / Continue` and confirm `MainScene` opens.
- [ ] Confirm a default save is created in LocalStorage with 0 coins and level 1 stall.
- [ ] Confirm game state starts in "idle" mode (HUD shows "Tap Start Day when ready", grill slots say "Empty", no customer has spawned yet).

## 2. Day / Session Loop
- [ ] Tap the `Start Day` button.
- [ ] Confirm the HUD text changes to show day progress: `Customers 0/6`.
- [ ] Confirm satisfaction starts at `100%`.
- [ ] Confirm streak starts at `0`.
- [ ] Confirm the first customer immediately spawns.
- [ ] Confirm that after 6 customer outcomes (either served or missed), the day ends automatically.
- [ ] Confirm the `DaySummaryPanel` appears overlaying the screen.
- [ ] Verify the summary displays: Served count, Missed count, Coins earned, Tips earned, Satisfaction %, and Best Streak.
- [ ] Confirm that the day grade rating shows correctly:
  - `Great Day` if satisfaction is >= 85%
  - `Good Day` if satisfaction is >= 65% and < 85%
  - `Rough Day` if satisfaction is < 65%
- [ ] Tap the `Continue` button on the summary panel and confirm it closes, resetting the game state back to the idle start phase.

## 3. Cooking Station Slots
- [ ] Verify the grill displays **two independent cooking slots**.
- [ ] Tap an empty slot while a customer is waiting.
- [ ] Confirm the slot transitions to the **Cooking** state, showing the name of the needed item and a loading progress bar.
- [ ] Wait for prep time to complete. Confirm the slot transitions to the **Ready** state (highlights in green).
- [ ] Let a ready slot sit without selection. Confirm it transitions to the **Burnt** state (highlights in red) after its ready window timer expires.
- [ ] Tap a burnt slot. Confirm it immediately clears back to the **Empty** state.
- [ ] Confirm that letting food burn reduces satisfaction (shown in HUD) and resets the active streak.

## 4. Customer Orders & Spawning
- [ ] Confirm customers spawn with a clear bubble containing **1–2 food items**.
- [ ] Verify early orders at stall level 1 are mostly 1 item.
- [ ] Confirm the customer shows a visible patience bar that drains over time.
- [ ] Let patience run out. Confirm the customer leaves, satisfaction drops, and the streak resets to 0.

## 5. Serving Mechanics
- [ ] Tap a ready slot. Confirm it toggles to **Selected** (base borders highlight in green).
- [ ] With correct items selected, tap the customer.
- [ ] Confirm the customer is served, items are consumed, and the customer leaves happily.
- [ ] Confirm a correct serve increases the streak and satisfaction.
- [ ] Select wrong items (or incomplete items) and tap the customer.
- [ ] Confirm a wrong serve clears the selected items, forces the customer to leave, reduces satisfaction, and resets the streak.

## 6. Economy & Tip Calculations
- [ ] Serve a correct order. Confirm base coin rewards and tips route through `EconomySystem`.
- [ ] Confirm fast serves (remaining patience >= 55%) grant tips.
- [ ] Confirm consecutive correct serves build a streak, and higher streaks apply a tip multiplier in the HUD.
- [ ] Confirm wrong serves yield 0 coins.

## 7. Upgrade Panel
- [ ] Earn enough coins to buy a locked/affordable upgrade.
- [ ] Confirm the upgrade panel highlights affordable items.
- [ ] Purchase an upgrade. Confirm coins decrease, upgrade level increases, and the stat modifier applies (e.g. grill speed reduces prep time).
- [ ] Confirm locked upgrades or max-level upgrades cannot be purchased.

## 8. Save, Load, & Migration
- [ ] Earn some coins and buy an upgrade, then refresh the browser.
- [ ] Select `Start / Continue` on the title scene.
- [ ] Confirm coins, upgrades, stall level, and settings persist correctly.
- [ ] Start a day, cook some items, then refresh mid-day.
- [ ] Reload the game and confirm that active cooking slots, day progress, and active customer state are reset to idle, while total coins and upgrades are preserved (no mid-day progress exploits).
- [ ] Confirm that save resets from Title Scene or HUD wipe the save to a clean default state.

## 9. Sound Setting Persistence
- [ ] Toggle sound to `Off` on the title screen or HUD.
- [ ] Confirm sounds are muted.
- [ ] Refresh the browser and confirm the sound setting remains `Off` (persisted in SaveSystem).
- [ ] Toggle sound to `On`, tap button, and verify generated WebAudio tones play.

## 10. Rush Hour & Offline Earnings
- [ ] Start a day and trigger `Rush Hour`. Confirm it double-rewards base coins and does not freeze the new session loop.
- [ ] Simulate a save with a timestamp 5 minutes in the past. Reload the game and confirm the `OfflineRewardPanel` welcome back screen appears.

## 11. Discard/Trash Button & Order Matching
- [ ] Start cooking an item. Tap the cooking slot. Verify it highlights as selected. Tap `DISCARD` button. Verify slot is aborted and cleared immediately.
- [ ] Cook an item to ready. Tap the ready slot. Verify it highlights as selected. Tap `DISCARD` button. Verify slot is cleared immediately without awarding coins or count progress.
- [ ] Let food burn. Tap slot directly. Verify it clears.
- [ ] Select a ready item that mismatches the active customer order. Verify customer tag displays red `Order Mismatch` and `DISCARD` button lights up.
- [ ] Select items matching active order perfectly. Verify customer tag displays green `Ready to Serve!`.
- [ ] When no slots are selected, verify the `DISCARD` button is grayed out (`alpha = 0.4`) and non-clickable.
- [ ] Tap customer to serve with empty tray. Verify floating text `'No food selected'` is shown.

## 12. Mobile Layout Adaptability
Check the canvas centering and font readability at these viewports:
- [ ] `360x800`
- [ ] `393x873`
- [ ] `720x1280`
- [ ] `1080x1920`
- [ ] Verify HUD texts (coins, satisfaction, day progress, streak) do not overlap.
- [ ] Verify the two-slot grill labels are clear on smaller viewports.
- [ ] Verify the `DISCARD` button sits perfectly centered between the slots and is fully readable.
- [ ] Verify the `DaySummaryPanel` continue button is fully tappable and centered.
