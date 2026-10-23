# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A practice kit that teaches testers who are new to automation how to write Maestro tests for a React Native app. It has three parts: a React Native 0.73.6 / TypeScript app whose screens each teach one testing idea, Markdown lessons, and reference Maestro solutions. It is distributed via GitHub only (APK and iOS simulator builds on GitHub Releases). Design: `docs/superpowers/specs/2026-10-22-learn-mobile-testing-design.md`.

## Development Commands

- `npm run android` / `npm run ios` - Build and run the app on an emulator/simulator
- `npm start` - Start the Metro bundler
- `npm run lint` - ESLint
- `npm test` - Jest unit/integration tests (`test/unit/`, `test/integration/`)
- `npx jest test/integration/App.test.tsx` - Run a single test file; add `-t "test name"` to run a single test
- `npx tsc --noEmit` - Type-check
- `npm run test:e2e:android` / `npm run test:e2e:ios` - Run every reference Maestro flow in `solutions/<platform>/`
- `maestro test solutions/android/01-launch.yaml` - Run one flow
- `make android-up` - Boot the emulator if needed, set up `adb reverse` for Metro, then build and run (`make adb-reverse` re-applies the port bridge). The Makefile hardcodes the Homebrew Android SDK path and AVD `Pixel_3a_API_30_ARM64`; override with `make android-up AVD=...`

## Architecture

- `App.tsx` is a thin shell. It holds `openSlug` state and renders either `src/HomeScreen.tsx` or the open practice screen wrapped in `src/components/ScreenFrame.tsx` (title, Back button, lesson hint). There is no navigation library. Android's hardware back button returns to the home list.
- `src/screens/index.ts` (`SCREENS`) is the registry. Each entry `{ lesson, slug, title, Component }` drives the home list (`home-item-<slug>`), the lesson hint, and the file names `lessons/NN-<slug>.md` and `solutions/<platform>/NN-<slug>.yaml` (`src/lessonPath.ts`).
- Adding a practice screen means adding all four together: the screen in `src/screens/<slug>/`, its registry entry, its lesson, and both platform solutions. `test/unit/drift.test.ts` fails if any are missing, or if a solution uses an `id:` that isn't a `testID` under `src/`.
- `test/unit/version.test.ts` keeps `src/version.ts`, `package.json`, Android `versionName` and iOS `MARKETING_VERSION` in step, and checks that the iOS bundle id is `com.mobiletestapp` (the same as the Android `applicationId`).
- Buttons use `src/components/PracticeButton.tsx`, which keeps its title text exactly as written. Only the Selectors screen uses the native `Button`, deliberately, because Android uppercases its title (`Submit` → `SUBMIT`). That's why `solutions/android/` and `solutions/ios/` are kept separate even where identical. Every interactive element needs a stable `testID`.
- `lessons/` are for learners (CC BY 4.0). Learners write their own flows in `my-tests/`.

## Testing conventions

When mocking `react-native` in a Jest test, mock only the specific export you need via `jest.spyOn(require('react-native'), 'exportName')` (or `jest.spyOn(Alert, 'alert')`). Do **not** do `jest.mock('react-native', () => ({ ...jest.requireActual('react-native'), ... }))` — spreading the whole actual module eagerly evaluates every lazily-loaded native-module getter (e.g. `Settings`), which throws a `TurboModuleRegistry` invariant violation in the Jest environment. For `BackHandler`, mock `react-native/Libraries/Utilities/BackHandler` with React Native's own `__mocks__/BackHandler` and call `mockPressBack()`.
