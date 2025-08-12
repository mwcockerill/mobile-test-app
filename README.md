# 🎮 Mini App Collection

A React Native mobile application showcasing interactive mini-apps and testing infrastructure.

## 📱 Features

### Interactive Mini-Apps
- **🎲 Random Number Generator** - Generate random numbers between 1-100
- **📝 Counter App** - Increment, decrement, and reset counter with buttons
- **🎯 Quick Math** - Interactive math quiz with multiple choice answers
- **🎨 Color Mood** - Discover your color mood with random color selection

### Dark Mode Support
- Automatic light/dark theme switching based on device settings
- Consistent styling across all components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start
```

### Running the App

```bash
# Android
npm run android
# or
make android-up  # Starts emulator + runs app

# iOS
npm run ios
```

## 🛠️ Development

### Available Commands

```bash
# Development
make start              # Start Metro bundler
make android-up         # Start emulator, wire Metro, build & run app
make adb-reverse        # Re-apply Metro port bridge (if red screen)

# Code Quality
npm run lint            # Run ESLint
npm test               # Run Jest tests

# E2E Testing
make e2e-build-android  # Build APKs for testing
make e2e-test-android   # Run E2E tests locally
make hyperexecute-run   # Run E2E tests on LambdaTest cloud
```

### Android Development Shortcuts

The Makefile includes convenient Android development commands:

- `make android-up` - One command to start emulator, configure Metro bridge, and run the app
- `make adb-reverse` - Fix Metro connection issues (red screen errors)

## 🧪 Testing

### Unit Tests
```bash
npm test                    # Run all tests
npm test utils.test.ts      # Run specific test file
```

### E2E Testing
- **Local**: Uses Detox for React Native E2E testing
- **Cloud**: LambdaTest HyperExecute for real device testing on Google Pixel 8
- **CI/CD**: GitHub Actions workflow included

```bash
# Local E2E testing
make e2e-build-android
make e2e-test-android

# Cloud testing (requires LambdaTest credentials)
make hyperexecute-run
```

## 📁 Project Structure

```
├── App.tsx                 # Main app component
├── test/
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests  
├── e2e/                   # End-to-end tests
├── android/               # Android-specific files
├── ios/                   # iOS-specific files
└── Makefile              # Development shortcuts
```

## 🔧 Configuration

### Development Environment
- **React Native**: 0.73.6
- **TypeScript**: 5.0.4
- **Testing**: Jest + @testing-library/react-native
- **Linting**: ESLint with React Native preset
- **E2E**: Detox + LambdaTest HyperExecute

### Code Quality Tools
- ESLint configured for React Native and TypeScript
- Jest with React Native preset
- Automated testing on pull requests

## 🌐 Cloud Testing

This project includes integration with LambdaTest HyperExecute for testing on real devices:

- **Real Device Testing**: Google Pixel 8 (Android 15)
- **Faster Execution**: ~5-10 minutes vs 20+ minutes locally
- **Comprehensive Results**: Screenshots, videos, logs, and reports

See [README-HyperExecute.md](./README-HyperExecute.md) for detailed cloud testing setup.

## 🚨 Troubleshooting

### Common Issues

**Metro connection errors (red screen)**:
```bash
make adb-reverse
```

**Build issues**:
```bash
make clean
npm install
```

**Android emulator not starting**:
```bash
# Check emulator setup
source env.android.zsh
./start-emulator.sh
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Run linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

📱 **Built with React Native • Tested on Real Devices • Ready for Production**