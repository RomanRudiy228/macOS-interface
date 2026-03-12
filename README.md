# macOS Interface

A macOS-style web interface: dock, menu bar, control center, app windows, and wallpapers. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

**Live:** [macos-interface.vercel.app](https://macos-interface.vercel.app) (Vercel)

## Main Features

- **Auth flow**
  - `/login` and `/register` pages with lock‑screen‑style UI.
  - Supabase email/password auth, profile syncing (username, avatar).
  - Remembered user info on the login screen.

- **Desktop & windows**
  - `DesktopPage` (`src/app/page.tsx`) renders the main desktop once the user is authenticated.
  - **Menubar**, **Dock**, **Windows layer** and **Wallpaper provider** mimic macOS behavior.
  - Windows layer (`windows-layer.tsx`) manages app windows (Finder, Settings/Wallpapers, Messages, Launchpad) via a central context.

- **Finder demo**
  - API routes under `src/app/api/finder/*` provide a **Finder‑like file browser**.
  - Supports two sources:
    - **server**: reads from `server-files/finder-demo` on disk (safe, no path traversal).
    - **user**: reads from a Supabase storage bucket (per‑user root under `users/{userId}`).
  - Sorting, type detection, and seed demo files for new users are implemented on the server.

- **Widgets**
  - **Clock widget** and **Weather widget** rendered on top of the desktop.
  - Weather uses `useWeather` hook and `NEXT_PUBLIC_WEATHER_KEY` (OpenWeather‑compatible API key).
  - Widgets are **draggable**, with collision avoidance and screen bounds.
  - **Optimistic persistence**: positions are saved via Supabase table `widget_positions`; on failure, UI rolls back to the previous position.

- **Chat / Messages**
  - Supabase tables `conversations` and `messages` are used for a simple messaging experience.
  - Server actions:
    - `getConversations`, `getOrCreateConversation`
    - `getMessages`, `sendMessage`, `deleteMessage`
    - `searchUsers`, `getAllUsers`
  - Each conversation is scoped to the authenticated user; message sender profiles are joined from `profiles`.

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
NEXT_PUBLIC_WEATHER_KEY=... # OpenWeather‑style API key
NEXT_PUBLIC_FINDER_STORAGE_BUCKET=finder-files # optional, default used in code
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

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `yarn dev`            | Start dev server                                      |
| `yarn build`          | Build for production                                  |
| `yarn start`          | Start production server                               |
| `yarn lint`           | Run ESLint                                            |
| `yarn lint:fix`       | Run ESLint with auto-fix                              |
| `yarn format`         | Format with Prettier                                  |
| `yarn format:check`   | Check formatting                                      |
| `yarn typecheck`      | Run TypeScript type check                             |
| `yarn db:types`       | Generate Supabase types (requires `SUPABASE_DB_URL`)  |
| `yarn db:types:local` | Generate types from local Supabase (`supabase start`) |

## Project structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, providers, WallpaperProvider, WindowsProvider
│   │   ├── page.tsx           # Desktop page with windows + widgets
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/register/page.tsx
│   │   ├── api/finder/files/route.ts # Finder: directory listing (server + user storage)
│   │   ├── api/finder/file/route.ts  # Finder: file download/preview (server + user storage)
│   │   └── globals.css        # Tailwind, CSS variables, launchpad/auth input autofill styles
│   ├── components/
│   │   ├── control-center/ # Control Center (Popover: theme, color, wallpaper)
│   │   ├── context-menu/   # Context menu
│   │   ├── desktop-background/ # Desktop background (selected wallpaper)
│   │   ├── dock-menu/      # Dock + drag-and-drop, dock-item, sortable
│   │   ├── menu-bar/       # Menu bar (Apple, Control Center, date)
│   │   ├── popover/        # Radix Popover wrapper
│   │   ├── tooltip/        # Tooltip
│   │   ├── widgets/        # Desktop widgets (clock, weather, draggable positions)
│   │   └── windows-layer/  # Windows layer: AppWindow, FinderWindow, WallpapersWindow, MessagesWindow, LaunchpadWindow
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
│   ├── actions/               # Server actions: wallpapers/settings/dock/profile/widgets/messages/users
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

- **Tables:** `apps`, `dock_items`, `wallpapers`, `profiles`, `settings`, `widget_positions`, `conversations`, `messages`.
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
