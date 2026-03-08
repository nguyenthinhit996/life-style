# Phase 3 — Verification & Enhancement Plan

> **Purpose:** Section-by-section audit of every admin dashboard page.  
> For each section: what to verify manually, what is currently broken, and the exact fix required.  
> Work through **Fix** items in order before Phase 4.

---

## How to Run Verification

```bash
npm run dev           # start at localhost:3000
# log in at /admin/login
# Email:    <ADMIN_EMAIL>
# Password: <ADMIN_PASSWORD>
```

---

## Section 1 — Dashboard (`/admin`)

### Verify
- [ ] 5 stat cards show correct counts (Total Posts, Published, Drafts, Series, Chapters)
- [ ] "Recent Posts" list shows the 6 newest posts with title, type badge, status badge, and Edit link
- [ ] Series cards grid shows all 6 series with chapter + lesson counts
- [ ] "+ New Post" and "+ New Series" header buttons navigate correctly

### Current State
✅ All working — dashboard was rebuilt with real data in a previous session.

### Fixes Required
None.

---

## Section 2 — Posts List (`/admin/posts`)

### Verify
- [ ] Table shows all posts with Title, Type badge, Category, Status badge, Edit + Delete buttons
- [ ] Edit button navigates to `/admin/posts/[id]/edit`
- [ ] Delete button opens the confirm dialog
- [ ] After confirming delete → post disappears from the list **without** requiring a manual page refresh
- [ ] Type badge colors: lesson = cyan, blog = violet
- [ ] Status badge colors: Published = green, Draft = amber

### Current State
⚠️ **Partial** — Delete API now works (writing to in-memory store), but after `handleDelete()` resolves the page does **not** refresh. The `PostsTable` component calls `fetch DELETE` then closes the dialog but the server-rendered list is stale until the user manually refreshes.

### Bug: `PostsTable.tsx` — no page refresh after delete

**File:** `src/components/admin/PostsTable.tsx`

```tsx
// CURRENT (line ~12-16) — closes dialog but renders stale list
async function handleDelete(id: string) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' })
  setConfirmId(null)
}
```

**Fix:** Add `useRouter` + call `router.refresh()` after delete to re-fetch the server component data.

```tsx
// ADD to imports at top:
import { useRouter } from 'next/navigation'

// ADD inside component body:
const router = useRouter()

// REPLACE handleDelete:
async function handleDelete(id: string) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' })
  setConfirmId(null)
  router.refresh()   // ← re-runs the server component, list updates
}
```

---

## Section 3 — New Post (`/admin/posts/new`)

### Verify
- [ ] Title input auto-generates the slug as you type
- [ ] Slug is editable independently
- [ ] "Blog Post" / "Lesson" type toggle switches correctly
- [ ] Selecting "Lesson" shows the Series and Chapter selects in the right sidebar
- [ ] Selecting a series in the sidebar loads the correct chapters in the Chapter select
- [ ] RichEditor toolbar renders all buttons: Undo/Redo, H1/H2/H3, Bold/Italic/Underline/Strike/Highlight/Code, Align, Lists, Blockquote, Code Block, HR, Link, Image, Clear, Preview toggle
- [ ] Preview toggle shows the rendered HTML below the editor
- [ ] Word count in the editor footer updates as you type
- [ ] "Save Draft" saves with `published: false` and navigates to `/admin/posts`
- [ ] "Publish" saves with `published: true` and navigates to `/admin/posts`
- [ ] After saving, the new post appears in the posts list (confirms mock store write)
- [ ] Cover image URL input in right sidebar shows a live preview thumbnail

### Current State
✅ All working after the API route fix (`createPost` wired up).

> **Note:** Posts only persist while the dev server is running; a restart resets to seed JSON. This is expected until Phase 7 (Firestore).

### Fixes Required
None.

---

## Section 4 — Edit Post (`/admin/posts/[id]/edit`)

### Verify
- [ ] Page loads the existing post data pre-filled in all fields
- [ ] Title, slug, type, content, category, excerpt, cover image all show correct values
- [ ] If type = lesson, Series and Chapter selects show the correct pre-selected values
- [ ] Editing and saving calls `PUT /api/posts/[id]` and updates the in-memory record
- [ ] After save, navigates to `/admin/posts` and the updated title appears

### Current State
✅ Page exists and loads post data. API route is wired to `updatePost`.

### Fixes Required
None.

---

## Section 5 — Series List (`/admin/series`)

### Verify
- [ ] Table shows all 6 series with Icon, Title, Category, Level, Chapters count, Status, Edit button
- [ ] Edit button navigates to `/admin/series/[id]/edit`
- [ ] **Delete button is present** (currently missing!)
- [ ] Delete triggers confirm dialog → removes series from in-memory list → page refreshes

