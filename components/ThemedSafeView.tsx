import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ThemedSafeView(props: any) {
    const insets = useSafeAreaInsets();
    const paddingTop = insets.top;
    const additionalPadding = Number(props?.style?.paddingTop ?? props?.style?.padding ?? 0);

    return (
      <ThemedView style={{ ...props.style, paddingTop: paddingTop + additionalPadding }}>
        {props.children}
      </ThemedView>
    );
}