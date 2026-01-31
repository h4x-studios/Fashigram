# Feature 2: Post Detail View (Read-Only Foundation)

## 🔹 Purpose of This Feature

Feature 2 establishes the canonical, **read-only representation** of a post.

This feature exists to:
- Display the post created in Feature 1
- Establish layout and data contracts
- Prepare the surface where later features (chips, voting, suggestions) will attach

**No interaction logic is introduced yet.**  
This is a **presentation and data integrity feature**.

---

## 1. Feature Objective

Enable any user to view an individual post in a dedicated **Post Detail View** that displays:

- The post's media
- The posting user's identity
- The declared genre (static)
- The caption
- The country (if provided)

This feature does **not** allow interaction beyond navigation and image viewing.

---

## 2. Entry Points (Locked)

A user can reach the Post Detail View by:

1. Being redirected after successfully creating a post (Feature 1)
2. Navigating to a post via a direct link (web)
3. Tapping a post tile (placeholder navigation for now)

No other entry points are required in this phase.

---

## 3. Display Requirements (Authoritative)

The Post Detail View must display the following, **in order**:

### 3.1 User Header

**Displays:**
- User avatar
- Username
- Country (if set)

**Rules:**
- Country is displayed **only if provided**
- Country is displayed as a **name**, not ISO code

---

### 3.2 Media Section

**Displays:**
- 1–3 images associated with the post
- Images are shown as placeholders initially if final image handling is not complete
- Images preserve the **order set during post creation**

**Interaction:**
- Images can be tapped to view **full-screen**
- Full-screen view supports **swipe between images**

**Explicit exclusions:**
- ❌ No image editing
- ❌ No reactions
- ❌ No overlays (votes, chips, icons)

---

### 3.3 Declared Genre (Static)

**Display:**
- Display the **declared primary genre**
- Displayed as **non-interactive text or static chip**
- No count, no bubble, no voting

**Purpose:**
- Reinforces intent without implying validation yet

---

### 3.4 Caption

**Display:**
- Display caption if present
- Plain text only
- No hashtags
- No parsing or linkification

---

## 4. Data Requirements

### The Post Detail View must read from:
- ✅ `posts`
- ✅ `post_images`
- ✅ `users`

### It must NOT read from:
- ❌ votes tables
- ❌ suggestion tables
- ❌ feed ranking logic
- ❌ brand data

---

## 5. Interaction Rules (Very Important)

### ✅ Allowed interactions:
- Navigate back
- Tap image → full screen
- Swipe images in full screen

### 🚫 Disallowed interactions:
- Voting
- Suggesting genres
- Following users
- Commenting
- Sharing
- Saving
- Reporting

> **If any of the above appear, the feature is out of scope.**

---

## 6. Error & Edge States

| State | Behavior |
|-------|----------|
| Post does not exist | Show a clear **"Post not found"** state |
| Images fail to load | Show **placeholders** |
| Caption is empty | **Omit the caption section entirely** |

---

## 7. UX Language Constraints

- ❌ Do **not** refer to genres as "tags"
- ❌ Do **not** show any numbers or counts
- ❌ Do **not** show any engagement metrics

**This view should feel quiet and neutral.**

---

## 8. Explicit Boundaries (Non-Negotiable)

This feature must **NOT** include:

- 🚫 Genre chips
- 🚫 Voting
- 🚫 Suggested genres
- 🚫 Feeds
- 🚫 Brand references
- 🚫 Likes or hearts
- 🚫 Comments
- 🚫 Profile navigation (beyond username display)

**This is a display-only feature.**

---

## 9. Dependencies

- ✅ Feature 1 (Create Post) must be complete
- ✅ Post data must exist
- ✅ Image URLs or placeholders must be available

---

## 10. Acceptance Criteria (High-Level)

Feature 2 is **complete** when:

1. ✅ A created post can be viewed in a dedicated Post Detail View
2. ✅ All post data is displayed correctly
3. ✅ Images can be viewed full-screen
4. ✅ No interactive social features exist on this screen

---

**Status:** 📋 Documented  
**Dependencies:** [Feature 1: Create Post](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md)  
**Next:** User stories and mockup documentation
