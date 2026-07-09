# Street Food Empire: Kingston Rush

Street Food Empire: Kingston Rush is a portrait-first 2D street food tycoon prototype built with Phaser 3, TypeScript, and Vite.

The player starts with a Jamaican food cart in Kingston Night Market, serves customers, earns coins, buys a first grill upgrade, triggers a short rush hour, and eventually grows toward a larger street food empire.

## Project Status

Playable core cooking loop with session goals, retention loop, rich visual identity, and 5 stall progression stages (`v0.4.0`).

Implemented now:

- Phaser 3 + TypeScript + Vite scaffold
- Portrait mobile-friendly canvas scaling
- Boot, preload, title, and main gameplay scene flow
- Start / Continue title scene showing player's current stall stage in real-time
- In-game Help overlay explaining the core loop
- v0.4.0 Session Goals: 3 goals per day (serve correct, earn coins, streak, satisfaction, avoid wrong orders, two-item orders)
- v0.4.0 Goals Panel with progress indicators and reward display
- v0.4.0 Auto-preview goals at day start
- v0.4.0 Goal bonus rewards (coins + XP) at day end
- v0.4.0 Next Target motivational display in day summary
- v0.3.0 Detailed Kingston Night Market background (layered sky, skyline windows, tents, streetlights, twinkling string lights)
- v0.3.0 5 Stall Visual stages (Tiny Cart, Umbrella Setup, Menu Board, Fairy Lights, Full permanent Kingston Booth)
- v0.3.0 Custom-drawn food items in grill slots (Chicken drumstick, Festival dumplings, Roast Corn cobs, Pepper Shrimp)
- v0.3.0 Distinct customer silhouetted types (backpack straps, neon safety vests, yellow hardhats, Hawaiian print shirts, sunglasses)
- v0.2.1 Trash/Discard button for aborting wrong cooking items
- v0.2.1 Ternary Customer Order Match status bubble indicators
- v0.2.1 Responsive floating text feedback overlays
- v0.2.0 core loop redesign featuring slot-based cooking (2 cooking slots)
- Order logic requesting 1-2 items from unlocked foods
- Satisfaction system clamped between `[0, 100]` with outcomes for serves/misses/burnt
- Streak system tracking consecutive correct serves and rewarding a tip multiplier
- Kingston Night Market placeholder scene
- Four foods unlocked by stall level: Jerk Chicken, Festival, Roast Corn, Pepper Shrimp
- Four customer types unlocked by stall level: Local Regular, Hungry Student, Night Shift Worker, Market Tourist
- Coin and tip reward through `EconomySystem`
- Multiple upgrades: `grill_speed`, `food_value`, `customer_patience`, `stall_capacity`
- Upgrade purchase through `UpgradeSystem`
- Upgrade panel with affordability/max-level states
- Stall level and XP progression through `ProgressionSystem`
- LocalStorage save/load through `SaveSystem` (version 3 schema) with automatic migration, clamping, and active day reset safety
- Manual Rush Hour prototype through `RushHourSystem` (30-second rush state with 2x coin rewards)
- Math-based offline earnings through `OfflineEarningsSystem`
- Resume reward panel for collecting offline coins
- Mobile-hardened HUD, upgrade panel, and tap targets for portrait screens
- Visible Reset Save button for local testing
- Lightweight placeholder feedback for serves, level-ups, upgrades, unavailable purchases, and rush start
- Manual QA checklist in `docs/QA_CHECKLIST.md`
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
- Generated in-code sound effects only; no external audio assets

## Project Docs

- Game Design Document: `docs/STREET_FOOD_EMPIRE_GDD.md`
- Manual QA checklist: `docs/QA_CHECKLIST.md`
- v0.2.0 release notes: `docs/RELEASE_NOTES_v0.2.0.md`
- v0.1.2 release notes: `docs/RELEASE_NOTES_v0.1.2.md`
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

## Sound Toggle

The title scene and in-game HUD include a visible `Sound: On` / `Sound: Off` toggle. The setting is saved through `SaveSystem` as `settings.soundEnabled` and persists after refresh.

All current sound effects are generated in code with WebAudio inside `AudioSystem`. The game does not ship `.wav`, `.mp3`, `.ogg`, external audio packs, background music, copied sounds, or real brand jingles.

Browser audio starts only after a user interaction, such as pressing Start, toggling Sound, tapping the grill, or pressing Rush Hour.

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
Player starts the day (6-customer shift)
-> Customer appears with 1-2 item bubble and patience bar
-> Player taps empty grill slots to start cooking next needed items
-> Food prepares in cooking slots
-> Food is ready (can burn if ignored too long)
-> Player taps ready food slots to select them
-> Player taps customer to serve the selected items
-> Correct order awards coins/tips, increases streak and satisfaction
-> Wrong/burnt/missed outcomes reset streak and decrease satisfaction
-> Coins and tips save locally (resets active day state on reload)
-> Day ends after 6 served/missed customer outcomes
-> Day Summary Panel displays results and rates the day
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
    AudioSystem.ts
    CustomerSystem.ts
    DaySystem.ts
    EconomySystem.ts
    OfflineEarningsSystem.ts
    OrderSystem.ts
    ProgressionSystem.ts
    SaveSystem.ts
    SatisfactionSystem.ts
    StreakSystem.ts
    RushHourSystem.ts
    UpgradeSystem.ts
  entities/
    Customer.ts
    FoodStation.ts
    Stall.ts
  ui/
    DaySummaryPanel.ts
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
- No background music, imported sound files, volume control, or polished audio mix yet.
- No staff, daily rewards, monetization, backend, cloud saves, multiplayer, chat, public UGC, new locations, or complex events.
- Rush Hour is manually triggered for prototype testing.
- Balance is tuned for an early 5-10 minute prototype session and should be revisited after human playtests.

## Asset And Audio Safety

The current visuals are built from original Phaser rectangles, circles, ellipses, triangles, lines, and text. The current sounds are generated in code. The project does not include copied photos, real restaurant names, real logos, external art packs, or external audio assets.

## Security Note

LocalStorage persistence is centralized in `SaveSystem`. Loaded saves are schema-versioned, validated, clamped, and repaired or reset when required. Version 1 saves migrate to version 2 by adding stall level/progress fields and mapping the old `grill_speed_1` upgrade key to `grill_speed`. The save includes a lightweight checksum to detect casual LocalStorage edits.

Offline earnings are also client-side and use the validated `lastSavedAt` timestamp. Future timestamps are repaired, offline duration is capped, and corrupted or checksum-failed saves do not grant offline rewards.

A fully client-side offline game cannot be perfectly protected against determined tampering. Server-authoritative validation should be added later only if the game adds leaderboards, cloud saves, purchases, competitive features, or other sensitive online systems.

## License

The source code is licensed under the repository license.

Game title, branding, art, music, sound effects, written content, design documents, and other non-code assets are not automatically licensed for reuse unless explicitly stated.
