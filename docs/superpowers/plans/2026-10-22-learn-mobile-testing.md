# Learn Mobile Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Mini App Collection into a GitHub-hosted practice kit: a React Native app whose screens each teach one Maestro testing idea, plus lessons, reference solutions, a learner workspace, and release builds.

**Architecture:** `App.tsx` becomes a thin shell that switches between a home list and one practice screen at a time using React state (no navigation library). Each practice screen is registered in `src/screens/index.ts`; the registry drives the home list, the on-screen lesson hint, and a Jest "drift" test that checks every screen has its lesson and solution files. Lessons are Markdown in `lessons/`, reference Maestro flows in `solutions/android/` and `solutions/ios/`, and the learner writes flows in `my-tests/`.

**Tech Stack:** React Native 0.73.6, TypeScript 5.0.4, Jest + @testing-library/react-native, Maestro.

**Spec:** `docs/superpowers/specs/2026-10-22-learn-mobile-testing-design.md`

## Global Constraints

- Stay on React Native 0.73.6, TypeScript, Maestro. Add no new runtime dependencies.
- Every interactive element has a stable `testID`.
- Keep separate Android and iOS flows (`solutions/android/`, `solutions/ios/`), even where identical.
- Distribution is GitHub only. No store work, no Appium/Detox, no in-app lesson reader, no backend.
- App id on both platforms: `com.mobiletestapp`. App version: `1.0.0`.
- Code is MIT; lessons are CC BY 4.0.
- Jest mocking rule from `CLAUDE.md`: use `jest.spyOn(require('react-native'), '<export>')`, never spread `jest.requireActual('react-native')`.
- Lesson file naming: `lessons/NN-<slug>.md`; solutions: `solutions/<platform>/NN-<slug>.yaml` (NN = two-digit lesson number).
- Buttons on all screens except the Selectors lesson use `PracticeButton` (no auto-uppercasing), so most flows read the same on both platforms. The Selectors screen deliberately uses a native `Button` to teach the Android uppercase gotcha.
- Every lesson follows this outline: What you'll learn · Open the screen · Inspect it (`maestro studio` / `maestro hierarchy`) · Write the test · Run it · Common failures · Solution link.

## Review Focus

1. **Android hardware back on a practice screen** must return to the home list, not exit the app. Test in Task 1.
2. **Leaving the Waiting screen before its data loads** must not update unmounted state, and reopening it must start fresh. Test in Task 7.
3. **Login with surrounding whitespace or the keyboard still open:** `" tester@example.com "` is accepted (trimmed), and the first tap on Log in works while the keyboard is up (`keyboardShouldPersistTaps="handled"`). Test in Task 4.
4. **Lessons, solutions and app drifting apart:** every registered screen has its lesson and both solution files, and every `id:` selector used in a solution exists as a `testID` in `src/`. Test in Task 1 (grows with each screen task).
5. **Version mismatch between app and release:** `APP_VERSION`, `package.json` `version`, Android `versionName` and iOS `MARKETING_VERSION` all equal `1.0.0`. Test in Task 1.

---

## File Structure

```
App.tsx                          shell: home ⇄ current screen, Android back handling
src/version.ts                   APP_VERSION
src/theme.ts                     useTheme() colours for light/dark
src/utils.ts                     generateRandomNumber, generateMathProblem, getRandomColor
src/lessonPath.ts                lessonFileName()
src/components/PracticeButton.tsx
src/components/ScreenFrame.tsx   title, lesson hint, Back button
src/HomeScreen.tsx               version + list of screens
src/screens/types.ts             PracticeScreen type
src/screens/index.ts             SCREENS registry
src/screens/<slug>/<Name>Screen.tsx   one per lesson
lessons/00-setup.md … 09-navigation.md, lessons/LICENSE
solutions/android/*.yaml, solutions/ios/*.yaml
my-tests/README.md, my-tests/my-first-test.yaml
scripts/build-release.sh, RELEASING.md, LICENSE, README.md
test/unit/*.test.ts(x), test/integration/*.test.tsx, test/integration/screens/*.test.tsx
```

Removed: `web-app/`, `web/`, `.maestro/`, `test/unit/Section.test.tsx`, `test/unit/utils.test.ts`, `test/integration/Counter.test.tsx`, `test/integration/ButtonInteractions.test.tsx`.

