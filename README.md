# template-skyline-04

Standalone Next.js public template for client deployments.

Required env vars:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ORG_SLUG`
- `TEMPLATE_HEX_CODE`

Optional env var:

- `NEXT_PUBLIC_FALLBACK_API_URL`

Deployment contract:

- Data loads from `/api/public/templates/:slug/:templateHexCode`
- Browser requests proxy through `src/app/api/public/[...path]/route.ts`

Checks before deploy:

- `npm run typecheck`
- `npm run build`

Reference:

- See [templates/README.md](../../README.md) for the shared deployment contract
