# V1 Development Steps for Claude

Follow steps strictly in order.

---

## Step 1
Initialize Next.js 14 App Router project with:
- TypeScript
- Tailwind CSS
- Prisma setup
- Railway compatibility

---

## Step 2
Create Prisma schema with models:
- Business
- Customer
- ServiceRequest
- Receipt

Run migrations.

---

## Step 3
Implement authentication:
- JWT
- Business-level isolation

---

## Step 4
Create API routes:
- /api/customers
- /api/service-requests
- /api/receipts
- /api/public/request

---

## Step 5
Build Dashboard UI:
- Mobile-first
- Bottom navigation
- Quick actions

---

## Step 6
Build public page:
Route: /b/[slug]

Form submission must:
- Create Customer
- Create ServiceRequest

---

## Step 7
Implement Bluetooth ESC/POS service:
- Connect to device
- Send Uint8Array
- Support formatting
- Paper cut command

---

## Step 8
Create receipt print component:
- Print preview
- Connect printer button
- Print button