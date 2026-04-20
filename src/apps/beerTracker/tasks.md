## Beer Tracker Tasks

All game logic and caching lives in tero.platform. Frontend lives in tero.mobile.

---

## Backend (tero.platform)

### 1. Database

- [ ] Create `beer_tracker_games` table: `id TEXT PRIMARY KEY`, `can_size DOUBLE NOT NULL` (0.33 or 0.5), `goal INTEGER NULL`, `created_at TIMESTAMPTZ DEFAULT now()`
- [ ] Create `beer_tracker_members` table: `game_id TEXT REFERENCES beer_tracker_games(id) ON DELETE CASCADE`, `name TEXT NOT NULL`, `count INTEGER DEFAULT 0`, unique index on `(game_id, name)` — separate rows per member avoids JSONB race conditions
- [ ] Add a daily PG cron trigger or background task that deletes games older than 24 hours

### 2. Models & Cache

- [ ] Define `BeerTrackerGame` struct: `id`, `can_size`, `goal: Option<i32>`, `members: Vec<UserScore>` where `UserScore` has `name: String` and `count: i32`
- [ ] Create a Moka cache keyed by game id (`String`) storing `BeerTrackerGame`, TTL ~5 minutes
- [ ] Invalidate cache entry on every write (create, join, increment, leave, finish)
- [ ] On every read, populate cache from DB on miss

### 3. API — Create

- [ ] `POST /beer-tracker` — Takes `game_id`, `name` (creator), optional `goal`, `can_size` (0.33 or 0.5). Validate game id is unique — return error if taken. Creator is added as first member

### 4. API — Join Integration

- [ ] Extend the existing join-key lookup: first check the key vault (interactive games), then check beer tracker cache for a matching game id. If found, return `hub_name: "non-hub:beertracker"` so frontend skips SignalR

### 5. API — Join

- [ ] `POST /beer-tracker/{id}/join` — Takes `name`. Writes to DB, invalidates cache. Validate: no duplicate names, max name length

### 6. API — Get State

- [ ] `GET /beer-tracker/{id}` — Returns game state. Serves from cache when possible

### 7. API — Increment

- [ ] `POST /beer-tracker/{id}/increment` — Takes `name` and `can_size` (0.33 or 0.5). Validate: only the owner can increment their own count (matched by name — immutable after joining). If game can size is 0.33 and a 0.5 is added, calculate proportional score (0.5 / 0.33 ≈ 1.52)

### 8. API — Leave & Finish

- [ ] `POST /beer-tracker/{id}/leave` — Takes `name`. Removes member row, invalidates cache. If no members remain, delete the game
- [ ] `POST /beer-tracker/{id}/finish` — Deletes game from DB and cache

### 9. Push Notification

- [ ] Send a push notification when a member reaches the goal

### 10. Real-time (SSE)

- [ ] Create a broadcast channel in app state. Write handlers (increment, join, leave) send events to a worker
- [ ] Worker pushes game state updates to clients via SSE

---

## Frontend (tero.mobile)

### 11. Routing & State

- [ ] The main `BeerTracker.tsx` entry component serves as the router — renders screens based on persisted screen state from the context/zustand store
- [ ] Add `BeerTrackerScreen` enum values: `Home`, `Join`, `Game`
- [ ] Persist joined game id, player name, and current screen in zustand + AsyncStorage. On app restart or reopen, restore the last screen — never reset to Home if already in a game
- [ ] On opening Beer Tracker, if a game is active and not finished, skip to GameScreen automatically

### 12. CreateScreen (Home)

- [ ] Two toggle buttons for can size (0.33 / 0.5) — select one
- [ ] Optional number input for goal
- [ ] Text input for game id — show error if taken
- [ ] Text input for your name
- [ ] On success, navigate to GameScreen. Minimal styling for now

### 13. Join Flow (via Home "BLI MED")

- [ ] When backend returns `non-hub:beertracker` from join lookup, skip SignalR connection
- [ ] Navigate to a JoinScreen that prompts for name with validation (no duplicates, max length)
- [ ] On success, navigate to GameScreen

### 14. GameScreen — Header & Goal

- [ ] Screen header like the spin game: "Rom: {game_id}" with a back button
- [ ] If a goal is set, show it centered at the top with descriptive text

### 15. GameScreen — Member List

- [ ] Member cards: profile icon on left (reuse avatar getter from passive lobby), name in middle, beer count on right

### 16. GameScreen — Add Beer Bar

- [ ] Bottom bar with distinct background color
- [ ] Two beer can icons labeled 0.33 and 0.5 with a "+" indicator
- [ ] Hold-to-add: holding fills a progress bar left-to-right with haptic feedback, releasing after full sends the increment
- [ ] If user taps 3 times without holding, show info modal: "Hold nede for å legge til øl". Resets tap counter

### 17. GameScreen — Leave

- [ ] Back button triggers confirmation modal: "Vil du forlate spillet, eller bare gå tilbake til appen?"
- [ ] Two options: leave game (calls leave API, clears state) or navigate back (stay in game, can return)

### 18. Polling

- [ ] Poll `GET /beer-tracker/{id}` every 2.5 seconds (hits cache on backend)
- [ ] Replace with SSE listener once the SSE worker is ready
