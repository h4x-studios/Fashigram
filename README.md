# 🚀 FASHIGRAM — MVP

**Fashion discovery driven by consensus, not popularity.**

---

## 📋 Overview

Fashigram is a fashion discovery platform where users declare a primary genre per post, and the community validates and contextualizes that genre through voting. Discovery is driven by consensus and style coherence, not attention metrics.

### Core Principle
> Fashion is treated as **culture and archive**, not performance.  
> **Consensus matters more than attention.**

---

## 🎯 Core User Loop

1. **User creates a post** with a declared genre
2. **Other users vote** to validate that genre
3. **Users suggest additional genres** via voteable chips
4. **Feeds update dynamically** based on votes + time
5. **Profiles accumulate** a historical archive of posts

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native + Expo |
| **Web** | Next.js |
| **Backend** | Supabase (Postgres, Auth, Storage, RLS) |
| **Logic** | Supabase Edge Functions |
| **Images** | Supabase Storage |

---

## 📦 MVP Feature Set (LOCKED)

### A. Account & Identity

**Included:**
- Email or OAuth sign-in
- Unique username
- Avatar image
- Plain-text bio (character-limited)

**Explicitly Excluded:**
- Followers
- Likes
- Public popularity metrics
- DMs

---

### B. Post Creation

**B1. Create Post**
- Upload 1–3 images (placeholders acceptable for MVP UI)
- Optional caption (plain text only, no hashtags)
- Declared Primary Genre (required, exactly one)
- Country (optional, ISO alpha-2 country code, default = Everywhere)

**B2. Genre Selection UX**
- Genre added via "+" input
- Searchable controlled list
- No free-text tags in MVP

---

### C. Genre & Tag System (CORE VALUE)

**C1. Controlled Genre Taxonomy**
- Centrally managed genre list
- Style-based (not brands)
- Covers niche, alt, and mainstream fashion

**C2. Genre Chips (Visual + Interactive)**

Each post displays genre chips consisting of:
- Genre label
- Overlapping number bubble showing vote count
- Genre bubble visually overlaps number bubble (not vice versa)
- Chip size scales as vote count increases (bucketed, non-linear)

**Chip Types:**
1. **Primary (Declared) Genre Chip**
   - Always present
   - Eligible for Top feed ranking
2. **Suggested Genre Chips**
   - Added via suggestion
   - Voteable
   - Informational only (non-ranking)

**C3. Voting Rules**
- Tapping a chip = +1 vote
- No downvotes
- No "wrong genre" actions
- No visible voter attribution
- Silence = neutral

**C4. Suggesting Genres**
- One standalone "+" chip per post
- Opens searchable controlled genre list
- Adds a suggested genre chip with initial vote
- Suggested genres:
  - Can accumulate votes
  - Can surface in filters
  - **Never override declared genre**

---

### D. Feeds & Discovery

**D1. Feed Tabs**
- **New**: Chronological
- **Top**: Vote-weighted with time decay

**D2. Feed Ranking**

| Feed | Ranking Logic |
|------|---------------|
| **New** | Chronological, filterable by Genre + Country |
| **Top** | `Declared Genre Validation Votes × Time Decay`, filterable by Genre + Country |

> **Note:** Suggested genre votes do **not** affect Top ranking.

**D3. Filters**
- **Genre filter**: Searchable
- **Country filter**: Default = Everywhere. When selected, shows only posts from that country.

---

### E. Post Detail View

**Displays:**
- Username + avatar
- Country (if set)
- Image gallery (1–3 images, full-screen on tap)
- Caption
- Genre chips section
- Standalone "+" for suggesting additional genres

**Explicitly Excluded:**
- Likes
- Comments
- Reactions

---

### F. Profiles (Archive-First)

**F1. User Profile Page**
- Avatar
- Username
- Bio
- Chronological grid of all posts

**F2. Profile Filters**
- By declared genre
- Optional toggle to include suggested-genre matches
- No ranking on profiles

---

### G. Location System (MVP)

- Posts may include a **country**
- Default view = **Everywhere**
- Selecting a country shows only posts from that country
- Country list is **client-side static**

---

### H. Safety & Constraints

**Structural:**
- No comments
- No likes
- No followers
- No hashtags
- No brand tagging in posts

**System:**
- Vote rate limits
- Suggestion caps
- Admin reporting tools

---

## 🔒 System Invariants (Must Not Be Violated)

1. **Declared genre determines Top feed lane**
2. **Suggested genres never affect Top ranking**
3. **No negative feedback mechanisms**
4. **No brand influence on ranking**
5. **No popularity metrics exposed**

---

## ✅ Functional Requirements

| ID | Requirement |
|----|-------------|
| **FR-1** | Enforce exactly one declared genre per post |
| **FR-2** | Enforce 1–3 images per post |
| **FR-3** | Optional country + caption |
| **FR-4** | Render overlapping label + count bubble for genre chips |
| **FR-5** | Scale chip visually with votes |
| **FR-6** | Support tap-to-vote on chips |
| **FR-7** | Standalone "+" control for suggesting genres |
| **FR-8** | Controlled genre list only (no free-text) |
| **FR-9** | Voteable suggestions |
| **FR-10** | New feed: chronological |
| **FR-11** | Top feed: vote-weighted with decay |
| **FR-12** | Filterable feeds by genre + country |
| **FR-13** | Profile archive of posts |
| **FR-14** | No ranking on profiles |
| **FR-15** | Genre-based filtering on profiles |

---

## 🚫 Explicit Out-of-Scope (MVP)

- Brand pages
- Sponsored content
- User-created tags
- Comments / DMs
- Notifications
- Monetization

---

## 📊 Success Criteria (MVP)

1. **Voting actions > posting actions**
2. **Genre feeds feel stylistically coherent**
3. **Users understand chip behavior without instruction**
4. **Minimal abuse reports**

---

## 🔮 Phase-2 Hooks (Do Not Implement Yet)

- Genre pages with smart blurbs
- Brand references on genre pages
- Community tag incubation
- Collections / saving posts

---

## 📂 Project Structure

```
Fashigram/
├── docs/          # Documentation & design specs
├── backend/       # Supabase edge functions & DB schema
├── mobile/        # React Native + Expo app
├── web/           # Next.js web app
└── README.md      # This file
```

---

## 🚀 Getting Started

1. **Review the PRD** (this document)
2. **Set up Supabase project**
3. **Define database schema** (posts, genres, votes, users)
4. **Implement backend logic** (Edge Functions for ranking, voting)
5. **Build mobile UI** (React Native)
6. **Build web UI** (Next.js)
7. **Test & validate** against success criteria

---

## 📝 License

TBD

---

**Built with ❤️ for fashion culture and consensus-driven discovery.**
