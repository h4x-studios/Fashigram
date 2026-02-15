# Bug Report: Non-Seamless Auth & Missing Profile Onboarding

## Status: Resolved

### Issue 1: Login/Signup Page Accessibility
**Description:** Logged-in users were able to navigate to `/auth/login` and `/auth/signup` without being redirected, causing a disconnected user experience.
**Fix:** Added an anti-flicker redirect using `useAuth` in both pages to send authenticated users back to the home page automatically.

### Issue 2: Social Login (Google) Lacks Username Persistence
**Description:** Google/Social logins bypass the "pick a username" step found in the email signup flow. This resulted in users being assigned default generated usernames (e.g., `user_12345678`) without a clear way to change them or complete their profile.
**Fix:** 
1.  Updated `AuthContext` to detect "placeholder" usernames starting with `user_`.
2.  Implemented a dedicated `/auth/setup` onboarding page.
3.  Added a global check on the Home page to redirect any user with a placeholder username to the setup page, ensuring every account has a chosen username before interacting with the feed.

### Issue 3: OAuth Redirect URLs
**Description:** Google login redirect URLs were inconsistent.
**Fix:** Standardized `redirectTo` to `${window.location.origin}/` to ensure consistent session handling across environments.
