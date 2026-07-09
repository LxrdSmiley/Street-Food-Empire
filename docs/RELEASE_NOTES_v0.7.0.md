# Street Food Empire: Kingston Rush — Release Notes v0.7.0

Street Food Empire v0.7.0 focuses on **UI Decluttering and Modal Window Management** to optimize the user experience and create a premium, clean gameplay layout. The upgrades, settings, and help systems have been moved off the active screen and placed into beautiful centered modal overlay windows.

---

## 🚀 Key Features

### 1. Main Screen UI Decluttering
- **Instructional Help Text Removed:** The long instructional status label (`hintText`) has been removed from the main active area to make the Jamaican food cart and incoming customers visually dominant.
- **HUD Footprint Simplified:** Relocated the large, cluttered Help, Reset, and Sound Toggle buttons off the active screen into a new modal settings window.
- **Compact Management Button Row:** Configured three tidy, aligned buttons (**Upgrades**, **Goals**, **Menu**) at `y = 214` to manage all non-gameplay options.

### 2. Modal Upgrades Window
- Reworked the upgrades panel in [UpgradePanel.ts](file:///C:/Users/Brandon%20Taylor/Street%20Food%20Empire/Street-Food-Empire/src/ui/UpgradePanel.ts) to render as a hidden-by-default, centered overlay card on a semi-transparent black backdrop.
- Backdrop intercepts all mouse clicks to block accidental background cooking or serving interactions.
- Close buttons: The modal can be closed via a top-right close `"X"` button, a bottom `"Close Upgrades"` button, or by tapping anywhere on the backdrop outside the modal card.
- Retained the `(Recommended)` upgrade tags, purchase flashing effects, and float coin/level-up feedback cleanly.

### 3. Settings & Help Menu Modal
- Created [MenuPanel.ts](file:///C:/Users/Brandon%20Taylor/Street%20Food%20Empire/Street-Food-Empire/src/ui/MenuPanel.ts) to group settings and instructions:
  - **How to Play Box:** Displays a compact, centered instructional guide explaining how to start shifts, cook food, serve orders, build streaks, and use upgrades.
  - **Sound Toggle:** A dedicated tap button to toggle sound on/off.
  - **Reset Save with Confirmation:** The Reset Save button now requires a confirmation step ("Confirm Reset?") before wiping data to prevent accidental loss of progress. Closing the menu cancels confirmation.
  - Close buttons and backdrop click-to-close behave identically to the upgrades modal.

### 4. Gameplay-Safe Modals
- **No Active-Day Punishments:** Upgrades and Menu buttons are disabled during active shifts (lowered to `0.42` opacity and interactivity turned off). This prevents the player from opening a modal during active play and being unfairly punished by customer patience timers.
- **Goals Panel Active:** The session Goals panel remains fully accessible during active play to track rewards.

### 5. Onboarding Tutorial Updates
- Tutorial steps have been modified to match the new layout:
  - `open_upgrades` now directs the player to the HUD Upgrades button instead of the bottom of the screen.
  - `understand_upgrades` directs the player to the Close button inside the Upgrades modal.
  - Tutorial completes on modal close, without forcing the player to buy an upgrade.

---

## 🛠️ Sizing and Layout Engineering
- The full-screen backdrops and layouts derive their dimensions directly from project constants (`GAME_WIDTH` and `GAME_HEIGHT`) rather than hardcoded raw canvas dimensions, improving responsive scaling and positioning.

---

## 💾 Save Compatibility & Integrity
- All existing v0.5.0/v0.6.0 local saves are fully compatible.
- Settings structure (`soundEnabled`, `tutorialCompleted`) remains intact. No settings or progression data are wiped.

---

## 🚫 Out of Scope (HARD MVP)
- No new foods, customer models, staff, locations, daily rewards, cloud saves, multiplayer, ads, IAP, or external image/audio assets were added.

---

## ⚠️ Known Limitations
- Reloading the browser mid-day resets active goals and progress for the current shift. Goal progress is persisted upon day completion.
