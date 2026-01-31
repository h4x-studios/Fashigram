# Feature 5 — User Stories
## Feeds (New & Top) with Genre + Country Filtering

---

## US-5.1: View the Feed Entry Point

### User Story
**As a** user,  
**I want to** land on a feed view when opening the app  
**so that** I can browse posts without taking an action first.

### Acceptance Criteria

- ✅ When I open the app, I am taken to a feed screen
- ✅ The feed screen displays:
  - A tab control with New and Top
  - A feed list area
- ✅ The feed screen does not require authentication to view content (read-only allowed)

### Explicit Exclusions

- 🚫 I am not prompted to post
- 🚫 I am not prompted to vote
- 🚫 I do not see any onboarding overlays in this feature

---

## US-5.2: Switch Between New and Top Feeds

### User Story
**As a** user browsing the feed,  
**I want to** switch between New and Top  
**so that** I can choose how posts are surfaced.

### Acceptance Criteria

- ✅ I can switch between New and Top tabs
- ✅ Only one tab is active at a time
- ✅ Switching tabs reloads the feed content according to the selected feed type
- ✅ The active tab is visually indicated

### Explicit Exclusions

- 🚫 Tabs do not animate ranking changes
- 🚫 No explanation or tooltip of ranking logic is shown
- 🚫 No tab is emphasized as "recommended"

---

## US-5.3: View the New Feed (Chronological)

### User Story
**As a** user viewing the New feed,  
**I want to** see posts ordered by recency  
**so that** I can see the latest uploads.

### Acceptance Criteria

- ✅ The New feed displays posts sorted strictly by `created_at` DESC
- ✅ All posts that match current filters appear
- ✅ No vote data is used in ordering
- ✅ Posts appear exactly once per page load

### Explicit Exclusions

- 🚫 No ranking based on votes
- 🚫 No personalization
- 🚫 No resurfacing logic
- 🚫 No "boosted" content

---

## US-5.4: View the Top Feed (Consensus-Based)

### User Story
**As a** user viewing the Top feed,  
**I want to** see posts ordered by community validation  
**so that** I can see outfits that best fit a genre.

### Acceptance Criteria

- ✅ The Top feed orders posts using:
  ```
  Declared Genre Validation Votes × Time Decay
  ```
- ✅ Only votes on the declared genre are used
- ✅ Suggested genre votes are ignored
- ✅ Ordering is deterministic for the same data state

### Explicit Exclusions

- 🚫 Suggested genres do not influence Top feed inclusion
- 🚫 No machine learning
- 🚫 No user-specific ranking
- 🚫 No "trending" logic

---

## US-5.5: Apply a Genre Filter to the Feed

### User Story
**As a** user browsing the feed,  
**I want to** filter posts by genre  
**so that** I can view outfits within a specific style.

### Acceptance Criteria

- ✅ I can open a genre filter control
- ✅ I can select one genre from a searchable controlled list
- ✅ When a genre is selected:
  - Only posts where `declared_genre = selected_genre` appear
- ✅ The selected genre filter applies to both New and Top feeds

### Explicit Exclusions

- 🚫 Suggested genres are not used for feed inclusion
- 🚫 I cannot select multiple genres
- 🚫 I cannot filter by free-text tags

---

## US-5.6: Apply a Country Filter to the Feed

### User Story
**As a** user browsing the feed,  
**I want to** filter posts by country  
**so that** I can see posts from a specific location.

### Acceptance Criteria

- ✅ The default country filter is **Everywhere**
- ✅ I can select one country from a searchable list
- ✅ When a country is selected:
  - Only posts with `post.country_code = selected_country` appear
- ✅ The country filter applies to both New and Top feeds

### Explicit Exclusions

- 🚫 Posts without a country are excluded when a country is selected
- 🚫 No city, region, or radius filtering
- 🚫 No auto-detected location

---

## US-5.7: Combine Genre and Country Filters

### User Story
**As a** user browsing the feed,  
**I want** genre and country filters to work together  
**so that** I can narrow the feed precisely.

### Acceptance Criteria

- ✅ When both filters are applied:
  - Only posts matching **both** filters appear
- ✅ Filters persist when switching between New and Top tabs
- ✅ Filters can be cleared independently

### Explicit Exclusions

- 🚫 No saved filter presets
- 🚫 No filter history

---

## US-5.8: View Feed Items as Post Tiles

### User Story
**As a** user browsing the feed,  
**I want to** see posts represented as tiles  
**so that** I can quickly scan outfits.

### Acceptance Criteria

**Each feed tile displays:**
- ✅ A single post image (placeholder acceptable)
- ✅ The declared genre (static text)
- ✅ Optionally the username (if included in design)

### Explicit Exclusions

- 🚫 No vote counts
- 🚫 No genre chips
- 🚫 No suggested genres
- 🚫 No likes, hearts, or reactions
- 🚫 No brand indicators

---

## US-5.9: Navigate From Feed to Post Detail View

### User Story
**As a** user browsing the feed,  
**I want to** tap a post tile  
**so that** I can view the full post.

### Acceptance Criteria

- ✅ Tapping a feed tile navigates to the Post Detail View
- ✅ The correct post is loaded using its ID
- ✅ Navigation works consistently on mobile and web

### Explicit Exclusions

- 🚫 No long-press actions
- 🚫 No quick vote or quick suggest actions from feed
- 🚫 No preview overlays

---

## US-5.10: Load Additional Feed Content

### User Story
**As a** user browsing the feed,  
**I want** additional posts to load as I scroll  
**so that** I can continue browsing seamlessly.

### Acceptance Criteria

- ✅ Feed supports pagination or infinite scroll
- ✅ Additional posts load without resetting scroll position
- ✅ Loading indicators are shown during fetch

### Explicit Exclusions

- 🚫 No auto-refresh that reorders content mid-scroll
- 🚫 No real-time re-ranking

---

## US-5.11: Handle Empty Feed States

### User Story
**As a** user applying filters,  
**I want** clear feedback when no posts match  
**so that** I understand the feed is empty.

### Acceptance Criteria

**If no posts match filters:**
- ✅ An empty state message is shown
- ✅ The empty state suggests clearing filters
- ✅ The app does not error or crash

---

## Feature 5 — Explicitly Out of Scope (Final Reiteration)

For Antigravity enforcement, Feature 5 **must not include:**

- 🚫 Voting from feed
- 🚫 Suggested genres in feed
- 🚫 Brand references
- 🚫 Sponsored posts
- 🚫 Personalization
- 🚫 Following / followers
- 🚫 Notifications
- 🚫 Trending labels
- 🚫 Algorithm explanations in UI

---

**Total User Stories:** 11  
**Status:** 📋 Documented  
**Related:** [feature-5-feeds-discovery.md](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-5-feeds-discovery.md), [Implementation Plan](file:///C:/Users/bleed/.gemini/antigravity/brain/56280c0b-eef4-45bc-bb0e-86d1a579a47f/implementation_plan.md)
