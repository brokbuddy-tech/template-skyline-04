# template-skyline-04

Standalone Next.js public template for client deployments.

Required env vars:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ORG_SLUG`

Optional env var:

- `NEXT_PUBLIC_FALLBACK_API_URL`

Deployment contract:

- Canonical public routes stay root-based, for example `/about`, `/agents/:agentSlug`, and `/property/:id`
- Browser data and asset requests flow through `/api/public-template-proxy/*`
- The organization slug and template hex code are resolved server-side and never exposed in browser fetch URLs

Checks before deploy:

- `npm run typecheck`
- `npm run build`

Reference:

- See [templates/README.md](../../README.md) for the shared deployment contract
