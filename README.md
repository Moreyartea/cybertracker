# Cyber Security Tracker

Progress tracker checklist belajar cyber security (13 stage, offline-first, localStorage). Stack sama kayak NoteZ: Next.js 15 + TypeScript + Tailwind v4 + Capacitor.

## Setup

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build APK Android

Sama seperti alur NoteZ:

```bash
npm run build
npx cap add android   # cuma sekali di awal, kalau folder android belum ada
npx cap sync android
npx cap open android  # buka Android Studio, lalu Generate APKs
```

## Struktur

```
app/                 # halaman & layout Next.js
components/          # ProgressBar, ChecklistItem, StageCard, OverallProgress
data/checklist-data.ts   # SEMUA konten checklist (13 stage) — edit di sini kalau mau ubah isi
lib/storage.ts       # baca/tulis localStorage
lib/progress.ts       # hitung persentase progress
types/checklist.ts   # type definitions
```

## Catatan penting

- **Data statis vs dinamis dipisah.** Isi checklist ada di `data/checklist-data.ts`, status checked disimpan terpisah di localStorage (key: `cyber-tracker-progress`) dan di-map by `id`. Artinya kalau nanti kamu edit/tambah item di `checklist-data.ts`, progress yang sudah dicentang **tidak ikut hilang** — asal `id` item lama tidak diubah.
- Tidak ada backend/API di v1 — murni client-side, sesuai keputusan awal (skip Supabase sync, notifikasi, dan login untuk versi pertama).
- Kalau nanti mau tambah Supabase sync, polanya bisa contek langsung dari NoteZ (`profile-page sync` yang upsert localStorage ke Supabase).

## Menambah item checklist baru

Buka `data/checklist-data.ts`, tambah object baru ke array `items` pada stage yang sesuai:

```ts
{ id: "s4-08", label: "Item baru di sini", type: "konsep" }
```

`id` harus unik di seluruh file — pola penamaan yang dipakai: `s{nomor-stage}-{urutan}`.
