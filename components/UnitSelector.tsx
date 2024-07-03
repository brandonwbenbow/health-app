import { DimensionValue, Pressable, StyleSheet, View, ViewStyle } from "react-native"
import { ThemedText } from "./ThemedText"
import { useEffect, useState } from "react"
import React from "react"
import { useTheme } from "@react-navigation/native"

export type UnitSelectorProps = {
  unitList: string[],
  onPress?: (index: number) => void,
  height?: DimensionValue | undefined,
  width?: DimensionValue | undefined,
  textOnly?: boolean,
  initialIndex?: number,
  fontSize?: number,
  style?: ViewStyle,
  index?: number
}

export default function UnitSelector(props: UnitSelectorProps) {
  const theme = useTheme();
  const [index, setIndex] = useState<number>(
    props.initialIndex && props.initialIndex <= props.unitList?.length - 1 ? props.initialIndex : 0
  );

  useEffect(() => {
    setIndex(props?.index ?? index);
  }, [props.index]);

  const styles = StyleSheet.create({
    text: {
      fontSize: props.fontSize ?? 20,
      lineHeight: props.fontSize ?? 20,
    },
    container: {
      ...props.style, 
      height: props.height, 
      width: props.width, 
      gap: props.textOnly ? 10 : 0, 
      flexDirection: 'row', 
      alignItems: 'center'
    },
  });

  return (
    <View style={styles.container}>
      {props.unitList.map((u, i) =>
        <React.Fragment key={i}>
          <Pressable 
            style={{
              flex: props.textOnly ? 0 : 1,
              justifyContent: "center",
              alignItems: "center",
              padding: props.textOnly ? 0 : 10,
              borderTopLeftRadius: i == 0 ? 10 : 0,
              borderBottomLeftRadius: i == 0 ? 10 : 0,
              borderTopRightRadius: i == props.unitList.length - 1 ? 10 : 0,
              borderBottomRightRadius: i == props.unitList.length - 1 ? 10 : 0,
              backgroundColor: !props.textOnly ? index == i ? theme.colors.primary : theme.colors.card : 'transparent'
            }}
            onPress={() => { setIndex(i); props.onPress?.(i); }}>
            <ThemedText style={{ ...styles.text, opacity: index == i ? 1 : 0.5 }}>{u}</ThemedText>
          </Pressable>
          { props.textOnly && i < props.unitList.length - 1 ? 
            <ThemedText style={{ ...styles.text, opacity: 0.5 }}>/</ThemedText> 
            : null
          }
        </React.Fragment>
      )}
    </View>
  )
}
