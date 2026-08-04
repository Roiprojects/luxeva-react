# Luxeva Care — React (Vite) version

Standalone **React + Vite** build of the Luxeva Care Pvt Ltd website (converted from the
Next.js version). Same premium design, pages, animations, and PostgreSQL lead capture.

## Stack
- **Vite + React 19 + TypeScript**, **Tailwind CSS v4**
- **react-router-dom** for routing
- **Express** API (`server/`) for the enquiry form → **PostgreSQL** (`pg`)
- Fonts: Fraunces (display) + Inter (body)

## Getting started
```bash
npm install
cp .env.example .env.local     # set DATABASE_URL
npm run db:init                # create the enquiries tables
npm run dev                    # Vite (5173) + API (3001) together
```
Open http://localhost:5173 (the dev server proxies `/api` → the Express server on 3001).

## Scripts
- `npm run dev` — Vite + API together (concurrently)
- `npm run build` — production build → `dist/`
- `npm start` — run the Express server; serves `dist/` **and** the API on one port (3001)
- `npm run db:init` — apply `db/schema.sql` to `DATABASE_URL`
- `npm run db:leads` — list recent enquiries from the terminal
- `npm run typecheck` — `tsc -b`

## Structure
```
src/
  pages/        route pages (Home, About, Services, ServiceDetail, Portfolio, …)
  components/   layout, ui, cards, forms, sections
  lib/          content (CMS-ready data), types, validation, utils, enquiry client
  shims/        next/link · next/image · next/navigation → react-router / plain <img>
server/         Express API (POST /api/enquiry) + static dist serving
db/schema.sql   PostgreSQL schema (enquiries + notes)
public/assets/  imagery
```

## Deploying
Build then run the Node server (serves the SPA + API on one port):
```bash
npm run build && npm start
```
Set `DATABASE_URL` (and `DATABASE_SSL=false` if your Postgres has SSL off) in the host env.
