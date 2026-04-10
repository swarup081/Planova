# Contributing to Planova

Thank you for your interest in contributing! Here's how to get started.

---

## Development Setup

```bash
git clone https://github.com/<your-username>/planova.git
cd planova
npm install
npm run dev
```

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `chore/*` | Maintenance / refactors |
| `docs/*` | Documentation only |

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:  add week view to desktop panel
fix:   correct timezone offset in dateToStr util
chore: migrate to Tailwind CSS v4
docs:  update README with project structure
```

---

## Project Structure Rules

- **Feature modules** live under `app/features/<feature-name>/`
- Each feature exposes a public API via `app/features/<feature-name>/index.ts`
- **Hooks** go in `hooks/`, **types** in `types/`, **constants** in `constants/`
- **Components** are split by viewport: `components/mobile/` and `components/desktop/`
- **Shared utilities** live in `app/lib/utils/`

---

## Code Style

- TypeScript strict mode – no `any` without a comment explaining why
- Keep components focused: prefer small, single-responsibility files
- Add JSDoc comments to all exported functions, hooks, and types

---

## Pull Request Checklist

- [ ] Code follows the project structure rules above
- [ ] All existing linting passes: `npm run lint`
- [ ] No `console.log` left in production code
- [ ] PR description explains *what* changed and *why*
