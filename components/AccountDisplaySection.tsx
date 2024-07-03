import { Database, LocalStorage } from "@/constants/Database";
import { Profile } from "@/constants/Profile";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import SectionButton from "./SectionButton";
import { useNavigation } from "expo-router";
import { CommitChartComponent } from "./Chart";

export default function AccountDisplaySection() {
  const [user, setUser] = useState<Profile | null>();
  const [state, setState] = useState<{ weight?: boolean, heart?: boolean, water?: boolean, sleep?: boolean }>();
  const [commit, setCommit] = useState<{ weight?: boolean[], heart?: boolean[], water?: boolean[], sleep?: boolean[] }>({});

  const nav = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new Profile(data))
    });

    const refresh = () => {
      Database.getInstance().getLatestTimestampFromAllTables().then((results: any[]) => {
        setState({ 
          weight: results?.[0]?.length > 0 ? true : false,
          heart: results?.[1]?.length > 0 ? true : false,
          water: results?.[2]?.length > 0 ? true : false,
          sleep: results?.[3]?.length > 0 ? true : false
        })
      });

      Database.getInstance().getLastWeekForAllTables().then((results) => {
        setCommit(results);
      });
    }

    nav.addListener('focus', () => {
      refresh();
    });

    return nav.removeListener('focus', () => {});
  }, []);

  const getDateString = () => {
    let d = new Date();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return days[d.getDay()];
  }

  return (
    <View style={{ minHeight: 140, gap: 10 }}>
      <View style={{ ...styles.row, padding: 5 }}>
        <View style={{ ...styles.row, gap: 5, alignItems: "center" }}>
          <Ionicons name="today" size={20} color={theme.colors.text}/>
          <ThemedText type="subtitle">{getDateString()}</ThemedText>
        </View>
        <View style={{ ...styles.row, flex: 1, justifyContent: "flex-end", padding: 5, gap: 10, flexWrap: "wrap" }}>
          <Ionicons name={state?.weight ? "scale" : "scale-outline"} size={15} color={theme.colors.text}/>
          <Ionicons name={state?.heart ? "heart" : "heart-outline"} size={15} color={theme.colors.text}/>
          <Ionicons name={state?.water ? "water" : "water-outline"} size={15} color={theme.colors.text}/>
          <Ionicons name={state?.sleep ? "bed" : "bed-outline"} size={15} color={theme.colors.text}/>
        </View>
      </View>
      <View>
        <View style={{ ...styles.row, gap: 5, padding: 5, alignItems: "center" }}>
          <Ionicons name="calendar" size={20} color={theme.colors.text}/>
          <ThemedText type="subtitle">Past Week</ThemedText>
        </View>
        <CommitChartComponent data={commit}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: "center"
  },
  title: {
    fontSize: 25, 
    lineHeight: 30
  }
})