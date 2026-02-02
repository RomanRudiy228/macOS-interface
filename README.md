# macOS Interface

A modern web application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Tech Stack

- **Next.js 16** - React framework with App Router and proxy (ex-middleware)
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI components built with Radix UI and Tailwind CSS
- **Supabase** - Backend (Auth, Database). Typed client via `@supabase/ssr` and `@supabase/supabase-js`
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Yarn** - Package manager

## Features & Configuration

### TypeScript

- Strict type checking enabled
- Path aliases: `@/*` → `./src/*`, `@/supabase/*` → `./supabase/*`
- Next.js TypeScript plugin integrated
- Type declarations for Node.js and Next.js

### ESLint

- Next.js ESLint configuration (`next/core-web-vitals`)
- Prettier integration to avoid conflicts
- Flat config format (ESLint 9+)
- Excludes build directories (`.next/`, `out/`, `dist/`)

### Prettier

- Configured with sensible defaults
- Integrated with ESLint
- Format on save enabled in VS Code
- Ignores build artifacts and dependencies

### Code Quality

- ESLint for linting
- Prettier for formatting
- TypeScript for type checking
- Pre-commit hooks ready (can be added with husky)

### Supabase

- **Client** (`supabase/client.ts`) — for Client Components (browser).
- **Server** (`supabase/server.ts`) — for Server Components and Route Handlers (cookies).
- **Middleware helper** (`supabase/middleware.ts`) — for Next.js proxy (session refresh).
- **Types** (`supabase/types/database.types.ts`) — generated DB types for type-safe queries.

Session refresh runs in `src/proxy.ts` (Next.js 16 proxy) so Server Components see an up-to-date session.

## Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Get these from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings** → **API**.

Optional (for generating types):

```env
SUPABASE_PROJECT_REF=<project-ref>
```

## Installation

```bash
yarn install
```

## Development

Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Run ESLint and fix auto-fixable issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting without fixing
- `yarn typecheck` - Run TypeScript type checking
- `yarn db:types` - Generate Supabase DB types (requires `SUPABASE_PROJECT_REF` in env)
- `yarn db:types:local` - Generate types from local Supabase (requires `supabase start`)

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Examples:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Project Structure

```
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles with Tailwind
│   ├── proxy.ts                # Next.js 16 proxy (session refresh)
│   └── shared/
│       ├── components/
│       │   └── ui/             # shadcn/ui components
│       └── lib/
│           └── utils.ts        # Utility functions (cn helper)
├── supabase/                   # Supabase clients and types
│   ├── client.ts               # Browser client (Client Components)
│   ├── server.ts               # Server client (Server Components, Route Handlers)
│   ├── middleware.ts           # Client for proxy (session refresh)
│   └── types/
│       └── database.types.ts   # Generated DB types (run yarn db:types)
├── .env                        # Environment variables (not committed)
├── eslint.config.js            # ESLint flat config (ESLint 9+)
├── .prettierrc.json            # Prettier configuration
├── .prettierignore             # Prettier ignore patterns
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── components.json             # shadcn/ui configuration
├── .yarnrc.yml                 # Yarn configuration (node-modules linker)
└── .vscode/                    # VS Code settings
    └── settings.json           # Editor settings (format on save, etc.)
```

## Generating Supabase Types

To get type-safe Supabase queries, generate types from your project schema:

**Remote project** (set `SUPABASE_PROJECT_REF` in `.env` or export it):

```bash
yarn db:types
```

**Local project** (with `supabase start`):

```bash
yarn db:types:local
```

**Manual** (replace `<project-ref>` with your project ID from the dashboard URL):

```bash
npx supabase gen types typescript --project-id <project-ref> --schema public > supabase/types/database.types.ts
```

After generation, `createClient()` from `supabase/server` and `supabase/client` will infer table types from `Database`.

## Configuration Files

- **`tsconfig.json`** - TypeScript compiler options with strict mode
- **`next.config.ts`** - Next.js config (includes `serverExternalPackages` for Supabase)
- **`eslint.config.js`** - ESLint flat config with Next.js and Prettier integration
- **`.prettierrc.json`** - Code formatting rules
- **`tailwind.config.ts`** - Tailwind CSS with shadcn/ui theme variables
- **`components.json`** - shadcn/ui component configuration
- **`.yarnrc.yml`** - Yarn package manager settings (node-modules linker)
- **`.vscode/settings.json`** - VS Code editor preferences (format on save, ESLint auto-fix)

## Code Style

- **ESLint**: Enforces Next.js best practices and code quality
- **Prettier**: Ensures consistent code formatting
- **TypeScript**: Provides type safety and better IDE support

The project is configured to automatically format code on save in VS Code/Cursor.

## License

MIT
