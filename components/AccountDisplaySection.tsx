import { Database, LocalStorage } from "@/constants/Database";
import { Profile } from "@/constants/Profile";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import SectionButton from "./SectionButton";
import { useNavigation } from "expo-router";

export default function AccountDisplaySection() {
  const [user, setUser] = useState<Profile | null>();
  const [state, setState] = useState<{ weight?: boolean, heart?: boolean }>();

  const nav = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new Profile(data))
    });

    const refresh = () => {
      Database.getInstance().query(
        `SELECT datetime(ts, 'localtime') FROM weights WHERE DATE(ts, 'localtime') = DATE('now', 'localtime')`
      ).then((output) => {
        setState({ ...state, weight: output?.length > 0 })
      })
    }

    nav.addListener('focus', () => {
      refresh();
    });

    return nav.removeListener('focus', () => {});
  }, []);

  return (
    <View style={{ ...styles.row, padding: 10, paddingTop: 20, paddingBottom: 0, minHeight: 140 }}>
      <View style={{ flex: 2, gap: 10 }}>
        <View style={{ ...styles.row, gap: 10, flexWrap: "wrap" }}>
          <Ionicons name={state?.weight ? "scale" : "scale-outline"} size={15} color={theme.colors.text}/>
          <Ionicons name={state?.heart ? "heart" : "heart-outline"} size={15} color={theme.colors.text}/>
        </View>
      </View>
      <View style={{ justifyContent: "flex-end", alignItems: "flex-end", flex: 1 }}>
        {/* <Ionicons name="person-outline" size={80} color={theme.colors.text}/> */}
        <SectionButton 
          href="/account" 
          title={user?.isValid() ? "Profile" : "Create Profile"} 
          style={{ flex: 0, minHeight: 0, padding: 15, borderColor: theme.colors.text, borderWidth: 2, backgroundColor: "transparent" }}
          textStyle={{ fontSize: 20, lineHeight: 25, flex: 1, textAlign: "center" }}
          linkStyle={{ flex: 0, padding: 0 }}
          align="center"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 25, 
    lineHeight: 30
  }
})