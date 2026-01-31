# Feature 4 — User Stories
## Suggested Genre Governance (Post-Level)

---

## US-4.1: Ensure the Declared Genre Is Always Visually Primary

### User Story
**As a** user viewing a post,  
**I want** the declared primary genre to always appear first and most prominent  
**so that** the poster's original intent is clearly preserved.

### Acceptance Criteria

**The declared genre chip:**
- ✅ Is always displayed first in the genre chip section
- ✅ Is visually emphasized relative to suggested genres

**Suggested genre chips:**
- ✅ Are always displayed after the declared genre chip
- ✅ Never visually override or displace the declared genre

### Explicit Exclusions

- 🚫 Suggested genres cannot reorder above the declared genre
- 🚫 Suggested genres cannot visually appear larger than the declared genre

---

## US-4.2: Limit the Number of Suggested Genres Per Post

### User Story
**As the** system,  
**I want to** limit the number of suggested genres on a post  
**so that** posts do not become cluttered or ambiguous.

### Acceptance Criteria

- ✅ Each post supports a maximum of **N** suggested genres (N is configurable; default = **5**)
- ✅ Once the maximum is reached:
  - No additional suggested genre chips can be added
  - Existing suggested genres remain voteable

### Explicit Exclusions

- 🚫 Existing suggested genres are not removed automatically
- 🚫 The declared genre does not count toward the suggested genre limit

---

## US-4.3: Control the Ordering of Suggested Genre Chips

### User Story
**As a** user viewing a post,  
**I want** suggested genres to appear in a predictable order  
**so that** I can easily understand which interpretations are most supported.

### Acceptance Criteria

**Suggested genre chips are ordered by:**
1. Vote count (descending)
2. Earliest suggestion timestamp (tie-breaker)

- ✅ Ordering remains stable across sessions

### Explicit Exclusions

- 🚫 Suggested genres are not ordered alphabetically
- 🚫 Suggested genres are not ordered by user identity or popularity

---

## US-4.4: Display the "+" Control Appropriately Based on Limits

### User Story
**As a** user viewing a post,  
**I want** the "+" control to reflect whether additional genre suggestions are allowed  
**so that** I understand when I can or cannot add more.

### Acceptance Criteria

**The standalone "+" control:**
- ✅ Appears after all existing genre chips
- ✅ Is visible when suggested genre count < max

**When the suggested genre limit is reached:**
- ✅ The "+" control is hidden or disabled

### Explicit Exclusions

- 🚫 No per-chip "+" controls exist
- 🚫 No automatic replacement of existing suggested genres occurs

---

## US-4.5: Provide Feedback When Suggestion Limit Is Reached

### User Story
**As a** user attempting to suggest a genre,  
**I want** clear feedback if the post already has the maximum number of suggestions  
**so that** I understand why I cannot add another.

### Acceptance Criteria

**If I attempt to add a suggested genre after the limit is reached:**
- ✅ No new chip is created
- ✅ A subtle, non-blocking message is shown indicating the limit
- ✅ The message is informational, not an error

### Explicit Exclusions

- 🚫 No modal dialogs
- 🚫 No forced navigation or interruptions

---

## US-4.6: Prevent Duplicate Suggested Genre Chips

### User Story
**As the** system,  
**I want to** prevent duplicate suggested genre chips  
**so that** each genre appears only once per post.

### Acceptance Criteria

**If a user selects a genre that is already suggested:**
- ✅ No duplicate chip is created
- ✅ The action is treated as a vote on the existing chip

- ✅ Duplicate chips cannot exist in the UI or data model

---

## US-4.7: Maintain Visual Hierarchy Between Declared and Suggested Genres

### User Story
**As a** user viewing a post,  
**I want** a clear visual distinction between declared and suggested genres  
**so that** I understand which genre represents intent versus interpretation.

### Acceptance Criteria

**Declared genre chip:**
- ✅ Has stronger visual emphasis (size, weight, or styling)

**Suggested genre chips:**
- ✅ Appear visually secondary
- ✅ Remain readable and consistent

### Explicit Exclusions

- 🚫 No labels such as "primary" or "secondary" are shown
- 🚫 No color coding that implies correctness or authority

---

## US-4.8: Handle Chip Overflow Gracefully

### User Story
**As a** user viewing a post with multiple genre chips,  
**I want** the layout to remain readable and stable  
**so that** chips do not overlap or become unreadable.

### Acceptance Criteria

- ✅ Genre chips wrap to additional rows as needed
- ✅ Chips do not overlap other content
- ✅ No horizontal scrolling is introduced

### Explicit Exclusions

- 🚫 No expand/collapse controls
- 🚫 No truncation of genre names

---

## Feature 4 — Explicitly Out of Scope (Reiterated)

For Antigravity clarity, this feature **must not include:**

- 🚫 Feed ranking logic
- 🚫 Discovery or filtering behavior
- 🚫 Country filtering
- 🚫 Genre pages
- 🚫 Brand references
- 🚫 Admin moderation UI
- 🚫 User-created genres
- 🚫 Notifications

---

## Why Feature 4 Is Structured This Way

- It stabilizes meaning before scaling visibility
- It prevents suggested genres from becoming noisy or competitive
- It preserves creator intent without confrontation
- It prepares clean data and UI for feed logic later

---

**Total User Stories:** 8  
**Status:** 📋 Documented  
**Related:** [feature-4-suggested-genre-governance.md](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-4-suggested-genre-governance.md), [Implementation Plan](file:///C:/Users/bleed/.gemini/antigravity/brain/56280c0b-eef4-45bc-bb0e-86d1a579a47f/implementation_plan.md)
