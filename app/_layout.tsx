import { Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { Stack, useNavigation } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from "react";
import { User } from "@/constants/User";
import { LocalStorage } from "@/constants/Database";
import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>();
  
  const nav = useNavigation();
  const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  SystemUI.setBackgroundColorAsync(theme.colors.background);

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new User(data))
    });
  }, [])

  return !user?.isValid() ? <CreateAccount /> : (
    <ThemeProvider
      value={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );

  type AccountCreationState = {
    name?: string,
    height?: number, // cm
    targetWeight?: number, // kg
  }

  function CreateAccount() {
    const [state, setState] = useState<AccountCreationState>()

    const onPress = async () => {
      let user = new User(state);
      if(user.isValid()) {
        await LocalStorage.setJSON('user', user.getData());
        setUser(user);
      }
    }

    return (
      <ThemedSafeView style={{ justifyContent: "center", alignItems: "center", flex: 1, gap: 20 }}>
        <TextInput 
          onChange={(e) => setState({ ...state, name: e.nativeEvent.text })} 
          placeholder="Name" 
          placeholderTextColor={theme.colors.text}
          style={{ color: theme.colors.text }} 
        />
        <TextInput
          onChange={(e) => setState({ ...state, height: Number(e.nativeEvent.text) })}
          placeholder="Height"
          placeholderTextColor={theme.colors.text}
          keyboardType="numeric"
          style={{ color: theme.colors.text }} 
        />
        <TextInput
          onChange={(e) => setState({ ...state, targetWeight: Number(e.nativeEvent.text) })}
          placeholder="Target Weight"
          placeholderTextColor={theme.colors.text}
          keyboardType="numeric"
          style={{ color: theme.colors.text }} 
        />
        <Pressable onPress={onPress} style={{ 
          padding: 20, 
          backgroundColor: 
          theme.colors.primary, 
          borderRadius: 10 
        }}>
          <ThemedText>Create Profile</ThemedText>
        </Pressable>
      </ThemedSafeView>
    )
  }
}

const styles = StyleSheet.create({

});