# aiSightApp

## Introduction

This project is an Expo React Native application that performs real-time object detection using YOLOv8. Follow the instructions below to build and run the project on your desired platform.

## Prerequisites

- Node.js and npm installed
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)
- Android emulator (for Android builds)
- iOS simulator (for iOS builds, macOS only)
- Python 3.x and pip

## Setup

1. **Clone the Repository**:

   ```bash
   git clone git@github.com:FarisAWheel/aiSight.git
   cd aiSightApp
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables** (for Android builds):

   **For macOS/Linux**:
   Add to your `~/.zshrc` or `~/.bash_profile`:

   ```bash
   export ANDROID_HOME=~/Library/Android/sdk
   export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
   ```

   Then apply changes:

   ```bash
   source ~/.zshrc  # or source ~/.bash_profile
   ```

   **For Windows**:

   1. Search for "Environment Variables" in Windows settings
   2. Under "System Variables", click "New" and add:
      - Variable name: `ANDROID_HOME`
      - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   3. Edit "Path" variable and add:
      - `%ANDROID_HOME%\tools`
      - `%ANDROID_HOME%\platform-tools`

4. **Set Up Python Environment**:

   **For macOS/Linux**:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

   **For Windows**:

   ```cmd
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Running the Project

### Android

1. Start an Android emulator
2. Run:
   ```bash
   npx expo run:android
   ```

### iOS (macOS only)

1. Install iOS simulator through Xcode
2. Run:
   ```bash
   npx expo run:ios
   ```

## Troubleshooting

### Android SDK Not Found

- **macOS/Linux**: Verify `ANDROID_HOME` in terminal: `echo $ANDROID_HOME`
- **Windows**: Verify in System Properties > Environment Variables
- Ensure Android SDK is installed through Android Studio

### iOS Build Issues (macOS only)

Ensure Xcode and iOS simulator are properly installed:

```bash
xcode-select --install
```
