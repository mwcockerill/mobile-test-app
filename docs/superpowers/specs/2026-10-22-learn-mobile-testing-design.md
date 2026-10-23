# Learn Mobile Testing — Design

Date: 2026-10-22
Status: Draft for approval

## Intent

Turn the existing Mini App Collection into a free, GitHub-hosted practice kit that teaches testers who are new to automation how to write automated tests for a React Native mobile app.

The learner is a tester (often coming from manual or web testing) who wants to **write and run their first automated test against a real app** and **understand how to inspect a mobile app's element tree and choose selectors**. A big part of the value is undoing web-testing assumptions: a React Native app has no DOM; testers work with a native view hierarchy and selectors such as `testID`, accessibility label, and visible text, and these behave differently on Android and iOS (e.g. Android `Button` uppercases its title).

## How it is used

- The practice app runs on an Android emulator, an iOS simulator, or a real Android phone.
- The learner writes and runs tests **on their laptop**, targeting that app.
- The first (and for now only) test tool taught is **Maestro**. Appium may be added later; nothing in v1 should make that hard, but v1 does not include it.

## Goals

1. A learner with no automation experience can go from nothing to a passing Maestro test against the practice app by following the repo alone.
2. Each screen of the practice app exists to teach one testing/selector idea.
3. Every lesson has a working reference solution the learner can compare against.
4. Learners can install a prebuilt app without building it from source.

## Non-goals (v1)

- Google Play or Apple App Store publishing. Distribution is **GitHub only**. (Store publishing was discussed and deliberately dropped: iOS store builds can't run on the simulator Maestro requires, Apple's review risk for a thin app, fees, and Google's closed-testing requirement. Play can be added later if wanted.)
- Appium, Detox, or Jest-based lessons.
- An in-app lesson reader, accounts, progress tracking, or any backend.
- The web build (`web-app/`). It is not part of the learning product.

## Anti-goals

- The learner gets stuck in environment setup and never runs a test. Setup guidance is a first-class deliverable, not an afterthought.
- Lessons that only work on one platform without saying so.
- Lesson text and app/reference flows drifting apart (a lesson's instructions no longer matching what's on screen).

## Deliverables

### 1. Practice app (rework of root `App.tsx`)

Replace the single-scroll Mini App Collection with a home screen listing practice screens, each focused on one concept. Each screen shows a short on-screen hint naming its lesson (e.g. "Lesson 3 — see lessons/03-…").

Proposed screens/concepts (**my call**, the builder may adjust order or merge):

1. Hello / launch — a static screen to assert on (first test)
2. Tapping and asserting text — the existing counter
3. Selectors — the same kind of element reachable by text, `testID`, and accessibility label, including the Android uppercase-button gotcha
4. Forms — text input, keyboard, a login-style form with validation messages
5. Lists — a scrollable list where the target is off-screen
6. Dialogs/alerts — native alerts (reuse the math challenge / color mood)
7. Waiting — content that appears after a delay
8. Randomness — asserting on non-deterministic output (reuse the random number generator)
9. Navigation — moving between screens and back

The existing features (counter, random number, math, color mood) are reused where they fit and otherwise removed.

### 2. Lessons

Markdown files in the repo (e.g. `lessons/00-setup.md`, `lessons/01-…`), read on the laptop next to the learner's code. Each lesson: what you'll learn, the screen to open, how to inspect it (Maestro Studio / `maestro hierarchy`), step-by-step test writing, how to run it, common failures, and a link to the solution.

### 3. Solutions

A reference Maestro flow per lesson, per platform where they differ. These live in the repo and double as this project's own E2E suite (replacing the current `.maestro/` flows).

### 4. Setup guide

`lessons/00-setup.md`: installing Maestro, starting an Android emulator / iOS simulator, installing the prebuilt app, running a provided "smoke" flow to prove the setup works. Covers macOS for both platforms and Windows/Linux for Android.

### 5. Releases

GitHub Releases containing an Android APK and a zipped iOS simulator `.app`, plus documented build steps for producing them. Automating the builds (e.g. GitHub Actions) is optional — builder's call.

### 6. README

Rewrite the README around the learner: what this is, the fastest path to a first passing test, and the lesson list.

### 7. Where the learner works (**my call**)

Learners clone (or fork) this repo. They write their own flows in a `my-tests/` folder that ships with a short README and an empty starter flow. Reference solutions live in a separate `solutions/` folder, so learners don't see answers by accident. `00-setup` includes a brief "clone the repo" step.

### 8. Keeping lessons and app in step (**my call**)

Each GitHub Release is tagged (e.g. `v1.0.0`), and the release notes link to the lessons at that tag. The app's home screen shows its version number, and the setup guide tells learners to read the lessons from the matching tag. Any change to a screen's content is released together with the matching lesson and solution changes.

### Supported targets (**my call**)

v1 setup and reference flows are verified on an Android emulator and an iOS simulator. A real Android phone is mentioned as "should work" with a short sideloading note, but isn't verified for every lesson.

### Licensing

Code (app, flows, scripts) is MIT-licensed; lessons and other written content are CC BY 4.0. Add a `LICENSE` (MIT) and a `lessons/LICENSE` (CC BY 4.0), and state both in the README.

## Constraints

- Stay on the existing stack: React Native 0.73.6, TypeScript, Maestro.
- Keep separate Android and iOS flows where text casing or behaviour differs (existing project convention).
- Every interactive element gets a stable `testID`.
- Existing Jest suite must keep passing or be updated to the new screens.

## Left to the builder

- Navigation approach (a navigation library vs. simple in-app state switching) — prefer the lighter option.
- Exact screen designs, copy, and lesson wording.
- Final lesson order and whether any concepts merge.
- Whether to delete `web-app/` and other leftover Detox/HyperExecute files, or just leave them out of the learner-facing docs.
- Android `applicationId` / iOS bundle id naming (the current Android flows use `com.mobiletestapp`).
