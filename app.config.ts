import type { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

/**
 * Placeholder brand. "FinTech" is what the screens already say — "Welcome to
 * FinTech" on the phone step, "Unlock FinTech" on the biometric prompt — so the
 * display name matches the copy until the real name lands.
 *
 * Renaming later is these two constants plus that copy; `slug` and `scheme`
 * deliberately stay put (see below).
 */
const APP_NAME = "FinTech";
const BASE_IDENTIFIER = "dev.fynix.fintech.app";

/**
 * Each variant gets its own identifier so development, preview and production
 * builds install side by side on one device instead of overwriting each other.
 * `APP_VARIANT` is set per build profile in eas.json.
 */
const getBundleIdentifier = () => {
  if (IS_DEV) return `${BASE_IDENTIFIER}.dev`;
  if (IS_PREVIEW) return `${BASE_IDENTIFIER}.preview`;
  return BASE_IDENTIFIER;
};

const getAppName = () => {
  if (IS_DEV) return `${APP_NAME} Dev`;
  if (IS_PREVIEW) return `${APP_NAME} Preview`;
  return APP_NAME;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  // Left alone on purpose: the slug is what ties this project to its EAS
  // projectId, so it does not follow the display name.
  slug: "am1",
  // Same reasoning — the deep-link scheme is a published surface, not a brand
  // string. Worth changing deliberately when the real name arrives.
  scheme: "am1",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  // The app is light-only, so native chrome doesn't follow the OS.
  userInterfaceStyle: "light",

  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleIdentifier(),
    // iOS 18 appearances; the dark and tinted marks are the glyph on
    // transparency, with the system supplying the backdrop and the tint.
    icon: {
      light: "./assets/images/icon.png",
      dark: "./assets/images/icon-dark.png",
      tinted: "./assets/images/icon-tinted.png",
    },
    infoPlist: {
      // Answers App Store Connect's export-compliance question up front. True
      // only if the app adds its own encryption beyond HTTPS — this one doesn't.
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  android: {
    package: getBundleIdentifier(),
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
      foregroundImage: "./assets/images/adaptive-icon.png",
      monochromeImage: "./assets/images/monochrome-icon.png",
    },
    predictiveBackGestureEnabled: true,
    permissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
    ],
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-asset",
    "expo-router",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        // The mark's own width on the kit's 375pt frame.
        imageWidth: 115,
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
      },
    ],
    [
      "expo-local-authentication",
      {
        // Wording from the kit's own Face ID permission alert (394:4366).
        faceIDPermission: "To sign in to the app",
      },
    ],
    "expo-audio",
    "expo-video",
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  extra: {
    router: {},
    eas: {
      projectId: "23dbdfaf-273b-408d-9e0b-71398dcbcee9",
    },
  },

  owner: "phoenixdahdev",
});