---

### Task 1: App shell, registry, Launch screen, and drift guards

**Files:**
- Create: `src/version.ts`, `src/theme.ts`, `src/lessonPath.ts`, `src/components/PracticeButton.tsx`, `src/components/ScreenFrame.tsx`, `src/HomeScreen.tsx`, `src/screens/types.ts`, `src/screens/index.ts`, `src/screens/launch/LaunchScreen.tsx`, `lessons/01-launch.md`, `solutions/android/01-launch.yaml`, `solutions/ios/01-launch.yaml`
- Modify: `App.tsx` (rewrite), `package.json` (version, scripts, remove web deps), `android/app/build.gradle:31` (`versionName "1.0.0"`), `ios/MobileTestApp.xcodeproj/project.pbxproj` (all `PRODUCT_BUNDLE_IDENTIFIER` for the app target → `com.mobiletestapp`; `MARKETING_VERSION = 1.0.0`), `CLAUDE.md`
- Delete: `web-app/`, `web/`, `.maestro/`, `test/unit/Section.test.tsx`, `test/integration/Counter.test.tsx`, `test/integration/ButtonInteractions.test.tsx`
- Test: `test/integration/App.test.tsx` (rewrite), `test/unit/drift.test.ts`, `test/unit/version.test.ts`, `test/unit/lessonPath.test.ts`

**Interfaces:**
- Produces:
  - `src/version.ts`: `export const APP_VERSION = '1.0.0';`
  - `src/theme.ts`: `useTheme(): { background: string; surface: string; text: string; mutedText: string; accent: string }`
  - `src/screens/types.ts`: `export type PracticeScreen = { lesson: number; slug: string; title: string; Component: React.ComponentType };`
  - `src/screens/index.ts`: `export const SCREENS: PracticeScreen[]` (ordered by `lesson`)
  - `src/lessonPath.ts`: `lessonFileName(screen: Pick<PracticeScreen, 'lesson' | 'slug'>): string` → `'01-launch'`
  - `src/components/PracticeButton.tsx`: `PracticeButton(props: { title: string; onPress: () => void; testID: string; accessibilityLabel?: string; disabled?: boolean })` — a `Pressable` + `Text`; title text rendered exactly as given.
  - `src/components/ScreenFrame.tsx`: `ScreenFrame(props: { screen: PracticeScreen; onBack: () => void; children: React.ReactNode })` — renders a `‹ Back` pressable (`testID="back-button"`), the title (`testID="screen-title"`), and hint text `Lesson {lesson} · lessons/{NN-slug}.md` (`testID="lesson-hint"`).
  - `src/HomeScreen.tsx`: `HomeScreen(props: { onOpen: (slug: string) => void })` — header `Learn Mobile Testing` (`testID="home-title"`), version `v1.0.0` (`testID="app-version"`), one `PracticeButton` per screen titled `{lesson}. {title}` with `testID="home-item-{slug}"`.

- [ ] **Step 1: Write the failing tests**

`test/integration/App.test.tsx`:
- `it('shows the home title and version')` — `getByTestId('home-title')` has text `Learn Mobile Testing`; `getByTestId('app-version')` has text `v1.0.0`.
- `it('lists every registered screen')` — for each `SCREENS` entry, `getByTestId('home-item-' + slug)` has text `` `${lesson}. ${title}` ``.
- `it('opens a screen and goes back')` — press `home-item-launch`; `screen-title` = `Launch`; `lesson-hint` = `Lesson 1 · lessons/01-launch.md`; press `back-button`; `home-title` visible.
- `it('Android back on a screen returns home')` — `jest.mock('react-native/Libraries/Utilities/BackHandler', () => require('react-native/Libraries/Utilities/__mocks__/BackHandler'))`; open `launch`; `act(() => BackHandler.mockPressBack())`; `home-title` visible.
- `it('Launch screen shows the welcome text')` — open `launch`; `getByTestId('welcome-text')` has text `Welcome to the practice app`.

`test/unit/lessonPath.test.ts`: `lessonFileName({ lesson: 1, slug: 'launch' })` → `'01-launch'`; `lessonFileName({ lesson: 9, slug: 'navigation' })` → `'09-navigation'`.

