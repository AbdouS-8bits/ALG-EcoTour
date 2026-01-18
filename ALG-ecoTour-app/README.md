# Flutter Mobile App - Algeria EcoTour

This is the Flutter mobile app for the Algeria EcoTour platform.

## 📱 Setup Instructions

### Prerequisites
- Flutter SDK installed: https://flutter.dev/docs/get-started/install
- Android Studio or VS Code
- For iOS: Xcode (Mac only)

### Installation

1. Navigate to this folder:
```bash
cd ALG-ecoTour-app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
# Android Emulator
flutter run

# iOS Simulator (Mac only)
flutter run -d ios

# Specific device
flutter devices
flutter run -d <device-id>
```

## 🔧 Configuration

### Update API URL

Edit `lib/services/api_service.dart`:

```dart
// For Android Emulator
static const String baseUrl = 'http://10.0.2.2:3000';

// For iOS Simulator
static const String baseUrl = 'http://localhost:3000';

// For Real Phone (same WiFi)
static const String baseUrl = 'http://YOUR_COMPUTER_IP:3000';

// For Production
static const String baseUrl = 'https://your-domain.com';
```

## 🏗️ Project Structure

```
lib/
├── main.dart                       # App entry point
├── models/
│   └── tour.dart                  # Tour data model
├── screens/
│   ├── home_screen.dart           # Home page
│   ├── auth/
│   │   ├── login_screen.dart      # Login
│   │   └── signup_screen.dart     # Signup
│   └── tours/
│       ├── tour_list_screen.dart  # Tour list
│       └── tour_detail_screen.dart # Tour details
└── services/
    └── api_service.dart           # API connection
```

## 🧪 Testing

### Android Emulator:
1. Open Android Studio → Device Manager
2. Start emulator
3. Run: `flutter run`

### Real Phone:
1. Enable USB Debugging on phone
2. Connect via USB
3. Run: `flutter run`

## 🚀 Build for Production

### Android APK:
```bash
flutter build apk --release
```

### iOS:
```bash
flutter build ios --release
```

## 📚 Resources

- [Flutter Documentation](https://docs.flutter.dev)
- [Main Web App](../README.md)
