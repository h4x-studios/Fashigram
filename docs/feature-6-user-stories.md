# Feature 6 — User Stories
## User Profiles as Archives (Read-Only, Non-Social)

---

## US-6.1: View a User Profile Page

### User Story
**As a** user,  
**I want to** view a user's profile page  
**so that** I can see their fashion archive in one place.

### Acceptance Criteria

- ✅ I can navigate to a user profile page
- ✅ The profile page is dedicated to one user only
- ✅ The profile page loads using the user's unique identifier
- ✅ The profile page is accessible on mobile and web

### Explicit Exclusions

- 🚫 I cannot see multiple users on the same profile page
- 🚫 I cannot interact with other users from this page

---

## US-6.2: View Basic User Identity Information

### User Story
**As a** user viewing a profile,  
**I want to** see basic identity information  
**so that** I understand whose archive I am viewing.

### Acceptance Criteria

**I can see:**
- ✅ The user's avatar
- ✅ The user's username
- ✅ The avatar and username match the profile owner

### Explicit Exclusions

- 🚫 I do not see follower counts
- 🚫 I do not see post counts
- 🚫 I do not see rankings, badges, or labels

---

## US-6.3: View a User Bio (If Present)

### User Story
**As a** user viewing a profile,  
**I want to** see a bio if the user has provided one  
**so that** I can understand their context or perspective.

### Acceptance Criteria

**If the user has a bio:**
- ✅ It is displayed as plain text

**If the user has no bio:**
- ✅ The bio section is not displayed

### Explicit Exclusions

- 🚫 No hashtags are parsed
- 🚫 No mentions are parsed
- 🚫 No links are clickable
- 🚫 No rich text formatting is supported

---

## US-6.4: View a User's Post Archive

### User Story
**As a** user viewing a profile,  
**I want to** see a grid of all posts created by that user  
**so that** I can explore their fashion archive.

### Acceptance Criteria

- ✅ The profile displays a grid of post tiles
- ✅ The grid includes all posts created by the user
- ✅ Posts are ordered by `created_at` DESC
- ✅ Each tile displays a single post image (placeholder acceptable)

### Explicit Exclusions

- 🚫 No vote counts are shown
- 🚫 No genre chips are shown
- 🚫 No suggested genres are shown
- 🚫 No likes or reactions are shown

---

## US-6.5: Navigate From Profile to Post Detail View

### User Story
**As a** user viewing a profile,  
**I want to** tap a post tile  
**so that** I can view the full post.

### Acceptance Criteria

- ✅ Tapping a post tile opens the Post Detail View
- ✅ The correct post is loaded using its ID
- ✅ Navigation works consistently across platforms

### Explicit Exclusions

- 🚫 No long-press actions
- 🚫 No quick actions from the grid

---

## US-6.6: Filter a Profile by Declared Genre

### User Story
**As a** user viewing a profile,  
**I want to** filter the archive by declared genre  
**so that** I can focus on a specific style.

### Acceptance Criteria

- ✅ I can open a genre filter control on the profile
- ✅ I can select one declared genre
- ✅ When selected: only posts where `declared_genre = selected_genre` are shown
- ✅ Clearing the filter restores the full archive

### Explicit Exclusions

- 🚫 I cannot select multiple genres
- 🚫 Suggested genres are not included in this filter (by default)

---

## US-6.7: Optionally Include Suggested Genre Matches in Profile View

### User Story
**As a** user viewing a profile,  
**I want** the option to include suggested genre matches  
**so that** I can see broader stylistic overlap.

### Acceptance Criteria

- ✅ A toggle exists labeled clearly (e.g. "Include suggested genres")
- ✅ When enabled: posts where the selected genre appears as a suggested genre are included
- ✅ When disabled: only declared genre matches are shown

### Explicit Exclusions

- 🚫 Suggested genres do not override declared genres
- 🚫 Suggested genre votes do not affect ordering

---

## US-6.8: Handle Profiles With No Posts

### User Story
**As a** user viewing a profile,  
**I want** clear feedback when a user has no posts  
**so that** I understand the archive is empty.

### Acceptance Criteria

**If a user has no posts:**
- ✅ A neutral empty state is shown
- ✅ The empty state does not prompt posting or following

---

## US-6.9: Handle Missing or Invalid Profiles

### User Story
**As a** user navigating to a profile,  
**I want** clear feedback if the profile does not exist  
**so that** I understand what happened.

### Acceptance Criteria

**If the user ID does not exist:**
- ✅ A "User not found" state is displayed
- ✅ The app does not crash

---

## US-6.10: Ensure Profiles Remain Non-Social

### User Story
**As the** system,  
**I want** profiles to remain non-social and non-competitive  
**so that** archives do not become popularity surfaces.

### Acceptance Criteria

**Profiles do not display:**
- ✅ Follower counts
- ✅ Following actions
- ✅ Popularity metrics
- ✅ Rankings

**Profiles do not allow:**
- ✅ Liking users
- ✅ Messaging users
- ✅ Endorsing users

---

## Feature 6 — Explicitly Out of Scope (Final Lock)

For enforcement, Feature 6 **must not include:**

- 🚫 Follow / unfollow
- 🚫 Likes / hearts
- 🚫 Comments
- 🚫 Profile ranking
- 🚫 Featured users
- 🚫 Brand affiliations
- 🚫 Monetization
- 🚫 Notifications
- 🚫 Profile analytics

---

**Total User Stories:** 10  
**Status:** 📋 Documented  
**Related:** [feature-6-user-profiles.md](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-6-user-profiles.md)
