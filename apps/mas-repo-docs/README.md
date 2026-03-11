# mas-repo-docs

Angular documentation portal for the MAS monorepo.

Primary purpose: validate the Nx project graph across two different frameworks (React Native + Angular) so that `nx affected` correctly lights up this app whenever a shared lib changes.

Secondary purpose: serve as the host for TypeDoc-generated HTML documentation for all `@mas/*` libs (planned).

---

## Stack

| Technology | Version |
|---|---|
| Angular | 19 |
| Angular CLI / build | `@angular/build:application` |
| Stylesheet | SCSS |

---

## Commands

```bash
# Development server
nx run mas-repo-docs:serve

# Production build
nx run mas-repo-docs:build

# Lint
nx run mas-repo-docs:lint
```

---

## Nx graph integration

This app is tagged `docs` in `project.json`. When any `@mas/*` lib is modified, `nx affected` will include `mas-repo-docs` in the affected set — verifying that both RN and Angular consumers are validated together.

---

## Roadmap

- ✅ Angular app in the Nx graph
- ✅ Validated `nx affected` propagation from shared libs
- ⏳ TypeDoc HTML generation per lib → `src/assets/docs/{lib-name}/`
- ⏳ Lib listing page with links to TypeDoc output
- ⏳ CD deployment (Firebase Hosting / Vercel)