`test/unit/version.test.ts` (read files with `fs`): `APP_VERSION === require('../../package.json').version`; `android/app/build.gradle` contains `versionName "1.0.0"`; every `MARKETING_VERSION` in `project.pbxproj` is `1.0.0`; every app-target `PRODUCT_BUNDLE_IDENTIFIER` is `com.mobiletestapp`.

`test/unit/drift.test.ts`, for each screen in `SCREENS` (with `name = lessonFileName(screen)`):
- `lessons/${name}.md` exists and contains the screen `title`.
- `solutions/android/${name}.yaml` and `solutions/ios/${name}.yaml` exist and start with `appId: com.mobiletestapp`.
- Every `id: "<x>"` in those flows matches a `testID="<x>"` (or `testID={`...`}` template prefix, e.g. `list-item-`) somewhere under `src/`. Collect `src` text by recursively reading `.tsx` files.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest test/integration/App.test.tsx test/unit`
Expected: FAIL — modules under `src/` not found.

- [ ] **Step 3: Implement**

- Create the `src/` files above. `App.tsx` holds `const [openSlug, setOpenSlug] = useState<string | null>(null)`; renders `HomeScreen` or `ScreenFrame` + the screen's `Component`. Register a `BackHandler` `hardwareBackPress` listener while a screen is open that sets `openSlug` to `null` and returns `true`; remove it on close. Remove all `Platform.OS === 'web'` code.
- `LaunchScreen`: a single `Text` `Welcome to the practice app` with `testID="welcome-text"`.
- `SCREENS = [{ lesson: 1, slug: 'launch', title: 'Launch', Component: LaunchScreen }]`.
- Bump `package.json` `version` to `1.0.0`; Android `versionName`; iOS `MARKETING_VERSION` and bundle id as listed in Files.
- `package.json` scripts: remove `web`, all `test:e2e:*` targeted at `.maestro`, and the `build:*`/`submit:*` EAS scripts; add `"test:e2e:android": "maestro test solutions/android"`, `"test:e2e:ios": "maestro test solutions/ios"`, `"test:e2e": "npm run test:e2e:android"`. Uninstall `react-native-web`, `react-dom`, `webpack`, `webpack-cli`, `webpack-dev-server`, `babel-loader` with `npm uninstall`.
- Delete the files/dirs listed under Delete. Keep `test/unit/utils.test.ts` until Task 2.
- Write `lessons/01-launch.md` (outline per Global Constraints): install the app, `maestro studio`, a flow that `launchApp`, taps `home-item-launch`, `assertVisible: { id: "welcome-text" }`.
- Solutions for both platforms:
  ```yaml
  appId: com.mobiletestapp
  ---
  - launchApp
  - tapOn: { id: "home-item-launch" }
  - assertVisible: { id: "welcome-text" }
  - assertVisible: "Welcome to the practice app"
  - tapOn: { id: "back-button" }
  - assertVisible: "Learn Mobile Testing"
  ```
- Update `CLAUDE.md`: remove web-app/web, Detox-era and EAS lines; describe the shell + registry, `src/` layout, `lessons/`, `solutions/`, `my-tests/`, the drift test, and the new e2e scripts. Keep the Jest mocking rule and the Android-uppercase note.

- [ ] **Step 4: Run tests and lint**

Run: `npx jest test/integration/App.test.tsx test/unit && npm run lint && npx tsc --noEmit`
Expected: all PASS, no lint or type errors.

- [ ] **Step 5: Run the Maestro flow (if an emulator/simulator is available)**

Run: `npm run android` then `maestro test solutions/android/01-launch.yaml` (and `npm run ios` + `maestro test solutions/ios/01-launch.yaml` on macOS).
Expected: flow passes. If no device is available, say so in the task report.

- [ ] **Step 6: Commit**

```bash
git add -A App.tsx src lessons solutions test package.json package-lock.json android/app/build.gradle ios/MobileTestApp.xcodeproj/project.pbxproj CLAUDE.md web-app web .maestro
git commit -m "feat: Replace Mini App Collection with practice-screen shell and Launch lesson"
```

---

### Tasks 2–9: one practice screen each

Every screen task follows the same pattern. The per-task sections below give only what differs.

**Files (per task, `<slug>`/`<Name>`/`NN` from the task):**
- Create: `src/screens/<slug>/<Name>Screen.tsx`, `lessons/NN-<slug>.md`, `solutions/android/NN-<slug>.yaml`, `solutions/ios/NN-<slug>.yaml`
- Modify: `src/screens/index.ts` (append the entry)
- Test: `test/integration/screens/<Name>.test.tsx`

**Interfaces:** Consumes `PracticeScreen`, `SCREENS`, `PracticeButton`, `useTheme` from Task 1. Produces a registry entry `{ lesson: N, slug, title, Component }`.

**Steps (per task):**
- [ ] **Step 1: Write the failing screen test** — render `<<Name>Screen />` directly with the assertions listed in the task.
- [ ] **Step 2: Run it** — `npx jest test/integration/screens/<Name>.test.tsx` → FAIL (module not found).
- [ ] **Step 3: Implement the screen and register it.**
- [ ] **Step 4: Run the screen test, the drift test, and the full suite** — `npx jest` → FAIL in `drift.test.ts` (lesson/solution missing), screen test PASS.
- [ ] **Step 5: Write the lesson and both solution flows** (each flow opens the screen from home via `home-item-<slug>`, exercises the listed behaviour, and returns with `back-button`).
- [ ] **Step 6: Verify** — `npx jest && npm run lint && npx tsc --noEmit` → all PASS; if a device is available, `maestro test solutions/android/NN-<slug>.yaml` (and iOS) → PASS, otherwise say so.
- [ ] **Step 7: Commit** — `git add src lessons solutions test && git commit -m "feat: Add <Title> practice screen and lesson"`

### Task 2: Counter (lesson 2, slug `counter`, title `Counter`)

Also: create `src/utils.ts` (`generateRandomNumber(min = 1, max = 100): number`, `generateMathProblem(): { a: number; b: number; answer: number }` with `a`,`b` in 1–10, `getRandomColor(): string` from the current colour list in `test/unit/utils.test.ts`), rewrite `test/unit/utils.test.ts` to import from `src/utils` (keep its existing assertions).

Screen test `Counter.test.tsx`:
- initial `count-text` = `Count: 0`
- press `increment-button` ×3 → `Count: 3`; `decrement-button` ×5 → `Count: -2`; `reset-button` → `Count: 0`
- buttons show titles `+`, `-`, `Reset` (not uppercased).

Lesson teaches: tapping, `assertVisible` on text vs `id`, running a single flow.

### Task 3: Selectors (lesson 3, slug `selectors`, title `Selectors`)

Screen has three targets and a result line (`testID="selectors-result"`, initial `Last tapped: nothing`):
- native `Button` title `Submit`, `testID="submit-button"` → `Last tapped: button`
- `PracticeButton` title `Find me by label`, `testID="label-target"`, `accessibilityLabel="Accessible target"` → `Last tapped: label`
- `Text` `Tap me by text` (pressable, no testID needed but give `testID="text-target"`) → `Last tapped: text`

Screen test: each press produces its result text; `getByLabelText('Accessible target')` finds the label target.

Solutions differ by platform here: Android taps `"SUBMIT"`, iOS taps `"Submit"`; both also tap `{ id: "submit-button" }`. Lesson explains the three selector kinds, why `id` is most stable, and the Android uppercase gotcha.

### Task 4: Forms (lesson 4, slug `forms`, title `Forms`)

Create `src/screens/forms/validateLogin.ts`: `validateLogin(email: string, password: string): string | null` — trims `email`; returns `Email is required` if empty, `Enter a valid email` if it has no `@` or nothing after it, `Password must be at least 8 characters` if `password.length < 8`, else `null`. Unit test it in `test/unit/validateLogin.test.ts` with those three messages and `validateLogin(' tester@example.com ', 'password123') === null`.

Screen: `TextInput` email (`testID="email-input"`, `autoCapitalize="none"`, `keyboardType="email-address"`), password (`testID="password-input"`, `secureTextEntry`), `PracticeButton` `Log in` (`testID="login-button"`), message `Text` (`testID="login-message"`). On success message is `Welcome, <trimmed email>!`. Wrap in a `ScrollView` with `keyboardShouldPersistTaps="handled"`.

Screen test: empty submit → `Email is required`; `tester@example.com` + `short` → password message; `" tester@example.com "` + `password123` → `Welcome, tester@example.com!`; the `ScrollView` has `keyboardShouldPersistTaps` = `handled`.

Lesson teaches `inputText`, `eraseText`, `hideKeyboard`, asserting validation messages.

### Task 5: Lists (lesson 5, slug `lists`, title `Lists`)

Screen: `FlatList` of 50 rows `Item 1`…`Item 50`, each a pressable with `testID={`list-item-${n}`}`; selection line `testID="list-selection"`, initial `Selected: none`, after tap `Selected: Item N`.

Screen test: renders `list-item-1`; pressing `list-item-3` → `Selected: Item 3`. (FlatList virtualisation means `list-item-40` may not render in Jest; don't assert on it.)

Solutions use `scrollUntilVisible: { element: { id: "list-item-40" } }` then tap and assert `Selected: Item 40`. Lesson teaches why off-screen elements aren't found and `scrollUntilVisible`.

### Task 6: Dialogs (lesson 6, slug `dialogs`, title `Dialogs`)

Screen reuses the old math challenge and colour mood with `PracticeButton`s `Give Me a Math Problem` (`testID="math-problem-button"`) and `What's My Color Mood?` (`testID="color-mood-button"`), using `Alert.alert` and `generateMathProblem` / `getRandomColor` from `src/utils.ts`. Math alert title `Math Challenge`, message `What is {a} + {b}?`, buttons `{answer}` → alert `Correct!` and `{answer + 1}` → alert `Try again!`. Colour alert title `Your Color Mood`, message the colour.

