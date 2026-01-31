# Feature 1: Create Post — UI Mockup

> **Note:** This mockup illustrates intended layout and visual hierarchy.  
> It does not define feature scope beyond the [feature specification](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md).

---

## Mobile UI Mockup

![Create Post UI Mockup](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/mockup-feature-1-create-post.png)

---

## Visual Hierarchy Analysis

### 1. Header
- **"New Post"** title (centered)
- **Back arrow** (top-left)

### 2. Photo Upload Section
- Large upload area with **"+" icon**
- Label: **"Add Photos (1-3)"**
- Clean, minimal design

### 3. Declared Genre Section (Required)
- Label: **"I am posting this as:"**
- **"+ Set genre"** button (pink accent)
- Helper text:
  - _"This sets where your post appears."_
  - _"Others can suggest additional genres."_

### 4. Caption Section (Optional)
- Label: **"Caption (optional)"**
- Placeholder: _"Write something about this look..."_

### 5. Tags Section (Community Perception)
- Label: **"Tags (community perception)"**
- Shows declared genre chip: **"Decora • 0"** (pink)
- **"+ Suggest a genre"** button

> **Important for Feature 1 Implementation:**  
> Per the [feature spec](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md#6-what-this-feature-must-not-do), the "Suggest a genre" functionality is **explicitly out of scope** for Feature 1.  
> 
> The Tags section in the mockup shows the full post-creation vision, but **Feature 1 should only display the declared genre** without vote counts or suggestion mechanisms.

### 6. Submit Button
- Large pink **"Post"** button
- Full-width, bottom-aligned

---

## Key UX Elements

| Element | Description | Spec Reference |
|---------|-------------|----------------|
| **Photo upload** | 1-3 images required | [FR-1](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md#fr-1-image-upload) |
| **"I am posting this as:"** | Required copy per spec | [UX Rules](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md#5-ux-rules-important) |
| **Set genre button** | Searchable controlled list | [FR-2](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md#fr-2-declared-primary-genre-required) |
| **Caption field** | Optional, plain text | [FR-3](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md#fr-3-caption-optional) |
| **Post button** | Primary action, disabled until valid | [FR-5](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md#fr-5-post-submission) |

---

## MVP Simplifications for Feature 1

For the initial Feature 1 implementation:

1. ✅ **Include:**
   - Photo upload (1-3)
   - "I am posting this as:" label
   - "+ Set genre" button → searchable list
   - Caption field (optional)
   - Country selector (optional, not shown in mockup)
   - "Post" button

2. ❌ **Exclude from Feature 1:**
   - "Tags (community perception)" section
   - Vote count display ("• 0")
   - "+ Suggest a genre" button
   - Any interactive chip behavior

3. 🔄 **Display declared genre:**
   - Show selected genre as text or static chip
   - No vote count
   - No tap interaction

---

## Design Notes

- **Color scheme:** Pink accent (#E91E63 or similar)
- **Typography:** Clean, modern sans-serif
- **Spacing:** Generous whitespace between sections
- **Hierarchy:** Clear visual flow from top to bottom
- **Mobile-first:** Optimized for portrait orientation

---

**Status:** 🎨 Mockup documented  
**Related:**
- [Feature 1: Technical Spec](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-create-post.md)
- [Feature 1: User Stories](file:///wsl.localhost/Ubuntu/root/projects/Fashigram/docs/feature-1-user-stories.md)
