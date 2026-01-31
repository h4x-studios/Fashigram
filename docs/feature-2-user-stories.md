# Feature 2 — User Stories
## Post Detail View (Read-Only)

---

## US-2.1: View a Post in a Dedicated Post Detail View

### User Story
**As a** user,  
**I want to** view a post in a dedicated post detail view  
**so that** I can see the full context of an outfit in one place.

### Acceptance Criteria

- ✅ I can open a post in a dedicated post detail view
- ✅ The post detail view is distinct from feed or grid views
- ✅ The post detail view displays information for only one post
- ✅ The post detail view loads using the post's unique identifier

### Explicit Exclusions

- 🚫 I cannot see multiple posts on the same screen
- 🚫 I cannot interact with other posts from this view

---

## US-2.2: See the Posting User's Identity on a Post

### User Story
**As a** user viewing a post,  
**I want to** see who posted the outfit  
**so that** I understand the source of the post.

### Acceptance Criteria

✅ **I can see the posting user's:**
- username
- avatar

- ✅ The username and avatar are displayed at the top of the post
- ✅ The information shown matches the post's author

### Explicit Exclusions

- 🚫 I cannot see follower counts
- 🚫 I cannot see user stats
- 🚫 I cannot follow the user
- 🚫 I cannot navigate to the user's profile from this screen (MVP)

---

## US-2.3: View the Country Associated With a Post

### User Story
**As a** user viewing a post,  
**I want to** see the country the post is associated with  
**so that** I understand the geographic context of the outfit.

### Acceptance Criteria

✅ **If a country was selected during post creation:**
- I can see the country displayed on the post detail view
- The country is displayed as a human-readable country name

✅ **If no country was selected:**
- The country section is not displayed

### Explicit Exclusions

- 🚫 Country is not displayed as an ISO code
- 🚫 No city or region information is displayed

---

## US-2.4: View All Images Associated With a Post

### User Story
**As a** user viewing a post,  
**I want to** see all images associated with the post  
**so that** I can fully view the outfit.

### Acceptance Criteria

- ✅ I can see between 1 and 3 images on the post detail view
- ✅ Images are displayed in the same order set during post creation
- ✅ If images are not yet finalized: Placeholder tiles are shown

### Explicit Exclusions

- 🚫 I cannot see more than 3 images
- 🚫 I cannot see videos or other media types

---

## US-2.5: View Images Full-Screen

### User Story
**As a** user viewing a post,  
**I want to** tap an image to view it full-screen  
**so that** I can see outfit details more clearly.

### Acceptance Criteria

- ✅ When I tap an image, it opens in full-screen view

✅ **In full-screen view:**
- I can swipe between images if more than one exists
- I can exit full-screen and return to the post detail view

### Explicit Exclusions

- 🚫 I cannot zoom, crop, or edit images
- 🚫 No overlays or UI elements appear on top of images

---

## US-2.6: See the Declared Primary Genre of a Post

### User Story
**As a** user viewing a post,  
**I want to** see the declared primary genre  
**so that** I understand how the poster intended the outfit to be categorized.

### Acceptance Criteria

- ✅ I can see the declared primary genre displayed on the post
- ✅ The genre is displayed as static text or a non-interactive chip
- ✅ The genre matches the value selected during post creation

### Explicit Exclusions

- 🚫 The genre is not clickable
- 🚫 No vote counts are shown
- 🚫 No suggested genres are shown
- 🚫 The genre cannot be changed

---

## US-2.7: View the Caption of a Post

### User Story
**As a** user viewing a post,  
**I want to** read the caption if one was provided  
**so that** I can understand additional context.

### Acceptance Criteria

✅ **If a caption exists:**
- I can see it displayed below the images and genre

✅ **If no caption exists:**
- The caption section is not shown

### Explicit Exclusions

- 🚫 Hashtags are not parsed
- 🚫 Mentions are not parsed
- 🚫 Links are not clickable
- 🚫 No rich text formatting is applied

---

## US-2.8: Navigate Away From the Post Detail View

### User Story
**As a** user viewing a post,  
**I want to** be able to navigate back  
**so that** I can continue using the app.

### Acceptance Criteria

- ✅ I can navigate back to the previous screen
- ✅ Navigation works consistently on mobile and web

### Explicit Exclusions

- 🚫 No sharing actions are available
- 🚫 No bookmarking or saving is available

---

## US-2.9: Handle Missing or Invalid Post Data

### User Story
**As a** user,  
**I want** clear feedback if a post cannot be loaded  
**so that** I understand what happened.

### Acceptance Criteria

✅ **If the post ID does not exist:**
- I see a clear "Post not found" state

✅ **If images fail to load:**
- Placeholder tiles are shown

- ✅ The app does not crash in any failure state

---

## Feature 2 — Explicitly Out of Scope (Reiterated)

For Antigravity clarity, this feature **must not include:**

- 🚫 Genre chips with counts
- 🚫 Voting
- 🚫 Suggested genres
- 🚫 Likes or hearts
- 🚫 Comments
- 🚫 Profile navigation
- 🚫 Brand references
- 🚫 Sharing
- 🚫 Saving
- 🚫 Reporting

---

**Total User Stories:** 9  
**Status:** 📋 Documented  
**Related:** [feature-2-post-detail-view.md](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-2-post-detail-view.md)
