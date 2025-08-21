# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform React Native application created with React Native 0.73.6. It supports iOS, Android, and web platforms with TypeScript support, containing native mobile configurations and React Native Web for browser deployment.

## Development Commands

### Building and Running
- `npm run android` - Run the app on Android simulator/device
- `npm run ios` - Run the app on iOS simulator/device
- `npm run web` - Run the web app in browser (http://localhost:8081)
- `npm start` - Start the Metro bundler

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run Jest tests

### E2E Testing
- `npm run test:e2e` - Run all Maestro E2E tests
- `npm run test:e2e:launch` - Run basic app launch test
- `npm run test:e2e:counter` - Run counter functionality test
- `npm run test:e2e:full` - Run comprehensive app flow test
- `maestro studio` - Launch Maestro Studio for test creation

## Architecture

### App Architecture

This project uses a **dual-app architecture** where mobile and web are essentially separate applications that share similar functionality:

**Mobile App** (`App.tsx` in root):
- Uses React Native CLI with Metro bundler
- Runs on iOS/Android simulators and devices
- Started with `npm start` (Metro bundler) then selecting iOS/Android platform
- Entry point: Root `App.tsx`

**Web App** (`web-app/App.tsx`):
- Uses React Native Web with Webpack dev server
- Runs in browser at http://localhost:8081
- Started with `npm run web` (separate webpack process)
- Entry point: `web-app/App.tsx`

**Why separate apps?**
- Different build systems optimized for each platform (Metro for mobile, Webpack for web)
- Platform-specific configurations and optimizations
- Independent development and deployment workflows
- Better performance and bundle size control per platform

Both apps share React Native components and similar functionality but are built and served completely separately. This is why `npm start` only shows iOS/Android options - web has its own development server.

### Project Structure
- `App.tsx` - Main application component with Mini App Collection features
- `web-app/` - Web-specific configuration and React Native Web setup
  - `App.tsx` - Web-compatible version of main app
  - `index.web.js` - Web entry point using AppRegistry
  - `webpack.config.js` - Webpack configuration for web bundling
  - `public/index.html` - HTML template for web deployment
- `android/` - Android-specific configuration and native code
- `ios/` - iOS-specific configuration including Xcode project files and Podfile for CocoaPods
- `.maestro/` - Maestro E2E test flows in YAML format
- `node_modules/` - Dependencies
- `metro.config.js` - Metro bundler configuration

### Key Technologies
- React Native 0.73.6
- React Native Web 0.19.13 for browser compatibility
- TypeScript 5.0.4
- Jest for testing
- ESLint for code linting
- Metro bundler for mobile JavaScript bundling
- Webpack 5 for web bundling
- CocoaPods for iOS dependency management (extensive Pods/ directory with Flipper, React Native core modules)
- Maestro for E2E testing (`.maestro/` directory with YAML test flows)

### Platform Support
- iOS: Configured with Xcode project, CocoaPods dependencies, and Flipper debugging tools
- Android: Standard Gradle-based build system
- Web: React Native Web with webpack dev server, browser-compatible alerts and Platform.OS checks

The app features a Mini App Collection with interactive tools including counter, random number generator, math challenges, and color mood selector. All features work across mobile and web platforms with appropriate UI adaptations.