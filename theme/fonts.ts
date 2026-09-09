// Deep imports, one per weight. The package root is a barrel that `require()`s
// all nine faces, and Metro doesn't tree-shake — importing from it would ship
// 1.2 MB of fonts to use four of them.
import { GoogleSansFlex_400Regular } from '@expo-google-fonts/google-sans-flex/400Regular';
import { GoogleSansFlex_500Medium } from '@expo-google-fonts/google-sans-flex/500Medium';
import { GoogleSansFlex_600SemiBold } from '@expo-google-fonts/google-sans-flex/600SemiBold';
import { GoogleSansFlex_700Bold } from '@expo-google-fonts/google-sans-flex/700Bold';
import { TextStyle } from 'react-native';

/**
 * Google Sans Flex, from `@expo-google-fonts/google-sans-flex`.
 *
 * The package ships static instances per weight, which is what React Native
 * needs — it has no way to drive a variable font's axes from a style, so the
 * 4 MB variable file would render at one instance and fake every other weight.
 *
 * We load four of the nine: the weights the components actually ask for.
 */
export const FONTS = {
  regular: 'GoogleSansFlex_400Regular',
  medium: 'GoogleSansFlex_500Medium',
  semibold: 'GoogleSansFlex_600SemiBold',
  bold: 'GoogleSansFlex_700Bold',
} as const;

/** Passed to `useFonts` in the root layout; the keys become the family names. */
export const FONT_ASSETS = {
  [FONTS.regular]: GoogleSansFlex_400Regular,
  [FONTS.medium]: GoogleSansFlex_500Medium,
  [FONTS.semibold]: GoogleSansFlex_600SemiBold,
  [FONTS.bold]: GoogleSansFlex_700Bold,
};

const NAMED_WEIGHTS: Record<string, string> = {
  normal: FONTS.regular,
  regular: FONTS.regular,
  medium: FONTS.medium,
  semibold: FONTS.semibold,
  bold: FONTS.bold,
  heavy: FONTS.bold,
  black: FONTS.bold,
};

/**
 * Maps a `fontWeight` onto the family that actually carries that weight —
 * React Native picks a font file by family name and synthesises anything else.
 *
 * Anything below 500 lands on Regular and anything at or above 700 on Bold, so
 * the Thin/Light end of the scale degrades to the nearest cut we load.
 * Stringified rather than compared against the union so it keeps working
 * whichever spelling of the weight a component uses.
 */
export function fontFamilyForWeight(weight?: TextStyle['fontWeight']): string {
  if (weight == null) return FONTS.regular;

  const key = String(weight);
  if (key in NAMED_WEIGHTS) return NAMED_WEIGHTS[key];

  const numeric = Number(key);
  if (Number.isNaN(numeric)) return FONTS.regular;
  if (numeric >= 700) return FONTS.bold;
  if (numeric >= 600) return FONTS.semibold;
  if (numeric >= 500) return FONTS.medium;
  return FONTS.regular;
}
