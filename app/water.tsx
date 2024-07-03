import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";


export default function WaterPage() {
  const nav = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Water", headerBackVisible: false })
  }, [nav])

  const Header = () => {
    return (
      <View style={{ ...styles.titleContainer }}>
        <Ionicons name='water' size={30} color={theme.colors.text} />
        <ThemedText style={styles.title}>Water</ThemedText>
      </View>
    )
  }

  return (
    <ThemedSafeView style={{ ...styles.container, backgroundColor: theme.colors.primary }}>
      <Header />
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText>Water Page</ThemedText>
        <ThemedText>TODO</ThemedText>
      </ThemedView>
    </ThemedSafeView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    gap: 10
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  }
})