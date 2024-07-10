import PageView from "@/components/PageView";
import { useProfileContext, useProfileDispatchContext } from "@/components/ProfileProvider";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@react-navigation/native";
import { Button } from "react-native";
import { Profile } from "@/types/Profile";
import { Database } from "@/types/Database";
import { useEffect, useState } from "react";
import { Weight } from "@/types/Weight";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const theme = useTheme();
  const profile = new Profile(useProfileContext());
  const saveProfile = useProfileDispatchContext();

  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ headerShown: false, title: 'Profile' })
  }, [nav])

  const [weight, setWeight] = useState<Weight>();
  useEffect(() => {
    Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights ORDER BY ts desc LIMIT ? OFFSET ?`,
      [1, 0]
    ).then((output) => { setWeight(new Weight(output?.[0]?.value ?? 0)); });
  }, [])

  return (
    <PageView style={{ gap: 10 }} scroll>
      <ThemedText>Height: {profile.getHeightString()}</ThemedText>
      <ThemedText>Weight: {weight?.toString() ?? 'No Weight Data'}</ThemedText>
      <ThemedText>Goal Weight: {profile.getGoalWeightString()}</ThemedText>
      <ThemedText>Age: {profile.getAge()} Years</ThemedText>
      <ThemedText>BMR: {profile.calculateBMR(weight)} Calories</ThemedText>
      <ThemedText>BMI: {profile.calculateBMI(weight)}</ThemedText>
      <Button title='Delete Profile' onPress={() => { saveProfile({}); }} />
    </PageView>
  )
}