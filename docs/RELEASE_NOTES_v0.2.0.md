# Release Notes - v0.2.0

Version `0.2.0` represents a complete redesign of the core gameplay loop of **Street Food Empire: Kingston Rush**, transitioning from the previous tap-only sequence to a slot-based cooking management and session-based day loop.

## New Gameplay Features

### 1. Slot-Based Cooking Loop
- The single-action grill has been replaced with a **two-slot cooking station** on the grill.
- Each cooking slot dynamically shifts through four clear states:
  - **Empty:** Available for cooking. Tapping it initiates cooking the next needed item in the active customer's order.
  - **Cooking:** Progress is represented visually by a loading bar. The preparation time scales down with upgrades.
  - **Ready:** Food is cooked and ready to be served. Ready food highlights in green and can be tapped to select it.
  - **Burnt:** If ready food is left on the grill too long (`readyWindowMs`), it burns, highlighting in red. Burnt food can be cleared by tapping, but it penalizes satisfaction and breaks the active serving streak.
- Controls remain tap-only; no drag-and-drop actions are required.

### 2. Day & Session System
- Players start a shift by pressing `Start Day`.
- Each day targets a short, focused shift of **6 customers** (combined served and missed).
- At the end of the shift, a **Day Summary Panel** displays:
  - Total served and missed customer counts.
  - Coins and tips earned during the day.
  - Final satisfaction level (%).
  - Best active streak achieved.
  - A summary grade rating: `Great Day` (>= 85% satisfaction), `Good Day` (>= 65%), or `Rough Day` (< 65%).

### 3. Customer Orders
- Spawning customers request **1–2 food items** from the pool of unlocked foods.
- Early orders default to 1 item, while higher stall levels gradually introduce 2-item combinations.
- A visible patience bar tracks time. If it drains to zero, the customer leaves, counting as missed.

### 4. Satisfaction System
- The day starts at a base **100% satisfaction**.
- Satisfaction updates in real time based on player outcomes:
  - **Fast correct serve:** Keeps satisfaction high and grants a small boost (+2).
  - **Wrong order served:** Reduces satisfaction (-12).
  - **Burnt food:** Reduces satisfaction (-6).
  - **Customer leaving (expired patience):** Reduces satisfaction (-15).
- Satisfaction remains clamped between 0% and 100%.

### 5. Streak System
- Correct serves build an active serving streak.
- Wrong orders, burnt food, or missed customers immediately reset the streak to 0.
- A higher streak awards a scaling tip multiplier: `1 + Math.min(streak, 5) * 0.08` (capped at +40% tips).

---

## Technical & Architecture Design

### Centralized Systems
Coordination remains strictly modular, routing logic rules through specialized single-responsibility classes:
- **OrderSystem:** Owns order generation and checking.
- **DaySystem:** Tracks and manages session states.
- **SatisfactionSystem:** Maintains and calculates satisfaction %.
- **StreakSystem:** Manages active streaks.
- **FoodStation:** Owns the cooking slot state machine.
- **CustomerSystem:** Controls customer lifecycles and patience timers.
- **EconomySystem:** Processes all coins and tips safely.
- **SaveSystem:** Handles all save/load operations in LocalStorage.
- **AudioSystem:** Operates WebAudio generated tones.

### Save Migration
- Bumps schema to Version 3.
- Safely preserves existing player coins, sound settings, and upgrade levels.
- Resets active cooking, customer spawns, and day progress upon reloads to prevent save-state cheating.

---

## Safety & Limitations

### Asset & Audio Safety
- Visuals use original Phaser primitive shapes and text. No copied art, real brands, real logos, or licensed media are included.
- Sound effects are lightweight WebAudio synth notes generated in code. No external audio files are loaded.

### Known Limitations
- **No Early Discard:** There is currently no active trash can or manual discard action. If a player cooks unneeded food, they must wait for it to burn to clear the slot.
- **Client-Side Security:** Save validation and checksums are client-side only. They prevent casual edits but are not cryptographically secure against determined tamper attempts.

### Future Targets
- Balancing upgrade costs, cook timers, and patience bounds based on human playtests.
