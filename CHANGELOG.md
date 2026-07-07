# Changelog

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
