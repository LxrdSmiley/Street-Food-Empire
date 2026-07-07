# Street Food Empire: Kingston Rush — Game Design Document (GDD)

**Document Version:** 1.1  
**Game Title:** Street Food Empire: Kingston Rush  
**Genre:** 2D Hybrid-Casual Idle/Tycoon Game  
**Target Platform:** Android first, then iOS/Web if successful  
**Recommended Prototype Stack:** Phaser 3 + JavaScript/TypeScript  
**Recommended Production Stack:** Godot 4 or Phaser 3 wrapped for mobile  
**Target Session Length:** 2–8 minutes  
**Primary Audience:** Casual mobile players, idle/tycoon fans, food game players, teens and adults  
**Target Rating:** Teen/general audience, not child-directed  

---

## 1. Executive Summary

**Street Food Empire: Kingston Rush** is a 2D casual tycoon game where the player starts with a tiny Jamaican street food cart and grows it into a global street food empire.

The player serves customers, earns coins, upgrades food equipment, unlocks recipes, hires staff, handles chaotic rush-hour events, earns offline income, joins food festivals, and expands from Kingston to international street food markets.

The game should feel simple, satisfying, fast, and progression-heavy. It must be easy to play with one hand and must run well on low-end Android phones.

### One-Sentence Pitch

Start with a tiny Jamaican food cart, survive rush hour, unlock iconic street foods, hire staff, upgrade your stall, and build a global street food empire.

### Core Player Fantasy

The player goes from:

```text
Tiny street cart → popular night-market stall → food truck → street food chain → global empire
```

### Core Design Goal

Make the player constantly think:

```text
Just one more customer.
Just one more upgrade.
Just one more rush hour.
Just one more location.
```

---

## 2. Design Pillars

### 2.1 Fast and Understandable

The player should understand the game in under 60 seconds.

The first minute should include:

1. Serve first customer.
2. Earn coins.
3. Buy first upgrade.
4. Unlock or preview the next food.
5. See progress toward a better stall.

No long story intro. No complicated tutorial.

---

### 2.2 Visible Progression

Upgrades must visibly change the stall. The player should not only see numbers increase. They should see the business becoming more successful.

Examples:

- Wooden cart becomes upgraded cart.
- Small grill becomes large grill.
- Handwritten menu becomes neon sign.
- One cook becomes a full team.
- Empty street becomes crowded market.

---

### 2.3 Active + Idle Balance

The game should support both active play and idle progression.

Active play:

- Serving customers.
- Completing combos.
- Handling rush hour.
- Managing food queues.

Idle play:

- Staff automation.
- Offline earnings.
- Passive reputation gain.
- Automatic production after upgrades.

The game should not become a boring idle-only tapper.

---

### 2.4 Caribbean/Jamaican Identity

The first location should feel strongly Jamaican without being stereotypical or disrespectful.

Tone:

- Bright.
- Warm.
- Energetic.
- Street-market inspired.
- Respectful.
- Food-focused.

Avoid:

- Mocking accents.
- Poverty jokes.
- Lazy stereotypes.
- Real brand references.
- Sacred/religious symbols used as jokes.

---

### 2.5 Low-End Device Friendly

The game should run smoothly on low-end Android devices.

Technical constraints:

- 2D only.
- Limited particles.
- Simple animations.
- Object pooling for customers, coins, popups, and food icons.
- No heavy physics.
- No complex lighting.
- No always-online requirement for MVP.
- Offline earnings calculated mathematically, not simulated in real time.

---

## 3. Target Platforms and Controls

### 3.1 Primary Platform

Android mobile.

### 3.2 Secondary Platforms

- Web prototype.
- iOS later if traction is good.

### 3.3 Input

Touch-first controls.

Main interactions:

- Tap customer/order.
- Tap food station.
- Tap upgrade button.
- Tap collect coins.
- Tap staff/recipe menu.
- Optional drag-and-drop for food serving in later versions.

### 3.4 Orientation

Recommended: **Portrait mode**.

Reason:

- One-handed play.
- Better for casual mobile.
- Easier UI layout for tycoon games.
- Better for TikTok/Shorts screen recordings.

---

## 4. Player Experience Goals

### 4.1 First 60 Seconds

The player should experience this flow:

```text
Open game
→ See small Kingston food cart
→ First customer appears
→ Tap to cook/serve jerk chicken
→ Earn coins
→ Upgrade grill
→ More customers arrive
→ Unlock beef patty or festival
→ See next goal: Upgrade cart to Level 2
```

### 4.2 First 5 Minutes

The player should:

- Serve multiple customers.
- Buy at least 3 upgrades.
- Unlock at least 1 new food.
- Experience one short rush hour.
- Hire or preview first staff member.
- See the stall visually improve.

### 4.3 First Day

The player should:

- Complete the starter location tutorial.
- Unlock 3–6 foods.
- Upgrade the stall several times.
- Claim offline earnings after leaving and returning.
- Complete daily challenge.

### 4.4 Long-Term Feel

The game should feel like a growing business empire with constant new goals:

- New foods.
- New staff.
- New locations.
- New festivals.
- Better ratings.
- Larger crowds.
- More automation.
- Cosmetic customization.

---

## 5. Core Game Loop

### 5.1 Main Loop

```text
Serve customers
→ Earn coins
→ Upgrade equipment/stall/food
→ Serve faster and earn more
→ Unlock recipes and staff
→ Complete rush hour/events
→ Expand to new location
→ Repeat at larger scale
```

### 5.2 Short Session Loop

```text
Open game
→ Claim offline earnings
→ Serve customers
→ Complete one rush hour or daily task
→ Buy upgrade
→ Check next unlock
→ Exit with progress saved
```

### 5.3 Long-Term Loop

```text
Master location
→ Win local festival
→ Expand to new city
→ Unlock regional food
→ Upgrade empire systems
→ Compete in bigger festivals
→ Prestige/reset for permanent bonuses, optional later
```

---

## 6. MVP Scope

The MVP should be small, playable, and testable.

### 6.1 MVP Location

**Kingston Night Market**

### 6.2 MVP Foods

Start with 6 foods:

1. Jerk Chicken
2. Beef Patty
3. Fried Dumpling
4. Festival
5. Curry Goat Bowl
6. Sorrel Drink

### 6.3 MVP Staff

Start with 3 staff types:

1. Cook
2. Cashier
3. Promoter

### 6.4 MVP Game Systems

Required:

- Customer spawning.
- Order generation.
- Food preparation timer.
- Serving mechanic.
- Coin earnings.
- Food upgrades.
- Stall upgrades.
- Staff automation.
- Rush hour event.
- Offline earnings.
- Save/load system.
- Daily reward.
- Basic settings menu.

Optional but useful:

- Basic shop placeholder.
- Rewarded ad placeholder.
- Daily challenge placeholder.
- Analytics placeholder.

### 6.5 MVP UI Screens

Required screens:

1. Main stall screen.
2. Upgrade screen.
3. Recipe screen.
4. Staff screen.
5. Daily reward screen.
6. Settings screen.
7. Offline earnings popup.

### 6.6 MVP Exclusions

Do not build these in the MVP:

