# macOS Interface

A macOS-style web interface: dock, menu bar, control center, app windows, and wallpapers. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

**Live:** [macos-interface.vercel.app](https://macos-interface.vercel.app) (Vercel)

## Features

- **Menu bar** — Apple logo, control center, date/time
- **Apple menu** — macOS-style dropdown with working **Log Out**
- **Control Center** — Dark/Light mode toggle, system accent color picker, Wallpaper button with selected wallpaper preview and opens the wallpapers window
- **Dock** — App icons (Finder, Safari, Notes, Settings, Launchpad, etc.), drag-and-drop to reorder (@dnd-kit), click to open/minimize/restore windows
- **Wallpapers** — Desktop background picker; data from Supabase or local fallback; selected wallpaper persisted in settings
- **App windows** — Standard windows (title bar, close/minimize) for Wallpapers; full-screen Launchpad with search; dark/light theme support in all windows
- **Auth flow** — Register/Login screens, password visibility toggle, confirm-password validation, remembered user on login screen
- **User profile** — `profiles` table sync (username, email, avatar), avatar upload to Supabase Storage (`avatars`)
- **Per-user settings** — Theme, system color, and wallpaper are stored per user (`settings.user_id`)

## Tech stack

- **Next.js 16** — App Router, React Server Components
- **TypeScript** — Strict typing, path aliases `@/*` → `./src/*`, `@/supabase/*` → `./supabase/*`
- **Tailwind CSS** — Styling, dark mode via `class` (next-themes)
- **Radix UI** — Popover (control center), Tooltip, Slot
- **next-themes** — Theme switching, synced with settings
- **@dnd-kit** — Drag-and-drop in dock (sortable)
- **Supabase** — Auth, Database, Storage (avatars), clients `@supabase/ssr` and `@supabase/supabase-js`
- **ESLint, Prettier** — Linting and formatting
- **Yarn** — Package manager

## Environment variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Get these from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings** → **API**.

Optional, for DB type generation:

```env
SUPABASE_DB_URL=postgresql://postgres.<PROJECT_REF>:<PASSWORD>@...
```

Or for local Supabase:

```env
SUPABASE_PROJECT_REF=<project-ref>
```

## Installation and running

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|--------|-------------|
| `yarn dev` | Start dev server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Run ESLint with auto-fix |
| `yarn format` | Format with Prettier |
| `yarn format:check` | Check formatting |
| `yarn typecheck` | Run TypeScript type check |
| `yarn db:types` | Generate Supabase types (requires `SUPABASE_DB_URL`) |
| `yarn db:types:local` | Generate types from local Supabase (`supabase start`) |

## Project structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, providers, WallpaperProvider, WindowsProvider
│   │   ├── page.tsx           # Desktop page
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/register/page.tsx
│   │   └── globals.css        # Tailwind, CSS variables, launchpad/auth input autofill styles
│   ├── components/
│   │   ├── control-center/ # Control Center (Popover: theme, color, wallpaper)
│   │   ├── context-menu/   # Context menu
│   │   ├── desktop-background/ # Desktop background (selected wallpaper)
│   │   ├── dock-menu/      # Dock + drag-and-drop, dock-item, sortable
│   │   ├── menu-bar/       # Menu bar (Apple, Control Center, date)
│   │   ├── popover/        # Radix Popover wrapper
│   │   ├── tooltip/        # Tooltip
│   │   └── windows-layer/  # Windows layer: AppWindow, WallpapersWindow, LaunchpadWindow
│   ├── contexts/
│   │   ├── windows-context.tsx  # Open windows, active, minimize, restore
│   │   └── wallpaper-context.tsx # Wallpapers list, selected, setSelectedWallpaperId
│   ├── hooks/
│   │   ├── use-dock-items.ts      # Dock items, reorder, add/remove
│   │   ├── use-system-settings.ts # Theme/system color (per-user settings)
│   │   ├── use-login-submit.ts
│   │   ├── use-register-submit.ts
│   │   ├── use-app-window-drag.ts
│   │   └── use-window-minimize-transition.ts
│   ├── actions/               # Server actions: wallpapers/settings/dock/profile
│   ├── const/              # Constants: dock order, wallpapers fallback
│   ├── types/              # Types: dock, wallpaper, window, settings
│   ├── utils/              # theme-utilis, get-wallpaper, date, get-scale
│   ├── providers/          # ThemeProvider (next-themes)
│   └── proxy.ts            # Proxy for session refresh (Next.js 16)
├── supabase/
│   ├── client.ts           # Client for Client Components
│   ├── server.ts           # Client for Server Components / Route Handlers
│   ├── middleware.ts       # Helper for proxy (session refresh)
│   ├── types/
│   │   └── database.types.ts # Generated DB types
│   └── migrations/            # SQL migrations (apps, dock, profiles, per-user settings)
├── public/images/wallpapers/ # Wallpaper images
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
├── components.json         # shadcn/ui (if adding components)
└── .env                    # Do not commit
```

## Supabase

- **Tables:** `apps`, `dock_items`, `wallpapers`, `profiles`, `settings`.
- **Profiles:** synced from `auth.users` via DB trigger (`create_profiles.sql`), avatar URL/path stored in `profiles`.
- **Dock seed:** new users get default dock items from template rows (`dock_items.user_id is null`) via trigger (`create_dock_seed_trigger.sql`).
- **Settings seed:** each user gets per-user settings row via trigger (`create_user_settings.sql`), defaults: `theme=dark`, `system_color=blue`.
- **Storage:** avatar files are uploaded to `avatars` bucket.
- **Clients:** browser — `createClient()` from `supabase/client.ts`; server — from `supabase/server.ts` (cookies). Types in `supabase/types/database.types.ts` (generate with `yarn db:types` or `yarn db:types:local`).

Recommended migration order:

1. `create_apps.sql`
2. `create_wallpapers.sql`
3. `create_dock_items.sql`
4. `create_dock_seed_trigger.sql`
5. `create_profiles.sql`
6. `create_user_settings.sql`

Generate types (PowerShell, with DB password):

```powershell
npx supabase gen types typescript --db-url "postgresql://postgres.<PROJECT_REF>:[PASSWORD]@..." --schema public | Out-File -FilePath "supabase/types/database.types.ts" -Encoding utf8
```

Deployment note:

- `next.config.ts` allows Supabase Storage host for `next/image` using `NEXT_PUBLIC_SUPABASE_URL`.

## Code style

- **ESLint** — next/core-web-vitals, Prettier integration (flat config).
- **Prettier** — Formatting; enable format on save in VS Code/Cursor.

## License

MIT
