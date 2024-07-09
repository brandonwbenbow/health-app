import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ThemedSafeView(props: any) {
    const paddingTop = useSafeAreaInsets().top;
    const additionalPadding = Number(props?.style?.paddingTop ?? props?.style?.padding ?? 0);

    return (
      <ThemedView style={{ flex: 1, ...props.style, paddingTop: paddingTop + additionalPadding }}>
        {props.children}
      </ThemedView>
    );
}