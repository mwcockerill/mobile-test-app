#!/usr/bin/env zsh
# React Native Android: bring up emulator, Metro, wire ports, install & run app.
# macOS / Apple Silicon-friendly.

set -euo pipefail

### --- CONFIG ---
: ${ANDROID_SDK_ROOT:=/opt/homebrew/share/android-commandlinetools}
: ${AVD_NAME:=Pixel_3a_API_30_ARM64}    # change if you use another AVD
: ${METRO_PORT:=8081}
ADB="$ANDROID_SDK_ROOT/platform-tools/adb"
EMULATOR="$ANDROID_SDK_ROOT/emulator/emulator"
PATH="$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:$PATH"

### --- Helpers ---
title() { print -P "\n%F{cyan}%B==> $1%B%f"; }
ok()    { print -P "%F{green}✔%f $1"; }
warn()  { print -P "%F{yellow}⚠%f $1"; }
die()   { print -P "%F{red}✖ $1%f"; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || die "Missing dependency: $1"; }

### --- Preflight ---
title "Checking tools"
need node
need npx
need lsof
[[ -x "$ADB" ]] || die "adb not found at $ADB"
[[ -x "$EMULATOR" ]] || die "emulator not found at $EMULATOR"
ok "Using ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"
ok "adb: $ADB"
ok "emulator: $EMULATOR"

### --- Clean up any old servers and free ADB port 5037 ---
title "Resetting ADB and emulator"
pkill -f "adb.*server" 2>/dev/null || true
pkill -f "adb" 2>/dev/null || true
pkill -f "emulator|qemu-system" 2>/dev/null || true

# Free port 5037 if something is holding it
if lsof -nP -iTCP:5037 -sTCP:LISTEN >/dev/null 2>&1; then
  warn "Port 5037 is busy; freeing it"
  lsof -nP -tiTCP:5037 -sTCP:LISTEN | xargs -I{} kill -9 {} || true
fi

mkdir -p ~/.android && chmod 700 ~/.android
# If keys were corrupted, uncomment next line:
# rm -f ~/.android/adbkey*

"$ADB" start-server >/dev/null
"$ADB" devices -l || true
ok "ADB server started"

### --- Start emulator (cold, no snapshot) ---
title "Launching AVD: $AVD_NAME"
# Show available AVDs if the chosen one isn't present
if ! "$EMULATOR" -list-avds | grep -qx "$AVD_NAME"; then
  warn "AVD '$AVD_NAME' not found. Available AVDs:"
  "$EMULATOR" -list-avds || true
  die "Update AVD_NAME and re-run."
fi

# Start emulator in background
"$EMULATOR" -avd "$AVD_NAME" -no-snapshot-load -netdelay none -netspeed full \
  -feature AllowSnapshotMigration=off \
  >/dev/null 2>&1 &

# Wait for device to register with adb
title "Waiting for emulator to come online"
"$ADB" wait-for-device

# Wait for boot to complete (timeout ~180s)
BOOT_TIMEOUT=180
elapsed=0
until "$ADB" shell getprop sys.boot_completed 2>/dev/null | grep -q 1; do
  sleep 1
  (( elapsed++ ))
  if (( elapsed >= BOOT_TIMEOUT )); then
    die "Emulator did not finish booting within ${BOOT_TIMEOUT}s"
  fi
done
ok "Emulator booted"

### --- Wire Metro port ---
title "Configuring port reverse to Metro ($METRO_PORT)"
"$ADB" reverse --remove-all || true
"$ADB" reverse "tcp:${METRO_PORT}" "tcp:${METRO_PORT}"
"$ADB" reverse --list | grep "tcp:${METRO_PORT} tcp:${METRO_PORT}" >/dev/null \
  && ok "Reverse tcp:${METRO_PORT} ↔ tcp:${METRO_PORT} set" \
  || die "Failed to set adb reverse"

### --- Start Metro (if not already) ---
title "Starting Metro (or confirming it's running)"
if lsof -nP -iTCP:${METRO_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  ok "Metro already listening on ${METRO_PORT}"
else
  # Start Metro in the background
  (npx react-native start >/dev/null 2>&1 &)
  # Wait briefly for it to bind
  for i in {1..20}; do
    if lsof -nP -iTCP:${METRO_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
      ok "Metro started on ${METRO_PORT}"
      break
    fi
    sleep 0.5
  done
  if ! lsof -nP -iTCP:${METRO_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
    warn "Metro didn’t bind yet, but proceeding (the app will retry)."
  fi
fi

### --- Ensure Dev Server points to localhost:8081 ---
title "Pointing app to localhost:${METRO_PORT}"
# RN Dev Settings read this when Debug server host was set previously.
"$ADB" shell settings put global http_proxy :0 >/dev/null 2>&1 || true
"$ADB" shell settings put secure debug_http_host "localhost:${METRO_PORT}" >/dev/null 2>&1 || true

### --- Build, install, run the app ---
title "Installing and launching the app"
npx react-native run-android

ok "All set. In Metro: press 'r' to reload, 'd' for Dev Menu."
print -P "%F{cyan}Tip:%f If you still see 'Unable to load script', open Dev Menu (Cmd+M or 'adb shell input keyevent 82'), Dev Settings → Debug server host & port → set to 'localhost:${METRO_PORT}', then Reload."
