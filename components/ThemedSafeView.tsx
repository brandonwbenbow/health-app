import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ThemedSafeView(props: any) {
    const insets = useSafeAreaInsets();
    const paddingTop = insets.top + 
      Number(props.style.paddingTop ?? props.style.padding) ?? 0;
    
    return (
      <ThemedView style={{ ...props.style, paddingTop: paddingTop }}>
        {props.children}
      </ThemedView>
    );
}