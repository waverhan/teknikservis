# Version 1 – Web SaaS (Android Bluetooth Printing)

## Architecture
- Single Next.js 14 repository
- API via Next.js Route Handlers
- PostgreSQL via Railway
- Prisma ORM
- Client-side Web Bluetooth printing

---

## Core Features

### 1. Business Account
- Sign up / login
- Business profile:
  - Name
  - Phone
  - Address
  - Logo
  - Slug

---

### 2. Customer Management
- Create customer
- Search customers
- View customer details
- View customer service history

---

### 3. Service Request Management
Statuses:
- NEW
- IN_PROGRESS
- COMPLETED

Fields:
- Customer
- Description
- Notes
- Created date

---

### 4. Public Service Request Page
Route:
`/b/[slug]`

Form:
- Name
- Phone
- Address
- Description

Submission:
- Create Customer
- Create ServiceRequest (NEW)

---

### 5. Receipt Creation
- Create receipt from completed job
- Fields:
  - Business name
  - Customer name
  - Description
  - Price
  - Date

---

### 6. Bluetooth Thermal Printing (58mm)
- Web Bluetooth API
- ESC/POS protocol
- Android Chrome only
- Manual user-triggered printing

Supported:
- Bold text
- Alignment
- Line breaks
- Paper cut

---

## Not Included in V1
- Staff accounts
- Payments
- VAT
- Inventory
- Notifications
- Scheduling
- Customer portal