import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { Stack, useNavigation } from "expo-router";
import * as SystemUI from 'expo-system-ui';

export default function RootLayout() {
  const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  SystemUI.setBackgroundColorAsync(theme.colors.background);

  return (
    <ThemeProvider
      value={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
