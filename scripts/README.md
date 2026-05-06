# scripts

One-off utility scripts that assist with development, testing, and data operations.
These are **not** part of the Next.js application bundle.

## Files

| File | Purpose |
|---|---|
| `fetch-form.mjs` | Test script to submit the lead form via fetch and verify the Server Action response. |
| `proxy.ts` | Development proxy helper (TypeScript). Run with `npx ts-node scripts/proxy.ts`. |

## Usage

Run scripts from the project root:
```bash
node scripts/fetch-form.mjs
# or
npx ts-node scripts/proxy.ts
```
