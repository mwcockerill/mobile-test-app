# Build Locally, Test on HyperExecute Architecture

This guide shows how to implement a **"Build Locally, Test Remotely"** architecture for React Native E2E testing with LambdaTest HyperExecute.

## 🎯 Overview

Instead of building AND testing in the cloud, this approach:
- **Builds APKs locally** (controlled environment)
- **Tests on HyperExecute** (real Google Pixel 8 device)

## 🏗️ Architecture Comparison

### Current (Complex)
```
Local Dev → HyperExecute → [Install SDK + Build + Test] → Real Device
```

### Proposed (Simple)
```
Local Dev → [Build APKs] → HyperExecute → [Test Only] → Real Device
```

## ✅ Benefits

- **Faster cloud execution** - No build time, only test time
- **Reduced complexity** - Fewer moving parts in cloud
- **Cost effective** - Less cloud compute usage
- **More reliable** - Controlled local build environment
- **Industry standard** - Standard mobile CI/CD pattern

---

## 📋 Implementation Steps

### Phase 1: Complete Local Android Setup

#### 1.1 Verify Java Installation
```bash
java -version
# Should show Java 17+
```

#### 1.2 Accept Android SDK Licenses
```bash
sdkmanager --licenses
# Type 'y' for each license prompt
```

#### 1.3 Install Required Android Components
```bash
sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

#### 1.4 Set Environment Variables
Add to your `~/.zshrc` or `~/.bash_profile`:
```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
```

#### 1.5 Test Local Build
```bash
npm run e2e:build:android
```

**Expected output:**
- APKs created in `e2e-build/` folder:
  - `app-debug.apk` (main app)
  - `app-debug-androidTest.apk` (test instrumentation)

---

### Phase 2: Simplify HyperExecute Configuration

#### 2.1 Update hyperexecute.yaml

**Remove:** Android SDK setup, build commands

**Keep:** Only dependency installation and testing

```yaml
version: "0.1"
runson: linux

env:
  LT_USERNAME: ${LT_USERNAME}
  LT_ACCESS_KEY: ${LT_ACCESS_KEY}

runtime:
  language: node
  version: "18"

pre:
  - echo "Installing dependencies for testing..."
  - npm ci --force
  - npm i -g detox-cli
  - echo "APKs should be pre-built locally"
  - ls -la e2e-build/

realDevice:
  appId: "com.mobiletestapp"
  operatingSystem: "android"
  deviceName: "Google Pixel 8"
  platformVersion: "15"
  app: "e2e-build/app-debug.apk"
  otherApps:
    - "e2e-build/app-debug-androidTest.apk"
  autoGrantPermissions: true

testSuites:
  - npm run e2e:test:android

uploadArtefacts:
  - name: detox-screens
    path: [ "e2e/artifacts/**/*.png", "e2e/artifacts/**/*.jpg" ]
  - name: detox-logs
    path: [ "e2e/artifacts/**/*.log", "e2e/artifacts/**/*.txt" ]
  - name: test-results
    path: [ "e2e-results/*.json", "e2e-results/*.xml" ]

post:
  - echo "Test artifacts collected"
```

#### 2.2 Verify APK Paths Match

Ensure these paths exist and match:
- **Local build output:** `e2e-build/app-debug.apk`
- **HyperExecute config:** `app: "e2e-build/app-debug.apk"`
- **Detox config:** `binaryPath: 'e2e-build/app-debug.apk'`

---

### Phase 3: Test the New Workflow

#### 3.1 Build APKs Locally
```bash
npm run e2e:build:android
```

**Verify:**
```bash
ls -la e2e-build/
# Should show:
# app-debug.apk
# app-debug-androidTest.apk
```

#### 3.2 Run Remote Tests
```bash
make hyperexecute-run
```

**Expected behavior:**
- ✅ Faster upload (no Android SDK components)
- ✅ Faster execution (skip build phase)
- ✅ APKs install on Google Pixel 8
- ✅ E2E tests execute on real device

---

## 🔄 Daily Workflow

### Developer Workflow
```bash
# 1. Make code changes
vim App.tsx

# 2. Build APKs locally (when code changes)
npm run e2e:build:android

# 3. Test on real device (anytime)
make hyperexecute-run
```

### CI/CD Workflow
```bash
# In CI pipeline:
npm run e2e:build:android  # Build once
make hyperexecute-run      # Test on multiple devices
```

---

## 🎛️ Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "e2e:build:android": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd - && mkdir -p e2e-build && cp android/app/build/outputs/apk/debug/app-debug.apk e2e-build/ && cp android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk e2e-build/",
    "e2e:test:android": "detox test -c android.debug.real --record-logs all --take-screenshots failing"
  }
}
```

### Makefile Commands
```makefile
build-local:
	npm run e2e:build:android

test-remote:
	make hyperexecute-run

e2e-full:
	npm run e2e:build:android && make hyperexecute-run
```

---

## 🔧 Troubleshooting

### Local Build Issues

**Java not found:**
```bash
brew install --cask temurin
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
```

**Android SDK not found:**
```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
```

**Gradle build fails:**
```bash
cd android && ./gradlew clean
npm run e2e:build:android
```

### HyperExecute Issues

**APK not found:**
- Verify `e2e-build/` folder exists locally
- Check APK file sizes are > 0 bytes
- Ensure no `.gitignore` excludes APK files

**Test execution fails:**
- Check Detox configuration matches APK paths
- Verify Google Pixel 8 device compatibility
- Review test selectors for real device behavior

---

## 📊 Performance Comparison

### Before (Build + Test on HyperExecute)
- **Total time:** ~8-12 minutes
- **Build phase:** ~5-8 minutes
- **Test phase:** ~3-4 minutes
- **Failure points:** SDK setup, build dependencies, test execution

### After (Build Local, Test Remote)
- **Total time:** ~3-5 minutes
- **Build phase:** ~2-3 minutes (local)
- **Test phase:** ~3-4 minutes (remote)
- **Failure points:** Only test execution

**Improvement:** ~50% faster, more reliable

---

## 🚀 Advanced Usage

### Multi-Device Testing
```yaml
matrix:
  device: 
    - "Google Pixel 8"
    - "Samsung Galaxy S23"
    - "OnePlus 11"
```

### Parallel Test Execution
```bash
# Build once
npm run e2e:build:android

# Test on multiple devices simultaneously
make hyperexecute-run    # Device 1
make hyperexecute-run    # Device 2  
make hyperexecute-run    # Device 3
```

### Integration with CI/CD
```yaml
# GitHub Actions
- name: Build APKs
  run: npm run e2e:build:android
  
- name: Test on Real Devices
  run: make hyperexecute-run
  env:
    LT_USERNAME: ${{ secrets.LT_USERNAME }}
    LT_ACCESS_KEY: ${{ secrets.LT_ACCESS_KEY }}
```

---

## 📞 Support

- **HyperExecute docs:** https://www.lambdatest.com/support/docs/hyperexecute-overview/
- **Detox docs:** https://wix.github.io/Detox/
- **React Native docs:** https://reactnative.dev/docs/running-on-device

---

## 🎉 Summary

This architecture provides:
- ✅ **Faster execution** - Skip cloud build time
- ✅ **Better reliability** - Controlled local environment
- ✅ **Cost optimization** - Reduced cloud usage
- ✅ **Industry standard** - Proven mobile CI/CD pattern

**Next:** Complete Phase 1 (local setup), then Phase 2 (HyperExecute config), then Phase 3 (testing).