# Server-verified island check-ins (Supabase)

The public GitHub Pages demo currently performs a browser-only GPS distance check. Browser-only results are editable and must not be represented as fraud-proof verification.

This repository now includes a Supabase Edge Function and database migration as the next-stage backend foundation.

## What the backend does

- Requires a signed-in Supabase user (JWT).
- Accepts one check-in request for one of the eight configured island hubs.
- Validates coordinate ranges, GPS accuracy (100 m or better), and distance to the configured hub (800 m radius).
- Writes the visit using the server timestamp and the authenticated user ID.
- Enforces one stamp per island per account with a database unique constraint.
- Does not store the submitted latitude or longitude.
- Allows users to read only their own visit records through row-level security.

## Setup required before it can run

1. Create a Supabase project.
2. Apply `supabase/migrations/202611180001_create_verified_island_visits.sql`.
3. Set the project's Edge Function secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. The service-role key must remain server-side and must never be added to Vite environment variables or committed to Git.
4. Deploy `supabase/functions/verify-island-visit`.
5. Add Supabase Auth to the website and require sign-in before showing a server-backed check-in.
6. Replace the current browser-only `IslandCheckIn` submission with a call to the deployed function, and load passport stamps from the authenticated user's visit records.

## Important security and product limitations

A server can validate a submitted coordinate, but a browser GPS reading can still be spoofed on some devices. This is stronger than localStorage-only state, not proof that a person physically visited. Stronger assurance would require additional anti-abuse signals, operational monitoring, and possibly a trusted native app/device-attestation approach.

The eight hub coordinates are provisional configuration values. Confirm each exact visitor point with Tahiti Tourisme or a local destination partner before launch. An 800 m circle may also need adjustment for access, coastline, and real visitor routes.

The public GitHub Pages demo remains in prototype mode until Supabase is configured, deployed, and connected to the frontend. No secrets are required or included in this repository.
