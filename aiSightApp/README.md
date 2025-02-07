# aiSightApp

## Introduction

This project is an Expo React Native application. Follow the instructions below to build and run the project on your desired platform.

## Prerequisites

- Node.js and npm installed
- Android Studio (for Android builds)
- Xcode (for iOS builds)
- Android emulator (for Android builds)
- iOS simulator (for iOS builds)
- ANDROID_HOME environment variable

# Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/aiSightApp.git
   cd aiSightApp
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables** (for Android builds):
   Add to your `~/.zshrc` or `~/.bash_profile`:

   ```bash
   export ANDROID_HOME=~/Library/Android/sdk
   export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
   ```

   Then apply changes:

   ```bash
   source ~/.zshrc  # or source ~/.bash_profile
   ```

4. **Set Up Python Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

## Running the Project

### Android

1. Start an Android emulator
2. Run:
   ```bash
   npx expo run:android
   ```

### iOS

1. Install iOS simulator through Xcode
2. Run:
   ```bash
   npx expo run:ios
   ```

## Troubleshooting

### Android SDK Not Found

Make sure `ANDROID_HOME` is set correctly and the Android SDK is installed through Android Studio.

### iOS Build Issues

Ensure Xcode and iOS simulator are properly installed. Run:

```bash
xcode-select --install
```
