import { ProfileData } from "@/types/Profile";
import { ThemedText } from "./ThemedText";
import DatePicker from 'react-native-date-picker'
import { useTheme } from "@react-navigation/native";
import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useRef, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import UnitSelector from "./UnitSelector";
import { CM } from "@/constants/Numbers";

export type ProfileSetupProps = {
  onSubmit: (profile: ProfileData) => void
}

export default function ProfileSetup(props: ProfileSetupProps) {
  const theme = useTheme();
  const element = useRef<ScrollView>(null);

  const [date, setDate] = useState<Date>(new Date);
  const scroll = (page: number) => {
    element.current?.scrollTo({
      x: page * Dimensions.get('window').width
    });
  }

  const [height, setHeight] = useState<number>(0);
  const [cm, useCM] = useState<number>(0);

  const [male, setMale] = useState<number>(0);

  const onSubmit = () => {
    props.onSubmit({ 
      birthday: date.getTime(), 
      height: cm ? height : height * CM,
      male: male === 0
    });
  }

  return (
    <ScrollView
      ref={element}
      horizontal={true}
      pagingEnabled={true}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    >
      <Page>
        <ThemedText type="title">Birthday</ThemedText>
        <DatePicker 
          onDateChange={setDate}
          date={date} 
          mode="date"
          dividerColor={theme.colors.text}
        />
        <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} onPress={() => { scroll(1) }}>
          <ThemedText>Next</ThemedText>
        </Pressable>
      </Page>
      <Page>
        <ThemedText type="title">Height</ThemedText>
        <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
          <TextInput 
            placeholder="70"
            placeholderTextColor={'#888'}
            onChange={(e) => setHeight(Number(e.nativeEvent.text))}
            style={{ ...styles.textInput, backgroundColor: theme.colors.card, color: theme.colors.text }}
          />
          <UnitSelector 
            unitList={['in', 'cm']} 
            onPress={useCM}
            textOnly
            fontSize={25}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Pressable style={{ ...styles.button, backgroundColor: theme.colors.card }} onPress={() => { scroll(0) }}>
            <ThemedText>Back</ThemedText>
          </Pressable>
          <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} onPress={() => { scroll(2) }}>
            <ThemedText>Next</ThemedText>
          </Pressable>
        </View>
      </Page>
      <Page>
        <ThemedText type="title">Gender</ThemedText>
        <View style={{ padding: 20, width: 250 }}>
          <UnitSelector
            unitList={['Male', 'Female']}
            onPress={setMale}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Pressable style={{ ...styles.button, backgroundColor: theme.colors.card }} onPress={() => { scroll(1) }}>
            <ThemedText>Back</ThemedText>
          </Pressable>
          <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} onPress={onSubmit}>
            <ThemedText>Done</ThemedText>
          </Pressable>
        </View>
      </Page>
    </ScrollView>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ 
      width: Dimensions.get('window').width,
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  textInput: {
    width: 150,
    borderRadius: 5,
    padding: 10,
    fontSize: 35,
    textAlign: 'center'
  }
})