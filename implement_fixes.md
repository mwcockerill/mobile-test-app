# implement_fixes.md

This guide walks you through **exactly** what to do to get your Android Detox tests running with **Metro**. It includes installing the missing Android test scaffolding, applying Gradle settings, and the precise run commands. Follow it **in order**.

> If you only want the bare minimum once everything is in place, jump to **[Quick Run (2-step)](#quick-run-2-step)**.

---

## 0) What you’re going to add

You’ll add two small files under `android/app/src/androidTest/` to enable the Android instrumentation test runner Detox needs, plus ensure your Gradle config is set correctly.

**Files being added:**
```
android/app/src/androidTest/DetoxTest.java
android/app/src/androidTest/AndroidManifest.xml
```

These are already prepared for your app id `com.mobiletestapp`.

---

## 1) Download and apply the prepared files (ZIP)

I prepared a zip with the missing Android test scaffolding and preserved your existing configs:

- **Download:** `detox-setup-files-updated.zip`  
  [Download here](sandbox:/mnt/data/detox-setup-files-updated.zip)

### 1.1 Unzip into your repo root
From your repo root (e.g., `~/path/to/mobile-test-app`):

```bash
# macOS / Linux
unzip ~/Downloads/detox-setup-files-updated.zip -d .
```

This creates (or updates) the following paths in your repo:
```
android/app/src/androidTest/DetoxTest.java
android/app/src/androidTest/AndroidManifest.xml
```

> **Note:** The zip **does not** overwrite your existing Gradle files or `.detoxrc.js`; those were already set correctly based on what you shared. If you changed them since, see section **2** to confirm the required settings.

### 1.2 Verify the files are in place
```bash
ls -R android/app/src/androidTest
```
Expected output:
```
android/app/src/androidTest:
AndroidManifest.xml  java

android/app/src/androidTest/java/com/mobiletestapp:
DetoxTest.java
```

---

## 2) Confirm required Gradle settings (already present)

Open `android/app/build.gradle` and confirm these **must** be present (they already are in your project):

```gradle
android {
  defaultConfig {
    applicationId "com.mobiletestapp"
    // ...
    testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    testInstrumentationRunnerArguments clearPackageData: 'true'
  }

  compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
  }
}

dependencies {
  // ...
  androidTestImplementation('com.wix:detox:+') { transitive = true }
  androidTestImplementation 'androidx.test:runner:1.5.2'
  androidTestImplementation 'androidx.test:rules:1.5.0'
  // optional:
  // androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
```

These link the AndroidJUnitRunner and Detox to your app and ensure Java 17 compatibility with your local setup.

---

## 3) One-time Android 12+ test manifest overlay

The zip already provides a minimal `android/app/src/androidTest/AndroidManifest.xml` that sets `android:exported="true"` for AndroidX’s test activities. This prevents **Manifest merger** failures on Android 12+ (API 31+). No action needed if you used the zip in step 1.

---

## 4) Environment: Android SDK and Java

You have an environment script `env.android.zsh` that sets `ANDROID_SDK_ROOT` and `PATH` for `adb` and `sdkmanager`. Source it in any new shell you’ll use for builds/tests:

```bash
source env.android.zsh
```

It prints something like:
```
Android SDK environment configured:
  ANDROID_SDK_ROOT: /opt/homebrew/share/android-commandlinetools
  adb: /opt/homebrew/share/android-commandlinetools/platform-tools/adb
  java: /opt/homebrew/opt/openjdk@17/bin/java
```

> If `adb` is “not found”, double-check `platform-tools` is installed in your SDK, or adjust `env.android.zsh` to point to the correct SDK path (e.g., `~/Library/Android/sdk`).

---

## 5) Build the app and test APKs (Detox build)

Run Detox’s build target, which invokes your Gradle tasks and copies APKs into `e2e-build/`:

```bash
detox build -c android.emu.debug
```
Expected success produces:
```
e2e-build/app-debug.apk
e2e-build/app-debug-androidTest.apk
```

If you need to do it manually:
```bash
cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --no-daemon && cd - \
  && mkdir -p e2e-build \
  && cp android/app/build/outputs/apk/debug/app-debug.apk e2e-build/ \
  && cp android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk e2e-build/
```

---

## 6) Run with Metro (Recommended)

Detox **debug** builds rely on Metro. You must run Metro and reverse the port so the emulator can reach the host packager.

### 6.1 Start Metro (Terminal A)
```bash
npx react-native start --port 8081 --reset-cache
```

### 6.2 Prep emulator and port reverse (Terminal B)
```bash
# Ensure ADB is available
adb start-server

# (One-time per emulator) Disable animations for stable Detox runs
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0

# Make emulator reach Metro on host:8081
adb reverse tcp:8081 tcp:8081
```

### 6.3 Run the tests (Terminal B)
```bash
detox test -c android.emu.debug --record-logs all --take-screenshots failing
```

> If the app shows "Could not connect to development server", it’s almost always the port reverse. Re-run `adb reverse tcp:8081 tcp:8081` and try again.

---

## 7) Quick Run (2-step)

Once the scaffolding is in place, every run boils down to:

```bash
# Terminal A
npx react-native start --port 8081 --reset-cache

# Terminal B
adb reverse tcp:8081 tcp:8081
detox test -c android.emu.debug --record-logs all --take-screenshots failing
```

---

## 8) Optional: Makefile helper

If you want a one-command runner (with Metro still in a separate tab):

**Makefile**
```make
detox-emu:
	adb start-server
	adb shell settings put global window_animation_scale 0
	adb shell settings put global transition_animation_scale 0
	adb shell settings put global animator_duration_scale 0
	adb reverse tcp:8081 tcp:8081 || true
	detox test -c android.emu.debug --record-logs all --take-screenshots failing
```

Usage:
```bash
# Terminal A
npx react-native start --port 8081 --reset-cache
# Terminal B
make detox-emu
```

---

## 9) Troubleshooting

### 9.1 Detox times out waiting for the app “ready”
- **Metro not reachable** → Start Metro and run `adb reverse tcp:8081 tcp:8081`.
- **Emulator not fully booted** → `adb shell getprop sys.boot_completed` should print `1`.
- **Old installs conflict** → `adb uninstall com.mobiletestapp || true && adb uninstall com.mobiletestapp.test || true` and re-run.
- **No `androidTest` runner** → Ensure `DetoxTest.java` exists and `testInstrumentationRunner` is set to AndroidJUnitRunner.

### 9.2 Manifest merger error about `android:exported`
- Ensure `android/app/src/androidTest/AndroidManifest.xml` from the zip is present. It explicitly sets `android:exported="true"` for AndroidX test activities.

### 9.3 `ANDROID_SDK_ROOT` not defined
- `source env.android.zsh` (or set the variables directly).
- Ensure `platform-tools` is installed (`adb` available) and on your `PATH`.

### 9.4 App launches but blank / dev server error
- Metro either isn’t running or isn’t reachable from the emulator. Re-check step **6**.

### 9.5 See more logs
Run with extra logging:
```bash
detox test -c android.emu.debug \
  --loglevel trace \
  --debug-synchronization 200 \
  --record-logs all \
  --take-screenshots failing
```

---

## 10) Notes for CI (still with Metro)

Running Metro in CI is possible but brittle. If you must:
- Start Metro in the background.
- Ensure the emulator can reach the CI host’s port (use `adb reverse`).
- Keep CI runners stable and warm to avoid emulator boot delays.

For long-term CI stability, consider a **bundled JS** variant that doesn’t rely on Metro. You can keep Metro locally and bundle only in CI.

---

## 11) Sanity checks (just in case)

```bash
# Emulator list and launch name must match your .detoxrc.js (e.g., Pixel_3a_API_30_ARM64)
emulator -list-avds

# Ensure app can launch manually
adb shell monkey -p com.mobiletestapp -c android.intent.category.LAUNCHER 1
```

---

## Done ✅

At this point, your Android Detox tests should run with Metro using the **2-step** flow. If you hit any new error, copy/paste the **first 30–50 lines around `INSTRUMENTATION_STATUS`** from `--loglevel trace` output, and I’ll pinpoint the fix.
