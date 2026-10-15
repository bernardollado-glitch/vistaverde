# VistaVerde

| | |
|---|---|
| Public experience title | VistaVerde — working title. IP & Content Policy self-check: TBD: not discussed yet. |
| Deployment target | Decentraland World; proposed NAME: vistaverde. Ownership, availability and deployment permission are unverified. |
| Studio / team name | Vista Verde |
| Date | 2026-10-14 |
| Contact (Discord + email) | Email: bernardo.llado@gmail.com · Discord: irondanu |

## 0. TL;DR

| | |
|---|---|
| **Player promise** | You farm with your community to feed it, while shared crops need care and spoil if nobody harvests them in time. |
| **Primary player** | For players who enjoy relaxed farming games and want to cooperate with others during short visits. |
| **Current status** | Local cooperative prototype, tested by the creator using desktop and Chrome with two identities; no public playable link verified. |
| **Requested round** | v0 — initial Creator Success proposal. |
| **Live at end of the round** | TBD: agree a small representative vertical-slice scope with Creator Success if selected for V0. The later target is a shared lettuce-and-watermelon farm with watering, automatic sale, proportional rewards, daily goals, cooperative progression, ranking and saved progress. Public deployment remains TBD. |

**Evidence and boundaries.** The creator confirmed shared planting, harvesting and watering across two clients, a five-harvest celebration, and harvest-count recovery after restarting. Four beds, time-based growth, wilting, cleaning, moisture indicators and saving exist. This is a creator self-test, not independent onboarding, retention or load-test evidence.

**Planned systems.** Watering currently plays a short sound and changes the bucket from blue to brown, with one use per planted crop, but does not affect growth. Water-dependent growth, watermelon, currency, seed inventory, automatic sale, contributor histories, daily goals, community levels, ranking and the shared touch menu remain to be built. Mobile readiness and public deployment are unverified. A localhost address is not a public submission link.

## 1. Player Promise

**One-line promise**

> You farm with your community to feed it, while shared crops need care and spoil if nobody harvests them in time.

## 2. First Minutes & How to Play

Intended v0 experience, not a claim that every step already runs. First-use comprehension without guidance remains untested.

| Time | Player experience |
|---|---|
| **0–5 seconds after control** | You see shared circular beds and the community food board. |
| **5–10 seconds** | You plant free lettuce and see a seedling. |
| **10–60 seconds** | You water the crop and see growth. Short introductory cycles are intended; their final duration is postponed. |
| **1–3 minutes** | You harvest when ready; automatic sale rewards the contributors. First-harvest timing still needs testing. |
| **3–10 minutes** | You coordinate care across beds, work toward the community unlock, and choose seeds when available. |
| **Natural stopping point** | Your progress is saved. You see remaining crops and the next daily goal at 00:00 UTC. |

**Player-facing How to Play**

- Plant and water the community's crops.
- Harvest ripe vegetables before they wilt.
- Help another farmer care for shared beds.

## 3. Core Loop

| # | Step (verb) | What the player does (Player input → what they see or hear → what changes) | Why do it again? |
|---|---|---|---|
| 1 | Plant | Use your seed on an empty bed → a seedling appears → the crop becomes shared. | Supply food for the community. |
| 2 | Water | Use the blue bucket once per planted crop → a short sound plays and the bucket turns brown → watering is recorded. TBD: reconcile the planned effect on growth with this one-use rule before implementation. | Care for your crops or another farmer's crops. |
| 3 | Harvest and sell | Harvest a mature crop → the bed clears → automatic sale distributes proceeds and adds community food. | Avoid loss and earn seed money. |
| 4 | Choose seeds | Use personal currency to buy an unlocked seed variety → choose its rhythm → return to planting. | Choose quick lettuce or slower, higher-reward watermelon. |

Seeds are personal inventory; planted crops are shared. Anyone can care for or harvest them. Starter lettuce is free.

| | |
|---|---|
| **One complete loop takes** | Current accelerated demo: 10 seconds to maturity and a 15-second harvest window; one watering is accepted per planted crop without affecting growth. The bucket is blue during growth before use and brown after use. TBD: the planned growth effect must be reconciled with one watering per crop; wilting starts after maturity. Short introductory cycles should encourage continuation, with longer cycles later by crop and progression. TBD: exact growth, moisture and harvest-window durations are postponed until gameplay balance; old timing proposals are not commitments. |
| **Decision, challenge, or expression** | Choose which bed needs care, coordinate a handoff, and harvest before mature food is lost. Dry crops pause instead of failing. |
| **Shortest satisfying visit / typical session** | Mobile target: 3–5-minute visits; optional longer desktop sessions. Neither is measured; typical desktop duration is TBD. Nobody must remain connected throughout growth. |
| **Why repetition 10 differs from repetition 1** | Lettuce is faster; watermelon takes longer and rewards more. Other farmers change care priorities. Sustained replay value is untested. |

