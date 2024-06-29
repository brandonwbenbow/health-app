import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Pressable, FlexStyle, ViewStyle, GestureResponderEvent, StyleProp, TextStyle, DimensionValue } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { useRouter } from 'expo-router';
import { ExpoRouter } from 'expo-router/types/expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type SectionButtonProps = {
  href: ExpoRouter.Href,
  title: string,
  bg?: string,
  icon?: keyof typeof Ionicons.glyphMap,
  reverse?: boolean,
  align?: FlexStyle['justifyContent'],
  style?: ViewStyle,
  textStyle?: StyleProp<TextStyle>,
  linkStyle?: ViewStyle,
  width?: DimensionValue | undefined,
  params?: { [field: string]: any }
}

export default function SectionButton(props: SectionButtonProps) {
  const theme = useTheme();
  const router = useRouter();

  const color = props.style?.backgroundColor?.toString() ?? theme.colors.primary;
  const onNavigate = (event: GestureResponderEvent) => {
    theme.colors.primary = color,
    router.push({ 
      pathname: props.href as string, 
      params: { title: props.title, ...props.params }
    });
  }

  const contents = [
    props.icon ? 
      <Ionicons key={0} name={props.icon} size={30} color={theme.colors.text} /> 
      : null,
    <ThemedText key={1} style={{ ...styles.text, ...props.textStyle as ViewStyle }}>{props.title}</ThemedText>
  ];

  return (
    <Pressable style={{ ...styles.link, ...props.linkStyle }} onPress={onNavigate}>
      <ThemedView style={{
        ...styles.container,
        ...props.style,
        width: props.width === null ? undefined : props.width ? props.width : "100%",
        justifyContent: props.align ? props.align : props.reverse ? 'flex-end' : 'flex-start'
      }}>
        { props.reverse ? contents.reverse() : contents }
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    display: 'flex',
    padding: 10
  },
  container: {
    padding: 25,
    minHeight: 80,
    // flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10
  },
  text: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  }
});
