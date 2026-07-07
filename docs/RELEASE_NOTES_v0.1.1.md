# Street Food Empire: Kingston Rush v0.1.1 Release Notes

## Release Focus

v0.1.1 is a demo presentation polish release candidate. It improves first-time clarity, mobile readability, tap target comfort, and placeholder-safe visual presentation without adding new gameplay systems or content.

## What Changed

- Improved mobile HUD readability for coins, stall progress, Rush Hour state, station state, and player messages.
- Enlarged key tap targets, including Rush Hour, Help, Reset Save, grill, customer, upgrade buttons, and offline reward collection.
- Added clearer first-time guidance on the title scene and in-game HUD.
- Reworded the Help panel around the core loop: tap grill, tap customer, earn coins, buy upgrades, use Rush Hour.
- Refined placeholder visuals with original primitive Phaser shapes only.
- Improved the cart silhouette, market backdrop layering, customer/order presentation, and simple food/grill shapes.
- Removed hardcoded local preview URLs from public docs.

## What Is Still Playable

- Start or continue from the title scene.
- Reset the local save from title or gameplay.
- Open and close the Help panel.
- Serve customers by preparing food at the grill and tapping the customer.
- Earn coins and stall XP.
- Buy upgrades.
- Save/load progress locally.
- Trigger Rush Hour for faster pacing and bonus rewards.
- Collect capped offline earnings after time away.

## Mobile QA Targets

The release candidate was checked at:

- `360x800`
- `393x873`
- `720x1280`
- `1080x1920`

## How To Run Locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite.

## How To Build And Preview

```powershell
npm run build
npm run preview
```

Open the preview URL printed by Vite.

## GitHub Pages Deployment Check

The GitHub Pages workflow remains `.github/workflows/deploy.yml`.

On push to `main`, the workflow installs with `npm ci`, runs `npm run build`, uploads `dist/`, and deploys through the standard GitHub Pages Actions. The repository Pages setting must use `Source: GitHub Actions`.

## Known Issues

- Vite still reports a large Phaser bundle chunk warning. The build succeeds.
- Visuals remain placeholder-safe and are not final art.
- No audio has been added.
- Rush Hour remains manually triggered for prototype testing.
- Offline earnings and save checksums remain client-side and casually protected only.

## Scope Notes

No new foods, customers, gameplay systems, dependencies, assets, audio, staff, daily rewards, ads, IAP, backend, cloud saves, multiplayer, chat, public UGC, new locations, complex events, real brands, copied art, or advanced 3D were added.
