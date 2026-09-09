import type { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const APP_NAME = "FinTech";
const BASE_IDENTIFIER = "dev.fynix.fintech.app";

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
      "expo-image-picker",
      {
        // The loan application asks for a photo of an ID; say why before iOS
        // shows the prompt.
        photosPermission:
          "Allow $(PRODUCT_NAME) to access your photos so you can attach your ID and payment slip.",
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