- Multiplayer.
- Chat.
- User-generated stall names visible online.
- Image uploads.
- Public leaderboards.
- 20+ cities.
- 100+ foods.
- Paid loot boxes.
- Real brand references.
- Real restaurant references.
- Complex story mode.
- 3D graphics.

---

## 7. Game Economy

### 7.1 Currencies

Use only two currencies in MVP.

| Currency | Purpose | Earned From | Monetized? |
|---|---|---|---|
| Coins | Main upgrades | Customers, offline earnings, rush hour | No direct purchase at MVP |
| Gems | Premium boosts/cosmetics | Daily rewards, milestones, ads, IAP later | Yes later |

Avoid adding too many currencies early.

### 7.2 Coin Sources

- Serving customers.
- Combo bonuses.
- Rush hour rewards.
- Offline earnings.
- Daily challenge.
- Food critic bonus.

### 7.3 Coin Sinks

- Food upgrades.
- Equipment upgrades.
- Stall upgrades.
- Staff hiring.
- Staff upgrades.
- Location unlock fees.

### 7.4 Gem Sources

- Daily login.
- Achievement rewards.
- Rewarded ads.
- Milestones.
- Optional purchase later.

### 7.5 Gem Sinks

- Cosmetic stall skins.
- Staff outfits.
- Temporary boosts.
- Rush hour retry.
- Special decorations.

### 7.6 Economy Principle

The first 10 minutes should be fast. The player should unlock upgrades frequently.

Early upgrade pacing target:

| Time Played | Expected Progress |
|---:|---|
| 0–1 min | First customer served, first coins earned |
| 1–2 min | First upgrade bought |
| 2–4 min | Second food unlocked |
| 4–6 min | First rush hour triggered |
| 6–10 min | First staff member previewed or hired |

---

## 8. Food System

### 8.1 Food Attributes

Each food should have:

| Attribute | Description |
|---|---|
| id | Unique food ID |
| name | Display name |
| icon | Sprite key |
| unlockCost | Coins required to unlock |
| basePrice | Starting sale price |
| prepTime | Time to prepare |
| level | Current upgrade level |
| maxLevel | Maximum upgrade level |
| popularity | Affects order frequency |
| category | Main, side, drink, dessert |

### 8.2 MVP Food Data Example

```json
[
  {
    "id": "jerk_chicken",
    "name": "Jerk Chicken",
    "icon": "food_jerk_chicken",
    "unlockCost": 0,
    "basePrice": 10,
    "prepTime": 2.0,
    "level": 1,
    "maxLevel": 50,
    "popularity": 1.0,
    "category": "main"
  },
  {
    "id": "beef_patty",
    "name": "Beef Patty",
    "icon": "food_beef_patty",
    "unlockCost": 120,
    "basePrice": 18,
    "prepTime": 2.5,
    "level": 0,
    "maxLevel": 50,
    "popularity": 0.8,
    "category": "snack"
  }
]
```

### 8.3 Food Upgrade Formula

Simple formula:

```text
foodSellPrice = basePrice * (1 + level * 0.15)
upgradeCost = baseUpgradeCost * (level ^ 1.45)
prepTime = max(minPrepTime, basePrepTime * (1 - level * 0.01))
```

Keep formulas simple and tunable.

### 8.4 Food Categories

- Main dishes.
- Snacks.
- Sides.
- Drinks.
- Festival/event foods later.

### 8.5 Future Food Ideas

Jamaica/Caribbean:

- Escovitch Fish
- Oxtail Plate
- Ackee-Inspired Breakfast Plate
- Roast Breadfruit
- Bammy
- Callaloo Wrap
- Coconut Drops
- Peanut Porridge
- Grilled Corn
- Fish Tea

Global expansion:

- Tacos
- Shawarma
- Ramen
- Arepas
- Bao
- Hot Dogs
- Suya
- Samosa
- Churros
- Kebabs

---

## 9. Customer System

### 9.1 Customer Attributes

Each customer should have:

| Attribute | Description |
|---|---|
| id | Unique customer type ID |
| name | Customer type name |
| sprite | Visual asset key |
| patience | Time before leaving |
| tipMultiplier | Bonus tip amount |
| orderComplexity | Number/type of foods ordered |
| spawnWeight | Relative spawn chance |
| specialBehavior | Optional unique behavior |

### 9.2 MVP Customer Types

| Customer Type | Description | Behavior |
|---|---|---|
| Local Regular | Common customer | Average patience, steady income |
| Tourist | Pays more | Higher tip, longer patience |
| Office Worker | Impatient | Short patience, decent reward |
| Food Critic | Rare | Hard to please, large reputation boost |
| Influencer | Rare | Gives temporary customer traffic boost |

### 9.3 Customer Data Example

```json
[
  {
    "id": "local_regular",
    "name": "Local Regular",
    "sprite": "customer_local_01",
    "patience": 12,
    "tipMultiplier": 1.0,
    "orderComplexity": 1,
    "spawnWeight": 60,
    "specialBehavior": null
  },
  {
    "id": "food_critic",
    "name": "Food Critic",
    "sprite": "customer_critic_01",
    "patience": 8,
    "tipMultiplier": 3.0,
    "orderComplexity": 2,
    "spawnWeight": 3,
    "specialBehavior": "rating_bonus"
  }
]
```

### 9.4 Order Generation

Customers should order from unlocked foods.

Basic logic:

```pseudo
availableFoods = unlockedFoods
orderSize = customer.orderComplexity
order = randomWeightedPick(availableFoods, orderSize, food.popularity)
```

### 9.5 Customer Patience

Customers have a patience timer. If the timer reaches zero:

- Customer leaves.
- No coins earned.
- Reputation may decrease slightly.
- Combo streak resets.

If served quickly:

- Coins earned.
- Tip bonus.
- Combo may increase.
- Reputation may increase.

---

## 10. Serving System

### 10.1 Basic Serving Flow

```text
Customer appears
→ Customer displays food order
→ Player taps food station to prepare food
→ Food timer completes
→ Player taps customer to serve
→ Coins and tips awarded
```

### 10.2 Automation

Staff should reduce manual work over time.

Examples:

- Cook automatically prepares common foods.
- Cashier automatically collects payment.
- Promoter increases customer spawn rate.

### 10.3 Combo System

Serving customers quickly builds combos.

Combo example:

| Combo Count | Bonus |
|---:|---:|
| 3 | +5% coins |
| 5 | +10% coins |
| 10 | +20% coins |
| 20 | +40% coins |

Combo resets when:

- Customer leaves.
- Wrong order served, if wrong-order mechanic exists.
- Timer expires.

For MVP, avoid wrong-order complexity unless it feels fun.

---

## 11. Rush Hour Mode

### 11.1 Purpose

Rush Hour is the active gameplay spike. It creates excitement, skill expression, and shareable moments.

### 11.2 Trigger Conditions

Rush Hour can trigger:

- Every 5–8 minutes of active play.
- After reaching a milestone.
- As a daily challenge.
- From an optional button.

### 11.3 Duration

MVP duration:

```text
45 seconds
```

### 11.4 Rush Hour Gameplay

During Rush Hour:

