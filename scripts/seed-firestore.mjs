/**
 * Seed Firestore with data from db/*.json
 *
 * Usage (from project root):
 *   node scripts/seed-firestore.mjs
 *
 * Prerequisites:
 *   - Fill in all NEXT_PUBLIC_FIREBASE_* vars in .env.local
 *   - npm install dotenv  (only needed once, if not already present)
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Load .env.local manually (dotenv-style)
function loadEnv() {
  const envPath = resolve(root, '.env.local')
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    process.env[key] = val
  }
}

loadEnv()

const { initializeApp, getApps, getApp } = await import('firebase/app')
const { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } = await import('firebase/firestore')

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate config
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length > 0) {
  console.error('❌  Missing Firebase env vars in .env.local:')
  missing.forEach(k => console.error(`   NEXT_PUBLIC_${k.toUpperCase()} is empty`))
  process.exit(1)
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ── Load local JSON ────────────────────────────────────────
const series   = JSON.parse(readFileSync(resolve(root, 'db/series.json'),   'utf-8'))
const chapters = JSON.parse(readFileSync(resolve(root, 'db/chapters.json'), 'utf-8'))
const posts    = JSON.parse(readFileSync(resolve(root, 'db/posts.json'),    'utf-8'))
const users    = JSON.parse(readFileSync(resolve(root, 'db/users.json'),    'utf-8'))
const about    = JSON.parse(readFileSync(resolve(root, 'db/about.json'),    'utf-8'))

// ── Seed helper ────────────────────────────────────────────
async function seedCollection(name, items) {
  console.log(`\n📂  Seeding "${name}" (${items.length} docs)…`)

  // Clear existing docs first
  const existing = await getDocs(collection(db, name))
  for (const d of existing.docs) {
    await deleteDoc(d.ref)
  }

  // Upload new docs with original IDs preserved
  for (const item of items) {
    const { id, ...data } = item
    await setDoc(doc(db, name, id), data)
    process.stdout.write('.')
  }
  console.log(` ✅`)
}

// ── Run ────────────────────────────────────────────────────
console.log('🚀  Starting Firestore seed…')
console.log(`   Project: ${firebaseConfig.projectId}`)

await seedCollection('series',   series)
await seedCollection('chapters', chapters)
await seedCollection('posts',    posts)
await seedCollection('users',    users)

// About is a single document
console.log('\n📂  Seeding "about/main"…')
await setDoc(doc(db, 'about', 'main'), about)
console.log(' ✅')

console.log('\n🎉  Seed complete! Your Firestore is ready.')
console.log('\nNext steps:')
console.log('  1. In src/lib/db/index.ts → change export to ./firebase')
console.log('  2. Set DB_PROVIDER=firebase in .env.local')
console.log('  3. Restart the dev server: npm run dev')
