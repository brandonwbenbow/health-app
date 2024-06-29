import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import { useEffect } from "react";


export default function AccountPage() {
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Account", headerBackVisible: false })
  }, [nav])

  return (
    <ThemedSafeView style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <ThemedText>Account Page</ThemedText>
      <ThemedText>TODO</ThemedText>
    </ThemedSafeView>
  )
}