import { Dimensions, GestureResponderEvent, Modal, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";

import { ThemedText } from "../ThemedText";
import ModalBase from "./ModalBase";

import { readString } from "react-native-csv";

export type ImportModalProps = {
  transparent?: boolean,
  visible?: boolean,
  children?: React.ReactNode,
  style?: ViewStyle,
  onSubmit?: Function
}

export default function ImportModal(props: any) {
  const [modalVisible, setVisible] = useState<boolean>(props.visible ?? false);
  const theme = useTheme()

  const results = (text: string) => {
    let output = readString(text, {});
    return output.data;
  }

  return (
    <>
      <ModalBase
        onViewPress={() => setVisible(false)}
        visible={modalVisible}
        onRequestClose={() => { setVisible(false) }}
      >
        <TextInput
          onSubmitEditing={(e) => {
            props.onSubmit?.(results(e.nativeEvent.text));
            setVisible(false);
          }}
          style={{ 
            ...styles.input, 
            backgroundColor: theme.colors.card,
            color: theme.colors.text
          }}
        />
      </ModalBase>
      <Pressable style={props.style} onPress={() => setVisible(true)}>
        {props.children}
      </Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088'
  },
  input: {
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 50,
    minWidth: Dimensions.get('window').width / 3,
    minHeight: Dimensions.get('window').width / 4
  }
})