Screen test (spy `Alert.alert`, mock `Math.random`): math press calls `Alert.alert('Math Challenge', 'What is 6 + 6?', [...])` for `Math.random → 0.5`; invoking the first button's `onPress` calls `Alert.alert('Correct!', ...)`; colour press calls `Alert.alert('Your Color Mood', <colour>)`.

Solutions: tap `math-problem-button`; `assertVisible: "Math Challenge"`; `assertVisible: "What is \\d+ \\+ \\d+\\?"`; `tapOn: "\\d+"` (first numeric answer button); `assertVisible: "Correct!|Try again!"`; dismiss with the platform's OK text (check whether Android renders `OK` uppercase and record it in the lesson); then tap `color-mood-button`, `assertVisible: "Your Color Mood"`, dismiss. Lesson explains native dialogs aren't in the app's view tree the same way, and why the answer button text can't be hard-coded (link to lesson 8).

### Task 7: Waiting (lesson 7, slug `waiting`, title `Waiting`)

Export `LOAD_DELAY_MS = 3000` from the screen file. `PracticeButton` `Load data` (`testID="load-button"`); after press shows `Loading…` (`testID="loading-text"`), then after `LOAD_DELAY_MS` shows `Data loaded` (`testID="loaded-text"`). Clear the timer on unmount.

