# Games Dashboard (React + Vite)

## Cloudflare Workers deploy

In **Workers Builds → Settings**, use:

| Setting | Value |
|--------|--------|
| **Root directory** | `/` (repo root — where `package.json` is) |
| **Build command** | *(optional)* `npm ci && npm run build` |
| **Deploy command** | **`npm ci && npm run deploy`** |

Use **`npm run deploy`**, not `npx wrangler deploy` alone — Wrangler needs the `dist/` folder from `npm run build`.

The Vite app outputs to `dist/`. `wrangler.toml` serves those files as a SPA.

Local deploy: `npm run deploy` (build + wrangler).

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
