import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const homeDir = os.homedir();
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function prependPath(env, entry) {
  if (!entry || !existsSync(entry)) {
    return;
  }

  const segments = (env.PATH || '').split(path.delimiter);

  if (!segments.includes(entry)) {
    env.PATH = [entry, ...segments.filter(Boolean)].join(path.delimiter);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    return '';
  }

  return result.stdout.trim();
}

function brewPrefix(formula) {
  return runCapture('brew', ['--prefix', formula]);
}

function detectHighestNdkDir(ndkRoot) {
  if (!existsSync(ndkRoot)) {
    return '';
  }

  const candidates = readdirSync(ndkRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter((name) => existsSync(path.join(ndkRoot, name)))
    .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));

  if (!candidates.length) {
    return '';
  }

  return path.join(ndkRoot, candidates[0]);
}

function resolveNativeEnv() {
  const env = { ...process.env };

  const rustBinCandidates = [
    process.env.CARGO_HOME ? path.join(process.env.CARGO_HOME, 'bin') : '',
    path.join(homeDir, '.cargo', 'bin'),
    path.join(brewPrefix('rustup'), 'bin'),
  ];

  rustBinCandidates.forEach((candidate) => prependPath(env, candidate));

  const javaPrefix = brewPrefix('openjdk@17');
  const javaHomeCandidate = javaPrefix
    ? path.join(javaPrefix, 'libexec', 'openjdk.jdk', 'Contents', 'Home')
    : '';

  prependPath(env, javaPrefix ? path.join(javaPrefix, 'bin') : '');

  if (!env.JAVA_HOME && javaHomeCandidate && existsSync(javaHomeCandidate)) {
    env.JAVA_HOME = javaHomeCandidate;
  }

  const androidSdkRoot =
    env.ANDROID_SDK_ROOT ||
    env.ANDROID_HOME ||
    path.join(homeDir, 'Library', 'Android', 'sdk');

  if (existsSync(androidSdkRoot)) {
    env.ANDROID_HOME = androidSdkRoot;
    env.ANDROID_SDK_ROOT = androidSdkRoot;

    const ndkHome =
      env.ANDROID_NDK_HOME ||
      env.NDK_HOME ||
      detectHighestNdkDir(path.join(androidSdkRoot, 'ndk'));

    if (ndkHome && existsSync(ndkHome)) {
      env.ANDROID_NDK_HOME = ndkHome;
      env.NDK_HOME = ndkHome;
    }
  }

  return env;
}

function toolLabel(command) {
  if (command === 'tauri' && process.platform === 'win32') {
    return 'tauri.cmd';
  }

  return command;
}

function runWithEnv(command, args, env) {
  const result = spawnSync(toolLabel(command), args, {
    env,
    stdio: 'inherit',
  });

  process.exit(result.status ?? 1);
}

function printDoctor(env) {
  const reportLines = [
    ['PATH', env.PATH || ''],
    ['JAVA_HOME', env.JAVA_HOME || 'not set'],
    ['ANDROID_HOME', env.ANDROID_HOME || 'not set'],
    ['ANDROID_SDK_ROOT', env.ANDROID_SDK_ROOT || 'not set'],
    ['ANDROID_NDK_HOME', env.ANDROID_NDK_HOME || 'not set'],
  ];

  console.log('Native environment');
  reportLines.forEach(([label, value]) => {
    console.log(`${label}: ${value}`);
  });

  const checks = [
    ['cargo', ['--version']],
    ['rustc', ['--version']],
    ['tauri', ['--version']],
    ['java', ['-version']],
    ['xcodebuild', ['-version']],
    ['adb', ['version']],
  ];

  console.log('\nTool check');

  checks.forEach(([command, args]) => {
    const result = spawnSync(toolLabel(command), args, {
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
    const firstLine = output.split('\n')[0] || 'not available';
    const prefix = result.status === 0 ? 'ok' : 'missing';
    console.log(`${prefix}: ${command} -> ${firstLine}`);
  });
}

function runAndroidLicenses(env) {
  const sdkManager = env.ANDROID_HOME
    ? path.join(env.ANDROID_HOME, 'cmdline-tools', 'latest', 'bin', 'sdkmanager')
    : '';

  if (!sdkManager || !existsSync(sdkManager)) {
    console.error('sdkmanager was not found under ANDROID_HOME/cmdline-tools/latest/bin');
    process.exit(1);
  }

  const licenseCommand = [
    'yes',
    `| "${sdkManager}" --licenses`,
    '&&',
    `yes | "${sdkManager}" --sdk_root="${env.ANDROID_HOME}" "build-tools;35.0.0" "platforms;android-36"`,
  ].join(' ');

  const shell = process.env.SHELL || '/bin/sh';
  const result = spawnSync(shell, ['-lc', licenseCommand], {
    env,
    stdio: 'inherit',
  });

  process.exit(result.status ?? 1);
}

function cleanIosBuildOutput() {
  const buildDir = path.join(repoRoot, 'src-tauri', 'gen', 'apple', 'build');
  rmSync(buildDir, { force: true, recursive: true });
}

const commands = {
  'desktop-dev': ['tauri', ['dev']],
  'desktop-build': ['tauri', ['build']],
  'ios-init': ['tauri', ['ios', 'init', '--ci']],
  'ios-dev': ['tauri', ['ios', 'dev']],
  'ios-build': ['tauri', ['ios', 'build']],
  'ios-build-sim': ['tauri', ['ios', 'build', '--debug', '--target', 'aarch64-sim', '--ci']],
  'android-init': ['tauri', ['android', 'init', '--ci']],
  'android-dev': ['tauri', ['android', 'dev']],
  'android-build': ['tauri', ['android', 'build']],
  'android-build-debug': [
    'tauri',
    ['android', 'build', '--debug', '--apk', '--target', 'aarch64', '--ci'],
  ],
};

const commandKey = process.argv[2];
const extraArgs = process.argv.slice(3);
const env = resolveNativeEnv();

if (!commandKey) {
  console.error('Usage: node scripts/tauri-runner.mjs <command>');
  process.exit(1);
}

if (commandKey === 'doctor') {
  printDoctor(env);
  process.exit(0);
}

if (commandKey === 'android-licenses') {
  runAndroidLicenses(env);
}

const command = commands[commandKey];

if (!command) {
  console.error(`Unknown command: ${commandKey}`);
  process.exit(1);
}

if (commandKey === 'ios-build' || commandKey === 'ios-build-sim') {
  cleanIosBuildOutput();
}

runWithEnv(command[0], [...command[1], ...extraArgs], env);