- Customers spawn faster.
- Patience timers may be shorter.
- Coin rewards are multiplied.
- Combo bonuses matter more.
- Special customers appear more often.

### 11.5 Rewards

Rush Hour rewards:

- Coins.
- Gems, sometimes.
- Reputation boost.
- Event points later.
- Share card after great performance.

### 11.6 Rush Hour Result Screen

Show:

- Customers served.
- Coins earned.
- Best combo.
- Rating.
- Bonus reward.
- Optional rewarded ad to double rewards.

Example:

```text
RUSH HOUR COMPLETE!
Customers Served: 42
Best Combo: 16
Coins Earned: 3,480
Rating: 4.8 Stars
[Claim] [Watch Ad: 2x]
```

### 11.7 Performance Grades

| Grade | Requirement |
|---|---|
| S | 90%+ served, high combo |
| A | 75%+ served |
| B | 50%+ served |
| C | Under 50% served |

---

## 12. Staff System

### 12.1 Purpose

Staff create automation and long-term progression.

### 12.2 MVP Staff Types

| Staff | Function | Upgrade Effect |
|---|---|---|
| Cook | Prepares food faster | Reduces prep time |
| Cashier | Serves/collects faster | Increases service speed/tips |
| Promoter | Attracts customers | Increases spawn rate/reputation |

### 12.3 Future Staff Types

| Staff | Function |
|---|---|
| Cleaner | Protects reputation |
| Manager | Boosts offline earnings |
| Delivery Rider | Adds delivery income |
| Event Host | Boosts festival rewards |
| Recipe Expert | Improves food prices |

### 12.4 Staff Attributes

| Attribute | Description |
|---|---|
| id | Unique staff ID |
| name | Display name |
| role | Cook, cashier, promoter, etc. |
| unlockCost | Coins/gems required |
| level | Current level |
| maxLevel | Maximum level |
| effectType | What stat is modified |
| effectValue | Modifier amount |
| sprite | Asset key |

### 12.5 Staff Data Example

```json
[
  {
    "id": "starter_cook",
    "name": "Grill Cook",
    "role": "cook",
    "unlockCost": 500,
    "level": 0,
    "maxLevel": 25,
    "effectType": "prep_time_reduction",
    "effectValue": 0.05,
    "sprite": "staff_cook_01"
  }
]
```

### 12.6 Staff Upgrade Formula

```text
staffUpgradeCost = baseCost * (level ^ 1.6)
staffEffect = baseEffect + (level * effectGrowth)
```

---

## 13. Stall Upgrade System

### 13.1 Purpose

The stall upgrade path creates visual progression.

### 13.2 MVP Stall Levels

| Level | Visual | Gameplay Bonus |
|---:|---|---|
| 1 | Wooden cart | Base income |
| 2 | Better grill | +10% prep speed |
| 3 | Menu board | +10% customer spawn |
| 4 | Neon sign | +15% tips |
| 5 | Covered stall | +20% reputation gain |
| 6 | Food truck | +30% income |
| 7 | Mini restaurant | Unlock next location |

### 13.3 Upgrade Requirements

Each stall upgrade may require:

- Coins.
- Certain reputation level.
- Certain number of foods unlocked.
- Certain rush hour grade.

Example:

```json
{
  "level": 4,
  "name": "Neon Sign",
  "cost": 2500,
  "requirements": {
    "reputation": 2.5,
    "foodsUnlocked": 3
  },
  "bonus": {
    "tipMultiplier": 1.15
  }
}
```

---

## 14. Reputation System

### 14.1 Purpose

Reputation gives players a quality/status goal beyond money.

### 14.2 Reputation Inputs

Reputation increases from:

- Serving customers quickly.
- Completing rush hour.
- Satisfying food critics.
- Unlocking menu variety.
- Keeping customers from leaving.

Reputation decreases from:

- Customers leaving.
- Failed rush hour.
- Slow service.

### 14.3 Rating Display

Show a star rating from 1.0 to 5.0.

Example:

```text
Kingston Night Market Rating: 4.6 ★
```

### 14.4 Reputation Effects

Higher reputation:

- Increases customer spawn rate.
- Unlocks special customers.
- Unlocks festivals.
- Unlocks locations.
- Increases tips.

### 14.5 Simple Formula

```text
rating = clamp(1.0 + reputationPoints / 1000, 1.0, 5.0)
```

Tune later.

---

## 15. Offline Earnings

### 15.1 Purpose

Offline earnings improve retention. Players return to collect progress.

### 15.2 Offline Earnings Popup

When player returns:

```text
While you were away, your stall earned:
$14,250
[Claim] [Watch Ad: 2x]
```

### 15.3 Formula

```text
offlineTime = currentTime - lastSaveTime
effectiveTime = min(offlineTime, offlineEarningsCap)
offlineEarnings = incomePerMinute * effectiveTimeInMinutes * offlineMultiplier
```

### 15.4 MVP Cap

Set cap to:

```text
4 hours
```

Upgrade later through staff/manager upgrades.

---

## 16. Daily Rewards and Retention

### 16.1 Daily Login Reward

A 7-day cycle.

Example:

| Day | Reward |
|---:|---|
| 1 | Coins |
| 2 | Gems |
| 3 | Food boost |
| 4 | Coins |
| 5 | Gems |
| 6 | Rush hour ticket |
| 7 | Cosmetic/decor item |

### 16.2 Daily Challenge

Examples:

- Serve 50 customers.
- Earn 10,000 coins.
- Complete rush hour with A grade.
- Serve 10 tourists.
- Upgrade one food.

### 16.3 Streak Bonus

Reward players for consecutive days.

Do not punish harshly for missing a day. Consider streak freeze later.

---

## 17. Food Festival Events

### 17.1 Purpose

Food festivals provide recurring content and live-ops potential.

### 17.2 MVP Event

First event:

```text
Kingston Jerk Festival
```

Event duration for MVP/prototype:

```text
24 hours or simulated test event
```

### 17.3 Event Gameplay

- Serve event-specific customers.
- Earn festival points.
- Complete milestone rewards.
- Unlock temporary/limited cosmetic.

### 17.4 Future Events

- Jerk Festival
- Patty Challenge
- Seafood Weekend
- Curry Clash
- Sorrel Season
- Night Market Rush
- Global Street Food Cup

### 17.5 Event Rewards

- Coins.
- Gems.
- Stall skins.
- Staff outfits.
- Limited decorations.
- Event trophies.

---

## 18. Location Expansion

### 18.1 MVP Location

Kingston Night Market.

### 18.2 Future Location Progression

Suggested order:

1. Kingston Night Market
2. Montego Bay Beachfront
3. Port of Spain
4. Mexico City
5. New York
6. Lagos
7. Seoul
8. Tokyo
9. Mumbai
10. London

### 18.3 Location Attributes

| Attribute | Description |
|---|---|
| id | Unique location ID |
| name | Display name |
| unlockCost | Coins/reputation required |
| background | Visual background key |
| customerSet | Customer types available |
| foodSet | Foods available |
| incomeMultiplier | Local economy modifier |
| festival | Main event tied to location |

### 18.4 Location Data Example

