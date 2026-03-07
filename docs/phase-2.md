# Phase 2 — Auth

> **Goal:** Admin login/logout with session protection so `/admin/*` routes are only accessible when signed in.  
> **Prerequisite:** Phase 1 ✅ complete — `src/lib/db/index.ts`, `src/types/index.ts`, and `.env.local` with `NEXTAUTH_SECRET` all exist.

---

## Brainstorm — What Needs to Happen

1. **NextAuth v5 configuration** — set up the Credentials provider that validates email + bcrypt password against `db/users.json`
2. **JWT + session callbacks** — attach `role: 'admin'` to every token so we can authorize by role later
3. **API route handler** — expose NextAuth's `GET` and `POST` at `/api/auth/[...nextauth]`
4. **Middleware** — intercept every `/admin/*` request before it reaches a page; redirect to `/admin/login` if unauthenticated; redirect to `/admin` if already logged in and hitting the login page
5. **Login page UI** — a centered dark-background card with email/password inputs, error state, and `signIn()` call
6. **Test login flow** — verify redirect, successful sign-in, and failed sign-in all behave correctly

---

## Checklist

### ☐ Step 2.1 — Create `src/lib/auth.ts`

This is the NextAuth core config. Create the file with:

```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await getUserByEmail(credentials.email as string)
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})
```

**Key details:**
| Part | What it does |
|------|-------------|
| `getUserByEmail()` | Reads from `db/users.json` via the mock data layer |
| `bcrypt.compare()` | Validates plain password against the bcrypt hash stored in `db/users.json` |
| `jwt` callback | Copies `role` from the user object into the JWT token |
| `session` callback | Copies `role` from the token into the session (accessible via `useSession()` / `auth()`) |
| `pages.signIn` | Tells NextAuth to use our custom login page instead of the default one |

---

### ☐ Step 2.2 — Create `src/app/api/auth/[...nextauth]/route.ts`

Wire the NextAuth handlers into the App Router:

```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

This single file handles all NextAuth endpoints automatically:
- `GET  /api/auth/session` — returns current session JSON
- `POST /api/auth/signin/credentials` — processes login
- `GET  /api/auth/signout` — clears the session cookie

---

### ☐ Step 2.3 — Create `src/middleware.ts`

Place this in `src/` (not inside `app/`). It runs on every matched request **before** any page or API route:

```ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  const isLoggedIn   = !!req.auth

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Logic table:**

| Route | Logged in? | Result |
|-------|-----------|--------|
| `/admin/posts` | ❌ No | → redirect to `/admin/login` |
| `/admin/posts` | ✅ Yes | → page renders normally |
| `/admin/login` | ❌ No | → login page renders |
| `/admin/login` | ✅ Yes | → redirect to `/admin` |

> **Important:** The `matcher` only runs middleware on `/admin/*` routes. Public routes (`/`, `/blog`, etc.) are never touched.

---

### ☐ Step 2.4 — Create `src/app/admin/login/page.tsx`

A client component — uses `signIn` from NextAuth and `useRouter` for redirect.

Visual spec (from `docs/04-pages-design.md` Page 7):
- Full-height dark background (`bg-[#0F172A]`)
- Centered card (`max-w-sm`, white border, rounded, shadow)
- Site logo / name at the top of the card
- Email input (type `email`, labeled)
- Password input (type `password`, labeled)
- "Sign In" button (violet, full width)
- Red error message shown below the button on failed login
- No registration link — login only

```tsx
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/admin')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Life-Style Admin
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-violet-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-violet-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-violet-600 px-4 py-2.5 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
```

---

### ☐ Step 2.5 — Create a stub `/admin` page (for redirect target)

The middleware redirects to `/admin` on success but that route doesn't exist yet.  
Create a minimal placeholder `src/app/admin/page.tsx` so the redirect doesn't 404:

```tsx
export default function AdminDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] text-white gap-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-slate-400">Phase 2 auth complete — Phase 3 dashboard coming next.</p>
    </main>
  )
}
```

---

### ☐ Step 2.6 — Test the login flow

Start the dev server:
```bash
npm run dev
```

Run through these manual checks:

| Test | Action | Expected result |
|------|--------|----------------|
| Unauthenticated redirect | Visit `http://localhost:3000/admin` | Redirects to `/admin/login` |
| Failed login | Submit wrong password | Error message: "Invalid email or password." |
| Successful login | Email: `peter@lifestyle.dev` / Password: `admin2026` | Redirects to `/admin` dashboard stub |
| Login-while-authed | When logged in, visit `/admin/login` | Redirects to `/admin` |
| Sign out (manual) | Visit `http://localhost:3000/api/auth/signout` | Session cleared, then can visit `/admin/login` again |

---

### ☐ Step 2.7 — Git commit

```bash
git add .
git commit -m "feat: Phase 2 — NextAuth credentials auth + middleware + login page"
```

---

## ✅ Phase 2 Complete When

| Check | Expectation |
|-------|-------------|
| `/admin` (unauthenticated) | Redirects to `/admin/login` |
| `/admin/login` (wrong password) | Shows "Invalid email or password." |
| `/admin/login` (correct password) | Redirects to `/admin` stub page |
| `/admin/login` (already logged in) | Redirects to `/admin` |
| `npm run build` | Passes with no TypeScript errors |

---

## Files Created in Phase 2

```
src/
├── lib/
│   └── auth.ts                             ← NextAuth config (Credentials + bcrypt)
├── middleware.ts                            ← Protects /admin/* routes
└── app/
    ├── admin/
    │   ├── page.tsx                         ← Stub dashboard (redirect target)
    │   └── login/
    │       └── page.tsx                     ← Login form UI
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts                 ← Exports GET + POST handlers
```

---

## What Comes After Phase 2

→ **Phase 3** — Build the full admin dashboard: sidebar layout, posts table, new/edit post form with TipTap editor, series + chapters management.  
See [phase-step.md](./phase-step.md) Phase 3 section for details.