### Current State
❌ **Missing Delete button** in the series table row.  
❌ **Series mutations are TODO stubs** — `POST /api/series` and `PUT /api/series/[id]` and `DELETE /api/series/[id]` all echo the body without writing to the in-memory store.

### Bug A: Missing mutation functions in `mock.ts`

**File:** `src/lib/db/mock.ts`  
Add these functions (same pattern as the `createPost`/`updatePost`/`deletePost` already added for posts):

```ts
// Series mutations
export async function createSeries(data: Omit<Series, 'id'>): Promise<Series> {
  const item: Series = { id: Date.now().toString(), ...data } as Series
  series.push(item)
  return item
}

export async function updateSeries(id: string, data: Partial<Series>): Promise<Series | null> {
  const idx = series.findIndex(s => s.id === id)
  if (idx === -1) return null
  series[idx] = { ...series[idx], ...data, id }
  return series[idx]
}

export async function deleteSeries(id: string): Promise<boolean> {
  const idx = series.findIndex(s => s.id === id)
  if (idx === -1) return false
  series.splice(idx, 1)
  return true
}
```

### Bug B: API routes still TODO stubs

**File:** `src/app/api/series/route.ts` — wire `POST` to `createSeries`  
**File:** `src/app/api/series/[id]/route.ts` — wire `PUT` to `updateSeries`, `DELETE` to `deleteSeries`

### Bug C: No Delete button on series list page

**File:** `src/app/admin/series/page.tsx`

Convert to a client component (`'use client'`) and add:
- `useState` for `confirmId`
- Delete button per row that opens `ConfirmDialog`
- `handleDelete` calling `DELETE /api/series/[id]` + `router.refresh()`

---

## Section 6 — New Series (`/admin/series/new`)

### Verify
- [ ] Title input auto-generates slug
- [ ] All fields work: Title, Slug, Description, Category, Tags (add/remove chips), Icon (emoji), Color (swatches), Level, Published toggle
- [ ] Saving a new series navigates to `/admin/series`
- [ ] New series appears in the list (confirms in-memory write)

### Current State
❌ `POST /api/series` is a stub — series not saved to in-memory store. After save, the series list does not include the new entry.

### Fixes Required
Same as Bug A + Bug B in Section 5.

---

## Section 7 — Edit Series (`/admin/series/[id]/edit`)

### Verify
- [ ] Page loads the existing series data pre-filled
- [ ] All fields are editable
- [ ] Saving navigates to `/admin/series` and shows updated data

### Current State
❌ `PUT /api/series/[id]` is a stub — no real write.

### Fixes Required
Same as Bug A + Bug B in Section 5.

---

## Section 8 — Chapters (`/admin/chapters`)

### Verify
- [ ] Series dropdown loads all series
- [ ] Selecting a series shows its chapters in a table: Order, Title, Lessons count, Edit, Delete
- [ ] **Inline edit:** clicking Edit puts the title row into an input field; saving calls `PUT /api/chapters/[id]`
- [ ] Inline edit cancel restores original value
- [ ] **Delete:** clicking Delete opens confirm dialog → removes chapter → list updates
- [ ] **Add Chapter:** there is a button to add a new chapter to the selected series

### Current State
✅ Series dropdown works.  
✅ Chapters list loads correctly.  
✅ Inline title edit is implemented.  
❌ `PUT /api/chapters/[id]` is a stub — inline edit doesn't persist.  
❌ **No Delete button** on chapter rows.  
❌ **No "Add Chapter" button** — per phase-step.md Step 3.7 this is required.  
❌ **Lessons count column** shows `undefined` — the `Chapter` type has a `totalLessons` field but it may not be populated in the data.

### Bug A: Missing mutation functions in `mock.ts`

```ts
// Chapter mutations
export async function createChapter(data: Omit<Chapter, 'id'>): Promise<Chapter> {
  const item: Chapter = { id: Date.now().toString(), ...data } as Chapter
  chapters.push(item)
  return item
}

export async function updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter | null> {
  const idx = chapters.findIndex(c => c.id === id)
  if (idx === -1) return null
  chapters[idx] = { ...chapters[idx], ...data, id }
  return chapters[idx]
}

export async function deleteChapter(id: string): Promise<boolean> {
  const idx = chapters.findIndex(c => c.id === id)
  if (idx === -1) return false
  chapters.splice(idx, 1)
  return true
}
```

### Bug B: API routes still TODO stubs

**File:** `src/app/api/chapters/route.ts` — wire `POST` to `createChapter`  
**File:** `src/app/api/chapters/[id]/route.ts` — wire `PUT` to `updateChapter`, `DELETE` to `deleteChapter`

### Bug C: No Delete button on chapter rows

**File:** `src/app/admin/chapters/page.tsx` — add Delete button + `ConfirmDialog` (same pattern as Posts).

### Bug D: No "Add Chapter" button

