import { Profile } from "@/types/Profile";
import { useProfileContext } from "./ProfileProvider";
import { Weight } from "@/types/Weight";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@react-navigation/native";

export function CurrentStats(props: { kilo: number | undefined }) {
  const theme = useTheme();
  const profile = useProfileContext();
  const prof = new Profile(profile);
  const weight = new Weight(props.kilo);
  const bmi = prof.calculateBMI(weight);

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 5,
      borderRadius: 5
    },
    text: {
      flex: 1, 
      fontWeight: 'bold'
    }
  });

  return (props.kilo == undefined ? <></> :
    <View>
      <View style={styles.row}>
        <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Weight:</ThemedText>
        <ThemedText>{weight.toString(profile?.useKG)}</ThemedText>
      </View>
      <View style={{ ...styles.row, backgroundColor: 'transparent' }}>
        <ThemedText style={styles.text}>BMI:</ThemedText>
        <ThemedText style={{ color: prof.getBMIColor(Number(bmi)) }}>{bmi}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.text}>BMR:</ThemedText>
        <ThemedText>{Math.round(Number(prof.calculateBMR(weight)))} kcal</ThemedText>
      </View>
    </View>
  )
}