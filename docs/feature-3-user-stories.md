# Feature 3 — User Stories
## Genre Chips & Voting (Post-Level Only)

---

## US-3.1: View Genre Chips on a Post

### User Story
**As a** user viewing a post,  
**I want to** see genre chips displayed on the post  
**so that** I can understand how the outfit is categorized and perceived.

### Acceptance Criteria

- ✅ I can see a Genre Chip section on the post detail view
- ✅ The section always includes:
  - Exactly one declared primary genre chip
- ✅ The declared genre chip displays:
  - The genre name
  - A numeric vote count
- ✅ The vote count is displayed inside a number bubble
- ✅ The genre bubble visually overlaps the number bubble, not the other way around

### Visual Rules

- Chip size increases as vote count increases
- Chip size growth is bucketed, not linear
- There are no animations beyond size change

### Explicit Exclusions

- 🚫 Chips are not clickable links
- 🚫 Chips do not navigate anywhere
- 🚫 No icons, hearts, or reactions are displayed

---

## US-3.2: View Suggested Genre Chips on a Post

### User Story
**As a** user viewing a post,  
**I want to** see suggested genre chips when they exist  
**so that** I can understand alternative ways the outfit is perceived.

### Acceptance Criteria

- ✅ Suggested genre chips appear only after at least one suggestion exists
- ✅ Each suggested genre chip displays:
  - Genre name
  - Numeric vote count
- ✅ Suggested genre chips use the same visual structure as the declared chip
- ✅ Suggested genre chips are visually secondary to the declared genre

### Explicit Exclusions

- 🚫 Suggested genres do not replace or override the declared genre
- 🚫 Suggested genres are not highlighted as "better" or "more correct"

---

## US-3.3: Vote on the Declared Genre

### User Story
**As a** signed-in user viewing a post,  
**I want to** vote on the declared genre  
**so that** I can indicate that the genre fits the outfit.

### Acceptance Criteria

- ✅ I can tap the declared genre chip to cast a vote
- ✅ Tapping the chip increases the vote count by +1
- ✅ The updated vote count is immediately reflected in the UI
- ✅ I can only vote once per post per genre

### System Rules

**Votes are stored per:**
- Post
- Genre
- User

**Duplicate votes are prevented at the data level**

### Explicit Exclusions

- 🚫 I cannot remove or change my vote
- 🚫 I cannot downvote
- 🚫 I cannot see who else voted
- 🚫 There is no "disagree" option

---

## US-3.4: Suggest an Additional Genre for a Post

### User Story
**As a** signed-in user viewing a post,  
**I want to** suggest an additional genre  
**so that** I can indicate other styles that also fit the outfit.

### Acceptance Criteria

- ✅ I can see a single standalone "+" control in the genre chip section
- ✅ Tapping the "+" opens a searchable genre selector
- ✅ The genre selector uses the controlled genre list
- ✅ I cannot enter free-text genres

### Behavior

**If I select a genre that is not yet suggested:**
- A new suggested genre chip is created
- The chip starts with 1 vote
- The initial vote is attributed to me

### Explicit Exclusions

- 🚫 The "+" does not appear on individual chips
- 🚫 I cannot create new genres
- 🚫 I cannot suggest the declared genre

---

## US-3.5: Vote on a Suggested Genre

### User Story
**As a** signed-in user viewing a post,  
**I want to** vote on a suggested genre  
**so that** I can agree that it also fits the outfit.

### Acceptance Criteria

- ✅ I can tap an existing suggested genre chip to vote
- ✅ Tapping the chip increases its vote count by +1
- ✅ I can vote once per suggested genre per post
- ✅ Vote counts update immediately

### Explicit Exclusions

- 🚫 Suggested genre votes do not affect the declared genre
- 🚫 Suggested genre votes do not affect feed ranking (in this feature)

---

## US-3.6: Prevent Anonymous Voting

### User Story
**As the** system,  
**I want to** prevent users who are not signed in from voting  
**so that** voting integrity is maintained.

### Acceptance Criteria

**If I am not signed in:**
- Genre chips are visible
- Voting actions are disabled

**Tapping a chip while signed out:**
- Does not increment votes
- Provides a non-blocking prompt to sign in

### Explicit Exclusions

- 🚫 No modal interruption
- 🚫 No forced redirect unless user chooses to sign in

---

## US-3.7: Enforce Voting Constraints

### User Story
**As the** system,  
**I want to** enforce strict voting rules  
**so that** vote counts remain accurate and fair.

### Acceptance Criteria

- ✅ A user cannot vote more than once for the same genre on the same post
- ✅ Duplicate vote attempts are ignored or rejected gracefully
- ✅ Vote counts are derived from stored votes, not manually incremented fields

---

## US-3.8: Handle Vote Submission Failures Gracefully

### User Story
**As a** user voting on a genre,  
**I want** clear feedback if my vote fails  
**so that** I understand whether my action succeeded.

### Acceptance Criteria

**If a vote fails to persist:**
- The UI does not permanently increment the count
- A subtle error message is shown
- The app does not crash
- The post remains usable

---

## Feature 3 — Explicitly Out of Scope (Reiterated)

For Antigravity clarity, this feature **must not include:**

- 🚫 Feed ranking updates
- 🚫 Genre-based discovery
- 🚫 Country filtering
- 🚫 Profile aggregation of votes
- 🚫 Brand references
- 🚫 Comments
- 🚫 Likes / hearts
- 🚫 Notifications
- 🚫 Vote removal or editing

---

## Why These Stories Are Split This Way

- Each interaction is isolated and testable
- Voting integrity is enforced early
- Visual + behavioral contracts are locked
- Future feed logic can rely on clean data

---

**Total User Stories:** 8  
**Status:** 📋 Documented  
**Related:** [feature-3-genre-chips-voting.md](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-3-genre-chips-voting.md), [Implementation Plan](file:///C:/Users/bleed/.gemini/antigravity/brain/56280c0b-eef4-45bc-bb0e-86d1a579a47f/implementation_plan.md)
