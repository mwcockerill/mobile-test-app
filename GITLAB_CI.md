# GitLab CI/CD for Detox E2E Testing

This project includes a comprehensive GitLab CI/CD pipeline for automated React Native E2E testing using Detox and Android emulators.

## 🚀 Quick Start

1. **Push to GitLab**: The pipeline runs automatically on every push
2. **Monitor Progress**: Check the pipeline status in GitLab UI
3. **View Artifacts**: Download test results, screenshots, and logs

## 📋 Pipeline Stages

### 1. 📱 Build APKs
- Installs Node.js dependencies
- Builds Android debug and test APKs using Gradle
- Caches dependencies for faster subsequent builds
- Artifacts: APK files stored for 2 hours

### 2. 🧪 Detox E2E Tests  
- Sets up Android emulator (API 31)
- Installs Detox CLI
- Runs E2E tests with screenshot/log collection
- Generates JUnit test reports
- Artifacts: Test results, screenshots, logs (1 week retention)

### 3. 📊 Test Report (Conditional)
- Generates markdown test summary
- Runs on merge requests and main branch
- Provides quick overview of test results

## 🛠️ Configuration

### Environment Variables
```yaml
ANDROID_SDK_ROOT: "/android-sdk"
NODE_VERSION: "18"
DETOX_CONFIGURATION: "android.emu.debug"
```

### Caching Strategy
- `node_modules/` - NPM dependencies
- `android/.gradle/` - Gradle build cache
- `~/.gradle/caches/` - Global Gradle cache

## 🔧 Manual Jobs

### Debug Environment
Run manually to troubleshoot issues:
```bash
# In GitLab UI: Pipelines > Manual Jobs > "🔧 Debug Environment"
```

This job shows:
- Node/Java/Android versions
- Available Android SDK packages
- Detox version
- APK file verification

## 📊 Artifacts & Reports

### Test Artifacts (Always Collected)
- **Screenshots**: `e2e/artifacts/*.png` (failure screenshots)
- **Logs**: `e2e/artifacts/*.log` (detailed test logs)
- **JUnit Reports**: `e2e-results/*.xml` (for GitLab test reporting)

### GitLab Integration
- ✅ **Test Reports**: Integrated with GitLab's test reporting
- 📊 **Pipeline Graphs**: Visual test result trends
- 🔍 **Merge Request Integration**: Test status on MRs

## ⚙️ Customization

### Timeout Configuration
- **APK Build**: 20 minutes
- **E2E Tests**: 30 minutes
- **Total Pipeline**: ~50 minutes

### Retry Policy
- **Build failures**: 1 retry on runner system failure
- **Test failures**: 1 retry on timeout/system issues

### Performance Optimizations
- ✅ Parallel Gradle builds (`--parallel`)
- ✅ Gradle build cache (`--build-cache`)
- ✅ NPM offline cache (`--prefer-offline`)
- ✅ Android emulator GPU acceleration
- ✅ Dependency caching across pipeline runs

## 🚨 Troubleshooting

### Common Issues

#### Emulator Boot Timeout
```yaml
# Increase timeout in .gitlab-ci.yml
timeout 300 bash -c 'until $ANDROID_SDK_ROOT/platform-tools/adb shell getprop sys.boot_completed | grep -m 1 "1"; do echo "Waiting..."; sleep 5; done'
```

#### APK Build Failures
```bash
# Check Gradle logs in build artifacts
./gradlew assembleDebug --debug
```

#### Test Failures
```bash
# Run debug test mode for more verbose output
npm run ci:test:debug
```

### Resource Limits
- **Memory**: Optimized for 4GB runners
- **CPU**: Configured for 2 parallel workers
- **Disk**: APKs ~50MB, total artifacts ~200MB

## 📈 GitLab CI Benefits

### vs LambdaTest/Cloud Services
- ✅ **400 free minutes/month** (GitLab.com)
- ✅ **No vendor lock-in** 
- ✅ **Full control** over environment
- ✅ **Integrated** with your Git workflow
- ✅ **Unlimited self-hosted** option

### vs GitHub Actions
- ✅ **Better Docker support** (Docker-in-Docker)
- ✅ **More flexible caching** 
- ✅ **Integrated platform** (issues, CI/CD, registry)
- ✅ **Advanced pipeline features**

## 🔄 Local Development

### Test Pipeline Locally
```bash
# Build APKs
npm run ci:build

# Run tests (requires Android emulator)
npm run ci:test

# Debug mode with full artifacts
npm run ci:test:debug
```

### Validate Configuration
```bash
# Check GitLab CI syntax
gitlab-ci-local --verify

# Lint pipeline file
yamllint .gitlab-ci.yml
```

## 📚 Resources

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Android Testing](https://reactnative.dev/docs/testing-overview)
- [Android Emulator in CI](https://developer.android.com/studio/test/command-line)

---

**💡 Pro Tip**: Use GitLab's built-in container registry to store and version your test APKs for even faster pipeline execution!