```json
{
  "id": "kingston_night_market",
  "name": "Kingston Night Market",
  "unlockCost": 0,
  "background": "bg_kingston_night_market",
  "incomeMultiplier": 1.0,
  "startingFoods": ["jerk_chicken", "beef_patty"],
  "festival": "kingston_jerk_festival"
}
```

---

## 19. Viral and Share Features

### 19.1 Shareable Moments

The game needs built-in moments that look good on TikTok/Shorts.

Potential moments:

- Tiny cart becomes food truck.
- Perfect rush hour.
- Food critic gives 5 stars.
- 100 customers served.
- $1 cart becomes $1M empire.
- Rare influencer customer appears.
- Massive combo.

### 19.2 Share Card System

After major achievements, show a share card.

Example:

```text
KINGSTON NIGHT MARKET COMPLETE
Revenue: $1,245,000
Customers Served: 18,430
Best Dish: Jerk Chicken
Rating: 4.9 Stars
```

For MVP, create the UI card only. Actual platform sharing can be added later.

### 19.3 Replay Export Later

Future feature:

- Auto-generate 5–10 second clips of rush hour results.
- Vertical format.
- Watermark with game logo.
- Simple caption.

---

## 20. Monetization Design

### 20.1 Monetization Strategy

Use hybrid monetization carefully.

Recommended order:

1. Rewarded ads.
2. Remove ads purchase.
3. Cosmetic packs.
4. Starter pack.
5. VIP pass.
6. Season pass.

Do not launch with aggressive monetization.

### 20.2 Rewarded Ads

Use for:

- 2x offline earnings.
- 2x rush hour reward.
- Free ingredient crate.
- Temporary income boost.
- Retry rush hour.
- Speed up production.

Rules:

- Rewarded ads must be optional.
- Never trick the player into watching.
- Do not show forced ads in the first 5–10 minutes.

### 20.3 Remove Ads

Only relevant if the game has interstitial ads later.

Potential product:

```text
Remove forced ads forever.
Rewarded ads remain optional.
```

### 20.4 Cosmetic Purchases

Good cosmetic items:

- Stall skins.
- Food truck skins.
- Neon signs.
- Staff outfits.
- Counter decorations.
- Festival themes.
- Customer reaction effects.

Cosmetics are safer than pay-to-win.

### 20.5 Starter Pack

Example:

```text
Starter Chef Pack
- 500 gems
- Rare grill skin
- 2-hour income boost
- Exclusive staff outfit
```

Show after player has completed the tutorial, not immediately.

### 20.6 VIP Pass

Possible benefits:

- Daily gems.
- Bonus offline earnings.
- Extra event attempts.
- Cosmetic rewards.
- Reduced ad friction.

### 20.7 Season Pass

Use after events exist.

Example:

```text
Jerk Festival Season
```

Free track:

- Coins.
- Boosts.
- Basic cosmetics.

Paid track:

- Premium skins.
- Rare recipes.
- Special stall decorations.

### 20.8 Monetization Restrictions

Avoid:

- Paid loot boxes.
- Fake countdowns.
- Confusing purchase buttons.
- Hiding real prices.
- Forced ads after every action.
- Paywalls before the player is hooked.
- Personalized ads for minors.

---

## 21. Legal, Platform, and Content Safety Constraints

### 21.1 No Real Brands

Do not use real restaurants, logos, food companies, drinks, delivery apps, or supermarkets.

Avoid:

- KFC.
- McDonald’s.
- Starbucks.
- Coca-Cola.
- Uber Eats.
- DoorDash.
- GraceKennedy.
- Walkerswood.

Use fictional alternatives only.

### 21.2 No Copied Assets

Do not use copied:

- Food photos.
- Restaurant menu designs.
- Recipe blog text.
- YouTube thumbnails.
- Chef likenesses.
- Real packaging designs.
- Copyrighted music.

Use original art and licensed/self-made audio.

### 21.3 Cultural Respect

Avoid:

- Mocking accents.
- Stereotyping countries.
- Poverty jokes.
- Sacred/religious imagery as jokes.
- Offensive costumes.

Represent cultures through food, market energy, and positive progression.

### 21.4 Children and Privacy

Do not position the game as child-directed.

Avoid:

- “For kids” marketing.
- Public chat.
- User uploads.
- Personal profiles.
- Collecting unnecessary personal data.
- Location access.
- Contacts access.
- Microphone access.

### 21.5 UGC Restrictions

MVP should have no public UGC.

Avoid:

- Public custom stall names.
- Public custom signs.
- User-uploaded images.
- Public comments.
- Direct messages.
- Chat rooms.

If UGC is ever added later, it must include:

- Report feature.
- Block/mute feature.
- Moderation queue.
- Bad word filter.
- Takedown process.
- Terms of service.

---

## 22. UI/UX Design

### 22.1 Main Screen Layout

Portrait screen layout:

```text
Top Bar:
Coins | Gems | Reputation | Settings

Middle:
Street food stall scene
Customers queue in front
Food stations visible
Staff visible

Bottom Bar:
Recipes | Upgrades | Staff | Events | Shop
```

### 22.2 Main Screen Elements

- Coin counter.
- Gem counter.
- Reputation stars.
- Customer queue.
- Food preparation station.
- Upgrade notification badge.
- Rush hour timer/button.
- Daily reward indicator.

### 22.3 Upgrade Screen

Tabs:

- Stall.
- Food.
- Equipment.
- Staff.

Each upgrade card should show:

- Name.
- Current level.
- Benefit.
- Cost.
- Buy button.
- Locked/unlocked state.

### 22.4 Recipe Screen

Each recipe card shows:

- Food icon.
- Name.
- Level.
- Sell price.
- Prep time.
- Upgrade cost.

### 22.5 Staff Screen

Each staff card shows:

- Staff sprite.
- Name.
- Role.
- Level.
- Effect.
- Hire/upgrade cost.

### 22.6 Event Screen

Shows:

- Current festival.
- Time remaining.
- Event points.
- Reward milestones.
- Start rush/event button.

### 22.7 Shop Screen

MVP can show placeholder items:

- Rewarded ad boost.
- Cosmetic coming soon.
- Remove ads coming soon.

Do not connect real payments until the game loop is tested.

---

## 23. Tutorial Design

### 23.1 Tutorial Rules

- Keep it under 60 seconds.
- Use hand pointers or highlights.
- Do not use long dialogue.
- Let the player act quickly.

### 23.2 Tutorial Steps

1. Highlight first customer.
2. Show order bubble.
3. Highlight jerk chicken station.
4. Player taps to cook.
5. Food completes.
6. Highlight customer to serve.
7. Coins appear.
8. Highlight upgrade button.
9. Player buys first grill upgrade.
10. Tutorial ends with next goal.

### 23.3 Tutorial Text Examples

Keep text short:

```text
Tap the grill to cook.
Serve the customer.
Nice. Upgrade your grill.
More customers are coming.
```

---

## 24. Art Direction

### 24.1 Style

- Bright 2D cartoon.
- Clean silhouettes.
- High readability.
- Warm market lighting.
- Satisfying upgrade visuals.

### 24.2 Visual Mood