**Pillars**

1. Cooperative farming.
2. Biological urgency at harvest.
3. Progression through crop variety.

**Community progression.** Solo cultivation works, but community-level advancement requires cooperation. Provisional first milestone: five successful crops, each with accepted work by at least two distinct players, permanently unlock watermelon for everyone. Each player then buys its seeds with personal currency. This counts crops, not daily food units. Mere presence does not qualify; later levels are TBD: not discussed yet.

## 4. Why Players Come Back

### 4.1 The next-day (D1) sentence

A player returns the next day to help complete the new community food goal, which begins at 00:00 UTC. This is the intended return reason, not measured retention.

### 4.2 The progression chain

Care and cooperative harvest → personal currency and community progress → permanent watermelon unlock → personal seed purchase → a longer, higher-reward growing choice.

| Moment | What persists or has been built? | What becomes possible next? | How can another player tell? |
|---|---|---|---|
| **End of first session** | Current crop state, moisture and harvest totals persist; currency and contribution histories are planned. | Care for or harvest another bed. | Visible crops and shared food progress. |
| **End of first week** | Intended: community unlock and personal currency; timing is not guaranteed. | Buy watermelon seeds after five qualifying cooperative harvests. | New crop variety and the weekly contribution ranking. |
| **Week 3+ — what takes more than two weeks?** | Later stages may add longer-cycle crops, weekly food goals and ranking rewards. | TBD: later-stage progression is not scheduled. | TBD: later-stage presentation is not discussed yet. |

First-week scene: You return to a farm that has unlocked watermelon through cooperation. You buy a seed and plant it for everyone to care for. You choose between a quick lettuce harvest and a longer watermelon investment; the compact ranking shows recognized work.

**Currency.** Automatic sale first repays the seed supplier's actual cost, then splits the remainder by work: planting, the single accepted watering per crop and harvesting each count as one point. Unnecessary watering earns nothing. Offline contributors are paid. Wilted crops give no proceeds or reimbursement. Currency buys seeds; prices, payouts, rounding and further abuse prevention are TBD: balance before implementation.

### 4.3 Two return hooks

| Selected hook | Exact trigger or timing | What the player anticipates | Reminder channel + no-reminder fallback |
|---|---|---|---|
| **1. Daily community food goal** | Resets at 00:00 UTC (21:00 Argentina time). Successful harvests add crop-weighted food; watermelon adds more than lettuce. Values and target remain TBD. | Reach the shared target for one proportional daily bonus. | In-world board and a remembered daily deadline; external reminder channel TBD: not discussed yet. |
| **2. Shared crop care and harvest** | At drying or maturity; timing awaits gameplay balance. | Help care for crops and harvest before food is lost. | Visible crop state and memory of shared work; no push notifications required. |

Food belongs to the UTC day of harvest. The bonus recognizes all accepted work on harvested crops that helped complete the goal, including earlier-day work and offline contributors. It pays once daily. After completion, cultivation and ordinary earnings continue; late arrivals receive no bonus for the completed goal. An incomplete goal gives no bonus but removes no earned currency. Daily reset changes the goal ledger, not crops, crop-specific work histories, currency, seeds, community level or unlocks. Weekly food goals belong to later stages.

## 5. Social by Design

| | |
|---|---|
| **The repeatable social loop** | A plants → B waters or harvests → contributors share proceeds and advance food goals; successful cooperative crops advance the community unlock. |
| **The disappearance test** | Solo crops still work, but the community cannot earn new levels without another contributor. Already unlocked crops remain available. |
| **From strangers to a group** | Shared beds have no fixed roles; newcomers can help existing crops. Whether they coordinate without guidance is untested. |
| **Recognition & continuity** | Record who planted, watered and harvested. A small top-three panel shows position, name or avatar and one score; tap/click opens the full ranking and crop details. Name versus avatar, placement and record retention remain TBD. |
| **Quiet hours & player counts** | Solo cultivation is allowed. Two distinct contributors on one successful crop meet the cooperation condition. One creator tested two identities; ideal group and tested maximum remain TBD: not discussed yet. |
| **Drop-in / drop-out** | Anyone can care for existing crops; contributions persist for later rewards even after departure. Sabotage limits remain TBD: not discussed yet. |
| **Visible play (the bystander test)** | Planting, watering and harvesting visibly change a shared bed or its progress. |
| **Shareable play (the memorable moment)** | Farmers reach a shared harvest milestone and see its celebration together. |
| **Bring-a-friend** | Another farmer can care for what you planted and help earn the community unlock that solo work cannot obtain. |

