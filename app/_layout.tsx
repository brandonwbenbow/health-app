import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from "react";
import { Profile } from "@/constants/Profile";
import { LocalStorage } from "@/constants/Database";
import ProfileSetup from "@/components/ProfileSetup";

export default function RootLayout() {  
  const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  SystemUI.setBackgroundColorAsync(theme.colors.background);

  const [profile, setProfile] = useState<Profile | null>();

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setProfile(new Profile(data))
    });
  }, [])

  const saveProfile = async (profile: Profile) => {
    await LocalStorage.setJSON('user', profile.getData());
    setProfile(profile);
  }

  return (
    <ThemeProvider
      value={theme}>
        {
          !profile?.isValid() ? 
          <ProfileSetup onSubmit={saveProfile}/> 
          :
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="weight" options={{ headerShown: false }} />
          </Stack>
        }
    </ThemeProvider>
  );
}