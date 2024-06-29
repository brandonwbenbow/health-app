import { GestureResponderEvent, Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";

export type ModalBaseProps = {
  animationType?: string
  transparent?: boolean,
  visible?: boolean,
  children?: React.ReactNode,
  style?: ViewStyle,
  onRequestClose?: Function,
  onViewPress?: Function
}

export default function ModalBase(props: any) {
  const theme = useTheme();

  return (
    <Modal
      animationType={props.animationType ?? 'slide'}
      transparent={props.transparent ?? true}
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <Pressable style={{ ...styles.container, ...props.style }} onPress={props.onViewPress}>
        {props.children}
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#000000aa'
  }
});