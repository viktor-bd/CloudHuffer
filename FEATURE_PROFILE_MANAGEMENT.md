# Feature: Profile Management (feature/profile-management)

This file captures progress, current implementation details, and next steps for the "Profile Management" backlog item. It was created from an implementation session on branch `feature/profile-management`.

---

What I implemented
- Branch: `feature/profile-management` (pushed to origin)
- Front-end MVP: profile management implemented in the Angular web app, persisted to browser `localStorage`.
- Import/export: JSON export and file import are supported.
- Profile model: supports multiple characters per profile with base m³/min and bonuses (link/module/implant %).

Files added
- `CloudHufferWeb/src/app/models/profile.models.ts`
- `CloudHufferWeb/src/app/services/profile.service.ts` (localStorage persistence, import/export, active profile)
- `CloudHufferWeb/src/app/profiles/profile-manager.component.ts` (standalone UI component)
- `CloudHufferWeb/src/app/services/profile.service.spec.ts` (unit tests)
- `FEATURE_PROFILE_MANAGEMENT.md` (this file)

Files updated
- `CloudHufferWeb/src/app/components/probe-parser.component.html` (integrated `<app-profile-manager>`)
- `CloudHufferWeb/src/app/components/probe-parser.component.ts` (registered component import)
- `CloudHufferWeb/src/styles.css` (small profile UI style tweaks)
- `CloudHufferWeb/angular.json` (production default restored; increased `anyComponentStyle` budget to accommodate styles)
- `.github/workflows/ci.yml` (frontend tests added to CI step)

How it behaves now
- Profiles are saved in localStorage under key `ch_profiles_v1`.
- Creating a profile auto-creates one character with default bonuses.
- You can add/remove characters per profile, edit names, base rate and bonuses.
- Export triggers a downloaded JSON file; import accepts a JSON file and merges valid profiles.
- Active profile can be selected; UI computes an effective huff rate per character as:
  `effective = baseRate * (1 + (link + module + implant) / 100)`

Build & test
- Run frontend build: `cd CloudHufferWeb && npm ci && npm run build` (production by default)
- Run frontend tests: `cd CloudHufferWeb && npm ci && npm test`
- CI was updated to run `npm test` before the build step.

Notes on decisions
- Chose localStorage-first approach to deliver value quickly without backend/auth changes.
- Kept server-side persistence as a planned follow-up (see next steps). This avoids migration and auth scope creep.
- Increased component style budget in `angular.json` from default to allow current CSS size; we can revisit by trimming CSS or splitting styles.

Next steps (pickable items)
1. Polish UI
   - Improve layout, icons, and better theming for the profile manager.
   - Make the import control visually consistent with theme (minor styling already added in `src/styles.css`).
2. Tests & CI improvements
   - Add component-level unit tests for `ProfileManagerComponent` and more negative tests for import validation.
   - Add E2E tests if desired.
3. Server-side persistence (design & incremental rollout)
   - Proposed API endpoints (requires authentication & ownership):
     - GET `/api/profiles` — list profiles for the current user
     - POST `/api/profiles` — create profile
     - PUT `/api/profiles/{id}` — update profile
     - DELETE `/api/profiles/{id}` — delete profile
     - POST `/api/profiles/import` — bulk import
   - Migration approach:
     1. Keep client localStorage fallback.
     2. When the user authenticates, offer an explicit import/merge of local profiles to the server (user action avoids accidental overwrite).
     3. Provide a simple sync strategy (merge by `updatedAt`, allow user to choose on conflicts).
   - Implementation plan: add DTOs + controller to `CloudHufferApi`, protect endpoints, then add client calls in `ProfileService` behind a feature flag.
4. Deployment considerations
   - If hosting static site separately from API, continue localStorage-first and enable sync for logged-in users.
   - If serving static files from the API host, add server endpoints to `CloudHufferApi` and choose auth strategy (cookie or JWT). Prefer JWT for SPA + API separation.

Notes about this branch
- No merges were performed into other branches. The branch was pushed to `origin/feature/profile-management`.
- Commit messages follow the local pattern (prefixed with `feat/` / `chore/` where applicable).

How to pick this up later
- Checkout the branch: `git fetch origin && git checkout feature/profile-management`
- Run tests and build locally: follow "Build & test" above.
- For server-side work, start by drafting API controllers and DTOs in `CloudHufferApi` and open a new branch `feature/profile-server-sync` that depends on this branch.

Contact / context
- This summary was generated from an implementation session and PR-ready code exists on branch `feature/profile-management`.

---

End of summary.
