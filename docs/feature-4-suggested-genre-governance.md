# Feature 4: Suggested Genre Governance (Post-Level)

## Purpose of This Feature

Feature 4 formalizes how suggested genres behave once they exist:
- How many can exist
- How they are ordered
- How they appear relative to the declared genre
- What happens when suggestions grow

This feature does **not** introduce feeds or discovery yet.  
It only stabilizes the meaning of suggested genres.

---

## 1. Feature Objective

Enable suggested genre chips to:
- Behave predictably as votes accumulate
- Remain clearly secondary to declared genre
- Avoid visual noise or dominance
- Avoid taxonomy abuse

This feature is about **control and clarity**, not interaction novelty.

---

## 2. Preconditions

- ✅ Feature 1 (Create Post) complete
- ✅ Feature 2 (Post Detail View) complete
- ✅ Feature 3 (Genre Chips & Voting) complete

---

## 3. Core Rules (Locked)

### 3.1 Declared Genre Priority

**Declared genre:**
- Is always displayed first
- Is visually emphasized
- Cannot be displaced

**Suggested genres never reorder above it, regardless of votes.**

### 3.2 Suggested Genre Limits

**Maximum number of suggested genre chips per post:** `N` (recommend **5**)

**Once the limit is reached:**
- No new suggested genres can be added
- Users may still vote on existing suggestions

This prevents tag sprawl.

### 3.3 Suggested Genre Ordering

**Suggested genre chips are ordered by:**
1. Vote count (descending)
2. Tie-breaker: earliest suggestion timestamp

Ordering is **deterministic and stable**.

---

## 4. UI Requirements

### 4.1 Suggested Genre Chip Display

**Suggested genre chips:**
- Appear after the declared genre chip
- Are visually smaller or lighter
- Use the same chip + overlapping number bubble structure

**The standalone "+" control:**
- Appears after all existing chips
- Is hidden or disabled when max suggestions reached

### 4.2 Overflow Behavior

If suggested genres exceed available horizontal space:
- Chips wrap to a second row
- No horizontal scrolling
- No collapse/expand UI in MVP

---

## 5. Interaction Rules (Refined)

### 5.1 Suggesting When Limit Reached

If user taps "+" after max suggestions:
- Show a non-blocking message:
  > "This post already has the maximum number of genre suggestions."
- No modal interruptions

### 5.2 Duplicate Suggestion Handling

If a user selects a genre that is already suggested:
- The action is treated as a vote
- No duplicate chip is created

---

## 6. Data Rules

Suggested genres are stored as:
- Vote records + derived grouping
- No separate "suggestion" entity is required
- Suggested genre existence is inferred from votes

---

## 7. Explicit Out-of-Scope (Non-Negotiable)

This feature must **NOT** include:

- 🚫 Feed behavior
- 🚫 Discovery logic
- 🚫 Country filtering
- 🚫 Genre pages
- 🚫 Brand references
- 🚫 Admin moderation UI
- 🚫 User-created genres

---

## 8. Acceptance Criteria (High-Level)

Feature 4 is **complete** when:

1. ✅ Suggested genres never outrank the declared genre visually
2. ✅ Suggested genre count is capped
3. ✅ Ordering is stable and predictable
4. ✅ Duplicate suggestions are prevented
5. ✅ The "+" control behaves correctly at limits

---

**Status:** 📋 Documented  
**Dependencies:** [Feature 3](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-3-genre-chips-voting.md)  
**Next:** Implementation plan
