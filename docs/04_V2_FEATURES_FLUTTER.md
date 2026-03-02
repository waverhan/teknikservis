# Version 2 – Flutter Companion App (iOS + Android Printing)

Purpose:
Enable Bluetooth printing on iOS and improve reliability.

The web SaaS remains the source of truth.

---

## Architecture

Web SaaS (Next.js)
        ↓
REST API
        ↓
Flutter App
        ↓
Bluetooth ESC/POS Printer

---

## V2 Core Features

### 1. Flutter Companion App
- iOS & Android support
- Login with SaaS account
- Secure API token authentication

---

### 2. Native Bluetooth Printing
- Use flutter_blue_plus
- ESC/POS support
- 58mm printers
- Auto reconnect to last printer

---

### 3. Print Flow (Option A – Recommended)
QR-Based Printing

1. Web generates receipt
2. Web displays QR code
3. Flutter app scans QR
4. App fetches receipt data
5. App prints receipt

---

### 4. Printer Management
- Save default printer
- Test print
- Printer status indicator

---

### 5. Offline Support
- Cache last receipts
- Print even if temporary network loss