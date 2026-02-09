# AGENTS.md

Guidelines for AI agents working in the Everthorn TanStack codebase.

## Tech Stack

- **Framework:** TanStack Start (React 19 meta-framework with SSR)
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query v5
- **Forms:** TanStack Form with Zod v4 validation
- **Styling:** Tailwind CSS v4, shadcn/ui (New York style)
- **Build:** Vite 7, TypeScript 5.7 (strict mode), bun
- **Testing:** Vitest with React Testing Library

## Commands

```bash
# Development
bun run dev          # Start dev server on port 3000

# Build & Production
bun run build        # Production build
bun run serve        # Preview production build

# Testing
bun run test         # Run all tests
bunx vitest run path/to/file.test.ts   # Run single test file
bunx vitest run -t "test name"         # Run tests matching name
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (shadcn/ui)
│   ├── features/     # Feature-specific components
│   ├── common/       # Common reusable primitives (extension of shadcn/ui)
│   ├── layout/       # Layout components (header, etc.)
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

### Import Order

1. External packages (react, @tanstack/*, etc.)
2. Path alias imports (`@/components`, `@/hooks`, etc.)
3. Relative imports (`./`, `../`)

```tsx
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { useFieldContext } from "@/hooks/use-form-context";
import { helperFn } from "./utils";
```

### Component Patterns

- Use **function declarations** for components (not arrow functions)
- Use **named exports** for components
- Extend native elements with `React.ComponentProps<T>`

```tsx
function Button({
  className,
  variant,
  ...props
}: React.ComponentProps<"button"> & ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}

export { Button }
```

### TypeScript Conventions

- Strict mode is enabled; avoid `any` types
- Use `interface` for object shapes, `type` for unions/intersections
- Place shared types in `src/types/*.d.ts`
- Infer types from Zod schemas: `type FormValues = z.infer<typeof schema>`

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `use-quests.ts`, `quest-form.tsx` |
| Components | PascalCase | `QuestEditForm`, `ControlBar` |
| Hooks | camelCase with `use` prefix | `useQuests`, `useThornyUser` |
| Variables/Functions | camelCase | `fetchData`, `isLoading` |
| API fields | snake_case (preserve from backend) | `quest_type`, `created_by` |

## UI/UX Guidelines

### Visual Coherence (Critical)

All components MUST be visually coherent. Before creating new UI elements:

1. **Check existing components** in `src/components/ui/`, `src/components/features/`, `src/components/common/` first
2. **Reuse patterns** - Select menus, buttons, inputs must look identical across all forms
3. **Use existing variants** - Button has `default`, `outline`, `ghost`, `invisible`, etc.
4. **Create variants when needed** - Create the `shiny` variant, don't just edit the tailwind classes for a specific case

### Invisible Title Pattern

For editable titles (quests, projects, etc.), use the invisible input pattern:

```tsx
<Input
  className="bg-transparent! text-3xl! focus-visible:bg-muted! focus-visible:ring-0 hover:bg-muted! px-1 border-none font-bold"
  placeholder="Quest Title"
/>
```

This creates an inline-editable title that looks like text until focused.

### Styling Guidelines

- Use `cn()` utility from `@/lib/utils` for conditional classes
- Use CSS variables for colors: `bg-primary`, `text-muted-foreground`, etc.
- Prefer Tailwind classes over inline styles
- Use `data-slot` attributes for component composition

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-styles", isActive && "active-styles", className)} />
```

### Form Components

Use the Field component system consistently:

```tsx
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

<Field>
  <FieldLabel>Label Text</FieldLabel>
  <Input {...inputProps} />
  {isInvalid && <FieldError errors={field.state.meta.errors} />}
</Field>
```

## Data Fetching

### TanStack Query Hooks

Place data fetching hooks in `src/hooks/`. Follow this pattern:

```tsx
const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const fetcher = async (url: string): Promise<DataType> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export function useData(id: string | null) {
  return useQuery({
    queryKey: ['data', id],
    queryFn: () => fetcher(`${API_URL}/endpoint/${id}`),
    enabled: !!id,
    gcTime: Infinity,
  });
}
```

### Query Key Conventions

- Use arrays: `['resource', id]` or `['resource', 'list', params]`
- Include all variables that affect the query result

## Forms & Validation

### TanStack Form Pattern

Use the form context pattern with Zod validation:

```tsx
// Schema definition (src/lib/schemas/)
export const formSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["option1", "option2"]),
});

export type FormValues = z.infer<typeof formSchema>;

// Form usage with AppField pattern
<form.AppField
  name="title"
  children={(field) => <field.TitleField />}
/>
```

### Field Context

Access field state in nested components:

```tsx
import { useFieldContext } from "@/hooks/use-form-context";

export function TitleField() {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  // ...
}
```

## Routing

### File-Based Routes

Routes are defined in `src/routes/`. File naming:

- `index.tsx` - Index route for directory
- `$param.tsx` - Dynamic parameter route
- `_layout.tsx` - Layout route (prefix with `_`)
- `(group)/` - Route groups (parentheses, no URL segment)

### Route Definition

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/quests/editor/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  // ...
}
```

## Error Handling

- Throw errors in fetcher functions; don't return error objects
- Handle loading/error states in components with `isLoading`, `isError`
- Use route-level error boundaries (`errorComponent` in route config)
- Display user-friendly messages with `sonner` toast notifications

```tsx
const { data, isLoading, isError } = useData(id);

if (isLoading) return <Spinner />;
if (isError) return <ErrorMessage />;
```
