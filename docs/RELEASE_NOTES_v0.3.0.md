# Release Notes - v0.3.0 (Milestone 15)

Street Food Empire: Kingston Rush version `v0.3.0` focuses on polishing the game's visual identity, night market atmosphere, and level progression reward loop using lightweight, placeholder-safe, and mobile-friendly Phaser primitives.

## What's New

### 1. Kingston Night Market Backdrop
*   **Atmospheric Skies:** Replaced the plain colored background panels with a deep navy-to-purple layered night sky.
*   **Twinkling Stars:** Created 30 stars with randomized opacities and slow-pulsing shared tween animations to simulate twinkling.
*   **Moon & Clouds:** Added a soft glowing moon in the top-left corner with low-opacity overlay clouds.
*   **City Skyline:** Drawn multiple distant buildings with glowing yellow window points.
*   **Market Tents:** Spawned background vendor tents with striped roofs and soft lighting glow boxes.
*   **Street Lights:** Positioned dual street lamps casting semi-transparent yellow light cones onto the street.
*   **Fairy Lights:** Added double strings of hanging fairy lights (warm yellow circles) looping across the top of the viewport with alternating pulse animations.
*   **Street Layer:** Replaced the plain dark street with a textured road containing pavement reflection glows.

### 2. 5 Stall Visual Progression Stages
The food cart now transforms dynamically as you upgrade it:
*   **Stage 1: Tiny Push Cart (Level 1):** Simple narrow wood cart with spoked wheels and a cardboard sign.
*   **Stage 2: Better Grill Setup (Level 2):** Wider counter, rustic wheels, a single-post red-yellow cloth umbrella canopy, and a clean painted sign.
*   **Stage 3: Menu Board & Sign (Level 3):** Wider mahogany counter, striped red/white awning on dual pillars, side ingredients crate, and a standing menu chalkboard.
*   **Stage 4: Fairy Lights & Counter (Level 4):** Premium wood counter, red-green-yellow striped awning, side crates of ingredients, and glowing fairy lights along the awning bottom lip.
*   **Stage 5: Full Kingston Booth (Level 5):** The ultimate permanent street booth structure. Features brick foundation supports (replacing wheels), a large backlit backlit title sign with neon pulsing, multiple colorful ingredient baskets, and dual red glowing lanterns hanging from the roof corners.

### 3. Dynamic Food Slot Renderers
Grill slots now display custom-drawn visual shapes representing the cooking food:
*   **Jerk Chicken:** A reddish-brown drumstick with white bone details.
*   **Festival:** Two golden-yellow fried dumplings.
*   **Roast Corn:** A yellow cob with green husks and char marks.
*   **Pepper Shrimp:** Three curved orange shrimp with tails.
*   **State Effects:**
    *   *Cooking:* Food appears pale/translucent and pulses slightly to represent heating.
    *   *Ready:* Food renders in full cooked colors and emits white wiggly steam lines that float upwards.
    *   *Burnt:* Food turns to charcoal black/dark gray and emits dark gray smoke particles.

### 4. Distinct Customer Silhouettes
Customer models have customized accessories depending on their type:
*   **Local Regular:** Simple baseball cap and blue shirt.
*   **Hungry Student:** Turquoise shirt, bright green hair, yellow headband, and a diagonal backpack strap.
*   **Night Shift Worker:** Dark shirt, neon yellow safety vest with white reflective bands, and a yellow construction hardhat.
*   **Market Tourist:** Sunglasses, coral Hawaiian floral shirt, and a camera strap hanging around the neck.

### 5. UI Polishes & Celebration Feedback
*   **Rounded Borders:** HUD panels, upgrade rows, summary overlays, and helper overlays now use rounded corners drawn using Graphics primitives.
*   **Level-Up celebration:** Upgrading your stall triggers a brief screen flash and a large scaling/fading text overlay: "STALL UPGRADED! Stage X".
*   **Rating Letter Grade Badge:** The day summary screen now awards a colored letter grade (A+, A, B, C, F) inside a circular badge based on satisfaction, and lists the current Stall Stage Name.
*   **Stall Stage on Title Screen:** The main Title scene now loads the player's actual upgraded stall model from their save file.

## Technical Details & Save Compatibility
*   **Clamping:** Increased `MAX_STALL_LEVEL` to `5`. Old level 4 saves load successfully and can earn XP toward level 5.
*   **No Asset Overhead:** No new image or audio files were added. Performance remains lightweight and optimized for low-end mobile viewports.
