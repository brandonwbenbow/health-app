import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"

export type WaitPageProps = {
  wait: boolean,
  children?: React.ReactNode,
  size?: number | "small" | "large" | undefined
}

export default function WaitView(props: WaitPageProps) {
  // useEffect(() => {}, [props.wait]);

  return !props.wait ? 
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size={props.size} />
  </View>
  :
  <>{props.children}</>
}