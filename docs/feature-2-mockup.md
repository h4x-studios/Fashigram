# Feature 2: Post Detail View — UI Mockup Analysis

> **Note:** This mockup illustrates the intended visual style for the Post Detail View.  
> It includes elements (voting, likes, comments) that are **explicitly out of scope** for the Feature 2 implementation.

---

## Post Detail UI Mockup

![Post Detail UI Mockup](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/mockup-feature-2-post-detail.png)

---

## Layout & Component Analysis

### 1. User Header
- **Avatar**: Circular image on the left.
- **Username**: Bold text next to the avatar (e.g., "CherryPop").
- **Primary Genre Chip**: A small, light pink chip directly below the name, showing the declared intent.

### 2. Media Gallery (Dynamic Grid)
The mockup illustrates a **3-image layout**:
- **Primary Image**: Large square (or 4:5) on the left.
- **Secondary Images**: Two smaller squares stacked vertically on the right.

### 3. Chip Section (Future Surface)
- This area sits directly below the images.
- **Feature 2 Limit**: For now, this will only display the **Declared Genre** as a static chip. No counts, no "+" suggesting, no interactive voting.

### 4. Caption Section
- Plain text below the chips.
- Focus is on clean typography and readability.

---

## MVP Feature 2 Boundries (Applying the Mockup)

| Element in Mockup | MVP / Feature 2 Status | Implementation Rule |
|-------------------|------------------------|---------------------|
| Back Arrow | ✅ Include | Simple navigation back |
| "..." Menu | ❌ Exclude | Out of scope for MVP |
| Like/Comment counts | ❌ Exclude | Popularity metrics are forbidden in MVP |
| Vote counts on chips | ❌ Exclude | Feature 2 is read-only foundation |
| Suggestion chip (+) | ❌ Exclude | Suggested genres are out of scope for now |
| Bottom Navbar | ✅ Include | Home, (+), and Profile icons |

---

## Technical Design: Media Grid Logic

To handle the 1-3 image requirement elegantly:
- **1 Image**: Full width, preserved aspect ratio.
- **2 Images**: Two equal columns.
- **3 Images**: 2/3 width for primary, 1/3 width stack for secondary (as shown in mockup).

---

**Status:** 🎨 Mockup analyzed  
**Next:** Implementing the Post Detail View logic and styling.
