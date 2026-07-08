# Street Food Empire: Kingston Rush v0.1.2 Release Notes

## Release Focus

v0.1.2 adds a lightweight generated audio layer and persistent sound toggle. It is not a gameplay expansion.

## What Changed

- Added generated WebAudio tones for key actions:
  - Button tap
  - Food prep start
  - Food ready
  - Serve success
  - Coin gain
  - Upgrade bought
  - Level up
  - Rush Hour start/end
- Added visible `Sound: On` / `Sound: Off` toggles on the title screen and in-game HUD.
- Persisted `settings.soundEnabled` through the existing save system.
- Migrated older saves by defaulting missing sound settings to enabled.

## Audio Safety

- No external audio files were added.
- No `.wav`, `.mp3`, or `.ogg` files were added.
- No background music was added.
- No copied sounds, real brand sounds, or jingles were added.
- No new dependencies were added.
- Audio playback is centralized in `src/systems/AudioSystem.ts`.
- Audio unlocks only after a user interaction.

## What Is Still Playable

- Start or continue from the title scene.
- Reset the local save from title or gameplay.
- Open and close Help.
- Toggle sound on/off and retain the setting after refresh.
- Serve customers.
- Earn coins and stall XP.
- Buy upgrades.
- Trigger Rush Hour.
- Collect capped offline earnings.

## How To Test

1. Run `npm install`.
2. Run `npm run build`.
3. Run `npm run preview`.
4. Open the preview URL printed by Vite.
5. Confirm sound does not play before user interaction.
6. Press Start or tap the grill to unlock audio.
7. Toggle `Sound: Off` and confirm future sounds stop.
8. Refresh and confirm the sound setting persists.

## Known Issues

- Generated tones are intentionally simple.
- There is no volume setting yet.
- There is no background music.
- Browser audio policies may require a fresh user gesture after reload before sound can play again.
