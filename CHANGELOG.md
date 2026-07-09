# Changelog

## v0.7.0

### Added
- **Modal Upgrades Window:** Reworked the upgrades panel to render as a hidden-by-default, full-screen glassmorphic modal overlay card blocking pointer inputs.
- **Settings & Help Menu Modal:** Relocated the sound toggle, reset save, and help instructions into a new compact Settings/Help modal, reducing main screen HUD footprint.
- **Backdrop and Close Button Support:** Modals can be closed by clicking the close `"X"` button, the bottom `"Close"` button, or tapping the semi-transparent black backdrop outside the modal card.
- **Double-Tap Reset Confirmation:** Reset Save button now requires a confirmation click ("Confirm Reset?") before resetting.
- **Coordination/Mutual Exclusion:** Opening any modal (Upgrades, Goals, Menu) automatically closes any other active modal. Opening the Day Summary closes all active modals.

### Changed
- **HUD Simplification:** Removed large Help, Reset, and Sound buttons from active play HUD, replaced with a row of three clean buttons (Upgrades, Goals, Menu) at `y = 214`.
- **Gameplay-Safe Modals:** Upgrades and Menu buttons are disabled during active day shifts (opacity = `0.42` and interactive zone disabled) to prevent pausing/punishing active gameplay. Goals button remains available during active play.
- **Tutorial Updates:** Modified tutorial steps to point to the new HUD Upgrades button and the modal's Close button. Tutorial completes on modal close without requiring a purchase.
- **Removed Hint Text:** Removed the large, always-visible gameplay instruction label to maximize visual dominance of the cart and customer areas.

### Notes
- Sizing and scaling for full-screen overlays derive from project constants (`GAME_WIDTH` and `GAME_HEIGHT`) to ensure mobile layout compatibility.
- Save settings (`soundEnabled` and `tutorialCompleted`) remain backwards-compatible with v0.6.0 saves.

## v0.6.0

### Added
- **Juice/Fun Feedback Pass:** Added lightweight Phaser primitive/tween polish around core actions without adding content or new systems.
- **Serve Feedback:** Correct serves now trigger clearer success text, customer success state, HUD pulses, and separated reward popups.
- **Coin / XP Feedback:** Base coins, tips, XP, and goal bonuses now use visually distinct floating text treatments.
- **Streak Feedback:** Fast serves and multi-serve streaks now show stronger readable callouts such as `Fast Serve!`, `Streak x2`, and `Hot Hands!`.
- **Goal Completion Feedback:** Completed session goals now trigger `Goal Complete!`, `Bonus Ready`, and goals panel pulse/update feedback without blocking play.
- **Upgrade Purchase Feedback:** Bought upgrades now flash their row, pulse coin display, and show upgrade-specific improvement text.
- **Day Summary Polish:** Day summary now emphasizes shift quality, total earned, goal bonus breakdown, grade, and Next Target.

### Changed
- **Level-Up Feel:** Stall level-up now includes a very small camera shake in addition to the existing flash/text celebration.
- **Food Slot Feel:** Cooking start, food ready, and ready-slot selection have small lightweight pop feedback.

### Notes
- No new foods, customers, staff, daily rewards, backend, ads, IAP, cloud saves, multiplayer, external assets, audio files, or dependencies were added.
- Save schema remains compatible with v0.5.0; no new persistent gameplay fields were introduced.

## v0.5.0

### Added
- **First-Time Tutorial System:** A lightweight, skippable tutorial system that introduces the main gameplay loop (Welcome → Start Day → Read Order → Cook → Wait for Ready → Select → Serve → Open Goals → Complete Day → Buy Upgrade).
- **Tutorial UI Overlay:** Renders callouts, interactive "Skip Tutorial" and "Next" buttons, and simple pointing arrows using primitive graphics.
- **Save Compatibility for Tutorial:** Adds `tutorialCompleted` to `GameSettings` and automatically repairs old saves to set it to `false`.
- **Upgrade Recommendation:** Automatically highlights the most useful/affordable upgrade in the Upgrade Panel with a `(Recommended)` tag.

