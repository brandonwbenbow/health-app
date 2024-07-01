import { DimensionValue, Pressable, StyleSheet, View, ViewStyle } from "react-native"
import { ThemedText } from "./ThemedText"
import { useState } from "react"

export type UnitSelectorProps = {
  unitList: string[],
  onPress?: (index: number) => void,
  height?: DimensionValue | undefined,
  width?: DimensionValue | undefined,
  textOnly?: boolean,
  initialIndex?: number,
  fontSize?: number,
  style?: ViewStyle
}

export default function UnitSelector(props: UnitSelectorProps) {
  const [index, setIndex] = useState<number>(
    props.initialIndex && props.initialIndex < props.unitList?.length - 1 ? props.initialIndex : 0
  );

  const styles = StyleSheet.create({
    text: {
      fontSize: props.fontSize ?? 20,
      lineHeight: props.fontSize ?? 20,
      padding: 5
    },
    container: {
      ...props.style, 
      height: props.height, 
      width: props.width, 
      gap: 5, 
      flexDirection: 'row', 
      alignItems: 'center'
    }
  })

  return (
    <View style={styles.container}>
      {props.unitList.map((u, i) =>
        <>
          <Pressable onPress={() => { setIndex(i); props.onPress?.(i); }}>
            <ThemedText style={{ ...styles.text, opacity: index == i ? 1 : 0.5 }}>{u}</ThemedText>
          </Pressable>
          { props.textOnly && i < props.unitList.length - 1 ? 
            <ThemedText style={{ ...styles.text, opacity: 0.5 }}>/</ThemedText> 
            : <></> 
          }
        </>
      )}
    </View>
  )
}