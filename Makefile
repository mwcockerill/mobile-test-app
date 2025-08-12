# --- Dev shortcuts (Android) ---
SDK := /opt/homebrew/share/android-commandlinetools
ADB := $(SDK)/platform-tools/adb
EMU := $(SDK)/emulator/emulator

AVD ?= Pixel_3a_API_30_ARM64
APP_ID ?= com.mobiletestapp
METRO_PORT ?= 8081

export ANDROID_SDK_ROOT := $(SDK)
export PATH := $(SDK)/platform-tools:$(SDK)/emulator:$(PATH)

.PHONY: help install start android ios test lint clean e2e-build e2e-test hyperexecute-run hyperexecute-run-ios hyperexecute-status hyperexecute-status-ios android-up adb-reverse

help:
	@echo "Available commands:"
	@echo "  install             - Install dependencies"
	@echo "  start               - Start Metro bundler"
	@echo "  android             - Run on Android"
	@echo "  ios                 - Run on iOS"
	@echo "  test                - Run unit/integration tests"
	@echo "  lint                - Run linter"
	@echo "  e2e-build           - Build app for E2E testing (iOS)"
	@echo "  e2e-build-android   - Build app for E2E testing (Android)"
	@echo "  e2e-test            - Run E2E tests locally (iOS)"
	@echo "  e2e-test-android    - Run E2E tests locally (Android)"
	@echo "  hyperexecute-run    - Run E2E tests on HyperExecute (Android)"
	@echo "  hyperexecute-run-ios - Run E2E tests on HyperExecute (iOS)"
	@echo "  hyperexecute-status - Check HyperExecute Android job status"
	@echo "  hyperexecute-status-ios - Check HyperExecute iOS job status"
	@echo "  hyperexecute-update - Update HyperExecute CLI binary"
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

e2e-build:
	npm run e2e:build

e2e-build-android:
	npm run e2e:build:android

e2e-test:
	npm run e2e:test

e2e-test-android:
	npm run e2e:test:android

hyperexecute-run:
	@echo "Running E2E tests on LambdaTest HyperExecute (Android)..."
	@if [ -f .env ]; then \
		echo "Loading credentials from .env file..."; \
		export $$(cat .env | grep -v '^#' | xargs) && ./hyperexecute --disable-updates --config hyperexecute.yaml --verbose; \
	else \
		if [ -z "$$LT_USERNAME" ] || [ -z "$$LT_ACCESS_KEY" ]; then \
			echo "Error: Please set LT_USERNAME and LT_ACCESS_KEY environment variables"; \
			echo "Or create a .env file with:"; \
			echo "LT_USERNAME=your_username"; \
			echo "LT_ACCESS_KEY=your_access_key"; \
			exit 1; \
		fi; \
		./hyperexecute --disable-updates --config hyperexecute.yaml --verbose; \
	fi

hyperexecute-run-ios:
	@echo "Running E2E tests on LambdaTest HyperExecute (iOS)..."
	@if [ -z "$$LT_USERNAME" ] || [ -z "$$LT_ACCESS_KEY" ]; then \
		echo "Error: Please set LT_USERNAME and LT_ACCESS_KEY environment variables"; \
		echo "Export them like this:"; \
		echo "export LT_USERNAME=your_username"; \
		echo "export LT_ACCESS_KEY=your_access_key"; \
		exit 1; \
	fi
	hyperexecute --config hyperexecute-ios.yaml --verbose

hyperexecute-status:
	@echo "Checking HyperExecute job status..."
	hyperexecute --config hyperexecute.yaml --status

hyperexecute-status-ios:
	@echo "Checking HyperExecute iOS job status..."
	hyperexecute --config hyperexecute-ios.yaml --status

hyperexecute-update:
	@echo "Updating HyperExecute CLI binary..."
	curl -L https://downloads.lambdatest.com/hyperexecute/darwin/hyperexecute -o ./hyperexecute
	chmod +x ./hyperexecute
	@echo "HyperExecute CLI updated successfully!"
	./hyperexecute --version

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