import { Stack } from "expo-router";
import { ProfileProvider } from "@/components/ProfileProvider";

export default function RootLayout() {  
  return (
    <ProfileProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ProfileProvider>
  );
}