Kingston Night Market should feel:

- Busy.
- Colorful.
- Safe.
- Energetic.
- Food-focused.
- Night-market inspired.

### 24.3 Asset List for MVP

Characters:

- 5 customer sprites.
- 3 staff sprites.
- 1 vendor/player avatar, optional.

Food:

- 6 food icons.
- 6 prepared food sprites, if needed.

Environment:

- 1 background.
- 7 stall upgrade visuals.
- 3 food station visuals.

UI:

- Coin icon.
- Gem icon.
- Star icon.
- Upgrade button.
- Recipe cards.
- Staff cards.
- Event panel.
- Rush hour result screen.

Effects:

- Coin popups.
- Combo text.
- Rating stars.
- Rush hour banner.
- Upgrade sparkle.

### 24.4 Animation

Keep simple:

- Customer idle bounce.
- Customer walk in/out.
- Food cooking progress bar.
- Coin fly-to-counter animation.
- Upgrade pop effect.
- Rush hour screen shake, very light.

---

## 25. Audio Direction

### 25.1 Music

Use original or licensed music only.

Style:

- Upbeat.
- Light Caribbean inspiration.
- Loop-friendly.
- Not too distracting.

Avoid copying real songs, riddims, samples, or popular tracks.

### 25.2 Sound Effects

Needed SFX:

- Tap.
- Coin collect.
- Food ready.
- Customer served.
- Customer angry/leave.
- Upgrade purchased.
- Rush hour start.
- Rush hour complete.
- Daily reward claim.

### 25.3 Audio Settings

Include:

- Music toggle.
- SFX toggle.
- Volume sliders, optional.

---

## 26. Technical Implementation Guidance for Codex

### 26.1 Recommended Prototype Structure

If using Phaser 3:

```text
/src
  /scenes
    BootScene.js
    PreloadScene.js
    MainGameScene.js
    UIScene.js
  /systems
    SaveSystem.js
    EconomySystem.js
    CustomerSystem.js
    FoodSystem.js
    StaffSystem.js
    UpgradeSystem.js
    RushHourSystem.js
    OfflineEarningsSystem.js
    DailyRewardSystem.js
  /data
    foods.json
    customers.json
    staff.json
    upgrades.json
    locations.json
  /ui
    Button.js
    UpgradeCard.js
    RecipeCard.js
    StaffCard.js
    Popup.js
  /utils
    formatNumber.js
    timeUtils.js
    randomWeighted.js
```

### 26.2 Core Game State

```json
{
  "coins": 0,
  "gems": 0,
  "reputationPoints": 0,
  "currentLocationId": "kingston_night_market",
  "foods": {
    "jerk_chicken": { "unlocked": true, "level": 1 },
    "beef_patty": { "unlocked": false, "level": 0 }
  },
  "staff": {
    "starter_cook": { "hired": false, "level": 0 }
  },
  "stallLevel": 1,
  "lastSaveTimestamp": 0,
  "dailyReward": {
    "lastClaimDate": null,
    "streak": 0
  },
  "stats": {
    "totalCustomersServed": 0,
    "totalCoinsEarned": 0,
    "bestRushCombo": 0
  }
}
```

### 26.3 Save System Requirements

Use local storage for prototype.

Save:

- Coins.
- Gems.
- Food levels.
- Staff levels.
- Stall level.
- Reputation.
- Last save timestamp.
- Daily reward state.
- Basic stats.

Save triggers:

- Every 10–30 seconds.
- On upgrade purchase.
- On app pause/visibility change.
- On scene shutdown.

### 26.4 Offline Earnings System

On load:

```pseudo
lastSave = gameState.lastSaveTimestamp
now = Date.now()
offlineMs = now - lastSave
offlineMinutes = min(offlineMs / 60000, offlineCapMinutes)
incomePerMinute = calculateIncomePerMinute(gameState)
earnings = incomePerMinute * offlineMinutes * offlineMultiplier
showOfflinePopup(earnings)
```

Do not simulate every customer while offline.

### 26.5 Customer Spawn System

```pseudo
spawnInterval = baseSpawnInterval / customerSpawnMultiplier
if timeSinceLastSpawn >= spawnInterval and queueNotFull:
    customerType = weightedRandom(customerTypes)
    order = generateOrder(customerType, unlockedFoods)
    spawnCustomer(customerType, order)
```

### 26.6 Food Preparation System

```pseudo
onFoodStationTapped(foodId):
    if foodIsUnlocked(foodId) and stationIsAvailable(foodId):
        startPrepTimer(foodId)

onPrepComplete(foodId):
    addPreparedFood(foodId, 1)
    showReadyIndicator(foodId)
```

### 26.7 Serving System

```pseudo
onCustomerTapped(customer):
    if preparedFoods include customer.order:
        removePreparedFoods(customer.order)
        reward = calculateOrderReward(customer.order, customer, combo)
        addCoins(reward)
        increaseReputation(customer)
        incrementCombo()
        despawnCustomer(customer, served=true)
    else:
        showMissingFoodFeedback()
```

### 26.8 Staff Automation System

```pseudo
for each hired staff:
    applyStaffEffect(staff)
```

Examples:

- Cook reduces prep time.
- Cashier increases tips or auto-serves a ready order every X seconds.
- Promoter reduces customer spawn interval.

Keep automation simple in MVP.

### 26.9 Rush Hour System

```pseudo
startRushHour():
    isRushHour = true
    timer = 45 seconds
    spawnMultiplier = 2.0
    coinMultiplier = 2.0
    resetRushStats()

updateRushHour(delta):
    timer -= delta
    if timer <= 0:
        endRushHour()

endRushHour():
    isRushHour = false
    calculateRushGrade()
    showRushResultPopup()
```

### 26.10 Number Formatting

Use readable formatting:

```text
1,250
12.4K
1.8M
3.2B
```

Implement `formatNumber()` early.


### 26.11 Recommended Tech Stack Decision

Codex should treat the tech stack as follows unless the user explicitly changes direction in a later chat.

#### Preferred First Build: Phaser 3 Prototype

Use this when the goal is to vibe code quickly, test the gameplay loop, and run the game in a browser first.

Recommended stack:

```text
Phaser 3
TypeScript preferred, JavaScript acceptable if setup is simpler
Vite or a simple Phaser starter template
LocalStorage for save/load prototype
JSON files for tunable game data
Portrait-first responsive canvas
```

Why this stack is recommended for the first version:

- Codex can generate and modify it quickly.
- It is easy to test in a browser.
- It does not require a heavy editor.
- It is suitable for a low-end PC.
- It supports fast iteration on systems, UI, balance, and game feel.

#### Production Option: Godot 4

Use this later if the prototype proves fun and the user wants a more native mobile-focused build.

Recommended stack:

```text
Godot 4
GDScript
2D scenes only
Resource/config-driven gameplay data
Android export first
```

Why Godot may be useful later:

- Strong 2D workflow.
- Good mobile export path.
- Cleaner visual scene editing.
- Good for a more polished app-store version.

#### Final Stack Instruction for Codex

For the first coded version, Codex should assume:

```text
Build the MVP prototype in Phaser 3 first.
Use a clean, modular TypeScript/JavaScript codebase.
Do not start with Godot unless the user explicitly requests Godot.
Do not build in Unity unless the user explicitly requests Unity.
```

---

### 26.12 Project Codebase Organization Standard

Codex must keep the project files organized like a regular game development codebase. The project should never become a flat folder full of random scripts.

The codebase should be organized by responsibility:

- Scenes/screens belong in a `scenes` folder.
- Gameplay logic belongs in `systems` or `managers`.
- Reusable entities belong in `entities` or `objects`.
- UI components belong in `ui`.
- Game data belongs in `data` as JSON/config files.
- Art/audio assets belong in `assets`.
- Utility helpers belong in `utils`.
- Constants/types belong in `config` or `types`.
- Save/data persistence belongs in a dedicated save module.

Codex should create folders before creating new files when a feature does not already have the correct location.

#### Required Phaser Prototype Structure

Use this folder structure for the Phaser 3 prototype unless a starter template requires minor naming differences:

```text
street-food-empire/
  package.json
  index.html
  README.md
  /public
    /assets
      /images
        /foods
        /customers
        /stalls
        /ui
        /backgrounds
      /audio
        /music
        /sfx
      /fonts
  /src
    main.ts or main.js
    /config
      GameConfig.ts
      BalanceConfig.ts
      Constants.ts
    /scenes
      BootScene.ts
      PreloadScene.ts
      MainGameScene.ts
      UIScene.ts
      MenuScene.ts
    /systems
      SaveSystem.ts
      EconomySystem.ts
      CustomerSystem.ts
      FoodSystem.ts
      StaffSystem.ts
      UpgradeSystem.ts
      RushHourSystem.ts
      OfflineEarningsSystem.ts
      DailyRewardSystem.ts
      ReputationSystem.ts
      AnalyticsStub.ts
    /entities
      Customer.ts
      FoodStation.ts
      Stall.ts
      StaffMember.ts
      CoinPopup.ts
    /ui
      Button.ts
      UpgradeCard.ts
      RecipeCard.ts
      StaffCard.ts
      ProgressBar.ts
      Popup.ts
      Toast.ts
      CurrencyDisplay.ts
    /data
      foods.json
      customers.json
      staff.json
      upgrades.json
      locations.json
      dailyRewards.json
      events.json
    /types
      GameState.ts
      FoodTypes.ts
      CustomerTypes.ts
      StaffTypes.ts
      UpgradeTypes.ts
    /utils
      formatNumber.ts
      timeUtils.ts
      randomWeighted.ts
      clamp.ts
      eventBus.ts
```

If using JavaScript instead of TypeScript, use the same structure with `.js` files.

#### Required Godot Production Structure

If the project is later moved to Godot 4, use this organization:

```text
street-food-empire-godot/
  project.godot
  /scenes
    /core
    /ui
    /gameplay
    /menus
  /scripts
    /systems
    /entities
    /ui
    /utils
  /assets
    /images
      /foods
      /customers
      /stalls
      /ui
      /backgrounds
    /audio
      /music
      /sfx
    /fonts
  /data
    foods.json
    customers.json
    staff.json
    upgrades.json
    locations.json
    daily_rewards.json
    events.json
  /autoload
    SaveManager.gd
    GameState.gd
    EventBus.gd
```

#### File Organization Rules for Codex

Codex must follow these rules:

1. Do not place unrelated logic in one large file.
2. Do not put all gameplay logic inside `MainGameScene`.
3. Do not hardcode balancing values directly inside scene files.
4. Do not mix UI rendering, save logic, economy formulas, and customer spawning in the same module.
5. Do not create duplicate files with similar names unless there is a clear reason.
6. Do not abandon existing architecture when adding features.
7. Do not rename folders or major files without explaining why.
8. Keep feature files small enough to understand and modify.
9. Prefer data-driven content for foods, upgrades, customers, staff, locations, rewards, and events.
10. Keep placeholder assets in the correct asset folders even if they are simple shapes or temporary images.

#### Feature Implementation Pattern

When Codex adds a new feature, it should usually follow this pattern:

```text
1. Add or update data/config.
2. Add or update the relevant system.
3. Add or update entities if needed.
4. Add or update UI components if needed.
5. Wire the feature into the scene.
6. Update save/load if the feature has persistent state.
7. Update README or implementation notes if setup changes.
```

Example:

```text
Feature: Staff upgrades
Data: /src/data/staff.json
Types: /src/types/StaffTypes.ts
System: /src/systems/StaffSystem.ts
UI: /src/ui/StaffCard.ts
Scene wiring: /src/scenes/MainGameScene.ts or /src/scenes/UIScene.ts
Save state: /src/systems/SaveSystem.ts
```

#### README Requirement

Codex should maintain a `README.md` that includes:

- Project title.
- Tech stack.
- How to install dependencies.
- How to run the project locally.
- Current implemented features.
- Known missing features.
- Folder structure summary.

#### Codebase Health Requirement

Before each major feature is considered complete, Codex should check:

```text
Does this file belong in this folder?
Is this logic in the correct system?
Can balance values be changed without editing core scene code?
Does save/load include the new persistent state?
Did this feature create unnecessary coupling?
```

If the answer is no, Codex should refactor before moving on.

---

## 27. Balancing Defaults

### 27.1 Initial Values

| Setting | Value |
|---|---:|
| Starting coins | 0 |
| Starting gems | 0–10 |
| Base customer spawn interval | 5 seconds |
| Max queue size | 5 customers |
| Jerk chicken base price | 10 coins |
| Jerk chicken prep time | 2 seconds |
| First upgrade cost | 50 coins |
| First new food cost | 120 coins |
| First staff cost | 500 coins |
| Rush hour duration | 45 seconds |
| Offline cap | 4 hours |

### 27.2 Early Upgrade Costs

Example:

| Upgrade | Cost |
|---|---:|
| Grill Level 2 | 50 |
| Grill Level 3 | 120 |
| Unlock Beef Patty | 120 |
| Menu Board | 300 |
| Hire Cook | 500 |
| Stall Level 2 | 750 |
| Unlock Fried Dumpling | 1,000 |

### 27.3 Balance Principle

During early play, the player should almost always have a visible short-term goal.

Good:

```text
I need 120 coins to unlock beef patty.
```

Bad:

```text
I need 20,000 coins and have no idea how long it will take.
```

---

## 28. Analytics and Testing

### 28.1 MVP Analytics Events

Track these later when analytics are added:

| Event | Purpose |
|---|---|
| tutorial_start | See how many players begin onboarding |
| tutorial_complete | Measure onboarding completion |
| first_upgrade | See if players reach first upgrade |
| food_unlocked | Track recipe progression |
| staff_hired | Track automation engagement |
| rush_hour_started | Track active event interest |
| rush_hour_completed | Track completion |
| offline_earnings_claimed | Track return behavior |
| rewarded_ad_clicked | Track ad interest |
| session_start | Measure sessions |
| session_end | Measure session length |

### 28.2 Important Metrics

