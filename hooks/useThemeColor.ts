/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function applyTheme(dark: boolean, theme: Theme) {
  let mode: 'dark' | 'light' = dark ? 'dark' : 'light';
  return { dark: theme.dark, colors: { ...theme.colors, ...Colors[mode] }}
}
