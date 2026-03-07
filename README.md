# Technical Service SaaS Platform

A modern, mobile-first, multi-tenant SaaS platform for technical service companies.

Built with:

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Prisma ORM
- Railway (single repo deployment)
- Web Bluetooth (Android printing)
- Flutter (iOS Bluetooth printing support)

---

# 🚀 Overview

This platform allows technical service businesses to:

- Manage service requests
- Track job progress
- Assign technicians
- Print 58mm Bluetooth thermal receipts
- Operate as independent SaaS tenants
- Have their own public website under a subdomain
- Prepare for custom domain usage

The system is designed for real-world technician workflows and optimized for mobile usage.

---

# 🧱 Architecture

- Single repository (frontend + backend together)
- Next.js App Router
- Server Components + API routes
- Multi-tenant architecture (V3)
- Subdomain-based tenant resolution
- Railway hosted
- PostgreSQL database

---

# 📌 Version Roadmap

## ✅ V1 – Core Service Management

- Service request lifecycle:
  - New
  - Assigned
  - In Progress
  - Completed
  - Invoiced
- Technician assignment
- Payment status:
  - Paid
  - Partial
  - Unpaid
- Customer signature capture
- Internal job tracking
- Basic reporting
- Android Bluetooth 58mm receipt printing (Web Bluetooth)

---

## ✅ V2 – iOS Printing Support

- Flutter companion app for iOS
- Native Bluetooth thermal printing (58mm)
- Shared backend API
- Unified receipt template logic
- Cross-platform print consistency

---

## ✅ V3 – User Roles & Task Assignment

- **Role-Based Access Control (RBAC):**
  - **Admin:** Full control over the business, team management, and all service requests.
  - **Technician:** Specialized view, access only to assigned tasks, simplified workflow.
- **Team Management:**
  - Capability for Admins to add and manage unlimited technicians.
  - Role-specific dashboard views and navigation.
- **Task Assignment System:**
  - Assign specific technicians to service requests.
  - Technician-specific job queues for improved focus.
  - Real-time status updates and action tracking by assigned staff.

---

## 🚀 V4 – Multi-Tenant Public Websites

### Multi-Tenant SaaS System

Each service company (tenant):

- Has isolated data
- Has a unique slug
- Operates under a subdomain
- Can customize branding
- Can receive public service requests

Example: `tenant1.teknikservis.com`
Future: `customdomain.com`


---

# 🏢 Multi-Tenant Design

Tenant resolution is handled via:

- Subdomain parsing
- Middleware detection
- Tenant context injection
- Strict database filtering by tenantId

All API routes enforce tenant isolation.

---

# 🌐 Public Website (Per Tenant)

Each tenant gets:

## Public Homepage

- Company logo
- Company name
- Public description
- Services list
- Contact details
- WhatsApp link
- Working hours
- Google Maps embed
- “Request Service” button

## Public Service Request Form

Visitors can:

- Submit service request
- Upload images
- Choose preferred date
- Provide contact information

Requests created with:

- status = NEW
- source = PUBLIC_SITE

---

# 👥 Team Management & User Roles

The platform supports a hierarchical user system optimized for service centers:

### Admin Workspace
- Dashboard with overhead view of all active/pending jobs.
- Ability to see which technician is working on which job.
- Full access to customer database, service catalog, and team management.
- Dedicated Team page to add, edit, or remove staff members.

### Technician Workspace
- Mobile-optimized focused view.
- "My Jobs" section showing only tasks assigned specifically to that technician.
- Simplified workflow to add actions, set prices, and complete assigned tasks.
- Immediate receipt generation for customers upon completion.
- Restricted access to ensure business data security.

---

# 🎨 Branding Customization

Tenant Admin can configure:

- Slug (unique identifier)
- Primary brand color
- Cover image
- Public description
- Enable/Disable public site

---

# 🔎 SEO Support (V3)

Dynamic metadata per tenant:

- Page title
- Meta description
- OpenGraph tags
- Canonical URLs

Designed to be indexable by search engines.

---

# 🌍 Custom Domain Support (Prepared)

Database supports:

- custom_domain
- domain_verified

Future flow:

User sets DNS:CNAME tenantdomain.com → yourapp.com


Middleware resolves tenant via:

- custom domain
- or subdomain

---

# 🔐 Security

- Strict tenant isolation
- Slug uniqueness enforcement
- Role-based access control
- Rate-limited public form
- Input validation and sanitization
- Secure file uploads

---

# 📁 Project Structure
app/
(dashboard)/
(public)/
lib/
middleware.ts
prisma/

---

# 🚂 Deployment (Railway)

Requirements:

- PostgreSQL database
- Wildcard domain configured:*.yourapp.com
- Environment variables:DATABASE_URL=
ROOT_DOMAIN=
NEXTAUTH_SECRET=


---

# 🎯 Product Vision

The platform evolves from:

> Internal technician tool

Into:

> Scalable multi-tenant SaaS platform for service companies

Future roadmap includes:

- Subscription billing
- Public marketplace directory
- Reviews system
- Analytics dashboard
- White-label SaaS
- AI-powered job classification

---

# 🧠 Development Principles

- Production-ready TypeScript
- Clean modular architecture
- Strict multi-tenant validation
- Mobile-first UI
- Incremental version-based development
- Secure by design

---

# 📌 Current Status

- V1: Completed
- V2: Completed
- V3: Completed (User Roles & Task Assignment)
- V4: Public websites & SEO (In Progress)

---

This project is designed to scale from a single service business tool into a full SaaS ecosystem for technical service companies.