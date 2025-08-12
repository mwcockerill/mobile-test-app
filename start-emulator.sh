#!/bin/bash

# Start Android emulator and wait for it to boot
source env.android.zsh

echo "Starting Android emulator..."
$ANDROID_SDK_ROOT/emulator/emulator -avd Pixel_3a_API_30_ARM64 -no-snapshot-save &

echo "Waiting for emulator to boot..."
while [ -z "$(adb devices | grep emulator)" ]; do
    echo "  Still booting..."
    sleep 5
done

echo "Waiting for system to be ready..."
adb wait-for-device
adb shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'

echo "✅ Emulator is ready!"
echo "Devices available:"
adb devices
echo ""
echo "You can now run: make e2e-test-android"