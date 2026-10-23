# Lesson 1 — Launch: your first test

## What you'll learn

- How a Maestro test (a "flow") is laid out
- How to launch the app, tap something, and check that text is on screen
- How to run a single flow from your laptop

You'll write your test in `my-tests/`. If you haven't set up Maestro, an emulator or simulator, and the app yet, do [Lesson 0 — Setup](00-setup.md) first.

## Open the screen

Start the app. On the home list, tap **1. Launch**. You'll see a screen titled "Launch" with the text "Welcome to the practice app".

Every practice screen shows a line like `Lesson 1 · lessons/01-launch.md` under its title. That tells you which lesson goes with the screen.

## Inspect it

A web page has a DOM you can open in the browser's developer tools. A React Native app has no DOM. Instead, it has a tree of native views. Maestro can show you that tree.

Run this on your laptop while the app is open:

```bash
maestro studio
```

A browser window opens, showing your device's screen. Click the "Welcome to the practice app" text. Studio shows the selectors it could use to find the element, including:

- **text** — `Welcome to the practice app`
- **id** — `welcome-text`. This comes from the `testID` the developers gave the element.

You can also print the whole tree in your terminal:

```bash
maestro hierarchy
```

Search the output for `welcome-text` to find the element.

## Write the test

Create `my-tests/01-launch.yaml`:

```yaml
appId: com.mobiletestapp
---
- launchApp
- tapOn:
    id: "home-item-launch"
- assertVisible:
    id: "welcome-text"
```

Line by line:

- `appId` tells Maestro which installed app to drive. Both the Android and the iOS app use `com.mobiletestapp`.
- `---` separates the settings from the steps.
- `launchApp` starts (or restarts) the app.
- `tapOn` with an `id` taps the element whose `testID` is `home-item-launch`, which is the "1. Launch" button on the home list.
- `assertVisible` with an `id` fails the test unless `welcome-text` is on screen.

Now add a check on the text itself, then go back to the home list:

```yaml
- assertVisible: "Welcome to the practice app"
- tapOn:
    id: "back-button"
- assertVisible: "Learn Mobile Testing"
```

## Run it

```bash
maestro test my-tests/01-launch.yaml
```

Maestro prints each step with a tick as it passes. If every step has a tick, you've written and run your first automated mobile test.

Make it fail on purpose: change the text to `Welcome to the practise app` and run it again. Read the error, then change it back. Knowing what a failure looks like will help you a lot later.

## Common failures

- **`Unable to launch app com.mobiletestapp`** — the app isn't installed on the device Maestro is using. See [Lesson 0](00-setup.md).
- **`No devices found`** — no emulator or simulator is running. Start one, then try again.
- **`Element not found: Id matching regex: welcome-text`** — check the spelling. Ids must match exactly.

## Solution

Try it yourself first. Then compare with [solutions/android/01-launch.yaml](../solutions/android/01-launch.yaml) or [solutions/ios/01-launch.yaml](../solutions/ios/01-launch.yaml).
