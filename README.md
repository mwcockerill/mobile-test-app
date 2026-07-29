# 🎮 Mini App Collection

A small cross-platform React Native application built specifically as a **testing practice ground**. It has a deliberately small, predictable feature surface (a counter, a random number generator, a math quiz, and a color picker) so it's fast to reason about, while still exercising the testing patterns you'll need on a real app: state changes, randomness, native dialogs, dark/light theming, and cross-platform (iOS vs Android) UI differences.

It runs on iOS, Android, and web from a shared component model.

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
- [Maestro](https://maestro.mobile.dev) CLI, if you want to run the E2E suite

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
npm test                # Run Jest unit/integration tests

# E2E Testing
npm run test:e2e        # Run all Maestro E2E tests (Android)
npm run test:e2e:android # Run all Maestro E2E tests (Android)
npm run test:e2e:ios    # Run all Maestro E2E tests (iOS)
```

### Android Development Shortcuts

The Makefile includes convenient Android development commands:

- `make android-up` - One command to start emulator, configure Metro bridge, and run the app
- `make adb-reverse` - Fix Metro connection issues (red screen errors)

## 🧪 Testing

This app is built in three layers on purpose, so it can double as a reference for how those layers differ:

| Layer | Tool | What it exercises | Talks to real native code? |
|---|---|---|---|
| Unit | Jest | Pure logic (random number/math generation, color selection) | No |
| Component / Integration | Jest + `@testing-library/react-native` | Rendering, state updates, `Alert`/`useColorScheme` interaction, in the JS engine only | No (native modules are mocked) |
| End-to-end (E2E) | Maestro | The full compiled app running on a real simulator/emulator, including native `Alert` dialogs | Yes |

### Unit & Integration Tests (Jest)

```bash
npm test                              # Run all 5 suites (47 tests)
npx jest test/unit/utils.test.ts      # Run one file
npx jest --coverage                   # With coverage report
```

- **`test/unit/utils.test.ts`** — Pure-function tests for the random number generator, math problem generator/checker, and color picker. Uses `jest.spyOn(Math, 'random')` to make randomness deterministic. No rendering involved.
- **`test/unit/Section.test.tsx`** — Renders the reusable `Section` wrapper component and asserts it responds correctly to light/dark `useColorScheme` values.
- **`test/integration/App.test.tsx`** — Renders the real root `App` component end-to-end within the JS test environment: full counter workflow, random number / math / color mood workflows, dark vs. light styling, and state-isolation checks (e.g. generating a random number doesn't reset the counter).
- **`test/integration/Counter.test.tsx`** — Focused counter behavior tests (increment/decrement/reset, negative numbers, state persistence across interactions) using `testID`-based queries.
- **`test/integration/ButtonInteractions.test.tsx`** — Verifies each button's `onPress` handler calls `Alert.alert` with the right title/message/options, including simulating a user tapping a specific alert option.

**Testing patterns worth noting if you're learning from this codebase:**
- `useColorScheme` and `Alert.alert` are mocked with `jest.spyOn(...)` on the specific export needed — **not** by spreading the whole `react-native` module (`jest.mock('react-native', () => ({ ...jest.requireActual('react-native'), ... }))`). Spreading the actual module eagerly evaluates every one of React Native's lazily-loaded native-module getters (e.g. `Settings`), which crashes with a `TurboModuleRegistry` invariant violation outside a real native runtime. Mocking only the specific export avoids that entirely.
- Non-deterministic output (`Math.random`) is made deterministic per-test via `jest.spyOn(Math, 'random').mockReturnValue(...)` (unit tests) or a full `global.Math` override with `mockReturnValueOnce` chains (integration tests), so exact expected values can be asserted.
- Both `getByText` (content assertions) and `getByTestId` (interaction targets) are used — a good example of picking the right query for the job.

### End-to-End Tests (Maestro)

Maestro drives the actual compiled app on a simulator/emulator/device, so it's the layer that catches things unit tests can't: native `Alert` dialog behavior, platform-specific rendering (see below), and real user gesture sequences.

```bash
maestro test .maestro/android          # All Android flows
maestro test .maestro/ios              # All iOS flows
maestro test .maestro/android/03_random_number_generator.yaml  # One flow
maestro studio                         # Interactive flow recorder/inspector
```

Flows live under `.maestro/android/` and `.maestro/ios/` as separate suites (see "Platform quirks" below for why they aren't unified):

| Flow | What it does |
|---|---|
| `01_app_launch.yaml` | Smoke test — app launches, header/subtitle and all 4 section titles are visible |
| `02_counter_functionality.yaml` | Increment/decrement/reset, including negative numbers |
| `03_random_number_generator.yaml` | Taps generate 3x, copies each result via regex, asserts they're not all identical (a real randomness check, not just "a number appeared") |
| `04_math_challenge.yaml` | Answers a math problem correctly (tapping option index 0) and incorrectly (index 1), asserting the right feedback message each time |
| `05_color_mood.yaml` | Runs the color picker 3x, asserting the result always matches one of the 5 known mood strings |
| `06_full_app_flow.yaml` | End-to-end smoke test chaining every feature in one pass, including scroll behavior and counter state persistence |

`config.yaml` in each platform folder sets the target `appId` for that suite.

#### `testID` reference

Interactive elements expose stable `testID`s so E2E/component tests don't have to rely on visible text (which changes with platform casing — see below):

| Feature | `testID` |
|---|---|
| Random Number Generator button | `generate-random-number-button` |
| Counter `+` button | `increment-button` |
| Counter `Reset` button | `reset-button` |
| Counter `-` button | `decrement-button` |
| Math Challenge button | `math-problem-button` |
| Color Mood button | `color-mood-button` |

The counter display and the buttons inside native `Alert` dialogs (OK / answer options) don't have `testID`s — flows match those by visible text/regex instead, since `Alert` buttons are rendered by the OS, not by this app's component tree.

#### Platform quirks the E2E suite has to account for

This is one of the more instructive parts of the app if you're learning cross-platform E2E testing:

- **Android's native `Button` auto-uppercases its title**; iOS renders it exactly as given. So the same button (`title="Generate Random Number"`) has to be matched as `"GENERATE RANDOM NUMBER"` in Android flows but `"Generate Random Number"` in iOS flows — the two platform suites are intentionally separate rather than shared, because a single flow file can't correctly assert both.
- iOS flows prefer `testID`-based selectors (`id: "generate-random-number-button"`) over text matching where possible, since it's immune to the casing/wording issues above.

## 📁 Project Structure

```
├── App.tsx                 # Main app component (cross-platform)
├── web-app/               # Web-specific files
│   ├── App.tsx            # Web-compatible app component
│   ├── index.web.js       # Web entry point
│   ├── webpack.config.js  # Webpack bundling config
│   └── public/index.html  # HTML template
├── test/                  # Jest unit & integration tests
│   ├── unit/
│   └── integration/
├── .maestro/               # Maestro E2E tests
│   ├── android/
│   └── ios/
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

> **CI status:** there is currently no CI workflow configured in this repo (a previous GitHub Actions workflow depended on a Detox/HyperExecute pipeline that has since been removed). `npm test`, `npm run lint`, and the Maestro suites all run locally — wiring them into CI is a good next step if you pick this project up.

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
