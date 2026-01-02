# 🚀 Quick Setup Script for Flutter App

## Step 1: Navigate to Flutter app folder
cd ALG-ecoTour-app

## Step 2: Install dependencies
flutter pub get

## Step 3: Check if Flutter is ready
flutter doctor

## Step 4: List available devices
flutter devices

## Step 5: Run the app
# For Android Emulator (default)
flutter run

# Or for specific device
# flutter run -d <device-id>

## Step 6: If you get errors, try:
flutter clean
flutter pub get
flutter run

---

# 📱 Testing Configuration

## For Android Emulator:
The API URL is already set to: http://10.0.2.2:3000

## For iOS Simulator:
Change API URL in lib/services/api_service.dart to: http://localhost:3000

## For Real Phone (same WiFi):
1. Find your computer's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
2. Change API URL to: http://YOUR_IP:3000
3. Make sure Next.js server is running: npm run dev

---

# ✅ What's Included:

- Home screen with features
- Login/Signup authentication
- Tours list with images
- Tour details page
- Booking form
- API connection to your backend

---

# 🎯 Next Steps:

1. Make sure your Next.js backend is running (npm run dev in main folder)
2. Create some tours in the admin panel
3. Run the Flutter app
4. Test booking a tour!

---

# 🐛 Troubleshooting:

## "flutter: command not found"
Install Flutter SDK: https://docs.flutter.dev/get-started/install

## "No devices found"
Start Android emulator or connect phone with USB debugging

## "Connection refused"
Make sure:
- Next.js server is running
- API URL is correct in lib/services/api_service.dart
- Phone/emulator can reach your computer

## Still having issues?
Run: flutter doctor
This will show what's missing
