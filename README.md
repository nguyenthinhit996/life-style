# Life·Style

A personal blog and tutorial hub about **Code**, **English**, and **Life** — built with Next.js.

## Features

- **Tutorial Series** — structured, book-like courses with chapters and lessons (Java, JavaScript, AI, English)
- **Blog Posts** — standalone articles across IT, English, and Lifestyle categories
- **Admin Dashboard** — full CMS with rich text editor, series/chapter management, and post CRUD
- **Light Theme (public)** — clean Fresh & Bold design with violet/cyan accents on a white/slate palette
- **Dark Theme (admin)** — dedicated dark UI for content management
- **Animated Navbar** — procedural grass & rabbit animations
- **Reading Progress** — progress bar and back-to-top button on lesson pages
- **Responsive** — mobile-first layout with collapsible navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Fonts | Syne (display), DM Sans (body), JetBrains Mono (code) |
| Auth | NextAuth v5 (Credentials) |
| Database | Firebase Firestore (mock JSON for local dev) |
| Editor | TipTap rich text editor |
| Animations | Framer Motion, SVG procedural grass/rabbit |
| Icons | Lucide React |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

## Project Structure

```
src/
├── app/
│   ├── (public)/       # Public pages (blog, about, series)
│   ├── admin/          # Admin dashboard (dark theme)
│   └── api/            # REST API routes
├── components/
│   ├── public/         # Public UI components
│   ├── admin/          # Admin UI components
│   └── ui/             # Shared primitives
├── lib/                # Auth, DB, utilities
└── types/              # TypeScript types
```

## License

Private project.