Screen test (`jest.useFakeTimers()`): press → `Loading…`; advance 2999 ms → still loading; advance 1 ms → `Data loaded`. Unmount mid-load then advance timers → no "state update on unmounted component" warning (`console.error` spy not called). Re-render fresh → `load-button` visible, no `loaded-text`.

Solutions use `extendedWaitUntil: { visible: { id: "loaded-text" }, timeout: 10000 }`. Lesson teaches Maestro's default waiting vs `extendedWaitUntil` and why `sleep` is a smell.

### Task 8: Randomness (lesson 8, slug `randomness`, title `Randomness`)

`PracticeButton` `Generate Random Number` (`testID="generate-random-number-button"`); text `testID="random-number-text"`, initial `Press the button`, then `Random number: N` via `generateRandomNumber()`.

Screen test (mock `Math.random`): `0` → `Random number: 1`; `0.9999` → `Random number: 100`.

Solutions assert with regex: `assertVisible: "Random number: \\d+"` (check Maestro YAML escaping when running). Lesson teaches regex assertions and asserting on shape rather than value.

### Task 9: Navigation (lesson 9, slug `navigation`, title `Navigation`)

Screen has internal state `'overview' | 'details'`. Overview: text `Navigation overview` (`testID="nav-overview-text"`), `PracticeButton` `Open details` (`testID="open-details-button"`). Details: text `Details page` (`testID="details-text"`), `PracticeButton` `Back to overview` (`testID="details-back-button"`).

