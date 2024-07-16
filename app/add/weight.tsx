import LoadCSV from "@/components/LoadCSV";
import { useProfileContext } from "@/components/ProfileProvider";
import { ThemedText } from "@/components/ThemedText";
import UnitSelector from "@/components/UnitSelector";
import { KG } from "@/constants/Numbers";
import { Database } from "@/types/Database";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function Page() {
  const profile = useProfileContext();
  const [kg, useKG] = useState<boolean>(profile.useKG);
  const [value, setValue] = useState<number>(0);

  const theme = useTheme();
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ title: 'Add Weight' })
  }, [nav]);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
        <LoadCSV kg={kg} onSubmit={async (r) => {
          await Database.getInstance().addWeightFromCSV(r);
          nav.goBack();
        }}/>
        <ThemedText>Or</ThemedText>
        <TextInput 
          placeholder="150"
          placeholderTextColor={'#888'}
          onChange={(e) => setValue(Number(e.nativeEvent.text))}
          style={{ ...styles.textInput, backgroundColor: theme.colors.card, color: theme.colors.text }}
        />
        <UnitSelector 
          initialIndex={kg ? 1 : 0}
          unitList={['lb', 'kg']} 
          onPress={(i) => useKG(i === 1)}
          textOnly
          fontSize={25}
        />
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} 
            onPress={async () => { 
              await Database.getInstance().addWeight(kg ? value : value * KG); 
              nav.goBack(); 
            }}>
            <ThemedText>Save</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 10
  },
  link: {
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: { 
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  textInput: {
    width: 150,
    borderRadius: 5,
    padding: 10,
    fontSize: 35,
    textAlign: 'center'
  }
});