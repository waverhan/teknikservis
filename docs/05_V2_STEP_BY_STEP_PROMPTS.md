# V2 Flutter Development Steps for Claude

---

## Step 1
Initialize Flutter project:
- Latest stable version
- iOS + Android support

---

## Step 2
Add dependencies:
- flutter_blue_plus
- http
- provider or riverpod
- qr_code_scanner

---

## Step 3
Implement authentication:
- Login with SaaS API
- Store JWT securely

---

## Step 4
Create QR scanner screen:
- Scan receipt QR
- Extract receipt ID
- Call API to fetch receipt

---

## Step 5
Implement ESC/POS printer service:
- Discover Bluetooth devices
- Connect
- Send raw bytes
- Support formatting
- Cut paper

---

## Step 6
Create print preview screen:
- Display receipt
- Print button