/**
 * Palette taken from the FinTech Banking Mobile UI kit in Figma
 * (file XsT82utuZ8hh7I6p74qEbk), read from the file's own named styles rather
 * than eyeballed off screenshots. The kit is built on the Eva Design System —
 * its `Basic / 100…900` ramp and `Success / 600` match Eva exactly — so the few
 * semantic steps the kit never uses (danger 500, warning 500) are taken from
 * Eva rather than invented.
 *
 * The app is light-mode-only; `darkColors` exists so the toggle and every
 * `Colors[scheme]` lookup keep working, but it is not a design deliverable.
 */
const lightColors = {
  // Base colors — Basic / 100 and Basic / 900
  background: '#FFFFFF',
  foreground: '#192038',

  // Card colors. Basic / 200: the kit's raised surfaces are white-on-white plus
  // a shadow, but the components here paint inputs and cards with `card` and
  // would vanish against `background`, so surfaces take the first grey step.
  card: '#F7F9FC',
  cardForeground: '#192038',

  // Popover colors
  popover: '#FFFFFF',
  popoverForeground: '#192038',

  // Primary colors — the brand blue, straight off the hero card and the app mark
  primary: '#2C64E3',
  primaryForeground: '#FFFFFF',

  // Secondary colors — Basic / 300 and Basic / 700
  secondary: '#EDF1F7',
  secondaryForeground: '#2E3A59',

  // Muted colors — Basic / 300 and Basic / 600
  muted: '#EDF1F7',
  mutedForeground: '#8F9BB3',

  // Accent colors — the pale blue used behind the "to do" tiles
  accent: '#E5EEFD',
  accentForeground: '#2C64E3',

  // Destructive colors — Eva Danger 500; the kit only ships Danger / 300
  destructive: '#FF3D71',
  destructiveForeground: '#FFFFFF',

  // Border and input — Basic / 400 and Basic / 300
  border: '#E4E9F2',
  input: '#EDF1F7',
  ring: '#2C64E3',

  // Text colors — Basic / 900 for copy, Basic / 600 for secondary
  text: '#192038',
  textMuted: '#8F9BB3',

  // Legacy support for existing components
  tint: '#2C64E3',
  icon: '#8F9BB3',
  tabIconDefault: '#8F9BB3',
  tabIconSelected: '#2C64E3',

  // Default buttons, links, Send button, selected tabs
  blue: '#2C64E3',

  // Success states, incoming amounts — Success / 600
  green: '#00B887',

  // Delete buttons, error states, critical alerts
  red: '#FF3D71',

  // Warning states — the warm end of the kit's card gradient
  orange: '#FF7E55',

  // Highlights — the amber end of that same gradient
  yellow: '#FFA800',

  // Soft accent — Danger / 300, the kit's own pink tint
  pink: '#FFA8B4',

  // Purple accent — the cool card gradient's end stop
  purple: '#D361FC',

  // Teal accent — that gradient's start stop
  teal: '#55B8FF',

  // Indigo accent — the brand blue's mid tint, used on stacked cards
  indigo: '#5E89EA',

  // Brand tints, for card stacks and pressed states
  brandTint: '#5E89EA',
  brandSubtle: '#E5EEFD',

  // The kit paints its onboarding / auth backdrop in Eva's own Primary 500
  // rather than the brand blue every other screen and the logo use. Kept
  // literal so those screens match Figma; see the note in the auth screens.
  brandVivid: '#3366FF',

  // Near-black CTA on brand surfaces — the onboarding "Sign up" button
  ink: '#1B1C3C',

  // Info / 100 — the OTP slot fill
  infoSubtle: '#F2F8FF',

  // Success / 100 — amounts printed on a coloured card
  successSubtle: '#F0FFF5',

  // "main bg" — the app chrome behind the home screen's white panels
  canvas: '#F2F1F6',

  // Basic / 500 — idle indicators, e.g. an unfilled PIN dot
  outline: '#C5CEE0',

  // Category tile fills, used across the kit's "to do" and promo cards
  lime: '#D8FF6F',
  peach: '#FAE3E0',
  lavender: '#EBE5FD',

  // Semantic states
  success: '#00B887',
  successForeground: '#FFFFFF',
  warning: '#FFA800',
  warningForeground: '#192038',
  info: '#2C64E3',
  infoForeground: '#FFFFFF',
  error: '#FF3D71',
  errorForeground: '#FFFFFF',
};

/**
 * Not part of the Figma kit — the app ships light-only. These keep the mode
 * toggle and every `Colors.dark.*` lookup working, using Eva's dark neutrals
 * under the same brand hue.
 */
const darkColors = {
  // Base colors
  background: '#101426',
  foreground: '#FFFFFF',

  // Card colors
  card: '#1A2138',
  cardForeground: '#FFFFFF',

  // Popover colors
  popover: '#1A2138',
  popoverForeground: '#FFFFFF',

  // Primary colors
  primary: '#5E89EA',
  primaryForeground: '#101426',

  // Secondary colors
  secondary: '#222B45',
  secondaryForeground: '#EDF1F7',

  // Muted colors
  muted: '#222B45',
  mutedForeground: '#8F9BB3',

  // Accent colors
  accent: '#222B45',
  accentForeground: '#5E89EA',

  // Destructive colors
  destructive: '#FF3D71',
  destructiveForeground: '#FFFFFF',

  // Border and input
  border: '#2E3A59',
  input: '#222B45',
  ring: '#5E89EA',

  // Text colors
  text: '#FFFFFF',
  textMuted: '#8F9BB3',

  // Legacy support for existing components
  tint: '#5E89EA',
  icon: '#8F9BB3',
  tabIconDefault: '#8F9BB3',
  tabIconSelected: '#FFFFFF',

  // Default buttons, links, Send button, selected tabs
  blue: '#5E89EA',

  // Success states, incoming amounts
  green: '#00E096',

  // Delete buttons, error states, critical alerts
  red: '#FF708D',

  // Warning states
  orange: '#FF9A7A',

  // Highlights
  yellow: '#FFC94D',

  // Soft accent
  pink: '#FFA8B4',

  // Purple accent
  purple: '#DE8BFD',

  // Teal accent
  teal: '#7FCBFF',

  // Indigo accent
  indigo: '#91AEF0',

  // Brand tints
  brandTint: '#91AEF0',
  brandSubtle: '#222B45',
  brandVivid: '#3366FF',
  ink: '#101426',

  infoSubtle: '#1A2138',
  successSubtle: '#0F2A1C',
  canvas: '#0B0E1A',
  outline: '#2E3A59',

  // Category tile fills
  lime: '#D8FF6F',
  peach: '#F2C9C2',
  lavender: '#C9BDF5',

  // Semantic states
  success: '#00E096',
  successForeground: '#101426',
  warning: '#FFC94D',
  warningForeground: '#101426',
  info: '#5E89EA',
  infoForeground: '#101426',
  error: '#FF708D',
  errorForeground: '#101426',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Export individual color schemes for easier access
export { darkColors, lightColors };

// Utility type for color keys
export type ColorKeys = keyof typeof lightColors;

// Helper function to get color with opacity (useful for React Native)
export const withOpacity = (color: string, opacity: number) => {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color;
  }

  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};
