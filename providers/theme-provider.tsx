import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from 'expo-router/react-navigation';
import { useMemo } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/theme/colors';

type Props = {
  children: React.ReactNode;
};

/**
 * Maps the resolved colour scheme onto React Navigation's theme, so navigator
 * chrome (headers, tab bars, card backgrounds) matches the app palette.
 *
 * Light/dark state itself lives in `@/stores/mode-store`, which also owns its
 * persistence — hence no storage prop here, and nothing to mount for the theme
 * to work. This exists only because React Navigation reads its theme from
 * context.
 */
export const ThemeProvider = ({ children }: Props) => {
  const colorScheme = useColorScheme();

  // Rebuilding this on every render invalidates every useTheme() consumer
  // app-wide, since ThemeProvider is mounted at the root — memoize on the
  // one thing it actually depends on, and only build the active theme.
  const theme = useMemo(() => {
    if (colorScheme === 'dark') {
      return {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: Colors.dark.primary,
          background: Colors.dark.background,
          card: Colors.dark.card,
          text: Colors.dark.text,
          border: Colors.dark.border,
          notification: Colors.dark.red,
        },
      };
    }

    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: Colors.light.primary,
        background: Colors.light.background,
        card: Colors.light.card,
        text: Colors.light.text,
        border: Colors.light.border,
        notification: Colors.light.red,
      },
    };
  }, [colorScheme]);

  return <RNThemeProvider value={theme}>{children}</RNThemeProvider>;
};
