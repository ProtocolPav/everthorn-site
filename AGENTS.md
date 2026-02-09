# AGENTS.md

Guidelines for AI agents working in the Everthorn TanStack codebase.

## Tech Stack

- **Framework:** TanStack Start (React 19 meta-framework with SSR)
- **Routing:** TanStack Router (file-based, dot notation for nesting)
- **Data Fetching:** TanStack Query v5
- **Forms:** TanStack Form with Zod v4 validation
- **Styling:** Tailwind CSS v4, shadcn/ui (New York style)
- **Icons:** Phosphor Icons (preferred), Lucide (secondary)
- **Build:** Vite 7, TypeScript 5.7 (strict mode), bun
- **Testing:** Vitest with React Testing Library

## Commands

```bash
bun run dev          # Start dev server on port 3000
bun run build        # Production build
bun run serve        # Preview production build
bun run test         # Run all tests
bunx vitest run path/to/file.test.ts   # Run single test file
bunx vitest run -t "test name"         # Run tests matching name
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives (installed via shadcn CLI)
│   ├── common/       # Custom reusable components (our own shadcn-style library)
│   ├── features/     # Feature-specific components (quest-card, project-card)
│   ├── layout/       # Layout components (header, footer)
│   └── errors/       # Error boundary components
├── hooks/            # Custom React hooks (data fetching)
├── lib/              # Utilities, auth, theme provider
│   └── schemas/      # Zod validation schemas
├── config/           # Static configuration files
├── routes/           # TanStack Router file-based routes
├── styles/           # Global CSS and Tailwind config
└── types/            # TypeScript type definitions (.d.ts)
```

## Code Style

### Imports

Order: external packages → `@/` alias imports → relative imports

### Components

- Use **function declarations** (not arrow functions)
- Use **named exports**
- Extend native elements with `React.ComponentProps<T>`

### TypeScript

- Strict mode enabled; avoid `any`
- `interface` for object shapes, `type` for unions/intersections
- Shared types in `src/types/*.d.ts`
- Infer from Zod: `type FormValues = z.infer<typeof schema>`

### Naming

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `use-quests.ts`, `quest-form.tsx` |
| Components | PascalCase | `QuestEditForm`, `ControlBar` |
| Hooks | camelCase with `use` | `useQuests`, `useThornyUser` |
| API fields | snake_case (from backend) | `quest_type`, `created_by` |

## UI/UX Guidelines

### Visual Coherence (Critical)

All UI must be visually consistent. Before creating new elements:

1. **Check existing components** in `ui/`, `common/`, `features/`
2. **Reuse patterns** - Selects, buttons, inputs must look identical everywhere
3. **Use existing variants** - e.g., Button has `default`, `outline`, `ghost`, `invisible`
4. **Create new variants/components** when a pattern will be reused - don't inline one-off Tailwind overrides

When a reusable pattern emerges, create either:
- A new **variant** on an existing component (e.g., `shiny` button variant)
- A new **common component** in `src/components/common/` (e.g., `SeamlessInput`, `VirtualizedCombobox`)

### Styling

- Use `cn()` from `@/lib/utils` for conditional classes
- Use CSS variables: `bg-primary`, `text-muted-foreground`, etc.
- Use `data-slot` attributes for component composition

### Dialogs & Modals

Use dialogs frequently for:
- Menus and additional options
- Preview panels (center peek, like Notion)
- Confirmations and forms

### Toast Notifications (Sonner)

- Use friendly, human-readable messages
- Include icons when possible
- Add actionable buttons (undo, retry, view)
- Use `duration: Infinity` for persistent toasts that require user action

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

Use TanStack Form with Zod schemas in `src/lib/schemas/`:

```tsx
export const formSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["option1", "option2"]),
});
export type FormValues = z.infer<typeof formSchema>;
```

Use the Field component system from `@/components/ui/field` consistently.

Access field state via `useFieldContext` from `@/hooks/use-form-context`.

## Routing

File-based routes in `src/routes/` using dot notation:
- `quests.index.tsx` - Index route
- `quests.editor.$id.tsx` - Dynamic param route
- `_main.tsx` - Layout route
- `(redirects)/` - Route group (no URL segment)

## Error Handling

- Throw errors in fetchers (don't return error objects)
- Handle `isLoading`/`isError` states in components
- Use `errorComponent` in route config for boundaries
- Show friendly messages via `sonner` toasts