| Metric | Meaning |
|---|---|
| Day 1 retention | Are players returning tomorrow? |
| Day 7 retention | Is the game sticky? |
| Average session length | Are players playing long enough? |
| Tutorial completion | Is onboarding too slow/confusing? |
| First upgrade rate | Is progression clear? |
| Rush hour replay rate | Is active gameplay fun? |
| Rewarded ad watch rate | Are ad rewards attractive? |

### 28.3 Testing Questions

After prototype, answer:

1. Is serving customers satisfying?
2. Do upgrades feel meaningful?
3. Is rush hour fun or stressful?
4. Do players understand what to do next?
5. Does the game feel too slow?
6. Do players want to return after leaving?
7. Is the Caribbean/Jamaican identity clear and respectful?

---

## 29. Success Potential

### 29.1 Realistic Outcome Ranges

| Outcome | Meaning | Chance |
|---|---|---:|
| Small success | A few thousand downloads, learning, small revenue | Medium-High |
| Solid indie success | 50K–500K downloads with good retention/marketing | Medium |
| Major success | 1M+ downloads with strong content and updates | Low-Medium |
| Top downloaded game | Major breakout hit | Low |

### 29.2 What Increases Success Chance

- Fast first session.
- Clear hook.
- Strong visual identity.
- Satisfying upgrades.
- Good rush hour mechanic.
- Daily rewards/events.
- Rewarded ads that feel fair.
- TikTok/Shorts-friendly moments.
- Frequent updates.

### 29.3 Main Threats to Success

- Game feels like generic cooking tycoon.
- Progression becomes too slow.
- Too many forced ads.
- Weak visual identity.
- No viral/share moments.
- Too much scope before MVP.
- Poor low-end performance.

---

## 30. Development Roadmap

### Phase 1 — Core Prototype

Goal:

> Prove serving customers and upgrading the stall is fun.

Build:

- Main game scene.
- Customer spawning.
- One food.
- Basic serving.
- Coins.
- One upgrade.
- Save/load.

Acceptance Criteria:

- Player can serve customers.
- Player earns coins.
- Player can buy an upgrade.
- Progress saves and loads.

---

### Phase 2 — MVP Gameplay

Goal:

> Create a complete short-session loop.

Build:

- 6 foods.
- Food upgrades.
- Stall upgrades.
- 3 staff types.
- Rush hour.
- Offline earnings.
- Daily rewards.

Acceptance Criteria:

- Player can play for 10 minutes without running out of goals.
- Rush hour works.
- Staff provide automation.
- Offline earnings work.

---

### Phase 3 — Polish and Retention

Goal:

> Make the game feel complete enough for testing.

Build:

- Better UI.
- Better animations.
- Sound effects.
- Daily challenge.
- Basic event screen.
- Share card UI.
- Settings screen.

Acceptance Criteria:

- Game feels clear and polished.
- Player always sees a next goal.
- UI works on mobile portrait sizes.

---

### Phase 4 — Soft Launch Prep

Goal:

> Prepare for real user testing.

Build:

- Analytics.
- Rewarded ad integration.
- Privacy policy.
- App store assets.
- Crash logging.
- Balance tuning.

Acceptance Criteria:

- Game runs on low-end Android.
- No major crashes.
- Basic metrics are tracked.
- Ads are optional and functional.

---

### Phase 5 — Growth

Goal:

> Add content and scale if metrics are good.

Build:

- New locations.
- New foods.
- Festivals.
- Cosmetics.
- VIP/season pass.
- Creator marketing campaign.

Acceptance Criteria:

- Players return for events.
- Content updates are easy to add.
- Monetization does not damage retention.

---

## 31. Codex Build Rules

### 31.1 General Rules

Codex should build the game incrementally.

Do not create a huge system all at once. Build one working feature at a time.

Recommended order:

1. Project setup.
2. Main game scene.
3. Customer spawn.
4. Food preparation.
5. Serving and coin reward.
6. Upgrade system.
7. Save/load.
8. Multiple foods.
9. Staff automation.
10. Rush hour.
11. Offline earnings.
12. Daily rewards.
13. UI polish.

### 31.2 Code Quality Requirements

- Use clear file names.
- Keep data in JSON/config files when possible.
- Do not hardcode all values inside scene files.
- Separate systems from UI.
- Use functions for reward calculation, upgrade costs, and formatting.
- Keep formulas easy to tune.
- Add comments only where useful.

### 31.3 MVP Coding Restrictions

Do not add:

- Multiplayer.
- Authentication.
- Online backend.
- Real IAP.
- Real ads before placeholder buttons work.
- AI features.
- Public UGC.
- Social login.
- Cloud save.

### 31.4 Placeholder Policy

Use placeholder art and simple shapes if needed.

Examples:

- Colored rectangles for stalls.
- Circles for customers.
- Emoji/text food icons during prototype.
- Simple buttons.

Gameplay matters first. Art can be replaced later.

### 31.5 Mobile Responsiveness

The UI should scale for portrait screens.

Target baseline:

```text
1080x1920 portrait
```

Also test:

```text
720x1280 portrait
```

---

## 32. Initial Content Tables

### 32.1 MVP Foods Table

| ID | Name | Unlock Cost | Base Price | Prep Time | Category |
|---|---|---:|---:|---:|---|
| jerk_chicken | Jerk Chicken | 0 | 10 | 2.0s | Main |
| beef_patty | Beef Patty | 120 | 18 | 2.5s | Snack |
| fried_dumpling | Fried Dumpling | 350 | 25 | 3.0s | Side |
| festival | Festival | 750 | 40 | 3.5s | Side |
| curry_goat_bowl | Curry Goat Bowl | 1500 | 70 | 4.5s | Main |
| sorrel_drink | Sorrel Drink | 2500 | 90 | 3.0s | Drink |

### 32.2 MVP Staff Table

| ID | Name | Role | Unlock Cost | Effect |
|---|---|---|---:|---|
| grill_cook | Grill Cook | Cook | 500 | -5% prep time per level |
| quick_cashier | Quick Cashier | Cashier | 1200 | +5% tips per level |
| street_promoter | Street Promoter | Promoter | 2500 | +5% customer spawn rate per level |

### 32.3 MVP Customer Table

| ID | Name | Patience | Tip Multiplier | Spawn Weight |
|---|---|---:|---:|---:|
| local_regular | Local Regular | 12s | 1.0x | 60 |
| tourist | Tourist | 15s | 1.5x | 20 |
| office_worker | Office Worker | 8s | 1.2x | 15 |
| food_critic | Food Critic | 8s | 3.0x | 3 |
| influencer | Influencer | 10s | 2.0x | 2 |

### 32.4 MVP Stall Upgrade Table

| Level | Name | Cost | Bonus |
|---:|---|---:|---|
| 1 | Wooden Cart | 0 | Base |
| 2 | Better Grill | 750 | +10% prep speed |
| 3 | Menu Board | 2000 | +10% customer spawn |
| 4 | Neon Sign | 5000 | +15% tips |
| 5 | Covered Stall | 12000 | +20% reputation gain |
| 6 | Food Truck | 30000 | +30% income |
| 7 | Mini Restaurant | 75000 | Unlock next location later |

---

## 33. Sample User Stories

### 33.1 Customer Serving

