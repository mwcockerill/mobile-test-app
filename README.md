# 🎮 Mini App Collection

A cross-platform React Native application showcasing interactive mini-apps with support for iOS, Android, and web platforms.

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

# Web (browser)
npm run web      # Opens at http://localhost:8081
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
npm run test:e2e        # Run all Maestro E2E tests
npm run test:e2e:launch # Run app launch test
npm run test:e2e:counter # Run counter functionality test
npm run test:e2e:full   # Run comprehensive flow test
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
- **Framework**: Maestro for cross-platform E2E testing
- **Tests**: Comprehensive test suite covering all Mini App Collection features
- **Platforms**: iOS and Android mobile testing

```bash
# E2E testing with Maestro
npm run test:e2e        # Run all tests
npm run test:e2e:launch # Test app launch
npm run test:e2e:counter # Test counter functionality
npm run test:e2e:full   # Test complete app flow
maestro studio          # Interactive test creation
```

## 📁 Project Structure

```
├── App.tsx                 # Main app component (cross-platform)
├── web-app/               # Web-specific files
│   ├── App.tsx            # Web-compatible app component
│   ├── index.web.js       # Web entry point
│   ├── webpack.config.js  # Webpack bundling config
│   └── public/index.html  # HTML template
├── .maestro/              # Maestro E2E tests
├── android/               # Android-specific files
├── ios/                   # iOS-specific files
└── Makefile              # Development shortcuts
```

## 🔧 Configuration

### Development Environment
- **React Native**: 0.73.6
- **React Native Web**: 0.19.13
- **TypeScript**: 5.0.4
- **Testing**: Jest + @testing-library/react-native
- **Linting**: ESLint with React Native preset
- **E2E**: Maestro cross-platform testing
- **Web Bundling**: Webpack 5 with Babel

### Code Quality Tools
- ESLint configured for React Native and TypeScript
- Jest with React Native preset
- Automated testing on pull requests

## 🌐 Web Deployment

The project includes React Native Web support for browser deployment:

- **Cross-Platform**: Same codebase runs on iOS, Android, and web browsers
- **Web-Compatible**: Platform.OS checks and browser-compatible alert functions
- **Development Server**: Webpack dev server with hot reloading
- **Build Output**: Optimized bundle for production web deployment

```bash
npm run web  # Start development server at http://localhost:8081
```

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

📱 **Built with React Native • Cross-Platform (iOS/Android/Web) • E2E Tested • Ready for Production**