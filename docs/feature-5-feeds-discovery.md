# Feature 5: Feeds (New & Top) with Genre + Country Filtering

## Purpose of This Feature

Feature 5 introduces discovery to Fashigram.

It surfaces posts through two clearly defined feeds:
- **New** — chronological
- **Top** — consensus-based

This feature consumes data created by Features 1–4 but does not modify post-level behavior.

Feeds must feel:
- Calm
- Coherent
- Predictable
- Non-competitive

---

## 1. Feature Objective

Enable users to:
- Browse posts via **New** and **Top** feeds
- Filter feeds by:
  - Genre
  - Country
- Understand why posts appear where they do (implicitly, not through UI explanation)

This feature does **not** introduce social feedback loops.

---

## 2. Preconditions

This feature assumes:
- ✅ Feature 1 (Create Post) complete
- ✅ Feature 2 (Post Detail View) complete
- ✅ Feature 3 (Genre Chips & Voting) complete
- ✅ Feature 4 (Suggested Genre Governance) complete
- ✅ Vote data exists and is reliable

---

## 3. Feed Types (Locked)

### 3.1 New Feed

**Definition:** Displays posts in reverse chronological order

**Rules:**
- Sorted strictly by `created_at` DESC
- No weighting
- No personalization
- No vote consideration

### 3.2 Top Feed

**Definition:** Displays posts ranked by community validation of declared genre

**Ranking Formula (Deterministic):**

```
Top Score = Declared Genre Validation Votes × Time Decay
```

**Where:**
- Only votes on the **declared genre** are counted
- Suggested genre votes are **ignored**
- Time decay prevents permanent dominance

**Rules:**
- Ranking is deterministic
- No ML
- No personalization

---

## 4. Filters (Authoritative)

### 4.1 Genre Filter

- User can select **one genre**
- Filter applies to both New and Top feeds

**Filter Logic:**
- Show posts where: `declared_genre = selected_genre`
- Suggested genres are **not** used for feed inclusion in MVP

### 4.2 Country Filter

- **Default:** Everywhere
- User can select **one country**

**Filter Logic:**

| Setting | Behavior |
|---------|----------|
| **Everywhere** | Show all posts |
| **Country selected** | Show only posts where `post.country_code = selected_country` |
| **Posts without country** | Included in "Everywhere", excluded when country selected |

---

## 5. Feed UI Requirements

### 5.1 Feed Tabs

Two tabs:
- **New**
- **Top**

- Tabs are visually equal
- No default emphasis on Top

### 5.2 Feed Items (Post Tiles)

Each feed item displays:
- Post image (placeholder acceptable)
- Declared genre (static label)
- Username (optional; can be omitted in tile view if needed)

**Explicit exclusions:**
- 🚫 No vote counts
- 🚫 No chip interactions
- 🚫 No likes
- 🚫 No comments
- 🚫 No brand indicators

**Feeds are entry points, not interaction surfaces.**

---

## 6. Navigation

Tapping a feed item:
- Opens the Post Detail View
- No inline expansion
- No quick actions

---

## 7. Pagination & Loading

- Feeds load incrementally (pagination or infinite scroll)
- Loading states are shown
- No "pull to refresh" requirements in MVP (optional)

---

## 8. Performance & Integrity Rules

**Feed queries must:**
- Be deterministic
- Be cacheable

**Vote updates:**
- May update Top feed ordering
- Do not require real-time reordering in MVP
- Eventual consistency is acceptable

---

## 9. Explicit Out-of-Scope (Non-Negotiable)

This feature must **NOT** include:

- 🚫 Suggested genre inclusion in feeds
- 🚫 Brand references
- 🚫 Sponsored posts
- 🚫 Personalized feeds
- 🚫 Following logic
- 🚫 Notifications
- 🚫 Trending labels
- 🚫 Infinite resurfacing of old posts
- 🚫 User influence weighting

**If any of these appear, the feature has exceeded scope.**

---

## 10. Acceptance Criteria (High-Level)

Feature 5 is **complete** when:

1. ✅ Users can switch between New and Top feeds
2. ✅ Feeds display posts correctly
3. ✅ Genre filter works as specified
4. ✅ Country filter works as specified
5. ✅ Top feed reflects declared-genre validation votes with decay
6. ✅ No social or brand mechanics appear

---

**Status:** 📋 Documented  
**Dependencies:** [Features 1-4](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs)  
**Next:** Implementation plan and time decay formula specification
