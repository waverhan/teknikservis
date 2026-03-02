
---

# V3 Implementation – Step by Step Claude Prompts

This file contains structured prompts to guide Claude through V3 development safely and incrementally.

Do NOT implement everything at once.
Follow steps in order.

---

# STEP 1 – Database Update

Prompt to Claude:

We are implementing V3 multi-tenant architecture.

Context:
- Next.js App Router
- PostgreSQL
- Prisma ORM
- Single repo
- Railway deployment
- V1 and V2 complete

Task:
1. Update Prisma schema:
   - Add slug (unique, required)
   - Add custom_domain (unique, optional)
   - Add domain_verified (boolean)
   - Add is_public (boolean)
   - Add primary_color
   - Add cover_image
   - Add public_description
2. Generate migration.
3. Ensure slug uniqueness validation.

Do not modify existing tables except organizations.
Return only updated schema and migration steps.

---

# STEP 2 – Middleware for Tenant Detection

Prompt:

Create production-ready middleware.ts for subdomain-based multi-tenant detection.

Requirements:
- Extract hostname from request
- Ignore www, app, admin
- Parse subdomain
- Query database for organization by slug
- If found:
    - Attach tenantId to request headers
- If not found:
    - Return 404 for public routes
- Do not break dashboard routes

Use ROOT_DOMAIN env variable.

Return full middleware.ts file.

---

# STEP 3 – Tenant Resolver Utility

Prompt:

Create /lib/tenant.ts

Function:
getTenantByHost(host: string)

It should:
- Check custom_domain first
- Then check slug via subdomain
- Return tenant object
- Handle missing tenant gracefully

Return full implementation.

---

# STEP 4 – Public Route Structure

Prompt:

Create public route group:

app/(public)/

Files:
- layout.tsx
- page.tsx

Requirements:
- Load tenant dynamically
- Apply primary_color as theme
- Render company info
- Handle missing tenant

Return production-ready React Server Components.

---

# STEP 5 – Public Service Request Form

Prompt:

Create public service request form at:

app/(public)/request/page.tsx

Requirements:
- Collect:
    - Name
    - Phone
    - Description
    - Preferred date
    - Image upload
- Create service request with:
    status = NEW
    source = PUBLIC_SITE
- Rate limit basic protection
- Validate input

Return full implementation.

---

# STEP 6 – Admin Public Settings Panel

Prompt:

Extend dashboard with:

Public Site Settings page

Features:
- Update primary_color
- Update public_description
- Update cover_image
- Enable/disable public site
- Slug display (read-only if already set)

Ensure:
- Only tenant admin can modify
- Tenant isolation enforced

Return page and API updates.

---

# STEP 7 – SEO Metadata

Prompt:

Implement dynamic metadata using generateMetadata().

Requirements:
- Title = tenant name
- Description = public_description
- OpenGraph tags
- Canonical URL
- Fallback if tenant missing

Return updated layout implementation.

---

# STEP 8 – Custom Domain Preparation

Prompt:

Update middleware to also resolve tenant by custom_domain.

If host matches custom_domain:
- Load tenant
- Bypass subdomain logic

Do not implement DNS verification yet.
Return updated middleware.

---

# FINAL CHECKLIST BEFORE DEPLOY

- Tenant isolation verified
- Slug uniqueness enforced
- Public routes working via subdomain
- Wildcard domain configured in Railway
- ROOT_DOMAIN set
- All API routes filtered by tenantId

---

# IMPORTANT RULES FOR CLAUDE

- Do not break V1/V2 logic
- Do not change core schema unnecessarily
- Keep code production-ready
- Use strict TypeScript
- Ensure security best practices