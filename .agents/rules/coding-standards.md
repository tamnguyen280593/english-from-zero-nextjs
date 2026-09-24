---
trigger: always_on
---

# Coding Standards & Best Practices

All agents and developers contributing to this project MUST strictly adhere to the following coding standards before rendering or committing any code:

## 1. TypeScript Strictness
- **NO `any` TYPE**: The use of `any` is strictly prohibited. All variables, props, and return types must have explicitly defined types or interfaces.
- **Type Interfaces**: Use `interface` or `type` definitions for all data structures (e.g., `Lesson`, `Topic`, `Category`).
- **Strict Null Checks**: Always handle `null` and `undefined` safely. Use optional chaining (`?.`) and nullish coalescing (`??`).

## 2. Next.js (App Router) & React Guidelines
- **Server vs Client Components**: Default to Server Components (`async function`) for data fetching. Only use `'use client'` when interactive hooks (`useState`, `useEffect`, `onClick`) are absolutely necessary.
- **Data Fetching**: Use Next.js native fetch API or server actions instead of heavy third-party fetching libraries unless required.
- **Performance**: Optimize images using `next/image` where applicable (or standard `<img>` with `loading="lazy"` if static export constraints require it).

## 3. Clean Code Architecture
- **DRY (Don't Repeat Yourself)**: Extract reusable UI elements into the `src/components/` directory.
- **Separation of Concerns**: Keep business logic (data parsing, quiz generation) in `src/lib/` and separate it from UI components.
- **CSS Modules**: All styles must be scoped using `*.module.css` to prevent global CSS leakage. Do NOT use inline styles unless for dynamic values (e.g., progress bars, dynamic colors).

## 4. Enforcement
- **Pre-Render Checklist**: Before an agent outputs or modifies code, it MUST verify the code against these rules.
- **Linting**: Ensure code passes standard ESLint and TypeScript compilation (`npm run build`) without warnings or errors.