As a player, I want to serve customers quickly so that I can earn coins and build combos.

Acceptance criteria:

- Customers appear with visible orders.
- Player can prepare the required food.
- Player can serve customer when food is ready.
- Coins increase after service.
- Customer leaves after service.

### 33.2 Food Upgrade

As a player, I want to upgrade foods so that each order earns more coins.

Acceptance criteria:

- Food has visible level.
- Upgrade button shows cost.
- Upgrade is disabled if player lacks coins.
- Upgrade increases sell price.
- Game saves upgraded level.

### 33.3 Staff Hiring

As a player, I want to hire staff so that my stall becomes more automated.

Acceptance criteria:

- Staff appears locked before purchase.
- Player can hire staff with coins.
- Staff effect applies after hiring.
- Staff can be upgraded.
- Staff state saves and loads.

### 33.4 Rush Hour

As a player, I want rush hour to create a fast challenge with bigger rewards.

Acceptance criteria:

- Rush hour starts from button or trigger.
- Customers spawn faster.
- Timer counts down.
- Rewards are calculated at end.
- Result popup appears.

### 33.5 Offline Earnings

As a player, I want to earn while away so that returning feels rewarding.

Acceptance criteria:

- Game stores last save time.
- On return, game calculates offline time.
- Offline earnings popup appears.
- Player can claim earnings.
- Earnings cap is respected.

---

## 34. Risks and Mitigations

### 34.1 Scope Risk

Risk:

The project becomes too large.

Mitigation:

Build only Kingston Night Market first. No multiplayer, no UGC, no 3D.

### 34.2 Retention Risk

Risk:

Game becomes boring.

Mitigation:

Rush hour, staff automation, daily rewards, visible upgrades, events.

### 34.3 Monetization Risk

Risk:

Ads and purchases annoy players.

Mitigation:

Use optional rewarded ads first. Avoid forced ads early.

### 34.4 Legal Risk

Risk:

Real brands or copied assets create legal problems.

Mitigation:

Use original assets, fictional brands, and generic food names.

### 34.5 Cultural Risk

Risk:

Cultural representation feels disrespectful.

Mitigation:

Keep focus on food, markets, positive progression, and respectful visuals.

### 34.6 Performance Risk

Risk:

Too many objects lag on low-end phones.

Mitigation:

Use object pooling, simple sprites, limited particles, and no heavy physics.

---

## 35. Naming Notes

Working title:

```text
Street Food Empire: Kingston Rush
```

Other possible titles:

- Street Food Empire
- Kingston Food Rush
- Street Cart Empire
- Night Market Tycoon
- Food Cart Empire
- Global Street Food Tycoon

Recommended MVP name:

```text
Street Food Empire: Kingston Rush
```

Reason:

It is specific, marketable, and communicates both the food tycoon concept and the Jamaican starting identity.

---

## 36. Final MVP Definition

The first playable version is successful if the player can:

1. Open the game.
2. Serve customers.
3. Earn coins.
4. Upgrade the stall.
5. Unlock foods.
6. Hire staff.
7. Complete rush hour.
8. Leave and return to offline earnings.
9. Understand the next goal at all times.
10. Play for 10 minutes without confusion or boredom.

The MVP does not need to be beautiful. It needs to be clear, satisfying, and expandable.

---

## 37. Final Direction

Build **Street Food Empire: Kingston Rush** as a simple but expandable 2D hybrid-casual tycoon.

Core identity:

```text
Jamaican street food cart → chaotic rush hour → satisfying upgrades → global food empire
```

Core mechanic:

```text
Serve customers fast, earn money, upgrade everything, unlock more food, and expand.
```

Core development rule:

```text
Build the smallest fun version first. Add content only after the loop works.
```

---

## 38. Instruction for Future ChatGPT Review Instance — Codex Ignore This Section

**Codex must ignore this section. This section is not an implementation requirement for the game.**

This section is written for the next ChatGPT instance that may continue the project in a new chat.

The user plans to work with Codex. Codex may return implementation plans, file plans, architecture plans, or proposed coding steps for approval or denial. The next ChatGPT instance should act as the user's technical/product reviewer before the user approves Codex plans.

### 38.1 Role of the Next ChatGPT Instance

The next ChatGPT instance should review Codex's proposed plans against this GDD and decide whether the user should approve, deny, or request changes.

The review should check:

- Whether Codex follows the MVP scope.
- Whether Codex uses the recommended tech stack unless the user changed it.
- Whether Codex keeps the project files organized like a normal game development codebase.
- Whether Codex avoids overbuilding.
- Whether Codex separates scenes, systems, UI, data, entities, utilities, and assets properly.
- Whether Codex avoids risky features such as multiplayer, public UGC, real ads, real IAP, authentication, and online backend during MVP.
- Whether Codex preserves low-end Android performance goals.
- Whether Codex keeps the game data-driven through JSON/config where practical.
- Whether Codex is building one working feature at a time.

### 38.2 How the Next ChatGPT Instance Should Respond to Codex Plans

When the user pastes a Codex plan, the next ChatGPT instance should respond in this structure:

```text
Decision: Approve / Approve with changes / Deny

Reason:
- Short explanation.

Required Changes:
- Specific changes Codex must make before coding.

Risks:
- Any scope, architecture, legal, platform, performance, or monetization risks.

Suggested Reply to Codex:
- A clear message the user can paste back to Codex.
```

### 38.3 Approval Standard

Approve Codex plans only if they are:

- Small enough to implement safely.
- Aligned with the MVP.
- Properly organized.
- Easy to test.
- Consistent with the chosen stack.
- Not adding unnecessary complexity.

Deny or request changes if Codex tries to add:

- Multiplayer.
- Cloud saves.
- Account login.
- User-generated public content.
- Real-money purchases too early.
- Real ads before gameplay is tested.
- Complex 3D systems.
- Giant all-in-one files.
- Hardcoded content that should be data-driven.
- Features outside the current roadmap phase.

### 38.4 Default Review Bias

The next ChatGPT instance should bias toward:

```text
Small working increments over large ambitious plans.
Clean architecture over quick messy hacks.
Playable MVP first, polish later.
Data-driven systems over hardcoded content.
Low-end device performance over visual excess.
```

### 38.5 Suggested Message if Codex Overbuilds

If Codex proposes too much, the next ChatGPT instance can suggest this reply:

```text
Do not build all of that yet. Reduce the scope to the next smallest playable increment. Follow the GDD architecture and keep files organized by scenes, systems, UI, entities, data, utils, assets, and config. Build only the current feature, add testable behavior, and avoid multiplayer, backend, real ads, real IAP, authentication, and public UGC during MVP.
```

### 38.6 Suggested Message if Codex Uses Poor File Organization

If Codex proposes messy file placement, the next ChatGPT instance can suggest this reply:

```text
Revise the plan before coding. The codebase must follow the GDD project organization standard. Put scenes in /src/scenes, gameplay logic in /src/systems, reusable game objects in /src/entities, UI components in /src/ui, tunable content in /src/data, shared types in /src/types, constants/config in /src/config, utilities in /src/utils, and assets in /public/assets. Do not put unrelated systems into one large file.
```

