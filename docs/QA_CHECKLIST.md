# Street Food Empire: Kingston Rush QA Checklist

Use this checklist before sharing a demo build.

## Fresh Start

- [ ] Clear or reset the local save.
- [ ] Load the game and confirm the title scene appears.
- [ ] Press `Start / Continue` and confirm MainScene opens.
- [ ] Confirm a default save is created with valid coins, upgrades, stall level, and stall XP.

## Serve Customer

- [ ] Confirm a customer spawns automatically.
- [ ] Confirm the order text is visible.
- [ ] Tap the grill to prepare the requested food.
- [ ] Wait for prep to complete.
- [ ] Tap the customer and confirm the customer leaves.
- [ ] Confirm another customer can spawn.

## Earn Coins

- [ ] Serve one customer.
- [ ] Confirm HUD coins increase.
- [ ] Confirm coin changes route through `EconomySystem`.

## Buy Upgrade

- [ ] Earn enough coins for an unlocked upgrade.
- [ ] Confirm the upgrade button changes from unaffordable to buyable.
- [ ] Buy the upgrade.
- [ ] Confirm coins decrease and upgrade level increases.
- [ ] Confirm locked and maxed upgrades cannot be bought.

## Save / Load

- [ ] Earn coins or buy an upgrade.
- [ ] Refresh the browser.
- [ ] Press `Start / Continue`.
- [ ] Confirm coins, upgrade levels, stall level, and stall XP persist.

## Reset Save

- [ ] Press `Reset Save` on the title scene.
- [ ] Start gameplay and confirm default coins, upgrades, stall level, and stall XP.
- [ ] Press in-game `Reset Save` and confirm the game restarts with a valid default save.

## Rush Hour

- [ ] Press `Rush Hour`.
- [ ] Confirm the HUD shows active state and remaining time.
- [ ] Serve a customer during Rush Hour.
- [ ] Confirm coin reward uses the rush multiplier.
- [ ] Wait for Rush Hour to end and confirm normal pacing resumes.

## Offline Earnings

- [ ] Create a valid save.
- [ ] Simulate a valid time-away save timestamp of at least 2 minutes.
- [ ] Reload and start gameplay.
- [ ] Confirm the offline reward panel appears.
- [ ] Collect once and confirm coins increase.
- [ ] Refresh again and confirm the same offline reward cannot be collected repeatedly.
- [ ] Simulate a long time away and confirm earnings are capped.

## Corrupted Save Recovery

- [ ] Replace LocalStorage save data with invalid JSON.
- [ ] Reload and confirm the game resets safely.
- [ ] Tamper with a valid save value without updating checksum.
- [ ] Reload and confirm the checksum failure resets safely.
- [ ] Set a far-future timestamp and confirm it is repaired without granting offline earnings.

## Mobile Screen Sizes

- [ ] Check `720x1280`.
- [ ] Check `1080x1920`.
- [ ] Check `393x873`.
- [ ] Check `360x800`.
- [ ] Confirm HUD text is readable.
- [ ] Confirm upgrade panel does not cover grill/customer interactions.
- [ ] Confirm Rush Hour, Help, and Reset buttons are easy to tap.
- [ ] Confirm no important UI goes off-screen.

## Build Check

- [ ] Run `npm install`.
- [ ] Run `npm run build`.
- [ ] Run `npm run preview`.
- [ ] Open the preview URL and confirm the title scene loads.
