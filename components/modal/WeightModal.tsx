import { Dimensions, GestureResponderEvent, Modal, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

import { ThemedText } from "../ThemedText";
import ModalBase from "./ModalBase";
import DatePicker from "react-native-date-picker";
import { NumberModalProps } from "./NumberModal";
import { KG } from "@/constants/Numbers";
import SimpleNumberInput from "../SimpleNumberInput";
import UnitSelector from "../UnitSelector";

export type WeightModalProps = NumberModalProps & {
  addWeight: Function,
  startLb: boolean,
  initalValue: number
}

export default function WeightModal(props: WeightModalProps) {
  const [modalVisible, setVisible] = useState<boolean>(props.visible ?? false);
  const [useLb, setUseLb] = useState<boolean>(props.startLb);

  const [value, setValue] = useState<number>(0);
  const [decimal, setDecimal] = useState<number>(0);

  const theme = useTheme();

  const onSubmit = () => {
    let num = Number(value + decimal / 10);
    if(useLb) { num = num * KG }
    props.addWeight(num);
  }

  useEffect(() => {
    setUseLb(props.startLb);
  }, [props.startLb])

  useEffect(() => {
    let initial = props.startLb ? props.initalValue / KG : props.initalValue;
    let value = Math.floor(initial);
    setValue(value);
    setDecimal(Math.round((initial - value) * 10));
  }, [props.initalValue, props.startLb]);

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
          <View style={{ flexDirection: "row", gap: 3 }}>
            <SimpleNumberInput
              initialValue={value}
              width={100}
              additionalAdder={10}
              onPress={setValue}
            />
            <SimpleNumberInput
              initialValue={decimal}
              width={50}
              prefix="."
              max={9}
              onPress={setDecimal}
            />
          </View>
          <UnitSelector 
            unitList={["LB", "KG"]}
            initialIndex={useLb ? 0 : 1}
            onPress={(index) => setUseLb(index == 0)}
          />
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

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 50,
    minWidth: Dimensions.get('window').width / 3,
    minHeight: Dimensions.get('window').width / 4
  },
  toggle: { 
    flexDirection: 'row', 
    alignItems: "center" 
  },
  togglePill: { 
    flex: 1, 
    alignItems: "center",
    padding: 5
  }
});