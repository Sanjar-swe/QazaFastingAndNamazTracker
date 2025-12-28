# Qaza Tracker

A professional, beautiful, and completely offline application to track and complete your missed (Qaza) Namaz and Fasting.

![Qaza Tracker Logo](android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png)

## 📋 Features

- **Prayer Tracking:** Track Fajr, Dhuhr, Asr, Maghrib, Isha, and Witr.
- **Qasr Support:** Toggle between Full and Qasr (traveler) prayer modes.
- **Fasting Debt:** Manage missed Ramadan months and individual days.
- **Flexible Dates:** Set custom start and end dates for your missed periods.
- **Visual Progress:** See your progress through growing trees and flowers.
- **Backup & Restore:** Never lose your progress. Export your data to a JSON file and import it anytime.
- **Offline First:** All data is stored locally on your device. Privacy is guaranteed.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Android Studio (for mobile building)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the app in development mode:
```bash
npm run dev
```

### Build APK
Build the Android APK:
```bash
cd android
./gradlew assembleDebug
```

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Mobile:** Capacitor / Android Native
- **Storage:** LocalStorage (Offline only)
- **Icons:** Custom SVG Icons

## 📜 Privacy Policy
This app does not collect any data. Read our full [Privacy Policy](PRIVACY_POLICY.md).

## 🌙 License
This project is open-source and free for the Muslim community.