Screen test: open details → `Details page`; back → `Navigation overview`.

Solutions: home → navigation → details → overview → `back-button` → home. Android solution additionally re-enters the screen and uses the `- back` command to return home. Lesson teaches multi-screen flows, `back`, and reusing steps with `runFlow`.

---

### Task 10: Setup lesson, learner workspace, README, licences

**Files:**
- Create: `lessons/00-setup.md`, `lessons/LICENSE`, `LICENSE`, `my-tests/README.md`, `my-tests/my-first-test.yaml`
- Modify: `README.md` (rewrite)
- Test: `test/unit/drift.test.ts` (extend)

- [ ] **Step 1: Extend the drift test** — `it('has setup lesson and learner workspace')`: `lessons/00-setup.md`, `my-tests/my-first-test.yaml` (starts with `appId: com.mobiletestapp`), `LICENSE` (contains `MIT License`), `lessons/LICENSE` (contains `Creative Commons Attribution 4.0`) exist; `README.md` links every `lessons/NN-<slug>.md` from `SCREENS`.
- [ ] **Step 2: Run** — `npx jest test/unit/drift.test.ts` → FAIL.
- [ ] **Step 3: Write the files.**
  - `00-setup.md`: clone the repo; install Maestro; Android emulator (macOS/Windows/Linux) and iOS simulator (macOS) setup; download the release APK / simulator `.app` zip for the version you cloned (`git checkout v1.0.0`) and install it (`adb install`, drag onto simulator or `xcrun simctl install booted`); run `maestro test my-tests/my-first-test.yaml` as the smoke test; short "real Android phone should work" note (USB debugging, `adb install`); troubleshooting (Maestro can't find device, `adb reverse` not needed for release builds, Java version).
  - `my-tests/my-first-test.yaml`: `appId: com.mobiletestapp`, `launchApp`, `assertVisible: "Learn Mobile Testing"`, with comments pointing to lesson 1.
  - `my-tests/README.md`: "write your flows here; answers are in `../solutions/`, try first".
  - `LICENSE`: MIT, `Copyright (c) 2026 <git config user.name>`. `lessons/LICENSE`: CC BY 4.0 notice with the legal-code URL.
  - `README.md`: what this is, who it's for, fastest path to a first passing test (link 00-setup), lesson list, folder guide, licences.
- [ ] **Step 4: Verify** — `npx jest && npm run lint` → PASS.
- [ ] **Step 5: Commit** — `git add lessons my-tests LICENSE README.md test && git commit -m "docs: Add setup lesson, learner workspace, README and licences"`

---

### Task 11: Release builds

**Files:**
- Create: `scripts/build-release.sh`, `RELEASING.md`

- [ ] **Step 1: Write `scripts/build-release.sh`** (bash, `set -euo pipefail`, run from repo root) that produces in `dist/`:
  - `mobile-test-app-<version>.apk` from `cd android && ./gradlew assembleRelease` (`android/app/build/outputs/apk/release/app-release.apk`; signed with the debug keystore the template already configures).
  - `mobile-test-app-<version>-ios-simulator.zip` containing `MobileTestApp.app` from `xcodebuild -workspace ios/MobileTestApp.xcworkspace -scheme MobileTestApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build` (iOS step skipped with a message when not on macOS).
  - `<version>` read from `package.json`. Add `dist/` to `.gitignore`.
- [ ] **Step 2: Run it** — `bash scripts/build-release.sh` → both artifacts in `dist/`. Install each on an emulator/simulator and run `npm run test:e2e:android` / `npm run test:e2e:ios` → all flows PASS. Report any platform you couldn't run.
- [ ] **Step 3: Write `RELEASING.md`** — bump version in the four places the version test checks, run the full Jest + Maestro suites, run the build script, `git tag vX.Y.Z && git push --tags`, `gh release create vX.Y.Z dist/* --notes "Lessons for this version: https://github.com/mwcockerill/mobile-test-app/tree/vX.Y.Z/lessons"`.
- [ ] **Step 4: Commit** — `git add scripts RELEASING.md .gitignore && git commit -m "build: Add release build script and release guide"`
- [ ] **Step 5: Stop before publishing.** Tagging, pushing and `gh release create` are outward-facing: ask the user before running them.
