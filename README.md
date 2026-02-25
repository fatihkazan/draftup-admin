# Draftup Admin

Private admin panel for managing Draftup SaaS.

## Features

- Password-protected admin login (`ADMIN_PASSWORD`)
- Dashboard:
  - Total users
  - MRR estimate
  - Active subscriptions by plan
- Support tickets:
  - List all tickets
  - View details
  - Reply and update status (`open`, `in progress`, `resolved`)
- Users:
  - List users from `agency_settings`
  - View plan/status/email
  - Change plan manually

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
```

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- All admin data access uses Supabase service role key on the server.
- Middleware protects all routes except `/login`.
