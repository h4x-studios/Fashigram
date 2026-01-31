# Feature 1: Create Post — Declared Genre & Media

## 1. Feature Objective

Enable a signed-in user to create a fashion post by:
- uploading 1–3 images
- declaring exactly one primary genre (intent)
- optionally adding a caption and country

**This feature captures intent, not validation.**  
No community interaction occurs here.

---

## 2. User Flow (Locked)

1. User opens **Create Post**
2. User uploads **1–3 images**
3. User selects **exactly one primary genre**
4. User optionally:
   - adds a caption
   - selects a country
5. User submits post
6. Post is created with **zero votes**
7. User is taken to the **Post Detail View**

---

## 3. Functional Requirements

### FR-1: Image Upload

**Constraints:**
- **Minimum**: 1 image
- **Maximum**: 3 images
- Order is preserved
- Images are stored but no image analysis is performed

**Explicit exclusions:**
- ❌ No filters
- ❌ No cropping tools
- ❌ No tagging inside images
- ❌ No video
- ❌ No alt-text (can be added later)

---

### FR-2: Declared Primary Genre (Required)

**Rules:**
- User **must** select exactly one genre
- Selection is done via:
  - a **"+" input**
  - searchable controlled list
- Genre list is **centrally managed**
- Genre **cannot** be free-text

**Hard constraints:**
- ❌ User cannot submit without a genre
- ❌ User cannot select more than one
- ❌ User cannot change the declared genre after posting (MVP)

---

### FR-3: Caption (Optional)

**Allowed:**
- Plain text only
- Character-limited

**Explicit exclusions:**
- ❌ No hashtags
- ❌ No mentions
- ❌ No markdown
- ❌ No links
- ❌ No emojis required to parse

---

### FR-4: Country (Optional)

**Rules:**
- User may select a country
- Stored as **ISO alpha-2 code**
- Default is **unset** ("Everywhere")

**Explicit exclusions:**
- ❌ No city/state
- ❌ No GPS
- ❌ No auto-detection
- ❌ No required field

---

### FR-5: Post Submission

**Post is created with:**
- declared genre
- images
- caption (if provided)
- country (if provided)

**No votes are created**  
**No chips are interactive yet**  
**No feed logic is triggered here**

---

## 4. Data Created (Authoritative)

When submission succeeds, create:

### `post`
- `id`
- `user_id`
- `declared_genre_id`
- `caption`
- `country_code`
- `created_at`

### `post_images`
- `post_id`
- `image_url`
- `order_index`

> **Note:** No vote rows created at this stage

---

## 5. UX Rules (Important)

### Language
✅ **Use:** "I am posting this as:"

❌ **Do NOT use:**
- "Tag"
- "Label"
- "Category"

> This reinforces **intent**, not classification.

### Error States
- If no image → **block submission**
- If no genre → **block submission**
- **Clear inline errors only**
- No modal confirmations

---

## 6. What This Feature Must NOT Do

These are explicit boundaries for Antigravity.

- 🚫 **No voting**
- 🚫 **No chip interaction**
- 🚫 **No suggested genres**
- 🚫 **No feeds**
- 🚫 **No popularity metrics**
- 🚫 **No profile logic**
- 🚫 **No moderation tooling**
- 🚫 **No brand logic**
- 🚫 **No notifications**

> If any of these appear, the feature is out of scope.

---

## 7. Dependencies

- ✅ User authentication must exist
- ✅ Controlled genre list must exist (static is acceptable)
- ✅ Storage must accept image uploads

---

## 8. Acceptance Criteria (Binary)

This feature is **complete** when:

1. ✅ A user can create a post with 1–3 images
2. ✅ A post cannot be created without a declared genre
3. ✅ Declared genre is stored immutably
4. ✅ Post appears in Post Detail View
5. ✅ No other system behavior is triggered

---

**Status:** 📋 Documented  
**Next:** Backend schema design & mobile UI implementation
