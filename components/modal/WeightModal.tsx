import { Dimensions, GestureResponderEvent, Modal, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

import { ThemedText } from "../ThemedText";
import ModalBase from "./ModalBase";
import DatePicker from "react-native-date-picker";
import { NumberModalProps } from "./NumberModal";
import { KG } from "@/constants/Numbers";

export type WeightModalProps = NumberModalProps & {
  addWeight: Function,
  startLb: boolean
}

export default function WeightModal(props: WeightModalProps) {
  const [modalVisible, setVisible] = useState<boolean>(props.visible ?? false);
  const [useLb, setUseLb] = useState<boolean>(props.startLb);

  const theme = useTheme();

  const onSubmit = (e: any) => {
    let value = Number(e.nativeEvent.text);
    if(useLb) { value = value * KG }
    props.addWeight(value);
  }

  useEffect(() => {
    setUseLb(props.startLb);
  }, [props.startLb])

  return (
    <>
      <ModalBase
        onViewPress={() => setVisible(false)}
        visible={modalVisible}
        onRequestClose={() => { setVisible(false) }}
      >
        <View style={{ gap: 20, padding: 20, backgroundColor: '#000000aa', borderRadius: 10 }}>
          {/* <DatePicker
            date={date}
            onDateChange={setDate}
            mode="date"
            theme={theme.dark ? 'dark' : 'light'}
            dividerColor={theme.colors.primary}
          /> */}
          <TextInput
            placeholder="0"
            placeholderTextColor={theme.colors.text}
            onSubmitEditing={(e) => {
              onSubmit(e);
              setVisible(false);
            }}
            keyboardType="numeric"
            style={{ 
              ...styles.input, 
              color: theme.colors.text,
              backgroundColor: theme.colors.card,
              borderRadius: 10
            }}
          />
          <View style={styles.toggle}>
            <Pressable onPress={() => setUseLb(true)} style={{ 
              ...styles.togglePill, 
              backgroundColor: useLb ? theme.colors.primary : theme.colors.card,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}>
              <ThemedText>LB</ThemedText>
            </Pressable>
            <Pressable onPress={() => setUseLb(false)} style={{ 
              ...styles.togglePill,
              backgroundColor: !useLb ? theme.colors.primary : theme.colors.card,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10
            }}>
              <ThemedText>KG</ThemedText>
            </Pressable>
          </View>
        </View>
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