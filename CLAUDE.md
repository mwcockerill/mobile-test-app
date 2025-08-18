# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application created with React Native 0.73.6. It's a standard React Native project with TypeScript support, containing both iOS and Android platform configurations.

## Development Commands

### Building and Running
- `npm run android` - Run the app on Android simulator/device
- `npm run ios` - Run the app on iOS simulator/device
- `npm start` - Start the Metro bundler

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run Jest tests

### E2E Testing
- `npm run test:e2e` - Run all Maestro E2E tests
- `npm run test:e2e:android` - Run basic app launch test on Android
- `maestro studio` - Launch Maestro Studio for test creation

## Architecture

### Project Structure
- `App.tsx` - Main application component with standard React Native template structure
- `android/` - Android-specific configuration and native code
- `ios/` - iOS-specific configuration including Xcode project files and Podfile for CocoaPods
- `node_modules/` - Dependencies
- `metro.config.js` - Metro bundler configuration

### Key Technologies
- React Native 0.73.6
- TypeScript 5.0.4
- Jest for testing
- ESLint for code linting
- Metro bundler for JavaScript bundling
- CocoaPods for iOS dependency management (extensive Pods/ directory with Flipper, React Native core modules)
- Maestro for E2E testing (`.maestro/` directory with YAML test flows)

### Platform Support
- iOS: Configured with Xcode project, CocoaPods dependencies, and Flipper debugging tools
- Android: Standard Gradle-based build system

The app currently uses the default React Native template structure with sections for getting started, debugging, and learning resources.