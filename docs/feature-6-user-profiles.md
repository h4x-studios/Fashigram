# Feature 6: User Profiles as Archives (Read-Only, Non-Social)

## Purpose of This Feature

Feature 6 introduces user profiles as **personal fashion archives**, not social hubs.

Profiles exist to:
- Collect a user's historical posts
- Show consistency or evolution of style
- Provide a stable identity anchor

**Profiles are not designed for influence, ranking, or interaction.**

---

## 1. Feature Objective

Enable users to:
- View a user's profile page
- See that user's post history
- Understand their style through accumulated work

This feature does **not** introduce:
- Following
- Popularity metrics
- Ranking
- Discovery bias

---

## 2. Preconditions

This feature assumes:
- ✅ Feature 1 (Create Post)
- ✅ Feature 2 (Post Detail View)
- ✅ Feature 3 (Genre Chips & Voting)
- ✅ Feature 4 (Suggested Genre Governance)
- ✅ Feature 5 (Feeds)
- ✅ All post data and votes already exist

---

## 3. Profile Page Structure (Authoritative)

The profile page displays, top to bottom:

### 3.1 User Header

- Avatar
- Username
- Bio (plain text)

**Rules:**
- Bio is optional
- No statistics are shown
- No badges or labels

### 3.2 Post Archive Grid

Displays all posts created by the user:
- Sorted by `created_at` DESC
- Displayed as a grid of post tiles

**Each tile:**
- Shows a single image (placeholder acceptable)
- Does **not** show vote counts
- Does **not** show chips

### 3.3 Profile-Level Filters (Lightweight)

Optional filter controls:
- **Declared Genre filter** (single-select)

Optional toggle:
- "Include suggested genre matches"

These filters affect **only this profile view**.

---

## 4. Navigation Rules

**Profiles can be accessed by:**
- Tapping a username in Post Detail View
- Direct URL (web)

**Tapping a post tile:**
- Opens the Post Detail View

---

## 5. Data Rules

**Profiles read from:**
- `users`
- `posts`
- `post_images`

**Profiles do not:**
- Aggregate vote counts
- Compute rankings
- Infer style labels automatically

---

## 6. Interaction Rules (Strict)

### Allowed interactions:
- Navigate to post detail
- Scroll archive
- Apply profile-local filters

### Disallowed interactions:
- 🚫 Following users
- 🚫 Messaging users
- 🚫 Liking users
- 🚫 Ranking users
- 🚫 Endorsing users
- 🚫 Saving profiles

**Profiles are archives, not social nodes.**

---

## 7. Empty & Edge States

| State | Behavior |
|-------|----------|
| User has no posts | Show a neutral empty state |
| Bio is empty | Bio section is omitted |
| Profile does not exist | Show "User not found" |

---

## 8. UX Language Constraints

**Do not:**
- Label profiles as "creators"
- Use "followers", "fans", or "engagement"
- Use comparative language

**Profiles should feel:**
- Calm
- Documentary
- Non-competitive

---

## 9. Explicit Out-of-Scope (Non-Negotiable)

This feature must **NOT** include:

- 🚫 Follow / unfollow
- 🚫 Likes or hearts
- 🚫 Commenting
- 🚫 Profile ranking
- 🚫 Featured users
- 🚫 Brand affiliations
- 🚫 Monetization
- 🚫 Notifications

**If any of these appear, the feature has exceeded scope.**

---

## 10. Acceptance Criteria (High-Level)

Feature 6 is **complete** when:

1. ✅ Users can view a profile page
2. ✅ Profiles show avatar, username, bio
3. ✅ Profiles display a chronological archive of posts
4. ✅ Users can navigate from profile → post → profile
5. ✅ No social metrics or actions exist

---

**Status:** 📋 Documented  
**Dependencies:** [Features 1-5](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs)  
**Next:** User stories and implementation plan
