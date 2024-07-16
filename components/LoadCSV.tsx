import { Pressable, StyleSheet } from "react-native"
import { ThemedText } from "./ThemedText"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { useState } from "react"
import * as ScopedStorage from "react-native-scoped-storage"
import { KG } from "@/constants/Numbers"

type LoadCSVProps = {
  onSubmit: (rows: { value: number, ts: Date }[]) => void,
  kg: boolean
}

export default function LoadCSV(props: LoadCSVProps) {
  const theme = useTheme();
  const [state, setState] = useState<string>('Import CSV')

  const getFileContent = async () => {
    const data = await ScopedStorage.openDocument(true);
    if(data == null) { return; }
    setState('Saving File Data...');
    let rows_strings = data.data?.split('\n');
    let rows = rows_strings.map((s, i) => { 
      let v = s.split(','); 
      let n = Number(v[1]);
      let d = v[0].split('/').map(i => Number(i));
      let obj = { 
        value: props.kg ? n : n * KG, 
        ts: new Date(d[2], d[0] - 1, d[1])
      }
      
      return obj;
    });
    props.onSubmit(rows);
  };

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      // borderWidth: 2,
      // borderColor: theme.colors.text,
      // borderRadius: 5,
      padding: 10
    }
  })

  return (
    <Pressable onPress={getFileContent} style={styles.button}>
      <ThemedText>{state}</ThemedText>
      <Ionicons color={theme.colors.text} size={20} name="download-outline"/>
    </Pressable>
  )
}