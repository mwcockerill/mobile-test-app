#!/usr/bin/env bash
# Builds the release artifacts learners download from GitHub Releases:
#   dist/mobile-test-app-<version>.apk
#   dist/mobile-test-app-<version>-ios-simulator.zip  (macOS only)
# Run from the repository root.
set -euo pipefail

version=$(node -p "require('./package.json').version")
mkdir -p dist

echo "→ Android release APK (v$version)"
(cd android && ./gradlew assembleRelease)
cp android/app/build/outputs/apk/release/app-release.apk "dist/mobile-test-app-$version.apk"

if [[ "$(uname)" == "Darwin" ]]; then
  echo "→ iOS simulator build (v$version)"
  xcodebuild \
    -workspace ios/MobileTestApp.xcworkspace \
    -scheme MobileTestApp \
    -configuration Release \
    -sdk iphonesimulator \
    -derivedDataPath ios/build \
    build
  (cd ios/build/Build/Products/Release-iphonesimulator &&
    rm -f "../../../../../dist/mobile-test-app-$version-ios-simulator.zip" &&
    zip -qr "../../../../../dist/mobile-test-app-$version-ios-simulator.zip" MobileTestApp.app)
else
  echo "→ Skipping iOS simulator build (needs macOS)"
fi

echo "✓ Artifacts:"
ls -lh dist/
