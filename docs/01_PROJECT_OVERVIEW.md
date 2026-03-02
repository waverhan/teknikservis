# Project Overview

This project is a mobile-first SaaS platform for small technical service businesses.

The system allows businesses to:
- Receive service requests online
- Manage customers
- Track service jobs
- Generate service receipts
- Print receipts using 58mm Bluetooth thermal printers
- Have a simple auto-generated public website

The project is built using:
- Next.js 14 (single repository)
- PostgreSQL
- Prisma ORM
- Deployed as a single Railway service

Version 1 supports Bluetooth printing via Web Bluetooth (Android Chrome).
Version 2 adds a Flutter companion app for iOS Bluetooth printing.

Core principle:
Keep the MVP simple, clean, and easy for non-technical users.