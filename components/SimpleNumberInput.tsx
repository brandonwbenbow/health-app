import { useTheme } from "@react-navigation/native";
import { LegacyRef, Ref, RefObject, useEffect, useState } from "react";
import { DimensionValue, Pressable, StyleSheet, View, ViewStyle, Text } from "react-native";
import { ThemedText } from "./ThemedText";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";

export type SimpleNumberInputProps = {
  initialValue?: number,
  prefix?: string,
  suffix?: string,
  height?: DimensionValue | undefined,
  width?: DimensionValue | undefined,
  borderRadius?: number,
  fontSize?: number,
  onPress?: (value: number) => void,
  additionalAdder?: number,
  withEffect?: boolean,
  horizontal?: boolean,
  style?: ViewStyle,
  max?: number,
  min?: number,
  ref?: any,
  onConversion?: (v: number) => number
  decimalPoints?: number
}

const SimpleNumberInput = React.forwardRef((props: SimpleNumberInputProps, ref: LegacyRef<Text> | undefined) => {
  const [value, setValue] = useState<number>(props.initialValue ?? 0);
  const theme = useTheme();

  useEffect(() => {
    setValue(props?.initialValue ?? value);
  }, [props.initialValue])

  useEffect(() => {
    props.onPress?.(value);
  }, [value]);

  const onPress = (v: number) => {
    setValue(Math.min(props.max ?? Infinity, Math.max(props.min ?? 0, v)));
  }

  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      padding: props.horizontal ? 0 : 10,
      justifyContent: 'center',
      alignItems: 'center',
      flex: props.horizontal ? 0 : 1,
      minWidth: props.horizontal ? 30 : 0
    },
    buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 25
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 2,
    },
    valueText: {
      textAlign: 'center',
      lineHeight: props.fontSize ?? 30,
      fontSize: props.fontSize ?? 30,
      padding: 10,
      paddingTop: (props.fontSize ?? 30) * 0.2 + 10,
      color: theme.colors.text,
      flex: props.horizontal ? 1 : 0
    }
  })

  const firstPressableSection = () => {
    let content = [
      <Pressable 
        onPress={(e) => { e.stopPropagation(); onPress(value + (props.horizontal ? -1 : 1)); }}
        style={{ 
          borderTopLeftRadius: props.horizontal ? 0 : props.borderRadius ?? 10, 
          borderTopRightRadius: props.additionalAdder ? 0 : props.borderRadius ?? 10,
          ...styles.button
        }}
      >
        {/* <ThemedText numberOfLines={1} style={styles.buttonText}>+</ThemedText> */}
        {
          props.horizontal ?
          <Feather name="chevron-left" size={24} color={theme.dark ? 'white' : 'black'} />
          :
          <Feather name="chevron-up" size={24} color={theme.dark ? 'white' : 'black'} />
        } 
      </Pressable>,
      props.additionalAdder ? <Pressable 
        onPress={(e) => { e.stopPropagation(); let v = props.additionalAdder ?? 0; onPress(value + (props.horizontal ? v * -1 : v)); }}
        style={{ 
          borderTopRightRadius: props.horizontal ? 0 : props.borderRadius ?? 10,
          borderTopLeftRadius: props.horizontal ? props.borderRadius ?? 10 : 0,
          borderBottomLeftRadius: props.horizontal ? props.borderRadius ?? 10 : 0,
          ...styles.button
        }}
      >
        {/* <ThemedText numberOfLines={1} style={styles.buttonText}>+ {props.additionalAdder}</ThemedText> */}
        {
          props.horizontal ?
          <Feather name="chevrons-left" size={24} color={theme.dark ? 'white' : 'black'} />
          :
          <Feather name="chevrons-up" size={24} color={theme.dark ? 'white' : 'black'} />
        } 
      </Pressable> : <></>
    ];

    return props.horizontal ? content.reverse() : content;
  }

  return (
    <View style={{ ...props.style, height: props.height, width: props.width, flexDirection: props.horizontal ? "row" : "column" }}>
      <View style={styles.buttonRow}>
        {firstPressableSection()}
      </View>
      <Text ref={ref} style={styles.valueText}>
        {props.prefix}
        {props.onConversion?.(value) ?? value}
        {props.suffix}
      </Text>
      <View style={styles.buttonRow}>
        <Pressable
          onPress={(e) => { e.stopPropagation(); onPress(value - (props.horizontal ? -1 : 1)); }}
          style={{ 
            borderBottomLeftRadius: props.horizontal ? 0 : props.borderRadius ?? 10,
            borderBottomRightRadius: props.additionalAdder ? 0 : props.borderRadius ?? 10,
            ...styles.button
          }}
        >
          {/* <ThemedText numberOfLines={1} style={styles.buttonText}>-</ThemedText> */}
          
          {
            props.horizontal ?
            <Feather name="chevron-right" size={24} color={theme.dark ? 'white' : 'black'} />
            :
            <Feather name="chevron-down" size={24} color={theme.dark ? 'white' : 'black'} />
          } 
        </Pressable>
        { props.additionalAdder ? <Pressable 
          onPress={(e) => { e.stopPropagation(); let v = props.additionalAdder ?? 0; onPress(value - (props.horizontal ? v * -1 : v)); }}
          style={{ 
            borderBottomRightRadius: props.borderRadius ?? 10,
            borderTopRightRadius: props.horizontal ? props.borderRadius ?? 10 : 0, 
            ...styles.button
          }}
        >
          {/* <ThemedText numberOfLines={1} style={styles.buttonText}>- 10</ThemedText> */}
          {
            props.horizontal ?
            <Feather name="chevrons-right" size={24} color={theme.dark ? 'white' : 'black'} />
            :
            <Feather name="chevrons-down" size={24} color={theme.dark ? 'white' : 'black'} />
          }  
        </Pressable> : <></> }
      </View>
    </View>
  )
});

export default SimpleNumberInput;