### Changed
- **Early Balance Tuning:** 
  - Stall Level 1 → 2 XP requirement increased from `36` to `45` (exactly 3 clean serves).
  - First upgrade cost for Hotter Grill decreased from `30` to `25` coins (reachable on Day 1).
  - Patience for early `local_regular` customers increased from 12s to 14s.

## v0.4.0

### Added
- **Session Goals:** Each day generates 3 achievable goals (e.g., serve correct orders, earn coins, reach a streak, maintain satisfaction, avoid wrong orders, serve two-item orders). Progress updates in real-time during gameplay.
- **Goals Panel:** New "Goals" button in the HUD opens a compact overlay showing today's goals with progress indicators, checkmarks, and reward amounts.
- **Auto-Preview:** Goals panel briefly appears at day start to orient the player.
- **Goal Rewards:** Completed goals award bonus coins and XP at day end. Rewards are claimed exactly once and saved immediately to prevent duplication.
- **Next Target Display:** Day summary now shows a motivational "Next Target" based on the player's current progression state (next upgrade, next stall stage, or play challenge).
- **Day Summary Goals Section:** End-of-day summary displays completed/incomplete goals with color-coded status and total bonus earned.

### Changed
- Day summary panel now accepts and renders session goal data alongside existing stats.
- HUD bottom action row adjusted to fit a 5th button (Goals) without crowding existing controls.

## v0.3.0

### Added
- **Kingston Night Market Backdrop:** Designed a detailed background featuring a layered night sky, city building outlines, glowing windows, market tents, streetlights with cast light cones, road pavements, and double strings of twinkling fairy lights.
- **5 Stall Visual Stages:** Implemented a visible upgrade system where the stall transforms dynamically based on the current level: Tiny Push Cart (Stage 1), Better Grill Setup (Stage 2), Menu Board & Sign (Stage 3), Fairy Lights & Counter (Stage 4), and Full Kingston Booth (Stage 5).
- **Dynamic Food Slot Renderers:** Food items inside grill slots now draw custom Phaser shapes representing Jerk Chicken (drumsticks with bones), Festival (golden ovals), Roast Corn (yellow cob with husk and grill char lines), and Pepper Shrimp (curved orange shrimp) with steam or smoke particles.
- **Distinct Customer Silhouettes:** Rendered custom overlays on customer bodies (e.g. backpacks, vests, hardhats, tropical floral shirt patterns, sunglasses, and camera straps) to distinguish customer types visually.
- **Level-Up celebration:** Added a full-screen flash and scaling alert overlays to celebrate stall upgrades.

### Changed
- Increased maximum stall level to 5.
- Polished HUD, UpgradePanel, and pop-up borders using rounded rectangle graphics.
- Set the Title Screen to render the player's saved stall stage in real-time.

## v0.2.1

### Added
- **Trash/Discard Button:** Shifted grill slot coordinates outward to create a 66px center channel containing a Trash/Discard button. Allows players to select cooking/ready slots and discard them immediately.
- **Ternary Match Tags:** Upgraded active customer bubble labels to support `'Waiting'` (gray/brown), `'Order Mismatch'` (soft red), and `'Ready to Serve!'` (vibrant green) indicators to guide serving inputs.
- **QoL Feedbacks:** Added immediate floating text notifications (`'Discarded'`, `'Burnt cleared'`, `'No food selected'`) to make game loops highly responsive.

### Changed
- Shifted grill slot centers from `-92`/`92` to `-110`/`110`.
- Enabled selecting slots in the `cooking` state to allow aborting errors.

## v0.2.0

Redesign of the core gameplay loop introducing slot-based cooking and a day-based session system.

### Core Loop Changes

- **Cooking Slot System:** Replaced the single-action grill with a two-slot cooking station on the grill supporting `empty`, `cooking`, `ready`, and `burnt` states. Burnt food can be cleared by tapping.
- **Day System:** Added a short day loop of 6 customers. Displays a summary panel showing served/missed stats, coins, tips, satisfaction %, and best streak.
- **Order Logic:** Customers request 1–2 items depending on current progress.
- **Satisfaction System:** Added a dynamic satisfaction tracker affected by served speed, wrong orders, burnt food, and customer wait failures.
- **Streak System:** Added a streak counter that gives a tip multiplier for consecutive correct orders.

### Tech and Coordination Updates

