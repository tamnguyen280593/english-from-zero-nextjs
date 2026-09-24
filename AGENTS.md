<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Coding & Project Rules

This project uses a sophisticated Agentic Workflow. **BEFORE generating or modifying any code, you MUST:**
1. Read the strict coding standards in `.agents/rules/coding-standards.md` (e.g., No `any` types, Clean Code principles).
2. Read the UI design rules in `.agents/rules/ui-design-rules.md`.
3. Check the skills folder (`.agents/skills/`) to use predefined workflows (like `build-json-data`).
4. **MANDATORY**: Before considering any task complete, you MUST run `npm run lint` and `npm run build` to ensure the codebase has no errors.
5. **MANDATORY**: When rendering, planning, or generating code, you MUST always read and strictly follow all rules defined in the `.agents/` directory.

Failure to run your generated code against these rules and build checks before committing is unacceptable.

## Content Guidelines

For all educational content in this repository, strictly adhere to the following rules:
- **Topics**: Each topic (chủ đề) MUST have **at least 10 lessons** (bài học).
- **Lessons**: Each lesson MUST have **at least 10 vocabulary words** and **at least 10 phrases**.
- **Practice**: Each lesson's practice section (quiz) MUST generate **at least 15 questions**. (Currently enforced automatically via `quizGenerator`).
