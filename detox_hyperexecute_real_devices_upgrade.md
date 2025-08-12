# Detox + HyperExecute Real Devices Upgrade Guide

This guide upgrades your Android project to **AGP 8.10.x + Gradle 8.11.1 + SDK 35 + JDK 17** for running Detox E2E tests on **real devices** via LambdaTest HyperExecute.

---

## 1. Android Project Upgrades

**`android/build.gradle`**
```groovy
buildscript {
  ext {
    buildToolsVersion = "35.0.0"
    minSdkVersion = 21
    compileSdkVersion = 35
    targetSdkVersion = 35
    ndkVersion = "27.0.12077973" // optional; can omit if unused
  }
  dependencies {
    classpath("com.android.tools.build:gradle:8.10.2") // any 8.10.x
    classpath("com.facebook.react:react-native-gradle-plugin")
  }
}
apply plugin: "com.facebook.react.rootproject"
```

**`android/gradle/wrapper/gradle-wrapper.properties`**
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
```

Regenerate the wrapper locally:
```bash
cd android
./gradlew wrapper --gradle-version=8.11.1
```

---

## 2. Detox Scripts (`package.json`)

```json
{
  "scripts": {
    "e2e:build:android": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd - && mkdir -p e2e-build && cp android/app/build/outputs/apk/debug/app-debug.apk e2e-build/ && cp android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk e2e-build/",
    "e2e:test:android": "detox test -c android.debug.real --record-logs all --take-screenshots failing"
  },
  "detox": {
    "testRunner": "jest",
    "runnerConfig": "e2e/jest.config.js",
    "apps": {
      "android.debug": {
        "type": "android.apk",
        "binaryPath": "e2e-build/app-debug.apk",
        "testBinaryPath": "e2e-build/app-debug-androidTest.apk"
      }
    },
    "devices": {
      "android.real": { "type": "android.attached" }
    },
    "configurations": {
      "android.debug.real": {
        "device": "android.real",
        "app": "android.debug"
      }
    }
  }
}
```

---

## 3. HyperExecute YAML

```yaml
version: "0.2"

env:
  LT_USERNAME: ${LT_USERNAME}       # from CI secrets
  LT_ACCESS_KEY: ${LT_ACCESS_KEY}   # from CI secrets
  DEVICE_NAME: ${matrix.device}
  PLATFORM_VERSION: "15"            # 14 or 15; must match LT real devices

matrix:
  os: [linux]
  platform: [android]
  device: ["Google Pixel 8"]

pre:
  - echo "Toolchains"
  - java -version
  - npm ci
  - npm i -g detox-cli
  - wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  - unzip -q commandlinetools-linux-11076708_latest.zip
  - mkdir -p android-sdk/cmdline-tools
  - mv cmdline-tools android-sdk/cmdline-tools/latest
  - export ANDROID_HOME=$(pwd)/android-sdk
  - export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
  - yes | sdkmanager --licenses
  - sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
  - cd android && ./gradlew wrapper --gradle-version=8.11.1 && chmod +x gradlew && cd -
  - npm run e2e:build:android

framework:
  name: "custom"
  baseCommand: ""
  args:
    platformName: "Android"
    isRealMobile: true
    devices: ["${matrix.device}"]
    platformVersion: "${PLATFORM_VERSION}"
    appPath: "e2e-build/app-debug.apk"
    otherApps:
      - "e2e-build/app-debug-androidTest.apk"
    autoGrantPermissions: true
    language: "en"
    locale: "US"
    networkHar: false

testRunnerCommand: "npm run e2e:test:android"

uploadArtefacts:
  - name: detox-screens
    path: [ "e2e/artifacts/**/*.png", "e2e/artifacts/**/*.jpg" ]
  - name: detox-logs
    path: [ "e2e/artifacts/**/*.log", "e2e/artifacts/**/*.txt" ]
  - name: test-results
    path: [ "e2e-results/*.json", "e2e-results/*.xml" ]

post:
  - echo "Artifacts collected"
```

---

## 4. Notes

- **No `wget gradle-wrapper.jar`** — the wrapper JAR is repo-managed.
- **Secrets in CI** — Rotate the LT key and use env vars.
- **Real devices** — Provide APK and test APK to HyperExecute via `appPath` and `otherApps`.
- **SDK match** — Pixel 8 with Android 14/15 is supported.
