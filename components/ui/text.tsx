import { useColor } from '@/hooks/use-color';
import { fontFamilyForWeight } from '@/theme/fonts';
import { FONT_SIZE } from '@/theme/globals';
import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';

type TextVariant =
  | 'body'
  | 'title'
  | 'subtitle'
  | 'caption'
  | 'heading'
  | 'link'
  | 'label'
  | 'code'
  | 'display'
  | 'screenTitle'
  | 'sectionTitle'
  | 'field'
  | 'bodySm'
  | 'action'
  | 'micro';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

const headingVariants: TextVariant[] = ['heading', 'title', 'subtitle'];

export const Text = React.memo(
  forwardRef<RNText, TextProps>(
    (
      { variant = 'body', lightColor, darkColor, style, children, ...props },
      ref
    ) => {
      const textColor = useColor('text', {
        light: lightColor,
        dark: darkColor,
      });
      const mutedColor = useColor('textMuted');
      const defaultAccessibilityRole = headingVariants.includes(variant)
        ? 'header'
        : undefined;

      const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
          color: textColor,
        };

        switch (variant) {
          case 'heading':
            return {
              ...baseStyle,
              fontSize: 28,
              fontWeight: '700',
            };
          case 'title':
            return {
              ...baseStyle,
              fontSize: 24,
              fontWeight: '700',
            };
          case 'subtitle':
            return {
              ...baseStyle,
              fontSize: 19,
              fontWeight: '600',
            };
          case 'caption':
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: '400',
              color: mutedColor,
            };
          case 'display':
            // The kit's Headline / H5 - M: 24/32 Medium, used for hero copy.
            return {
              ...baseStyle,
              fontSize: 24,
              lineHeight: 32,
              fontWeight: '500',
            };
          // The FinTech kit's named text styles, mapped one-to-one so a Figma
          // layer's style name tells you which variant to reach for.
          case 'screenTitle': // Headline / H5 - SemiB
            return { ...baseStyle, fontSize: 24, lineHeight: 32, fontWeight: '600' };
          case 'sectionTitle': // Headline / H6 - SemiB
            return { ...baseStyle, fontSize: 20, lineHeight: 28, fontWeight: '600' };
          case 'field': // Subtitle / S1 - M
            return { ...baseStyle, fontSize: 16, lineHeight: 24, fontWeight: '500' };
          case 'bodySm': // Body / B2 - R
            return { ...baseStyle, fontSize: 14, lineHeight: 20, fontWeight: '400' };
          case 'action': // Button Aa / Medium — inline text actions
            return { ...baseStyle, fontSize: 14, lineHeight: 16, fontWeight: '500' };
          case 'micro': // Other / C1 - R
            return { ...baseStyle, fontSize: 12, lineHeight: 16, fontWeight: '400' };
          case 'label':
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: '600',
            };
          case 'code':
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: '400',
              fontFamily: 'monospace',
            };
          case 'link':
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: '500',
              textDecorationLine: 'underline',
            };
          default: // 'body'
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: '400',
            };
        }
      };

      // Google Sans Flex ships one family per weight, so the face has to be
      // chosen from the *merged* style: a caller passing `fontWeight: '600'`
      // through `style` is picking a font file, not a synthesis hint. Flatten
      // first, then drop the weight so neither platform fakes a bolder cut on
      // top of the one we just selected. A caller who names their own
      // `fontFamily` (monospace, say) keeps it, weight and all.
      const flattened: TextStyle =
        StyleSheet.flatten<TextStyle>([getTextStyle(), style]) ?? {};

      const resolvedStyle: TextStyle = flattened.fontFamily
        ? flattened
        : {
            ...flattened,
            fontFamily: fontFamilyForWeight(flattened.fontWeight),
            fontWeight: undefined,
          };

      return (
        <RNText
          ref={ref}
          style={resolvedStyle}
          accessibilityRole={defaultAccessibilityRole}
          {...props}
        >
          {children}
        </RNText>
      );
    }
  )
);

Text.displayName = 'Text';
