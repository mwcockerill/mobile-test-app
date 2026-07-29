# --- Dev shortcuts (Android) ---
SDK := /opt/homebrew/share/android-commandlinetools
ADB := $(SDK)/platform-tools/adb
EMU := $(SDK)/emulator/emulator

AVD ?= Pixel_3a_API_30_ARM64
APP_ID ?= com.mobiletestapp
METRO_PORT ?= 8081

export ANDROID_SDK_ROOT := $(SDK)
export PATH := $(SDK)/platform-tools:$(SDK)/emulator:$(PATH)

.PHONY: help install start android ios test lint clean e2e e2e-android e2e-ios android-up adb-reverse

help:
	@echo "Available commands:"
	@echo "  install             - Install dependencies"
	@echo "  start               - Start Metro bundler"
	@echo "  android             - Run on Android"
	@echo "  ios                 - Run on iOS"
	@echo "  test                - Run unit/integration tests"
	@echo "  lint                - Run linter"
	@echo "  e2e                 - Run all Maestro E2E tests (Android)"
	@echo "  e2e-android         - Run all Maestro E2E tests (Android)"
	@echo "  e2e-ios             - Run all Maestro E2E tests (iOS)"
	@echo "  clean               - Clean build artifacts"
	@echo "  android-up          - Start emulator, wire Metro, build & run app"
	@echo "  adb-reverse         - Re-apply Metro port bridge (if red screen)"

install:
	npm install

start:
	npm start

android:
	npm run android

ios:
	npm run ios

test:
	npm test

lint:
	npm run lint

e2e: e2e-android

e2e-android:
	npm run test:e2e:android

e2e-ios:
	npm run test:e2e:ios

## Start emulator (if needed), wire Metro (8081), build & run app
android-up:
	@echo "→ Launching $(AVD) and running $(APP_ID)"
	@$(ADB) start-server >/dev/null 2>&1 || true
	@$(ADB) devices | grep -q 'emulator-' || \
	  ( $(EMU) -avd $(AVD) -no-snapshot-load -netdelay none -netspeed full >/dev/null 2>&1 & )
	@$(ADB) wait-for-device
	@sh -c 'until $(ADB) shell getprop sys.boot_completed 2>/dev/null | grep -q 1; do sleep 1; done'
	@$(ADB) reverse --remove-all || true
	@$(ADB) reverse tcp:$(METRO_PORT) tcp:$(METRO_PORT)
	@$(ADB) shell settings put secure debug_http_host "localhost:$(METRO_PORT)" >/dev/null 2>&1 || true
	@npx react-native run-android

## Re-apply Metro port bridge (use if red screen appears)
adb-reverse:
	@$(ADB) reverse --remove-all || true
	@$(ADB) reverse tcp:$(METRO_PORT) tcp:$(METRO_PORT)
	@$(ADB) reverse --list

clean:
	npx react-native-clean-project
	cd android && ./gradlew clean
	cd ios && xcodebuild clean -workspace ios/*.xcworkspace -scheme $(shell ls ios/*.xcodeproj | sed 's/.xcodeproj//')
	rm -rf node_modules
	npm install