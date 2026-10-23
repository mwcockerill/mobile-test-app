# Releasing

Learners install prebuilt apps from GitHub Releases and read the lessons from the matching git tag, so every release is a tag + two build artifacts.

## 1. Bump the version

Set the new version (e.g. `1.1.0`) in all four places. `test/unit/version.test.ts` fails if they disagree:

- `package.json` → `"version"`
- `src/version.ts` → `APP_VERSION` (shown on the app's home screen)
- `android/app/build.gradle` → `versionName` (also increase `versionCode`)
- `ios/MobileTestApp.xcodeproj/project.pbxproj` → every `MARKETING_VERSION`

If you changed a screen, make sure its lesson and both solution flows changed in the same release.

## 2. Check everything

```bash
npm test && npm run lint && npx tsc --noEmit
```

Build the release artifacts, install them, and run every reference flow on both platforms:

```bash
bash scripts/build-release.sh
adb install -r dist/mobile-test-app-<version>.apk
npm run test:e2e:android

unzip -o dist/mobile-test-app-<version>-ios-simulator.zip -d dist/
xcrun simctl install booted dist/MobileTestApp.app
npm run test:e2e:ios
```

The Android APK is signed with the project's debug keystore. That's fine for sideloading onto emulators and test phones, and it isn't used for any store.

## 3. Publish

```bash
git tag v<version>
git push origin v<version>
gh release create v<version> dist/mobile-test-app-<version>.apk dist/mobile-test-app-<version>-ios-simulator.zip \
  --title "v<version>" \
  --notes "Lessons for this version: https://github.com/mwcockerill/mobile-test-app/tree/v<version>/lessons"
```

Then update the version in `lessons/00-setup.md` (the `git checkout` and download file names) if it mentions the old one.
