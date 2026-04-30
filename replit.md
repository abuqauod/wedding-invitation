# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Project: Majd & Dana Wedding RSVP

**Wedding date:** Wednesday, 1 July 2026, Ritz-Carlton Amman, 7:15 PM

### Artifacts
- `artifacts/wedding` — React+Vite frontend (all views in `WeddingRSVP.tsx`)
- `artifacts/api-server` — Express API server (`src/routes/rsvp.ts`)
- `lib/db` — Drizzle ORM schema + DB connection

### Database schema (`lib/db/src/schema/guests.ts`)
Table: `guests`
- `id` (text PK), `firstName`, `familyName`, `countryCode`, `mobile`, `fullPhone` (unique), `group`, `lang`
- `seatNumber` (int), `tableNumber` (int)
- `registeredAt`, `checkedInAt` (timestamps)
- `whatsappSent` (bool), `whatsappSid`, `whatsappError`
- `companions` (text, JSON-encoded array of {firstName, familyName})

### API Routes (`/api`)
- `POST /rsvp` — register guest, build QR invitation image (no auto-send)
- `GET /guests` — list all guests
- `POST /guests/:id/resend` — manually send/resend WhatsApp entry pass
- `PATCH /guests/:id/seat` — assign table/seat
- `POST /guests/:id/checkin` — mark as checked in
- `DELETE /guests/:id` — delete guest
- `GET /qr/:filename` — serve personalized invitation image with QR overlay
- `GET /assets/invitation` — serve default (Arabic) invitation card
- `GET /assets/invitation/:lang` — serve language-specific invitation card
- `POST /invite` — send general WhatsApp invitations

### Invitation Images
- `artifacts/api-server/assets/invitation_ar.jpeg` — Arabic invitation (1119×1600)
- `artifacts/api-server/assets/invitation_en.jpeg` — English invitation (1119×1600)
- QR overlay: size=260px, left=430, top=1100 (centred over placeholder)

### Auth
- Admin: `admin` / `wedding2026` — full access (Admin + Entry tabs)
- Viewer: `viewer` / `password00` — Entry (scanner) tab only

### WhatsApp / Twilio
- Credentials: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
- From: `+14155238886` (Twilio sandbox — guests must join sandbox first)
- WhatsApp is NOT sent on RSVP; admin must use the "Send Pass" button per guest

### Frontend Features
- Invitation card view (landing)
- RSVP form with companion support (0-9 additional guests per registration)
- Admin panel: guest table with sortable columns, resend pass, seat assignment, delete, export CSV
- Entry scanner: camera QR scanner + name search list with check-in status indicators
- Bilingual (Arabic/English), Arabic uses Aref Ruqaa + Amiri fonts throughout
