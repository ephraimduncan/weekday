# AGENTS.md

## Cursor Cloud specific instructions

Weekday is a single-product Bun + Turborepo monorepo: a Next.js 16 web app
(`apps/web`, the only runnable service, on port 3000) backed by PostgreSQL via
Drizzle ORM, tRPC, and Better Auth. Packages under `packages/*` (`api`, `auth`,
`db`, `env`, `google-calendar`, `lib`) are libraries consumed by the web app.

Standard commands live in the root `package.json` and `readme.md`; prefer those.
The notes below are only the non-obvious caveats for this environment.

### Services

- PostgreSQL must be running on port **5433** (not the default 5432) to match
  `DATABASE_URL` in `.env` and `docker-compose.yml`. Docker is not available
  here; Postgres 16 is installed as a system cluster instead. Start it with
  `sudo pg_ctlcluster 16 main start` (the cluster is preconfigured for port 5433
  and the `postgres` user password is `password`). It does not auto-start on
  boot.
- Run only the web app with `bun run dev:next` (filters to `@weekday/web`).
  Plain `bun run dev` also works but only `@weekday/web` has a `dev` task.

### Environment file

- `.env` is gitignored and required (env schema in `packages/env/index.js`
  validates it at startup). If it is missing, copy `.env.example` to `.env` and
  set: `DATABASE_URL=postgresql://postgres:password@localhost:5433/postgres`,
  a generated `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), and
  `BETTER_AUTH_URL=http://localhost:3000`. `BETTER_AUTH_GOOGLE_ID`,
  `BETTER_AUTH_GOOGLE_SECRET`, and `AI_GATEWAY_API_KEY` are required by the
  schema (non-empty), so use placeholders to boot; real values are only needed
  for actual Google login / AI features.
- After `.env` exists and Postgres is up, run `bun run db:push` to sync the
  Drizzle schema (creates the `weekday_*` tables). This is not part of the
  startup update script.

### Auth caveat (login is Google-only)

- The only sign-in method is Google OAuth (`/login` -> "Login with Google").
  Completing a real login requires valid `BETTER_AUTH_GOOGLE_ID` /
  `BETTER_AUTH_GOOGLE_SECRET` from a Google Cloud OAuth client whose redirect
  URI is `http://localhost:3000/api/auth/callback/google`, plus a Google
  account. With placeholder credentials the app boots and all public routes and
  the auth API work (the sign-in endpoint generates a real Google OAuth URL and
  writes state to the DB), but the OAuth round-trip cannot complete.

### Lint

- `turbo lint` / root `bun run lint` fails: `turbo.json` defines no `lint` task.
  Run lint per package instead (e.g. `cd apps/web && bun run lint`).
- On this commit `apps/web` ESLint itself throws
  `Converting circular structure to JSON` — a known incompatibility between
  `eslint-config-next@16` and the `FlatCompat` layer, unrelated to environment
  setup.

### Tests

- There are no automated test scripts in this repo.
