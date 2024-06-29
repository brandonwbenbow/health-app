import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ThemedSafeView(props: any) {
    const insets = useSafeAreaInsets();
    
    return (
      <ThemedView style={{ ...props.style, paddingTop: insets.top }}>
        {props.children}
      </ThemedView>
    );
}