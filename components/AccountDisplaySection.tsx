import { Database, LocalStorage } from "@/constants/Database";
import { User } from "@/constants/User";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import SectionButton from "./SectionButton";

export default function AccountDisplaySection() {
  const [user, setUser] = useState<User | null>();
  const [state, setState] = useState<{ weight?: boolean, heart?: boolean }>();

  const theme = useTheme();

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new User(data))
    });

    Database.getInstance().query(
      `SELECT datetime(ts, 'localtime') FROM weights WHERE DATE(ts, 'localtime') = DATE('now', 'localtime')`
    ).then((output) => {
      setState({ ...state, weight: output?.length > 0 })
    })
  }, [])

  return (
    <View style={{ ...styles.row, padding: 20, paddingTop: 20, paddingBottom: 0 }}>
      <View style={{ flex: 2, gap: 10 }}>
        <ThemedText style={styles.title}>Hi{(user?.getData()?.name) ? `, ${user.getData().name}` : ''}</ThemedText>
        <View style={{ ...styles.row, gap: 10 }}>
          <Ionicons name={state?.weight ? "scale" : "scale-outline"} size={15} color={theme.colors.text}/>
          <Ionicons name={state?.heart ? "heart" : "heart-outline"} size={15} color={theme.colors.text}/>
        </View>
        <SectionButton 
          href="/account" 
          title={user?.getData()?.name ? "Profile" : "Create Profile"} 
          style={{ flex: 0, minHeight: 0, padding: 15, borderColor: theme.colors.text, borderWidth: 2, backgroundColor: "transparent" }}
          textStyle={{ fontSize: 20, lineHeight: 25 }}
          linkStyle={{ paddingLeft: 0, flex: 0 }}
          align="center"
        />
      </View>
      <View style={{ justifyContent: "center", flex: 1 }}>
        {/* <Ionicons name="person-outline" size={80} color={theme.colors.text}/> */}
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