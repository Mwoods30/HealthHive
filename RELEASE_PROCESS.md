# Release Process

This repo now supports repeatable native build output for the HealthHive app.

## Current Targets

- Web demo build via Vite
- macOS desktop bundle via Tauri
- Windows desktop bundle via Tauri
- Android debug APK via Tauri
- iOS simulator app via Tauri

## Local Commands

```bash
npm run tauri:doctor
npm run tauri:build
npm run tauri:android:apk
npm run tauri:ios:sim
```

Use `npm run tauri:android:licenses` once on a fresh macOS machine if the Android SDK reports missing licenses.

## GitHub Actions

The CI workflow lives in `.github/workflows/native-builds.yml`.

It currently does the following on pushes, pull requests, and manual runs:

1. Runs web lint and build on `ubuntu-latest`
2. Builds desktop artifacts on:
   - `macos-13` for Intel macOS output
   - `macos-14` for Apple Silicon macOS output
   - `windows-latest` for Windows output
3. Builds the Android debug APK on `macos-14`
4. Builds the iOS simulator app on `macos-14`
5. Uploads normalized release-style artifacts for each platform

The release publishing workflow lives in `.github/workflows/release.yml`.

It runs on tags matching `v*` and:

1. Rebuilds macOS Intel, macOS Apple Silicon, Windows, and Android artifacts
2. Normalizes asset names to stable download names
3. Publishes those assets to the GitHub Release created from the tag

## Expected Artifact Types

- macOS: `.app` and `.dmg`
- Windows: installer bundles under `src-tauri/target/release/bundle/`
- Android: `app-universal-debug.apk`
- iOS simulator: `HealthHive.app`

The normalized GitHub Release asset names are:

- `HealthHive-macos-intel.dmg`
- `HealthHive-macos-apple-silicon.dmg`
- `HealthHive-windows-x64-setup.exe`
- `HealthHive-windows-x64.msi` when available
- `HealthHive-android-arm64-debug.apk`

## What Is Still Missing

- Signed macOS release builds
- Windows code signing
- A real Apple development team for iPhone/device builds
- TestFlight/App Store packaging
- Android release signing and Play Store bundle generation
- Signed GitHub Release publishing from tags

## Suggested Next Step

When you are ready for real public release distribution, the next step is replacing the unsigned workflows with signed builds by adding the required GitHub secrets for Apple, Windows, and Android signing.
