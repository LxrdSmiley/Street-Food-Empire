# Changelog

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