- Added modular coordination systems: `DaySystem`, `OrderSystem`, `SatisfactionSystem`, and `StreakSystem`.
- Centralized UI updates in `HUD` and added `DaySummaryPanel`.
- Upgraded save files to version 3 schema with automatic migration, clamping, and active day reset safety.

### Known Limitations

- **No Early Discard:** There is no trash action; wrong food must burn before clearing.
- **Client-Side Limits:** Save security remains basic client-side verification.

## v0.1.2

Lightweight generated audio and sound toggle release candidate.

### Audio Changes

- Added short, soft, generated WebAudio tones for button taps, food prep start, food ready, serve success, coin gain, upgrade bought, level up, and Rush Hour start/end.
- Added visible `Sound: On` / `Sound: Off` toggles on the title screen and in-game HUD.
- Persisted `settings.soundEnabled` through the existing `SaveSystem`.
- Migrated older saves safely by defaulting missing settings to sound enabled.

### Safety Notes

- No `.wav`, `.mp3`, `.ogg`, external audio assets, audio packs, background music, or new dependencies were added.
- Audio unlocks only after user interaction and does not autoplay on title load.
- All WebAudio usage is centralized in `AudioSystem`.

### Known Limitations

- No volume setting yet.
- No background music.
- Generated tones are intentionally simple and may need human playtest tuning for comfort.

## v0.1.1

Demo presentation polish release candidate.

### Polish Changes

- Increased mobile HUD readability for coins, stall progress, Rush Hour state, food state, and message text.
- Enlarged Rush Hour, Help, Reset Save, grill, customer, offline reward, and upgrade tap targets.
- Added concise in-game guidance: `1 Tap grill  2 Tap customer  3 Buy upgrades`.
- Improved title screen first-time guidance.
- Reworded Help panel instructions for the core serving loop.
- Refined placeholder-safe visuals using original Phaser primitive shapes only.
- Added a clearer cart silhouette, market layering, simple food shapes, and stronger customer/order presentation.

### Mobile Sizes Tested

- `360x800`
- `393x873`
- `720x1280`
- `1080x1920`

### Known Limitations

- Still placeholder-only; this is not a final art pass.
- No audio has been added.
- Rush Hour remains manually triggered for prototype testing.
- No new foods, customers, systems, locations, backend, cloud saves, monetization, staff, or daily rewards.

### Asset And Audio Safety

All v0.1.1 visual changes use original Phaser primitive shapes and text. No copied art, real brands, real logos, external photos, or audio assets were added.

## v0.1.0

First public prototype release prep for **Street Food Empire: Kingston Rush**.

### Current MVP Features

- Phaser 3, TypeScript, and Vite browser prototype.
- Portrait-first canvas scaling for mobile-friendly play.
- Boot, preload, title, and main gameplay scene flow.
- Start / Continue and Reset Save from the title scene.
- Kingston Night Market placeholder play scene.
- Customer-serving loop: prepare food, serve customer, earn coins, spawn next customer.
- Four early foods unlocked by stall level.
- Four early customer types unlocked by stall level.
- Coins routed through `EconomySystem`.
- Upgrades routed through `UpgradeSystem`.
- Stall level and XP progression routed through `ProgressionSystem`.
- LocalStorage save/load routed through `SaveSystem`.
- Save schema validation, clamping, repair/reset handling, and lightweight checksum detection.
- Rush Hour prototype with faster customer pacing and 2x rewards.
- Math-based offline earnings with a capped resume reward.
- In-game Help overlay.
- Mobile-hardened HUD and upgrade panel.
- GitHub Pages deployment workflow.

### Known Limitations

- Placeholder shapes and text only.
- No art, animation, or audio polish.
- Rush Hour is manually triggered.
- Balance is tuned for a short prototype session and needs human playtest feedback.
- No staff, daily rewards, ads, IAP, backend, cloud saves, multiplayer, chat, public UGC, new locations, or complex events.

### Security Limitation

Save validation and checksums are client-side only. They detect casual LocalStorage edits but do not prevent determined tampering. Server-authoritative validation would be needed later for competitive, paid, or online features.

### Placeholder Asset Note

The current prototype uses placeholder Phaser shapes and text. No real brands, logos, licensed art, or polished audio assets are included in this release.
