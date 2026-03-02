
---

```md
# ServiceFlow SaaS

ServiceFlow is a mobile-first SaaS platform designed for small technical service businesses.

It allows businesses to:
- Receive service requests online
- Manage customers and service jobs
- Generate service receipts
- Print receipts using 58mm Bluetooth thermal printers
- Have an auto-generated public website

---

## 🚀 Tech Stack

### Web (V1)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Railway)
- Web Bluetooth API
- ESC/POS thermal printing

### Mobile (V2)
- Flutter
- Dart
- flutter_blue_plus
- REST API integration
- Native Bluetooth printing

---

## 🏗 Architecture

Single repository structure:

- Next.js handles:
  - Frontend UI
  - Backend API (Route Handlers)
- PostgreSQL via Railway
- Bluetooth printing handled client-side

```

Web App (Next.js)
↓
PostgreSQL (Railway)
↓
Bluetooth Printer (Client-side)

```

V2 introduces:

```

Web SaaS → REST API → Flutter App → Bluetooth Printer

```

---

## 📦 Project Structure

```

/
├── app/
├── components/
├── lib/
├── prisma/
├── docs/
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_V1_FEATURES.md
│   ├── 03_V1_STEP_BY_STEP_PROMPTS.md
│   ├── 04_V2_FEATURES_FLUTTER.md
│   ├── 05_V2_STEP_BY_STEP_PROMPTS.md
│   └── 06_ARCHITECTURE_RULES.md
├── README.md

```

---

## ✅ Version 1 Features

- Business account setup
- Customer management
- Service request management
- Public service request form
- Auto-generated business website
- Receipt creation
- Bluetooth printing (Android Chrome)
- Simple dashboard

---

## 📱 Version 2 Features

- Flutter companion app
- iOS Bluetooth printing
- QR-based print flow
- Printer management
- Offline printing support

---

## ⚙️ Environment Variables

```

DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=

```

---

## 🛠 Development

### Install

```

npm install

```

### Run locally

```

npm run dev

```

### Build

```

npm run build
npm run start

```

---

## 🚄 Deployment

Deploy as a single service on Railway.

- Connect GitHub repo
- Add PostgreSQL plugin
- Set environment variables
- Deploy

---

## ⚠️ Important Notes

- Web Bluetooth works on Android Chrome only
- iOS printing requires Flutter companion app (V2)
- All data must be scoped by business_id
- Keep MVP simple

---

## 🎯 Product Philosophy

This product replaces:
- Paper notes
- WhatsApp tracking
- Excel sheets
- Manual receipts

Always prioritize:
- Simplicity
- Speed
- Mobile usability
- Clean architecture

---

## 📈 Roadmap

V1 → Web SaaS + Android printing  
V2 → Flutter app + iOS printing  
V3 → Payments, staff, automation  

---

## License

Proprietary – Internal SaaS Project
```

---
