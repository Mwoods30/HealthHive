# Tauri Setup

This repo now has native app packaging started for desktop, iOS, and Android on top of the existing Vite + React frontend.

## Current State

- Desktop Tauri wrapper is initialized in `src-tauri/`
- Native icons were generated from `public/healthhive-icon.svg`
- iOS project was generated in `src-tauri/gen/apple/`
- Android Studio project was generated in `src-tauri/gen/android/`
- Desktop, Android, and iOS simulator builds have already been run on this machine

## Available Scripts

```bash
npm run tauri:doctor
npm run tauri:dev
npm run tauri:build
npm run tauri:ios:init
npm run tauri:ios:dev
npm run tauri:ios:build
npm run tauri:ios:sim
npm run tauri:android:init
npm run tauri:android:dev
npm run tauri:android:build
npm run tauri:android:apk
npm run tauri:android:licenses
```

These commands now run through `scripts/tauri-runner.mjs`, which auto-detects the local Rust, Java, Android SDK, and NDK locations used on this machine.

Desktop CI automation now lives in `.github/workflows/native-builds.yml`. The broader release flow is documented in `RELEASE_PROCESS.md`.

## Machine Prerequisites Used Here

This machine is using:

- Rust via `rustup`
- Xcode and CocoaPods for iOS
- Homebrew `openjdk@17` for Android builds
- Android SDK tools under `$HOME/Library/Android/sdk`
- Android NDK `29.0.14206865`

Recommended shell exports before Android commands if auto-detection is not enough:

```bash
export PATH="/opt/homebrew/opt/openjdk@17/bin:/opt/homebrew/opt/rustup/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export NDK_HOME="$HOME/Library/Android/sdk/ndk/29.0.14206865"
export ANDROID_NDK_HOME="$HOME/Library/Android/sdk/ndk/29.0.14206865"
```

Recommended shell export before desktop commands if Rust is not already on `PATH`:

```bash
export PATH="/opt/homebrew/opt/rustup/bin:$PATH"
```

## Generated Outputs

Successful desktop build output on this machine:

- `src-tauri/target/release/bundle/macos/HealthHive.app`
- `src-tauri/target/release/bundle/dmg/HealthHive_0.1.0_aarch64.dmg`

Successful Android debug output on this machine:

- `src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk`

Successful iOS simulator output on this machine:

- `src-tauri/gen/apple/build/arm64-sim/HealthHive.app`
- GitHub Releases are expected to publish normalized desktop and Android asset names that match the landing page download links

## Remaining Work

1. Run `npm run tauri:doctor` after toolchain changes to confirm the local environment is still detected correctly.
2. Re-run `npm run tauri:build` after any desktop shell changes.
3. Re-run `npm run tauri:android:apk` when the Android app changes.
4. Re-run `npm run tauri:ios:sim` when the iOS shell changes.
5. Use `npm run tauri:android:licenses` on a fresh macOS machine if Gradle reports missing Android SDK licenses.
6. Add an Apple development team before attempting signed iPhone device builds.
7. Add release signing and notarization later for real distribution.

## Notes

- iOS simulator builds do not produce App Store-ready output.
- Signed iOS device builds need an Apple Developer team configured.
- Android builds on a fresh machine may still need `npm run tauri:android:licenses` once before the first Gradle build.
- Android and iOS should continue using the same React frontend and backend API as the desktop build.
