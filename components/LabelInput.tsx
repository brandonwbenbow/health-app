import { useTheme } from "@react-navigation/native";
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

export type LabelTextProps = {
  label: string,
  style?: ViewStyle
}

export default function LabelText(props: LabelTextProps) {
  const theme = useTheme();

  return (
    <View>
      <ThemedText>{props.label}</ThemedText>
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.text,
          ...props.style
        }}
      />
    </View>
  )
}