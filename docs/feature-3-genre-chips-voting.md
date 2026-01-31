# Feature 3: Genre Chips & Voting (Post-Level Only)

## 🔹 Purpose of This Feature

Feature 3 introduces the core interaction mechanic of Fashigram:
- Visual genre chips
- Community validation via voting
- Suggested genres as secondary signals

This feature establishes how collective perception is expressed, but **does not yet influence feeds, ranking, or discovery logic**.

**This is post-level interaction only.**

---

## 1. Feature Objective

Enable users to:
- View genre chips on a post
- Vote on the declared genre
- Suggest additional genres
- Vote on suggested genres

All while:
- Preserving creator intent
- Avoiding negative feedback
- Avoiding reclassification conflict

---

## 2. Preconditions

This feature assumes:
- ✅ Feature 1 (Create Post) is complete
- ✅ Feature 2 (Post Detail View) is complete
- ✅ Controlled genre list exists
- ✅ Users are authenticated

---

## 3. Core Concepts (Re-locked)

### 3.1 Declared Genre
- **Exactly one** per post
- Selected by the creator
- **Cannot be changed**
- Determines future Top-feed lane (not implemented here)

### 3.2 Validation Votes
- Votes on the declared genre
- Indicate "this fits"
- **Additive only**

### 3.3 Suggested Genres
- Added by users via suggestion
- Voteable by others
- **Informational only** in this phase

---

## 4. UI Requirements (Authoritative)

### 4.1 Genre Chip Rendering

On the Post Detail View, display a **Genre Chip Section**:

#### Declared Genre Chip
- Always present
- Displays:
  - Genre label
  - Overlapping number bubble showing vote count
- Chip is visually emphasized (primary)

#### Suggested Genre Chips
- Display only if suggested
- Same visual structure
- Secondary emphasis

#### Chip Design Rules
- Genre bubble **visually overlaps** number bubble
- Chip size **scales with vote count** (bucketed)
- No animation beyond subtle size changes
- No color-coding for "good/bad"

### 4.2 Standalone "+" Control (Suggest Genre)

- One standalone "+" chip
- Always visible after declared genre chip
- Opens searchable genre selector
- Adds a new suggested genre chip at lowest size with 1 vote

**Important:**
- This "+" is **not per-chip**
- It does **not** create new genres (controlled list only)

---

## 5. Interaction Rules

### 5.1 Voting on Chips

**Tapping a chip:**
- Increments vote count by +1
- Updates bubble number immediately
- Each user can vote **once per genre per post**

**Explicit exclusions:**
- ❌ No downvotes
- ❌ No vote removal
- ❌ No public voter lists
- ❌ No "wrong genre" actions

### 5.2 Suggesting a Genre

1. User taps standalone "+"
2. Selects a genre from controlled list
3. **If genre not already present:**
   - A new suggested chip is created
   - Initial vote is recorded for the suggester
4. **If genre already suggested:**
   - User's vote increments that chip

---

## 6. Data Requirements

This feature creates and reads:

### `post_genre_votes`
- `post_id`
- `genre_id`
- `user_id`
- `vote_type` (DECLARED or SUGGESTED)
- `created_at`

**Constraints:**
- Unique `(post_id, genre_id, user_id)`
- Vote counts are **derived**, not stored directly

---

## 7. Display Rules (Critical Boundaries)

Vote counts are displayed **only on the post**.

Vote counts do **not yet**:
- Affect feeds
- Affect ordering elsewhere
- Affect profiles

**Suggested genres are never promoted over declared genre.**

---

## 8. Error & Edge States

| State | Behavior |
|-------|----------|
| User is not signed in | Chips are visible, voting is disabled |
| Vote submission fails | Show non-blocking error, do not optimistically increment permanently |

---

## 9. Explicit Out-of-Scope (Non-Negotiable)

This feature must **NOT** include:

- 🚫 Feed ranking logic
- 🚫 Genre-based discovery
- 🚫 Country filtering
- 🚫 Profile aggregation
- 🚫 Brand references
- 🚫 Comments or reactions
- 🚫 Notifications
- 🚫 Editing or removing votes

**If any of these appear, the feature has exceeded scope.**

---

## 10. Acceptance Criteria (High-Level)

Feature 3 is **complete** when:

1. ✅ Declared genre chip displays with vote count
2. ✅ Users can vote on declared genre
3. ✅ Users can suggest additional genres
4. ✅ Suggested genres appear as chips with vote counts
5. ✅ No feed behavior changes as a result

---

**Status:** 📋 Documented  
**Dependencies:** [Feature 1](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md), [Feature 2](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-2-post-detail-view.md)  
**Next:** Implementation plan and UI design
