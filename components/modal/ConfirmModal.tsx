import { Button, Dimensions, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import ModalBase from "./ModalBase";
import { ThemedText } from "../ThemedText";
import { useState } from "react";

export type ConfirmModalProps = {
  report: string,
  response: (value: boolean) => void,
  visible: boolean,
  style?: ViewStyle
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const respond = (value: boolean) => {
    props.response(value);
  }

  return (
    <ModalBase style={{ gap: 10, backgroundColor: '#000000aa' }} visible={props.visible}>
      <ThemedText style={{ ...styles.text, fontSize: 20, lineHeight: 25, paddingBottom: 20 }}>{props.report}</ThemedText>
      <ThemedText style={styles.text}>Are You Sure?</ThemedText>
      <View style={styles.row}>
        <Pressable style={{ ...props.style, ...styles.button }} onPress={() => respond(false)}>
          <ThemedText style={styles.text}>No</ThemedText>
        </Pressable>
        <Pressable style={{ ...props.style, ...styles.button }} onPress={() => respond(true)}>
          <ThemedText style={styles.text}>Yes</ThemedText>
        </Pressable>
      </View>
    </ModalBase>
  )
}

const styles = StyleSheet.create({
  row: {
    minWidth: Dimensions.get("window").width / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
  },
  text: {
    fontWeight: 'bold'
  }
})