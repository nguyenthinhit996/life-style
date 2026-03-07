# Phase 0 — Project Scaffold

> **Goal:** A clean, running Next.js app with all dependencies installed, correct folder structure, and env config ready.  
> **Estimated time:** 1–2 hours  
> **Before you start:** The workspace only has `/docs`, `/db`, and `README.md`. No `src/` folder yet.

---

## Brainstorm — What Needs to Happen

Before writing a single component, we need:

1. **A Next.js app to exist** — `npx create-next-app` puts the skeleton in place
2. **All npm packages installed** — auth, editor, icons, animations, Firebase SDK
3. **Boilerplate deleted** — Next.js creates demo files we don't want
4. **Every future folder pre-created** — so we never have to think about where a file goes
5. **`.env.local` ready** — NextAuth will crash without a secret on first run
6. **Admin password hashed** — `db/users.json` has a plain-text placeholder right now
7. **`tsconfig` verified** — JSON imports need `resolveJsonModule: true` or mock data won't load
8. **Git initialized** — first commit captures the clean scaffold before any real code

---

## Checklist

### ☐ Step 0.1 — Scaffold the Next.js app

```bash
cd /Users/peter/Desktop/Project/life-style
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Prompts to answer:
| Prompt | Answer |
|--------|--------|
| Use Turbopack for `next dev`? | **Yes** |
| Everything else | **Enter (default)** |

**Why `.` (dot)?** Installs into the current folder — keeps `db/` and `docs/` in the same root.

---

### ☐ Step 0.2 — Install all dependencies

```bash
npm install firebase next-auth@beta @tiptap/react @tiptap/pm @tiptap/starter-kit \
  lucide-react clsx tailwind-merge framer-motion next-themes bcryptjs
npm install -D @types/bcryptjs
```

| Package | Used for |
|---------|----------|
| `firebase` | Firestore database (production — not used until Phase 7) |
| `next-auth@beta` | Admin login + session management |
| `@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit` | Rich text editor in admin |
| `lucide-react` | Icons throughout the UI |
| `clsx` + `tailwind-merge` | Safely merge Tailwind class names |
| `framer-motion` | Page + card animations |
| `next-themes` | Dark / light mode toggle |
| `bcryptjs` | Hash + compare admin passwords |
| `@types/bcryptjs` | TypeScript types for bcryptjs |

---

### ☐ Step 0.3 — Delete + replace boilerplate

Files to **delete**:
```
public/vercel.svg
public/next.svg
src/app/favicon.ico        (replace later with a real one)
```

Files to **replace content**:

**`src/app/page.tsx`** — replace everything with:
```tsx
export default function HomePage() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🚧 Life-Style — Coming Soon</h1>
      <p>Phase 0 scaffold complete.</p>
    </main>
  )
}
```

**`src/app/globals.css`** — replace everything with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`src/app/layout.tsx`** — keep the root layout but simplify:
```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life-Style',
  description: 'Code & Language — by Peter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

### ☐ Step 0.4 — Create all folders

Run this one block in terminal to create every folder that will be needed:

```bash
mkdir -p \
  src/app/\(public\)/about \
  src/app/\(public\)/blog/\[slug\] \
  src/app/\(public\)/blog/series/\[seriesId\] \
  "src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]" \
  src/app/admin/login \
  src/app/admin/posts/new \
  "src/app/admin/posts/[id]/edit" \
  src/app/admin/series/new \
  "src/app/admin/series/[id]/edit" \
  src/app/admin/chapters \
  src/app/admin/about \
  "src/app/api/auth/[...nextauth]" \
  "src/app/api/posts/[id]" \
  "src/app/api/series/[id]" \
  "src/app/api/chapters/[id]" \
  src/components/ui \
  src/components/public \
  src/components/admin \
  src/lib/db \
  src/types
```

---

### ☐ Step 0.5 — Create `.env.local`

Create the file at the project root `/Users/peter/Desktop/Project/life-style/.env.local`:

```env
# ── NextAuth ──────────────────────────────────────────────────────
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# ── Firebase (fill in when switching from mock data in Phase 7) ───
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

Generate the `NEXTAUTH_SECRET` value:
```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET`.

> ⚠️ `.env.local` must be in `.gitignore` — Next.js adds it by default, but verify.

---

### ☐ Step 0.6 — Hash the admin password

Current `db/users.json` has a placeholder password. Replace it with a real bcrypt hash:

```bash
node -e "const b = require('bcryptjs'); b.hash('YOUR_PASSWORD_HERE', 10).then(console.log)"
```

Then open `db/users.json` and replace the `"password"` field value with the hash output (starts with `$2a$10$...`).

> Remember the plain password — you'll need it to log in during Phase 2 testing.

---

### ☐ Step 0.7 — Verify `tsconfig.json`

Open `tsconfig.json` and confirm this option is present under `compilerOptions`:

```json
"resolveJsonModule": true
```

If it's missing, add it. This is required for `import seriesData from '../../../db/series.json'` to work in Phase 1.

---

### ☐ Step 0.8 — Verify `tailwind.config.ts`

After scaffold, open `tailwind.config.ts` and make sure `content` includes `src/**`:

```ts
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

Also add the custom font and color extensions for later (won't break anything now):

```ts
theme: {
  extend: {
    fontFamily: {
      display: ['Space Grotesk', 'sans-serif'],
      body:    ['Inter', 'sans-serif'],
      mono:    ['JetBrains Mono', 'monospace'],
    },
    colors: {
      violet: { DEFAULT: '#7C3AED', dark: '#6D28D9' },
      cyan:   { DEFAULT: '#06B6D4' },
    },
  },
},
```

---

### ☐ Step 0.9 — Smoke test — run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
You should see **"🚧 Life-Style — Coming Soon"**.  
No red errors in the terminal. No TypeScript errors.

---

### ☐ Step 0.10 — Git first commit

```bash
git add .
git commit -m "chore: scaffold Next.js app + install all dependencies"
```

---

## ✅ Phase 0 Complete When

| Check | Expectation |
|-------|-------------|
| `npm run dev` | Starts with no errors |
| `localhost:3000` | Shows "Coming soon" page |
| `node_modules/` | Contains `firebase`, `next-auth`, `@tiptap`, `bcryptjs`, etc. |
| `src/` folder | Has all sub-folders listed in Step 0.4 |
| `.env.local` | Exists with `NEXTAUTH_SECRET` filled in |
| `db/users.json` | Password field is a bcrypt hash (`$2a$10$...`) |
| `tsconfig.json` | `resolveJsonModule: true` present |
| Git | Has an initial commit |

---

## What Comes After Phase 0

→ **Phase 1** — Create `src/types/index.ts` + `src/lib/db/mock.ts` + `src/lib/db/index.ts`  
See [phase-step.md](./phase-step.md) Phase 1 section for details.
