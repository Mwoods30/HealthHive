import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = process.argv[3]
  ? path.resolve(process.cwd(), process.argv[3])
  : path.join(repoRoot, 'release-artifacts');
const target = process.argv[2];

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function listFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).map((entry) => path.join(dir, entry));
}

function findFirstFile(dir, extension) {
  return listFiles(dir).find((entry) => statSync(entry).isFile() && entry.endsWith(extension)) || '';
}

function copyFile(sourcePath, targetName) {
  if (!sourcePath || !existsSync(sourcePath)) {
    throw new Error(`Missing source artifact: ${sourcePath}`);
  }

  ensureDir(outputDir);
  cpSync(sourcePath, path.join(outputDir, targetName));
}

function zipBundle(sourcePath, targetName) {
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing bundle to archive: ${sourcePath}`);
  }

  ensureDir(outputDir);
  const destination = path.join(outputDir, targetName);
  const result = spawnSync('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', sourcePath, destination], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Failed to archive bundle: ${sourcePath}`);
  }
}

function collectMacArtifact(archLabel) {
  const dmgDir = path.join(repoRoot, 'src-tauri', 'target', 'release', 'bundle', 'dmg');
  const dmgPath = findFirstFile(dmgDir, '.dmg');
  copyFile(dmgPath, `HealthHive-macos-${archLabel}.dmg`);
}

function collectWindowsArtifacts() {
  const bundleDir = path.join(repoRoot, 'src-tauri', 'target', 'release', 'bundle');
  const nsisDir = path.join(bundleDir, 'nsis');
  const msiDir = path.join(bundleDir, 'msi');
  const exePath = findFirstFile(nsisDir, '.exe');
  const msiPath = findFirstFile(msiDir, '.msi');

  if (exePath) {
    copyFile(exePath, 'HealthHive-windows-x64-setup.exe');
  }

  if (msiPath) {
    copyFile(msiPath, 'HealthHive-windows-x64.msi');
  }

  if (!exePath && !msiPath) {
    throw new Error('No Windows installer artifacts were found');
  }
}

function collectAndroidArtifact() {
  const apkPath = path.join(
    repoRoot,
    'src-tauri',
    'gen',
    'android',
    'app',
    'build',
    'outputs',
    'apk',
    'universal',
    'debug',
    'app-universal-debug.apk',
  );

  copyFile(apkPath, 'HealthHive-android-arm64-debug.apk');
}

function collectIosSimulatorArtifact() {
  const appPath = path.join(
    repoRoot,
    'src-tauri',
    'gen',
    'apple',
    'build',
    'arm64-sim',
    'HealthHive.app',
  );

  zipBundle(appPath, 'HealthHive-ios-simulator-arm64.zip');
}

if (!target) {
  console.error('Usage: node scripts/collect-native-artifacts.mjs <target> [outputDir]');
  process.exit(1);
}

switch (target) {
  case 'macos-apple-silicon':
    collectMacArtifact('apple-silicon');
    break;
  case 'macos-intel':
    collectMacArtifact('intel');
    break;
  case 'windows':
    collectWindowsArtifacts();
    break;
  case 'android-debug':
    collectAndroidArtifact();
    break;
  case 'ios-sim':
    collectIosSimulatorArtifact();
    break;
  default:
    console.error(`Unknown artifact target: ${target}`);
    process.exit(1);
}
