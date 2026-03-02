# V3 Features – Multi-Tenant Architecture & Public Websites

## Status
V1 ✅ Core Service Management  
V2 ✅ Bluetooth Printing (Android Web Bluetooth + iOS Flutter)  
V3 🚀 Multi-Tenant SaaS + Public Websites  

---

# 🎯 Objective of V3

Upgrade the platform into a fully multi-tenant SaaS system where:

- Each service company has isolated data
- Each company gets a public website via subdomain
- Visitors can submit service requests
- SEO indexing is enabled
- Custom domains are supported (future-ready)

---

# 🏗 Multi-Tenant Architecture

## Subdomain Structure


tenant1.yourapp.com
tenant2.yourapp.com


Future:


tenantdomain.com


---

# 🧠 Tenant Resolution Strategy

Tenant is resolved using:

- Host header
- Subdomain parsing
- Next.js middleware
- Tenant context injection
- Database lookup by slug

---

# 🗂 Database Changes

Update `organizations` (or `companies`) table:

```sql
slug TEXT UNIQUE NOT NULL
custom_domain TEXT UNIQUE NULL
domain_verified BOOLEAN DEFAULT false
is_public BOOLEAN DEFAULT true
primary_color TEXT
cover_image TEXT
public_description TEXT
🔐 Tenant Isolation

Every query must:

Include tenantId filter

Prevent cross-tenant access

Validate session tenant match

All API routes must verify tenant context.

🌐 Public Website (Per Tenant)

Each tenant has:

Public Homepage

Contains:

Logo

Company name

Public description

Services list

Contact information

WhatsApp link

Working hours

Map embed

Request Service button

Public Service Request Form

Creates:

status = NEW
source = PUBLIC_SITE

Supports:

Image upload

Preferred date

Customer contact info

Security:

Rate limiting

Basic spam protection

🎨 Branding & Customization

Admin Panel → Public Site Settings

Fields:

Slug (editable once)

Primary color

Cover image

Public description

Services list

Enable/Disable public visibility

🔎 SEO Support

Dynamic metadata using:

generateMetadata()

Per tenant:

Title

Meta description

OpenGraph image

Canonical URL

Ensure:

Sitemap support

Robots.txt configured

🌍 Custom Domain (Prepared)

Database fields added.

Middleware checks:

subdomain

custom_domain match

Future DNS setup:

CNAME tenantdomain.com → yourapp.com
🚂 Railway Configuration

Add wildcard domain:

*.yourapp.com

Environment variable:

ROOT_DOMAIN=yourapp.com
📦 V3 Deliverables

Multi-tenant middleware

Tenant resolver

Public site layout

Public service form

Admin public settings

SEO implementation

Custom domain preparation