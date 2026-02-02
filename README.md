# macOS Interface

A modern web application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components built with Radix UI and Tailwind CSS
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Yarn** - Package manager

## Features & Configuration

### TypeScript

- Strict type checking enabled
- Path aliases configured (`@/*` → `./*`)
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
├── app/                  # App Router (Next.js 13+)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles with Tailwind
├── components/            # React components
│   └── ui/              # shadcn/ui components
├── lib/                  # Utilities and helpers
│   └── utils.ts         # Utility functions (cn helper)
├── hooks/                # Custom React hooks
├── public/               # Static assets
├── .eslintrc.json        # ESLint configuration (legacy, for reference)
├── eslint.config.js      # ESLint flat config (ESLint 9+)
├── .prettierrc.json      # Prettier configuration
├── .prettierignore       # Prettier ignore patterns
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── components.json       # shadcn/ui configuration
├── .yarnrc.yml           # Yarn configuration (node-modules linker)
└── .vscode/              # VS Code settings
    └── settings.json     # Editor settings (format on save, etc.)
```

## Configuration Files

- **`tsconfig.json`** - TypeScript compiler options with strict mode
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
