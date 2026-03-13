# SAFETY.md - Security & Protection Protocols

Guidelines for maintaining a secure education consultancy system.

## 1. Credentials Management
- **Rule:** NEVER commit `.env.local` or its equivalents to source control.
- **Practice:** Use Vercel's Environment Variable management for production.
- **Audit:** Regularly check `package.json` for outdated/vulnerable dependencies.

## 2. Supabase Security
- **Rule:** Row Level Security (RLS) must ALWAYS be enabled.
- **Practice:** Ensure `anon` keys only have `SELECT` on public tables and `INSERT` on `leads`.
- **Policy:** Admins MUST have specific authenticated roles/claims to modify data.

## 3. Data Integrity
- **Rule:** All student inquiries MUST be sanitized.
- **Practice:** Use Zod schemas for all form inputs.
- **Privacy:** Leads contain PII (Phone/Email). Ensure data access is restricted to verified admin users only.

## 4. Operational Safety
- **Rule:** Do not run untrusted scripts.
- **Audit:** Any `npm run` or `npx` command must be verified before execution.
- **Backups:** Utilize Supabase's automatic database backups for data recovery.