**File:** `src/app/admin/chapters/page.tsx` — add a row or button below the table. On click: show a small form (title input, order input) that `POST`s to `/api/chapters` with the current `seriesId`.

---

## Section 9 — About Page (`/admin/about`)

### Verify
- [ ] Page loads bio, skills, and social links from `GET /api/about`
- [ ] Bio textarea is editable
- [ ] Skills: typing in input and pressing Enter or clicking Add adds a chip
- [ ] Clicking ✕ on a skill chip removes it
- [ ] GitHub, LinkedIn, Twitter URL inputs are editable
- [ ] Saving shows a "Saved ✓" feedback toast / message
- [ ] After save, refreshing the page retains the changes

### Current State
✅ UI is fully implemented and correct.  
✅ GET loads data correctly.  
⚠️ `POST /api/about` echoes the body as a response but doesn't persist — after a page refresh the edits are lost (back to `db/about.json` seed data).

> This is **acceptable for Phase 3** since the mock layer has no persistent write layer for about. This will be fixed in Phase 7 with Firestore. However it would be confusing during testing.

### Fix (optional but recommended): in-memory about store

**File:** `src/lib/db/mock.ts` — store the about data mutably:

```ts
// Change constant import to a mutable variable
let aboutStore = { ...aboutData }  // ← mutable copy

export async function getAbout() {
  return aboutStore
}

export async function updateAbout(data: typeof aboutData) {
  aboutStore = { ...aboutStore, ...data }
  return aboutStore
}
```

**File:** `src/app/api/about/route.ts` — wire `POST` to `updateAbout`.

---

## Section 10 — Auth & Navigation

### Verify
- [ ] Visiting `/admin` without being logged in redirects to `/admin/login`
- [ ] Wrong credentials on login page shows an error message (not a blank crash)
- [ ] Correct credentials log in and redirect to `/admin`
- [ ] Sidebar "Log out" button signs out and redirects to `/admin/login`
- [ ] Sidebar active link highlights correctly on every route
- [ ] All sidebar links navigate to the correct pages without 404

### Current State
✅ All working (fixed in earlier session — redirect loop removed, proxy.ts handles protection).

### Fixes Required
None.

---

## Summary — All Bugs to Fix

| # | File | Issue | Priority |
|---|------|-------|----------|
| 1 | `src/components/admin/PostsTable.tsx` | No `router.refresh()` after delete | 🔴 High |
| 2 | `src/lib/db/mock.ts` | Missing `createSeries`, `updateSeries`, `deleteSeries` | 🔴 High |
| 3 | `src/app/api/series/route.ts` | `POST` is TODO stub | 🔴 High |
| 4 | `src/app/api/series/[id]/route.ts` | `PUT` + `DELETE` are TODO stubs | 🔴 High |
| 5 | `src/app/admin/series/page.tsx` | No Delete button | 🔴 High |
| 6 | `src/lib/db/mock.ts` | Missing `createChapter`, `updateChapter`, `deleteChapter` | 🔴 High |
| 7 | `src/app/api/chapters/route.ts` | `POST` is TODO stub | 🔴 High |
| 8 | `src/app/api/chapters/[id]/route.ts` | `PUT` + `DELETE` are TODO stubs | 🔴 High |
| 9 | `src/app/admin/chapters/page.tsx` | No Delete button on chapter rows | 🔴 High |
| 10 | `src/app/admin/chapters/page.tsx` | No "Add Chapter" button | 🟡 Medium |
| 11 | `src/lib/db/mock.ts` | `getAbout()` reads static import, not mutable | 🟡 Medium |
| 12 | `src/app/api/about/route.ts` | `POST` doesn't persist changes | 🟡 Medium |

---

## Fix Order

Execute fixes in this order (each can be committed separately):

1. **`PostsTable` refresh** (Section 2) — 2 lines, isolated
2. **Series mutations + API routes + Delete button** (Sections 5–7) — single commit
3. **Chapter mutations + API routes + Delete button + Add form** (Section 8) — single commit
4. **About in-memory persistence** (Section 9) — single commit
5. **Full re-test** — walk through all 10 sections above

---

## Acceptance Criteria for Phase 3 ✅

Phase 3 is complete when all of the following are true:

- [ ] Log in → dashboard loads with correct stat counts
- [ ] Create a new blog post → appears in posts list
- [ ] Edit that post → title change persists
- [ ] Delete that post → disappears from list immediately (no manual refresh needed)
- [ ] Create a new series → appears in series list
- [ ] Edit that series → changes persist
- [ ] Delete that series → disappears from list immediately
- [ ] Select a series on chapters page → chapters load
- [ ] Edit a chapter title inline → updated title shown
- [ ] Delete a chapter → disappears from list
- [ ] Add a new chapter → appears in list
- [ ] Edit About bio + skills + social links → save → refresh → changes retained
- [ ] All sidebar links open correct pages with no 404 or console errors
