import { Pressable, View } from "react-native"
import { NumberModalProps } from "./NumberModal"
import ModalBase from "./ModalBase"
import { ThemedText } from "../ThemedText"
import SimpleNumberInput from "../SimpleNumberInput"
import { useState } from "react"
import { useTheme } from "@react-navigation/native"


export type PressureModalProps = NumberModalProps & {
  addPressure: Function,
  initalValue?: { upper: number, lower: number }
}


export default function PressureModal(props: PressureModalProps) {
  const [modalVisible, setVisible] = useState<boolean>(props.visible ?? false);

  const [upper, setUpper] = useState<number>(0);
  const [lower, setLower] = useState<number>(0);

  const theme = useTheme();

  const onSubmit = () => {
    props.addPressure(upper, lower);
  }

  return (
    <>
    <ModalBase
      onViewPress={() => setVisible(false)}
      visible={modalVisible}
      onRequestClose={() => { setVisible(false) }}
    >
      <Pressable 
        onPress={(e) => { e.stopPropagation(); }}
        style={{ gap: 20, padding: 20, backgroundColor: theme.colors.background, borderRadius: 10 }}>
        {/* <DatePicker
          date={date}
          onDateChange={setDate}
          mode="date"
          theme={theme.dark ? 'dark' : 'light'}
          dividerColor={theme.colors.primary}
        /> */}
        <View style={{ flexDirection: "column", gap: 3 }}>
          <SimpleNumberInput
            initialValue={upper}
            width={250}
            additionalAdder={10}
            onPress={setUpper}
            horizontal
          />
          <SimpleNumberInput
            initialValue={lower}
            width={250}
            additionalAdder={10}
            onPress={setLower}
            horizontal
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable 
            style={{ 
              flex: 1,
              padding: 10,
              borderRadius: 10,
              justifyContent: "center", 
              alignItems: "center",
              backgroundColor: theme.colors.primary
            }}
            onPress={() => { onSubmit() }}
          >
            <ThemedText>Submit</ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </ModalBase>
    <Pressable style={{ ...props.style, backgroundColor: theme.colors.primary }} onPress={() => setVisible(true)}>
      {props.children}
    </Pressable>
  </>
  )
}