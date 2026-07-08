# Release Notes - v0.2.1 (Milestone 14)

Street Food Empire: Kingston Rush version `v0.2.1` implements quality of life gameplay additions, allowing players to abort wrong cooking operations, view exact order matching states, and clear space on the grill without waiting for items to burn.

## What's New

### 1. Trash/Discard Button
- **Layout Adjustments:** We shifted the two cooking slots from `x = -92 / 92` to `x = -110 / 110` relative to the center of the grill. This creates a center gap of 66px, allowing a high-contrast vertical `Trash/Discard` button to reside in the center of the grill base.
- **Two-Step Discard UX:** To prevent accidental taps from deleting food, players select a slot (the border highlights in green) and tap the Trash button to discard.
- **Cooking & Ready Discards:** Discarding works for both `ready` food (unwanted dishes) and `cooking` food (if the player started cooking the wrong item by mistake). Discarding clears all slot timers and returns it to `empty` immediately. No coins or points are awarded.
- **Visual Discard States:** The Trash button lights up (`alpha = 1.0`) and becomes interactive only when at least one slot is selected. Otherwise, it remains greyed out (`alpha = 0.4`) and non-clickable.

### 2. Ternary Customer Order Matching
The wait tag above the active customer now reacts dynamically to selected items:
- **`Waiting` (Neutral brown/gray):** Appears when no ready items are selected.
- **`Order Mismatch` (Soft red):** Appears when selected food items do not match what is requested.
- **`Ready to Serve!` (Vibrant green):** Appears when selected items match the active order perfectly, indicating it is safe to tap the customer to serve.

### 3. Floating Text Feedback
Added immediate floating text overlays for actions:
- **`Discarded`:** Renders over the grill when items are trashed.
- **`Burnt cleared`:** Renders over the grill when burnt items are cleared.
- **`No food selected`:** Renders over the customer if the player taps to serve with an empty tray.

### 4. Technical and Save Compatibility
- **Zero Schema Mutations:** The cooking, selection, and trash states remain runtime-only and reset on refresh. This ensures complete compatibility with existing `v0.2.0` progress saves (coins, sound settings, stall levels, and unlocked foods).
- **Save Integrity:** Saving and loading continue to route exclusively through the `SaveSystem`.
