import { ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import ThemedSafeView from "./ThemedSafeView"

export type PageViewProps = {
  style?: ViewStyle,
  children?: React.ReactNode,
  scroll?: boolean
}

export default function PageView(props: PageViewProps) {
  return (
    <ThemedSafeView>
      {
        props.scroll ? 
        <ScrollView style={styles.scroll}>
          <View style={{ ...styles.page, ...props.style }}>
            {props.children}
          </View>
        </ScrollView>
        :
        <View style={{ ...styles.page, ...props.style }}>
          {props.children}
        </View>
      }
    </ThemedSafeView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 10
  },
  scroll: {
    flex: 1, 
    gap: 10
  }
});