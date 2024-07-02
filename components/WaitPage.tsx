import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"

export type WaitPageProps = {
  wait: boolean,
  children?: React.ReactNode
}

export default function WaitPage(props: WaitPageProps) {
  // useEffect(() => {}, [props.wait]);

  return !props.wait ? 
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator />
  </View>
  :
  <>{props.children}</>
}