# Games Dashboard (React + Vite)

## Auto-deploy on git push (recommended)

Push to **`main`** → GitHub Actions runs **`.github/workflows/deploy-cloudflare.yml`** → build + `wrangler deploy`.

### One-time GitHub secrets

Repo **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Where to get it |
|--------|------------------|
| `CLOUDFLARE_API_TOKEN` | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → template **Edit Cloudflare Workers** (or custom: Account + Workers Scripts edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → any zone/workers URL, or **Workers & Pages** → right sidebar **Account ID** |

Then push this repo to `main`. Check **Actions** tab for the deploy run.

Local deploy: `npm run deploy`

### Optional: Cloudflare Workers Builds

If you also use Workers Builds, set **Deploy command** to `npm ci && npm run deploy` (not `npx wrangler deploy` alone). To avoid double deploys, disable either GitHub Actions or automatic Workers Builds—pick one.

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
