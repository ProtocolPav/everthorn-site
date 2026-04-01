# AGENTS.md

Guidelines for AI agents working in the Everthorn TanStack codebase.

## Tech Stack

- **Framework:** TanStack Start (React 19 meta-framework with SSR)
- **Routing:** TanStack Router (file-based, dot notation for nesting)
- **Data Fetching:** TanStack Query v5
- **Forms:** TanStack Form with Zod v4 validation
- **Styling:** Tailwind CSS v4 (CSS-based config in `src/styles/globals.css`), shadcn/ui (New York style)
- **Icons:** Phosphor Icons (`@phosphor-icons/react`) — preferred. Lucide (`lucide-react`) — secondary, only in shadcn defaults.
- **Build:** Vite 7, TypeScript 5.7 (strict mode), bun as package manager
- **Testing:** Vitest with React Testing Library (configured, no tests written yet)

## Commands

```bash
bun run dev          # Start dev server on port 3000
bun run build        # Production build
bun run serve        # Preview production build
bun run test         # Run all tests
bunx vitest run path/to/file.test.ts   # Run single test file
bunx vitest run -t "test name"         # Run tests matching name
```

No lint, typecheck, or format scripts are configured. To typecheck manually: `bunx tsc --noEmit`.

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives (45+ files, managed via shadcn CLI)
│   ├── common/       # Custom reusable components (our own library: SeamlessInput, VirtualizedCombobox, etc.)
│   ├── features/     # Feature-specific components (quest-card, project-card, map, etc.)
│   ├── layout/       # Layout components (header, footer)
│   └── errors/       # Error boundary components
├── hooks/            # Custom React hooks (use-*.ts pattern)
├── lib/              # Utilities, auth, theme provider
│   └── schemas/      # Zod validation schemas (.tsx extension, uses TanStack Form field components)
├── config/           # Static configuration files (navigation, form options, map defaults)
├── routes/           # TanStack Router file-based routes
├── styles/           # Global CSS and Tailwind v4 @theme config
└── types/            # TypeScript type definitions (.d.ts, pure interface declarations)
```

## Code Style

### Imports

Order: external packages → `@/` alias imports → relative imports. Include `.ts`/`.tsx` extensions in import paths (`allowImportingTsExtensions` is enabled).

### Components

- Use **function declarations** (not arrow functions)
- Use **named exports** (export at bottom of file, not default exports)
- Extend native elements with `React.ComponentProps<"element">` or combine with `VariantProps<>`
- Use `data-slot` attributes on all component sub-elements for composition (shadcn convention)

### TypeScript

- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Avoid `any`; use proper typing
- `interface` for object shapes, `type` for unions/intersections
- Shared types in `src/types/*.d.ts` — pure `interface` declarations with `export`
- Infer from Zod: `type FormValues = z.infer<typeof schema>`
- API fields use **snake_case** (matching backend)

### Naming

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `use-quests.ts`, `quest-form.tsx` |
| Components | PascalCase | `QuestEditForm`, `ControlBar` |
| Hooks | camelCase with `use` | `useQuests`, `useThornyUser` |
| Schemas | kebab-case in `schemas/` | `quest-form.tsx` |
| API fields | snake_case (from backend) | `quest_type`, `created_by` |

## UI/UX Guidelines

### Visual Coherence (Critical)

All UI must be visually consistent. Before creating new elements:

1. **Check existing components** in `ui/`, `common/`, `features/`
2. **Reuse patterns** — Selects, buttons, inputs must look identical everywhere
3. **Use existing variants** — e.g., Button has `default`, `outline`, `ghost`, `invisible`
4. **Create new variants/components** when a pattern will be reused — don't inline one-off Tailwind overrides

When a reusable pattern emerges, create either:
- A new **variant** on an existing component (e.g., `shiny` button variant)
- A new **common component** in `src/components/common/`

### Styling

- Use `cn()` from `@/lib/utils` for conditional classes (`clsx` + `tailwind-merge`)
- Use CSS variables: `bg-primary`, `text-muted-foreground`, etc. (defined in `globals.css`)
- Tailwind v4 uses `@theme` and `@custom-variant dark` in CSS — no `tailwind.config.js`
- Dark mode: `.dark` class on `<html>`, toggled via `useTheme()` from `@/lib/theme-provider`

### Dialogs & Modals

Use dialogs frequently for: menus, preview panels (center peek, like Notion), confirmations, and forms.

### Toast Notifications (Sonner)

- Use friendly, human-readable messages with icons
- Add actionable buttons (undo, retry, view)
- Use `duration: Infinity` for persistent toasts requiring user action

## Data Fetching

Place hooks in `src/hooks/`. Pattern:

```tsx
const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

export function useData(id: string | null) {
  return useQuery({
    queryKey: ['data', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/endpoint/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!id,
    gcTime: Infinity,
  });
}
```

Query keys: `['resource', id]` or `['resource', 'list', params]`

## Forms & Validation

Use TanStack Form with Zod v4 schemas in `src/lib/schemas/`:

```tsx
export const formSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["option1", "option2"]),
});
export type FormValues = z.infer<typeof schema>;
```

Forms use a custom hook system via `createFormHook()` / `createFormHookContexts()`. Use the Field component system from `@/components/ui/field` consistently. Access field state via `useFieldContext` from `@/hooks/use-form-context`.

## Routing

File-based routes in `src/routes/` using dot notation:
- `quests.index.tsx` — Index route
- `quests.editor.$id.tsx` — Dynamic param route (`$` prefix)
- `_main.tsx` — Layout route (`_` prefix)
- `(redirects)/` — Route group (no URL segment, `()` prefix)
- `__root.tsx` — Root layout (HTML shell, providers, devtools)
- Each route exports `Route` via `createFileRoute()`

## Error Handling

- Throw errors in fetchers (don't return error objects)
- Handle `isLoading`/`isError` states in components
- Use `errorComponent` in route config for boundaries
- Show friendly messages via `sonner` toasts

## Environment Variables

Stored in `.env` (gitignored). Key variables:
- `VITE_NEXUSCORE_API_URL` — Backend API URL
- `VITE_BASE_URL` — App base URL
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — Auth config
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` — Discord OAuth
