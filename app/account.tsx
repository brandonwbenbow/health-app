import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import { LocalStorage } from "@/constants/Database";
import { User } from "@/constants/User";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>();
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Account", headerBackVisible: false })
  }, [nav])

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new User(data))
    });
  }, [])

  return (
    <ThemedSafeView style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <ThemedText>{user?.getData()?.name ?? "Undefined Name"}</ThemedText>
      <ThemedText>Height (cm): {user?.getData()?.height ?? "Undefined"}</ThemedText>
      <ThemedText>Target Weight (kg): {user?.getData()?.targetWeight ?? "Undefined"}</ThemedText>
    </ThemedSafeView>
  )
}