**Ranking rule.** Planting +1, the single accepted watering per crop +1, harvesting +1: confirm all points only after successful harvest, in its UTC week, including earlier work. Wilted crops give no points. Expanded crop counts credit each participant once per successful crop they helped produce. Reset Mondays at 00:00 UTC (Sundays at 21:00 Argentina time), without erasing pending crop work, currency, crops or community levels. V0 ranking gives recognition only; currency or a premium crop as ranking rewards belong to later stages.

## 6. Mobile-First

**Every core-loop verb on touch**

| Core-loop verb | How it works with touch controls |
|---|---|
| Plant | Tap a bed and choose Plant. |
| Water | Tap a planted bed and choose Water. |
| Harvest and sell | Tap a mature bed and choose Harvest; sale is automatic. |
| Choose seeds | TBD: not discussed yet. |

**UI plan**

Use the same contextual action menu on desktop and mobile: click or tap a bed, then choose a visible action without keyboard combinations or precision aiming. The compact ranking expands on demand; layout and target sizes remain TBD: verify during the mobile test.

**Performance**

No measured mobile or concurrency results. An iPhone SE was mentioned historically; exact model, client, performance targets and group-load results remain TBD: identify during the mobile test.

**Desktop-only dependencies**

Desktop and Chrome were tested on a Mac. Touch-menu implementation, mobile interaction and server compatibility remain unverified.

## 7. World, Look & Story

**Story / world**

You cultivate a shared farm to help the community become self-sufficient in food. Personal seeds become shared crops that anyone can care for or harvest.

**Visual direction**

Circular wooden beds around a common center, bright cartoon colors, readable vegetables and a shared food board. The current prototype includes a scarecrow and crop/moisture indicators; watering sound feedback exists; mobile readability and playback remain unverified.

## 8. Audience & Comparables

**Primary player + arrival context**

For players who enjoy relaxed farming games and want to cooperate during short visits; the first public arrival route is postponed.

**How the first group arrives**

The creator currently tests at home with multiple accounts. TBD: independent-player recruitment and its channel are postponed by the creator.

**Deliberately not for**

TBD: not discussed yet.

### Comparables

| | Comparable A — Decentraland if known; otherwise outside: Cozy Farm | Comparable B — outside Decentraland: TBD |
|---|---|---|
| What we observed works | Creator reports intuitive farming and crop variety. | TBD: not discussed yet. |
| What does not fit our audience or context—and why | Creator perceived insufficient cooperation and reasons to return; no retention data collected. | TBD: not discussed yet. |
| What we will do differently | Shared cultivation, cooperative unlocks and visible community goals. | TBD: not discussed yet. |

Additional recovered observation: Antrom RPG looked appealing, but its initial objectives were unclear to the creator. It is a second Decentraland reference, not an outside-platform comparable.

## 9. 4 Week Plan (v1 scope)

This is a tentative later V1 plan, not the initial V0 delivery scope. The requested application round is **v0**; its vertical-slice scope will be agreed with Creator Success if selected. Capacity: up to five hours daily, retaining the historical seven-day week, or up to 140 hours over four weeks. Occasional technical advice is not committed developer capacity. These are proposed targets, not an effort-validated promise or completed work.

| Week | What is playable / done |
|---|---|
| 1 — Prototype definition | Water-dependent growth and watermelon cultivation, preserving cooperation and saving. |
| 2 — Core interaction + first-group test | Automatic sale, proportional payouts and seed purchasing; creator self-test with two accounts and restart recovery. No independent group claimed. |
| 3 — Core systems refinement | Daily food goal, bonus, cooperative watermelon unlock and basic compact weekly ranking (top three, expandable contribution details); test day boundaries, weekly reset and offline rewards. |
| 4 — Playable prototype, final design direction (mobile playtest) | Defect fixes, time/reward balance, clearer controls, screenshots or video, and a mobile test with documented issues. |

**What keeps the experience changing after launch**

- Daily food goals and a weekly ranking provide shared deadlines; target rotation remains TBD.
- Other farmers and persistent shared crops change care priorities without new content.
- Daily and weekly ledgers reset; currency, seeds, crops, pending crop contributions, community levels and unlocks persist.
- Behavior that would change the next build: TBD: not discussed yet.

**Not building in v1**

For the requested v0, these three confirmed exclusions apply:

1. Currency or premium-crop prizes for ranking positions: reserved for later stages.
2. A crop catalog beyond lettuce and watermelon.
3. Friend-invitation bonuses and referral tracking.

Which later-stage feature returns first is TBD: not discussed yet.

**Top risk + fallback**

Saving or synchronization may interrupt play. Stalls and reloads were observed; save writes were not proven causal. Local Hammurabi preview with automatic reloads disabled improved play, and the creator confirmed cooperation and recovery, but public/mobile behavior is unverified.

If stalls recur, Weeks 3–4 prioritize stability over extra features, without dropping cooperation or saving. Re-scope the schedule honestly if fixes consume its capacity; the compact ranking adds work that is not yet estimated.
