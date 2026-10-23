# Lesson 0 — Setup

Getting your setup working is often the hardest part of mobile test automation. Take it slowly. When you finish this lesson, you'll have run a real test against the practice app.

You'll need:

- a laptop. **Mac** works for Android and iOS. **Windows or Linux** works for Android only, because iOS simulators run only on macOS.
- about an hour, mostly spent waiting for downloads

## 1. Get the course

Clone this repository (or fork it on GitHub first, if you want to save your work there):

```bash
git clone https://github.com/mwcockerill/mobile-test-app.git
cd mobile-test-app
```

Each release of the app has a version number, shown on the app's home screen (for example `v1.0.0`). The lessons must match the app you install, so switch to the same version:

```bash
git checkout v1.0.0
```

## 2. Install Maestro

Maestro needs **Java 17 or newer**. Check with `java -version`. If you don't have it, install a JDK first (for example, Eclipse Temurin from https://adoptium.net).

On macOS or Linux:

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

On Windows, follow the instructions at https://docs.maestro.dev/getting-started/installing-maestro.

Close and reopen your terminal, then check that it worked:

```bash
maestro --version
```

## 3. Start a device

You need either an Android emulator or an iOS simulator running. Pick one to start with. You can add the other later.

### Android emulator (Mac, Windows, Linux)

1. Install [Android Studio](https://developer.android.com/studio).
2. Open **Device Manager** in Android Studio and create a virtual device (any recent Pixel phone is fine).
3. Press ▶ to start it.

Check that your laptop can see it:

```bash
adb devices
```

You should see a line like `emulator-5554   device`. If `adb` isn't found, add Android Studio's `platform-tools` folder to your `PATH`.

### iOS simulator (Mac only)

1. Install **Xcode** from the Mac App Store, and open it once to finish setup.
2. Start a simulator:

   ```bash
   open -a Simulator
   ```

## 4. Install the practice app

Download the files for your version from the repository's **Releases** page on GitHub (for example, `v1.0.0`):

- **Android:** `mobile-test-app-1.0.0.apk`
- **iOS simulator:** `mobile-test-app-1.0.0-ios-simulator.zip`

### Android

With the emulator running:

```bash
adb install mobile-test-app-1.0.0.apk
```

You can also drag the `.apk` file onto the emulator window.

### iOS

Unzip the file to get `MobileTestApp.app`, then, with the simulator running:

```bash
xcrun simctl install booted MobileTestApp.app
```

You can also drag `MobileTestApp.app` onto the simulator window.

Open the app. You should see **Learn Mobile Testing** and the version number.

### A real Android phone (optional)

This should work, but the lessons are only checked on emulators. Turn on **Developer options → USB debugging** on the phone, connect it with a USB cable, accept the prompt on the phone, then run `adb install` as above. Close any running emulators so Maestro uses the phone.

> **Why no app store?** Maestro tests iOS apps on the simulator only, and a simulator can't install App Store apps. Downloading builds from GitHub works the same way for everyone.

## 5. Run your first test

From the repository folder:

```bash
maestro test my-tests/my-first-test.yaml
```

Maestro opens the app and checks the home screen. If you see a tick next to every step, your setup works. 🎉

Now go to [Lesson 1 — Launch](01-launch.md).

## Troubleshooting

- **`maestro: command not found`** — close and reopen your terminal. If that doesn't help, make sure `~/.maestro/bin` is on your `PATH`.
- **`No devices found` / `Not enough devices connected`** — start your emulator or simulator first. Run `adb devices` (Android) or `xcrun simctl list devices booted` (iOS) to check it's running.
- **`Unable to launch app com.mobiletestapp`** — the app isn't installed on that device. Repeat step 4.
- **Java errors when Maestro starts** — check `java -version` shows 17 or newer.
- **Both an emulator and a simulator are running** — Maestro might pick the wrong one. Close the one you're not using, or pass `--device <id>` to `maestro test`.
- **The lessons don't match what you see in the app** — check that the version on the app's home screen matches the version you checked out in step 1.
