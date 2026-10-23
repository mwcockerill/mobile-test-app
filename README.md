# Learn Mobile Testing

A free, hands-on course for testers who are new to automation. You write and run real automated tests against a real React Native mobile app, using [Maestro](https://maestro.dev).

The repository has three parts:

- **A practice app** for Android and iOS. Each screen is built to teach one testing idea.
- **Lessons** that walk you through writing a test for each screen.
- **Reference solutions** for every lesson, so you can check your work.

You write the tests on your laptop. They drive the app running on an Android emulator or iOS simulator.

## Who it's for

Testers who have done manual testing, or have automated web apps, and want to learn mobile test automation. You don't need to know React Native or how to build mobile apps.

If you've tested web apps, Lesson 1 explains the biggest difference: a mobile app has no DOM.

## Get started

1. Follow **[Lesson 0 — Setup](lessons/00-setup.md)** to install Maestro, start an emulator or simulator, and install the app from the [Releases](https://github.com/mwcockerill/mobile-test-app/releases) page.
2. Run your first test: `maestro test my-tests/my-first-test.yaml`
3. Work through the lessons in order.

## Lessons

| # | Lesson | You'll learn |
|---|---|---|
| 0 | [Setup](lessons/00-setup.md) | Install Maestro, a device and the app |
| 1 | [Launch](lessons/01-launch.md) | Your first flow; inspecting the app; no DOM |
| 2 | [Counter](lessons/02-counter.md) | Tapping by text and by id; checking text |
| 3 | [Selectors](lessons/03-selectors.md) | Text vs id vs accessibility label; platform differences |
| 4 | [Forms](lessons/04-forms.md) | Typing, clearing fields, the keyboard, validation |
| 5 | [Lists](lessons/05-lists.md) | Off-screen elements and `scrollUntilVisible` |
| 6 | [Dialogs](lessons/06-dialogs.md) | Native alerts; `assertNotVisible` |
| 7 | [Waiting](lessons/07-waiting.md) | Slow content, `extendedWaitUntil`, avoiding flaky tests |
| 8 | [Randomness](lessons/08-randomness.md) | Regular expressions; testing output you can't predict |
| 9 | [Navigation](lessons/09-navigation.md) | Multi-screen flows, Android `back`, `runFlow` |

## What's where

| Folder | What's in it |
|---|---|
| `lessons/` | The course |
| `my-tests/` | **Your** tests go here |
| `solutions/android/`, `solutions/ios/` | Reference answers (try the lesson first!) |
| `src/`, `App.tsx`, `android/`, `ios/` | The practice app's source code. You don't need to read it, but you can. |
| `test/` | The app's own Jest tests |

## Building the app yourself (optional)

Most learners should install a prebuilt app from Releases. To build from source, you need a [React Native development environment](https://reactnative.dev/docs/set-up-your-environment). Then run:

```bash
npm install
npm run android        # or: cd ios && pod install && cd .. && npm run ios
```

Maintainers: see [RELEASING.md](RELEASING.md).

## License

- App code, Maestro flows and scripts: [MIT](LICENSE)
- Lessons: [CC BY 4.0](lessons/LICENSE)
