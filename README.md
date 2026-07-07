# Street Food Empire: Kingston Rush

Street Food Empire: Kingston Rush is a portrait-first 2D street food tycoon prototype built with Phaser 3, TypeScript, and Vite.

The player starts with a Jamaican food cart in Kingston Night Market, serves customers, earns coins, buys a first grill upgrade, triggers a short rush hour, and eventually grows toward a larger street food empire. The current build is intentionally small: it proves the first customer-serving loop, first progression upgrade, local save foundation, and first active gameplay spike before adding larger systems.

## Project Status

Early playable prototype.

Implemented now:

- Phaser 3 + TypeScript + Vite scaffold
- Portrait mobile-friendly canvas scaling
- Boot, preload, title, and main gameplay scene flow
- Start / Continue title scene with visible Reset Save
- In-game Help overlay explaining the core loop
- v0.1.1 polish pass with clearer mobile HUD text, larger tap targets, and stronger first-time guidance
- Kingston Night Market placeholder scene
- Four foods unlocked by stall level: Jerk Chicken, Festival, Roast Corn, Pepper Shrimp
- Four customer types unlocked by stall level: Local Regular, Hungry Student, Night Shift Worker, Market Tourist
- Tap grill to prepare food
- Tap customer to serve
- Coin reward through `EconomySystem`
- Multiple upgrades: `grill_speed`, `food_value`, `customer_patience`, `stall_capacity`
- Upgrade purchase through `UpgradeSystem`
- Upgrade panel with affordability/max-level states
- Stall level and XP progression through `ProgressionSystem`
- Simple food, customer, and upgrade unlocks by stall level
- LocalStorage save/load through `SaveSystem`
- Save schema validation, clamping, and lightweight checksum tamper detection
- Manual Rush Hour prototype through `RushHourSystem`
- 30-second rush state with faster customer pacing and 2x coin rewards
- Math-based offline earnings through `OfflineEarningsSystem`
- Resume reward panel for collecting offline coins
- Mobile-hardened HUD, upgrade panel, and tap targets for portrait screens
- Visible Reset Save button for local testing
- Lightweight placeholder feedback for serves, level-ups, upgrades, unavailable purchases, and rush start
- Manual regression checklist in `docs/QA_CHECKLIST.md`
- Organized source folders for scenes, systems, entities, UI, data, types, config, and utilities

Not implemented yet:

- Staff
- Daily rewards
- Monetization
- Backend, cloud saves, authentication, multiplayer, ads, or IAP

## Tech Stack

- Phaser 3
- TypeScript
- Vite
- Browser-first prototype
- Placeholder visuals only
- No audio in the current build

## Project Docs

- Game Design Document: `docs/STREET_FOOD_EMPIRE_GDD.md`
- Manual QA checklist: `docs/QA_CHECKLIST.md`
- v0.1.1 release notes: `docs/RELEASE_NOTES_v0.1.1.md`
- v0.1.0 release notes: `docs/RELEASE_NOTES_v0.1.0.md`

## Run Locally

```powershell
npm install
npm run dev
```

Then open the local URL printed by Vite.

Build check:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## GitHub Pages Deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

In GitHub, set `Settings -> Pages -> Source` to `GitHub Actions`.

On every push to `main`, the workflow:

1. Checks out the repo.
2. Installs dependencies with `npm ci`.
3. Runs `npm run build`.
4. Uploads `dist/` to GitHub Pages.
5. Deploys using the standard GitHub Pages Actions.

The Vite config uses a relative production base path so built assets load when the game is served from a GitHub Pages repository URL as well as from local preview.

## Offline Earnings

Offline earnings are calculated when a valid save is loaded after enough time away. The game does not simulate customers while closed.

Current formula:

```text
coinsPerMinute =
  stallLevel * 3
  + unlockedFoodCount * 1.5
  + foodValueUpgradeLevel * 1.25
```

Rules:

- Minimum time away for a reward: 2 minutes
- Maximum rewarded time: 240 minutes / 4 hours
- Offline earnings are weaker than active play and Rush Hour
- Active rush state is not saved and does not affect offline earnings

To test offline earnings manually:

1. Play until a save exists.
2. In browser DevTools, edit `street_food_empire_save_v1.lastSavedAt` to an older timestamp and recompute the checksum, or temporarily use a known valid save fixture during development.
3. Reload the page.
4. If the save is valid and the time away is at least 2 minutes, the Welcome Back panel appears.
5. Press `Collect` once to add coins through `EconomySystem` and save the new timestamp.

## Reset Save

Use the visible `Reset Save` button on the title scene or in the game view to reset LocalStorage to a valid default save.

