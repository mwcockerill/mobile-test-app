/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: { '$0': 'jest', config: 'e2e/jest.config.js' },
    jest: { setupTimeout: 120000 },
  },

  apps: {
    // iOS
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MobileTestApp.app',
      build:
        'xcodebuild -workspace ios/MobileTestApp.xcworkspace -scheme MobileTestApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/MobileTestApp.app',
      build:
        'xcodebuild -workspace ios/MobileTestApp.xcworkspace -scheme MobileTestApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },

    // ANDROID
    'android.debug': {
      type: 'android.apk',
      // Build both app & test APK, then copy to e2e-build/
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --no-daemon && cd - && ' +
        'mkdir -p e2e-build && ' +
        'cp android/app/build/outputs/apk/debug/app-debug.apk e2e-build/ && ' +
        'cp android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk e2e-build/',
      binaryPath: 'e2e-build/app-debug.apk',
      testBinaryPath: 'e2e-build/app-debug-androidTest.apk',
    },

    'android.release': {
      type: 'android.apk',
      // NOTE: verify the test APK path for your project (see note below)
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release --no-daemon && cd -',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk',
    },
  },

  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: process.env.DEVICE_NAME || 'iPhone 16' },
    },
    'android.real': { type: 'android.attached' },
    emulator: {
      type: 'android.emulator',
      device: {
        // On Apple Silicon, an ARM64 AVD is fine; change if your AVD name differs
        avdName: process.env.DEVICE_NAME || 'Pixel_3a_API_30_ARM64',
      },
    },
  },

  configurations: {
    'ios.sim.debug':   { device: 'simulator', app: 'ios.debug' },
    'ios.sim.release': { device: 'simulator', app: 'ios.release' },

    'android.debug.real': { device: 'android.real', app: 'android.debug' },
    'android.emu.debug':  { device: 'emulator',   app: 'android.debug' },

    'android.emu.release': { device: 'emulator', app: 'android.release' },
  },
};
