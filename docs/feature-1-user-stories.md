# Feature 1 — User Stories
## Create Post (Declared Genre / Intent)

---

## US-1: Upload Images for a New Post

### User Story
**As a** signed-in user,  
**I want to** upload images when creating a post  
**so that** I can visually represent my outfit.

### Acceptance Criteria

- ✅ I can upload at least 1 image to create a post
- ✅ I can upload no more than 3 images per post
- ✅ I can see a preview thumbnail for each uploaded image
- ✅ I can remove an uploaded image before submitting the post
- ✅ I can reorder images before submitting the post
- ✅ Image order is preserved after submission

### Validation / Error States

- ❌ If I attempt to submit a post with 0 images, I am blocked from submitting
- ℹ️ I see a clear inline error indicating that at least 1 image is required

### Explicit Exclusions

- 🚫 I cannot upload videos
- 🚫 I cannot apply filters or edits
- 🚫 I cannot tag within images
- 🚫 I cannot upload more than 3 images

---

## US-2: Declare a Primary Genre for a Post

### User Story
**As a** user creating a post,  
**I want to** declare exactly one primary genre  
**so that** I can explicitly state my intent for how the post should be categorized.

### Acceptance Criteria

- ✅ I am required to select exactly one genre before submitting a post
- ✅ I select a genre via a **"+" input** that opens a searchable list
- ✅ The genre list is controlled (no free-text input)
- ✅ I cannot submit the post unless a genre is selected
- ✅ Once submitted, the declared genre is stored **immutably**

### UX Copy Requirements

- ✅ The UI uses the phrase **"I am posting this as:"**
- ❌ The UI does **not** use the words "tag", "label", or "category"

### Validation / Error States

- ❌ If no genre is selected, the Post action is disabled or blocked
- ℹ️ I see a clear inline message indicating a genre is required

### Explicit Exclusions

- 🚫 I cannot select more than one genre
- 🚫 I cannot change the declared genre after posting (MVP)
- 🚫 I cannot enter a custom genre
- 🚫 Suggested genres are not available at creation time

---

## US-3: Add an Optional Caption to a Post

### User Story
**As a** user creating a post,  
**I want to** optionally add a caption  
**so that** I can provide context for my outfit.

### Acceptance Criteria

- ✅ I can enter a caption as plain text
- ✅ The caption is optional
- ✅ The caption is displayed on the post detail view after submission

### Validation Rules

- ℹ️ Caption length is limited (character cap enforced)

### Explicit Exclusions

- 🚫 Hashtags are not supported
- 🚫 Mentions are not supported
- 🚫 Links are not supported
- 🚫 Rich text or markdown is not supported

---

## US-4: Select an Optional Country for a Post

### User Story
**As a** user creating a post,  
**I want to** optionally select the country I am in  
**so that** my post can be filtered geographically.

### Acceptance Criteria

- ✅ I can leave the country unset (default = **Everywhere**)
- ✅ I can select a country from a searchable list
- ✅ The selected country is stored using an **ISO alpha-2 code**
- ✅ The country is displayed on the post detail view if set

### Explicit Exclusions

- 🚫 I cannot select city or state
- 🚫 Country is not auto-detected
- 🚫 Country selection is not required

---

## US-5: Submit a Post Successfully

### User Story
**As a** user creating a post,  
**I want to** submit my post once all required fields are complete  
**so that** it becomes visible in the application.

### Acceptance Criteria

✅ **I can submit the post only when:**
- At least 1 image is uploaded
- Exactly 1 primary genre is selected

✅ **Upon submission:**
- A post record is created
- Image records are created with preserved order
- The post has **zero votes**
- I am navigated to the **Post Detail View** after submission

### Explicit Exclusions

- 🚫 No voting occurs during submission
- 🚫 No suggested genres are created
- 🚫 No feeds are updated as part of this story
- 🚫 No notifications are sent

---

## US-6: Prevent Submission When Required Data Is Missing

### User Story
**As a** user creating a post,  
**I want** clear feedback when required information is missing  
**so that** I understand how to complete my post.

### Acceptance Criteria

- ✅ If I attempt to submit without images, submission is blocked
- ✅ If I attempt to submit without a declared genre, submission is blocked
- ✅ Errors are shown inline near the relevant field
- ✅ Errors are clear and non-technical

### Explicit Exclusions

- 🚫 No modal error dialogs
- 🚫 No multi-step confirmation flows

---

## US-7: Persist Post Data Correctly

### User Story
**As the** system,  
**I want to** persist post data in a consistent structure  
**so that** future features can rely on it.

### Acceptance Criteria

✅ **The post is stored with:**
- user ID
- declared genre ID
- caption (nullable)
- country code (nullable)
- created timestamp

✅ **Images are stored separately with:**
- post ID
- image URL
- order index

❌ **No vote records are created**

---

## Feature 1 — Explicit Out of Scope (Reiterated)

For Antigravity clarity, Feature 1 **must not include:**

- 🚫 Genre chips beyond the declared genre
- 🚫 Voting of any kind
- 🚫 Suggested genres
- 🚫 Feeds
- 🚫 Profiles
- 🚫 Brand references
- 🚫 Comments or reactions
- 🚫 Notifications
- 🚫 Moderation tools

---

**Total User Stories:** 7  
**Status:** 📋 Documented  
**Related:** [feature-1-create-post.md](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md)
