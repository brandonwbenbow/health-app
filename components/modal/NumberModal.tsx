import { Dimensions, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";

import ModalBase from "./ModalBase";

export type NumberModalProps = {
  transparent?: boolean,
  visible?: boolean,
  children?: React.ReactNode,
  style?: ViewStyle,
  onSubmit?: Function
}

export default function NumberModal(props: any) {
  const [modalVisible, setVisible] = useState<boolean>(props.visible ?? false);
  const theme = useTheme()

  return (
    <>
      <ModalBase
        onViewPress={() => setVisible(false)}
        visible={modalVisible}
        onRequestClose={() => { setVisible(false) }}
      >
        <View style={{ gap: 20, padding: 20, backgroundColor: '#000000aa', borderRadius: 10 }}>
          <TextInput
            onSubmitEditing={(e) => {
              props.onSubmit?.(e);
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
        </View>
      </ModalBase>
      <Pressable style={props.style} onPress={() => setVisible(true)}>
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
})