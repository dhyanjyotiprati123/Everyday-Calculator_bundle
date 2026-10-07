// Release-build settings applied on every `expo prebuild`, so a freshly
// generated android/ folder builds a Play-ready app without hand edits.
//
// Signing: the upload key is read from Gradle properties, normally kept in the
// user-level ~/.gradle/gradle.properties so passwords never enter the project:
//   CALCULATORS_UPLOAD_STORE_FILE=C:/path/to/upload.jks
//   CALCULATORS_UPLOAD_STORE_PASSWORD=…
//   CALCULATORS_UPLOAD_KEY_ALIAS=upload
//   CALCULATORS_UPLOAD_KEY_PASSWORD=…
// Without them, release builds fall back to the debug key (fine for local
// testing; Play rejects debug-signed uploads).
const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

const PREFIX = 'CALCULATORS_UPLOAD';

const GRADLE_PROPERTIES = {
  // Release lint runs out of the default 512 MB metaspace.
  'org.gradle.jvmargs': '-Xmx4096m -XX:MaxMetaspaceSize=1536m',
  // Phones (64- and 32-bit ARM) plus the x86_64 emulator; 32-bit x86 is obsolete.
  reactNativeArchitectures: 'armeabi-v7a,arm64-v8a,x86_64',
};

const RELEASE_SIGNING_CONFIG = `
        release {
            if (findProperty('${PREFIX}_STORE_FILE')) {
                storeFile file(findProperty('${PREFIX}_STORE_FILE'))
                storePassword findProperty('${PREFIX}_STORE_PASSWORD')
                keyAlias findProperty('${PREFIX}_KEY_ALIAS')
                keyPassword findProperty('${PREFIX}_KEY_PASSWORD')
            }
        }`;

function withReleaseGradleProperties(config) {
  return withGradleProperties(config, (config) => {
    for (const [key, value] of Object.entries(GRADLE_PROPERTIES)) {
      const existing = config.modResults.find((item) => item.type === 'property' && item.key === key);
      if (existing) existing.value = value;
      else config.modResults.push({ type: 'property', key, value });
    }
    return config;
  });
}

function addReleaseSigning(gradle) {
  if (gradle.includes(`${PREFIX}_STORE_FILE`)) return gradle;

  const signingConfigs = /signingConfigs \{/;
  const releaseSigning = /(buildTypes \{[\s\S]*?release \{[\s\S]*?)signingConfig signingConfigs\.debug/;
  // Fail loudly rather than silently shipping a debug-signed release.
  if (!signingConfigs.test(gradle) || !releaseSigning.test(gradle)) {
    throw new Error('withAndroidRelease: app/build.gradle no longer matches the expected template; update the plugin.');
  }
  return gradle
    .replace(signingConfigs, (match) => match + RELEASE_SIGNING_CONFIG)
    .replace(
      releaseSigning,
      `$1signingConfig findProperty('${PREFIX}_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`
    );
}

function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = addReleaseSigning(config.modResults.contents);
    return config;
  });
}

module.exports = function withAndroidRelease(config) {
  return withReleaseSigning(withReleaseGradleProperties(config));
};
module.exports.addReleaseSigning = addReleaseSigning;
