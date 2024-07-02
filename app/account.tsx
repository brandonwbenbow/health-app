import ProfileSetup from "@/components/ProfileSetup";
import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import { LocalStorage } from "@/constants/Database";
import { Profile } from "@/constants/Profile";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>();
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Account", headerBackVisible: false })
  }, [nav])

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setProfile(new Profile(data))
    });
  }, [])

  return (
    <ThemedSafeView style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <ThemedText>Height (cm): {profile?.getData()?.height ?? "Undefined"}</ThemedText>
      <ThemedText>Target Weight (kg): {profile?.getData()?.targetWeight ?? "Undefined"}</ThemedText>
      <Pressable onPress={() => { LocalStorage.setJSON('user', {}).then(() => setProfile(null)); }}>
        <ThemedText>Delete Profile</ThemedText>
      </Pressable>
    </ThemedSafeView>
  )
}