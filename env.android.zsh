# Android SDK Environment Setup
# Source this file: source env.android.zsh

export ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# Add Android SDK tools to PATH
export PATH="$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH"

# Java (if needed)
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"

echo "Android SDK environment configured:"
echo "  ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
echo "  adb: $(which adb 2>/dev/null || echo 'not found')"
echo "  java: $(which java 2>/dev/null || echo 'not found')"