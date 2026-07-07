# Street Food Empire: Kingston Rush v0.1.0 Release Notes

## What Is Playable

- Open the title scene and start or continue into gameplay.
- Reset the local save from the title scene or in-game.
- Read the Help overlay for the core loop.
- Serve customers by tapping the grill, waiting for prep, and tapping the customer.
- Earn coins and stall XP from successful service.
- Buy upgrades when affordable and unlocked.
- Level the stall to unlock more foods, customers, and upgrades.
- Start Rush Hour for faster customer pacing and multiplied coin rewards.
- Return after time away to collect capped offline earnings.
- Save and load coins, upgrade levels, stall level, and stall XP locally.

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

## How To Deploy And Test GitHub Pages

1. Commit and push the repo to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main`.
5. Confirm `.github/workflows/deploy.yml` runs successfully.
6. Open the published Pages URL.
7. Confirm the title scene loads and use `docs/QA_CHECKLIST.md` for the full manual pass.

The workflow installs dependencies with `npm ci`, runs `npm run build`, uploads `dist/`, and deploys through the official GitHub Pages Actions.

## Manual QA Checklist Summary

- Fresh start and title scene.
- Start / Continue into gameplay.
- Reset Save from title and in-game.
- Help overlay open and close.
- Customer spawn, order visibility, prep, serve, and respawn.
- Coin reward and HUD update.
- Upgrade purchase, locked state, unaffordable state, and max state.
- Stall XP and level progression.
- Save/load persistence after refresh.
- Rush Hour start, reward multiplier, and return to normal pacing.
- Offline earnings, collect once behavior, cap behavior, and corrupt-save handling.
- Mobile portrait checks at `720x1280`, `1080x1920`, `393x873`, and `360x800`.
- Production build and preview check.

## Known Issues

- Vite reports a large JavaScript chunk warning because Phaser ships in the main bundle. The build still succeeds.
- Visuals are placeholder-only.
- No audio polish is present.
- Offline earnings are client-side and casually protected only.
- Rush Hour is prototype-triggered from a visible button.

## Future Roadmap Notes

Future milestones can consider staff, daily rewards, more locations, more content, backend/cloud saves, monetization, and polished assets, but none of those are part of v0.1.0.
