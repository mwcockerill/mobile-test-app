# LambdaTest HyperExecute Real Device Testing

This guide shows you how to run React Native E2E tests on **real devices** using LambdaTest HyperExecute with modern Android tooling (SDK 35, AGP 8.10.x, Gradle 8.11.1).

## 🚀 Quick Start

### 1. Get LambdaTest Credentials
- Sign up at [LambdaTest](https://accounts.lambdatest.com/register)
- Go to [Security Settings](https://accounts.lambdatest.com/security)
- Copy your Username and Access Key

### 2. Set Environment Variables
```bash
export LT_USERNAME="your_username"
export LT_ACCESS_KEY="your_access_key"
```

Or create a `.env` file:
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Install HyperExecute CLI
```bash
# macOS
curl -O https://downloads.lambdatest.com/hyperexecute/darwin/hyperexecute
chmod +x hyperexecute
sudo mv hyperexecute /usr/local/bin/

# Linux
wget https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute
chmod +x hyperexecute
sudo mv hyperexecute /usr/local/bin/

# Windows
# Download from https://downloads.lambdatest.com/hyperexecute/windows/hyperexecute.exe
```

### 4. Run E2E Tests
```bash
# Using Makefile (recommended)
make hyperexecute-run

# Or directly
hyperexecute --config hyperexecute.yaml --verbose
```

## 📱 Real Device Testing

Your tests will run on **real hardware**:
- **Google Pixel 8** (Android 15)
- Actual device performance and behavior
- Real network conditions and sensors

**Total execution time**: ~5-10 minutes (vs 20+ minutes locally)

## 🧪 What Gets Tested

### E2E Tests (`e2e/`)
- **Counter functionality**: Increment, decrement, reset
- **Interactive features**: Random number, math problems, color mood
- **Real device interactions**: Touch, gestures, sensors
- **Performance**: Actual device performance metrics

### Real Device Benefits
- ✅ **Actual hardware performance** - Real CPU, GPU, memory
- ✅ **True touch interactions** - Real finger touches, not simulated
- ✅ **Network conditions** - Real cellular/WiFi behavior
- ✅ **OS variations** - Actual Android 15 behavior
- ✅ **Hardware sensors** - Real accelerometer, gyroscope

## 📊 Results & Artifacts

After tests complete, you'll get:
- **Test reports**: JSON results with pass/fail status
- **Screenshots**: Automatic capture on failures
- **Videos**: Full test execution recordings
- **Logs**: Detailed execution logs

Access results at: [LambdaTest Dashboard](https://hyperexecute.lambdatest.com/)

## 🔧 Configuration Files

- `hyperexecute.yaml` - Real device HyperExecute configuration (v0.2)
- `android/build.gradle` - Upgraded to SDK 35 + AGP 8.10.2
- `package.json` - Real device scripts and Detox config
- `.detoxrc.js` - Real device Detox configuration
- `e2e/jest.config.js` - Jest configuration for E2E tests

## 📝 Commands Available

```bash
make help                    # Show all available commands
make hyperexecute-run        # Run E2E tests on real Google Pixel 8
make hyperexecute-status     # Check job status
npm run e2e:build:android    # Build APKs for real device testing
npm run e2e:test:android     # Run E2E tests on real device
```

## 🚨 Troubleshooting

### Authentication Issues
```bash
# Verify credentials are set
echo $LT_USERNAME
echo $LT_ACCESS_KEY

# Test authentication
hyperexecute --config hyperexecute.yaml --status
```

### Build Issues
```bash
# Clean and rebuild with new toolchain
cd android && ./gradlew clean
npm run e2e:build:android
```

### Test Failures on Real Device
- Check real device availability in LambdaTest dashboard
- Review Detox selectors work on actual hardware
- Verify app permissions for real device interactions
- Check network connectivity requirements

## 🤖 CI/CD Integration

GitHub Actions workflow is set up at `.github/workflows/e2e-tests.yml`:
- Runs on every push/PR
- Requires secrets: `LT_USERNAME`, `LT_ACCESS_KEY`
- Posts test results as PR comments

### Setting up GitHub Secrets
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add `LT_USERNAME` and `LT_ACCESS_KEY`

## 💰 Real Device Testing Cost

- **Real device testing**: Premium feature (paid plans)
- **Value**: Actual hardware behavior + faster feedback
- **ROI**: 4x faster execution + real-world validation

## 📞 Support

- [LambdaTest Documentation](https://www.lambdatest.com/support/docs/)
- [HyperExecute Guide](https://www.lambdatest.com/support/docs/hyperexecute-overview/)
- [Detox Documentation](https://wix.github.io/Detox/)

---

🎮 **Your Mini App Collection is now ready for real device E2E testing on Google Pixel 8!**