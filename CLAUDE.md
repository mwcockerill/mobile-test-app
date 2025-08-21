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