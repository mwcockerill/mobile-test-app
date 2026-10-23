import fs from 'fs';
import path from 'path';
import { APP_VERSION } from '../../src/version';

const root = path.join(__dirname, '../..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('app version and id', () => {
  it('matches package.json', () => {
    expect(APP_VERSION).toBe(require('../../package.json').version);
  });

  it('matches the Android versionName', () => {
    expect(read('android/app/build.gradle')).toContain(
      `versionName "${APP_VERSION}"`,
    );
  });

  it('matches every iOS MARKETING_VERSION', () => {
    const versions = [
      ...read('ios/MobileTestApp.xcodeproj/project.pbxproj').matchAll(
        /MARKETING_VERSION = ([^;]+);/g,
      ),
    ].map(m => m[1]);
    expect(versions.length).toBeGreaterThan(0);
    versions.forEach(v => expect(v).toBe(APP_VERSION));
  });

  it('uses com.mobiletestapp as the iOS app bundle id', () => {
    const pbx = read('ios/MobileTestApp.xcodeproj/project.pbxproj');
    const ids = [...pbx.matchAll(/PRODUCT_BUNDLE_IDENTIFIER = "?([^";]+)"?;/g)]
      .map(m => m[1])
      .filter(id => !id.includes('$('));  // "$(PRODUCT_NAME...)" ids belong to the test target
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach(id => expect(id).toBe('com.mobiletestapp'));
  });

  it('matches the version named in the setup lesson', () => {
    const versions = read('lessons/00-setup.md').match(/\d+\.\d+\.\d+/g) ?? [];
    expect(versions.length).toBeGreaterThan(0);
    versions.forEach(v => expect(v).toBe(APP_VERSION));
  });
});