The reset path calls `SaveSystem.reset()`. There are no hidden coin, upgrade, or progression cheat keys.

## Mobile QA Targets

The current layout has been checked at:

- `720x1280`
- `1080x1920`
- `393x873`
- `360x800`

The Phaser canvas remains portrait-first and scales to fit the available browser viewport.

The v0.1.1 polish pass specifically targets clearer HUD text, larger Rush Hour/Help/Reset tap areas, readable upgrade rows, visible customer order text, and larger grill/customer hit zones on the smallest supported portrait viewport.

## Current Gameplay Loop

```text
Customer appears
-> Customer requests Jerk Chicken
-> Player taps the grill
-> Food prep timer completes
-> Player taps the customer
-> Coins increase
-> Stall XP increases
-> Stall levels unlock foods, customers, and upgrades
-> Player buys upgrades
-> Prep speed, order value, patience display, and customer pacing improve
-> Coins, upgrade levels, stall level, and stall XP save locally
-> Returning after time away may show a capped offline reward
-> Player can start Rush Hour
-> Rush Hour temporarily doubles coins and speeds up customer flow
-> Customer leaves
-> Another customer appears
```

## Project Structure

```text
public/
  assets/
    images/
    audio/
    fonts/
    data/

src/
  main.ts
  config/
    gameConfig.ts
    constants.ts
  scenes/
    BootScene.ts
    PreloadScene.ts
    TitleScene.ts
    MainScene.ts
  systems/
    CustomerSystem.ts
    EconomySystem.ts
    OfflineEarningsSystem.ts
    ProgressionSystem.ts
    SaveSystem.ts
    RushHourSystem.ts
    UpgradeSystem.ts
  entities/
    Customer.ts
    FoodStation.ts
    Stall.ts
  ui/
    HelpPanel.ts
    HUD.ts
    OfflineRewardPanel.ts
    UpgradePanel.ts
  data/
    foods.ts
    customers.ts
    upgrades.ts
  types/
    gameTypes.ts
  utils/
    math.ts
    format.ts
```

## Development Rules

- Build one playable feature at a time.
- Keep scenes thin; scenes coordinate systems and renderer-facing objects.
- Keep gameplay rules in `src/systems`.
- Keep reusable visual/game objects in `src/entities`.
- Keep HUD and display code in `src/ui`.
- Keep tunable food and customer values in `src/data`.
- Keep upgrade values in `src/data/upgrades.ts`.
- Keep progression rules in `ProgressionSystem`.
- Route all coin changes through `EconomySystem`.
- Route all upgrade purchases through `UpgradeSystem`.
- Route all save/load through `SaveSystem`.
- Keep offline reward math in `OfflineEarningsSystem`.
- Keep rush state in `RushHourSystem`; do not save active rush state yet.
- Keep deployment config in `.github/workflows` and `vite.config.ts`.
- Use `docs/QA_CHECKLIST.md` before sharing demo builds.
- Do not add debug cheat keys.
- Do not add backend, cloud saves, ads, IAP, authentication, multiplayer, or public UGC during the MVP.

## Current Limitations

- Placeholder-safe original shapes and text only; no final art polish yet.
- No audio has been added yet, so there are no music, sound effects, mute controls, or audio licensing requirements in this build.
- No staff, daily rewards, monetization, backend, cloud saves, multiplayer, chat, public UGC, new locations, or complex events.
- Rush Hour is manually triggered for prototype testing.
- Balance is tuned for an early 5-10 minute prototype session and should be revisited after human playtests.

## Asset And Audio Safety

The current visuals are built from original Phaser rectangles, circles, ellipses, triangles, lines, and text. The project does not include copied photos, real restaurant names, real logos, external art packs, or audio assets.

## Security Note

LocalStorage persistence is centralized in `SaveSystem`. Loaded saves are schema-versioned, validated, clamped, and repaired or reset when required. Version 1 saves migrate to version 2 by adding stall level/progress fields and mapping the old `grill_speed_1` upgrade key to `grill_speed`. The save includes a lightweight checksum to detect casual LocalStorage edits.

Offline earnings are also client-side and use the validated `lastSavedAt` timestamp. Future timestamps are repaired, offline duration is capped, and corrupted or checksum-failed saves do not grant offline rewards.

A fully client-side offline game cannot be perfectly protected against determined tampering. Server-authoritative validation should be added later only if the game adds leaderboards, cloud saves, purchases, competitive features, or other sensitive online systems.

## License

The source code is licensed under the repository license.

Game title, branding, art, music, sound effects, written content, design documents, and other non-code assets are not automatically licensed for reuse unless explicitly stated.
