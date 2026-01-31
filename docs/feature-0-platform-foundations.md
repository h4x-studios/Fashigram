# Feature 0: Platform Foundations (Auth + Storage)

## Purpose of This Feature

Provide identity and storage primitives required for all other MVP features, while explicitly preventing social drift.

This feature establishes:
- **Who a user is**
- **How they authenticate**
- **Where images live**
- **What the system can trust**

**Nothing more.**

---

## 1. Feature Objective

Enable users to:
- Authenticate securely
- Maintain a stable identity
- Upload and retrieve images

Enable the system to:
- Associate actions with users
- Prevent anonymous voting
- Persist post media safely

---

## 2. Authentication (OAuth / Login)

### 2.1 Supported Login Methods (MVP)

- **Email + password** OR
- **OAuth providers** (e.g. Google, Apple)

#### Rules
- Authentication must return a **stable `user_id`**
- `user_id` is the only authority for ownership and voting

### 2.2 User Identity Model

On first login, a user record is created with:
- `id` (UUID or equivalent)
- `username` (unique, user-chosen or derived)
- `avatar_url` (nullable, can be OAuth profile pic or placeholder)
- `bio` (nullable)
- `created_at`

#### Explicit Exclusions
- ❌ No follower graph
- ❌ No social graph
- ❌ No public activity log

### 2.3 Session Rules

**Logged-in users can:**
- Create posts
- Vote
- Suggest genres

**Logged-out users can:**
- Browse feeds
- View posts
- View profiles (read-only)

**No "soft voting" or guest actions.**

---

## 3. Storage (Images)

### 3.1 Image Storage Requirements

- Images are stored in **managed object storage** (e.g. S3, Cloudflare R2, Vercel Blob)
- Each image is associated with:
  - A `post_id`
  - An `order` index (for multi-image posts)
- URLs are retrievable for display

### 3.2 Upload Rules

- **Only authenticated users** can upload images
- Uploads are limited to:
  - Image formats only (JPEG, PNG, WebP)
  - Size limits (e.g., 10MB per image, configurable)
- **Images are immutable after upload** (MVP)

### 3.3 Retrieval Rules

Images can be fetched:
- For feeds
- For post detail view
- For profiles

- ❌ No public write access
- ✅ Read access is controlled by the app

---

## 4. Security & Abuse Boundaries

### Identity Enforcement

**All votes require:**
- A valid authenticated user

**All posts require:**
- A valid authenticated user

### Storage Enforcement

**Users cannot:**
- Modify or delete other users' images
- Overwrite existing images

---

## 5. Explicit Out-of-Scope (Critical)

Feature 0 must **NOT** include:

- 🚫 Following / followers
- 🚫 Messaging
- 🚫 Notifications
- 🚫 Account discovery
- 🚫 Social graphs
- 🚫 Analytics dashboards
- 🚫 Admin tooling beyond minimal access

**This is plumbing only.**

---

## 6. Acceptance Criteria (High-Level)

Feature 0 is **complete** when:

1. ✅ Users can authenticate and receive a stable user ID
2. ✅ Authenticated users can upload images
3. ✅ Images persist and are retrievable
4. ✅ User identity is enforced for posting and voting
5. ✅ Logged-out users are read-only

---

## How Feature 0 Fits the MVP Stack

**Execution order (recommended):**

1. **Feature 0** — Auth + Storage ✅ ← **WE ARE HERE**
2. Feature 1 — Create Post
3. Feature 2 — Post Detail View
4. Feature 3 — Genre Chips & Voting
5. Feature 4 — Suggested Genre Governance
6. Feature 5 — Feeds
7. Feature 6 — Profiles

This is the correct dependency graph.

---

**Status:** 📋 Documented  
**Dependencies:** None (foundational)  
**Next:** Implementation plan and technology selection
