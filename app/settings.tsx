import PageView from "@/components/PageView";
import { useProfileContext, useProfileDispatchContext } from "@/components/ProfileProvider";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@react-navigation/native";
import { Alert, Button, View } from "react-native";
import { Profile } from "@/types/Profile";
import { Database } from "@/types/Database";
import { useEffect, useState } from "react";
import { Weight } from "@/types/Weight";
import { useNavigation } from "expo-router";
import UnitSelector from "@/components/UnitSelector";

export default function Page() {
  const theme = useTheme();
  const profile = new Profile(useProfileContext());
  const saveProfile = useProfileDispatchContext();

  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ title: 'Settings' })
  }, [nav])

  const [weight, setWeight] = useState<Weight>();
  useEffect(() => {
    Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights ORDER BY ts desc LIMIT ? OFFSET ?`,
      [1, 0]
    ).then((output) => { setWeight(new Weight(output?.[0]?.value ?? 0)); });
  }, [])

  const clearDB = () => {
    Database.getInstance().resetDatabase();
  }

  const check = (title: string, callback: Function) => {
    Alert.alert(title, "Are you sure?", [
      {text: 'Cancel', onPress: () => {}, style: "cancel"},
      {text: 'OK', onPress: () => callback() }
    ])
  }

  function DataSquare(props: { children: React.ReactNode }) {
    return (
      <View style={{ 
        flexDirection: 'column', 
        padding: 15, 
        borderRadius: 5, 
        backgroundColor: theme.colors.card,
        alignItems: 'center'
      }}>
        {props.children}
      </View>
    )
  }

  return (
    <View style={{ gap: 10, flex: 1, padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ThemedText style={{ flex: 1 }} type="subtitle">Weight Unit</ThemedText>
        <UnitSelector
          initialIndex={profile.getData().useKG ? 1 : 0}
          unitList={['lb', 'kg']}
          onPress={(i) => { let d = profile.getData(); d.useKG = (i === 1); saveProfile(d); }}
          textOnly
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {/* <DataSquare>
          <ThemedText type="subtitle">{profile.getHeightString()}</ThemedText>
          <ThemedText>Height</ThemedText>
        </DataSquare>
        <DataSquare>
          <ThemedText type="subtitle">{profile.getHeightString()}</ThemedText>
          <ThemedText>Height</ThemedText>
        </DataSquare> */}
      </View>
      <View style={{ flex: 1 }}></View>
      <Button title='Delete Profile' onPress={() => { check("Delete Profile", () => saveProfile({})) }} />
      <Button title='Clear Database' onPress={() => { check("Clear Database", clearDB) }} />
    </View>
  )
}