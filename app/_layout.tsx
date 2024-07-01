import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { Stack, useNavigation } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useEffect, useRef, useState } from "react";
import { Profile } from "@/constants/Profile";
import { LocalStorage } from "@/constants/Database";
import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import SimpleNumberInput from "@/components/SimpleNumberInput";
import UnitSelector from "@/components/UnitSelector";
import { METER } from "@/constants/Numbers";

export default function RootLayout() {
  const [user, setUser] = useState<Profile | null>();
  
  const nav = useNavigation();
  const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  SystemUI.setBackgroundColorAsync(theme.colors.background);

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new Profile(data))
    });
  }, [])

  return (
    <ThemeProvider
      value={theme}>
        {
          !user?.isValid() ? 
          <CreateAccount /> 
          :
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        }
    </ThemeProvider>
  );

  type AccountCreationState = {
    height?: number, // cm
    targetWeight?: number, // kg
  }

  function CreateAccount() {
    const [state, setState] = useState<AccountCreationState>();
    const [page, setPage] = useState<number>(0);
    const [useUSUnit, setUSUnit] = useState<boolean>(false);

    var scroll: ScrollView | null;
    var refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

    const pagePadding = 10;
    const pages = 2;
    const onPress = async (toPage: number) => {
      // refs.forEach((r, i) => {
      //   let obj = r?.current?.state;
      //   let keys = Object.keys(obj ?? {});
      //   keys.forEach((k) => console.log(k));
      // });

      if(toPage >= pages) { 
        // let user = new Profile(state);
        // if(user.isValid()) {
        //   await LocalStorage.setJSON('user', user.getData());
        //   setUser(user);
        // }

        return;
      }

      setPage(toPage);
    }

    const onHeightPress = (big: number | null, small: number | null) => {

    }

    const onUnitChange = (usa: boolean) => {
      setUSUnit(usa);
    }

    useEffect(() => {
      scroll?.scrollTo({x: page * Dimensions.get('window').width - pagePadding * 2});
      if(page == pages - 1) {  }
    }, [page]);

    const styles = StyleSheet.create({
      input: {
        color: theme.colors.text,
        fontSize: 22,
        padding: 10
      },
      slide: {
        width: Dimensions.get('window').width - pagePadding * 2,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        padding: 40
      },
      button: { 
        flex: 1,
        gap: 20,
        padding: 20, 
        backgroundColor: theme.colors.primary, 
        borderRadius: 10, 
        alignItems: "center"
      }
    });

    return (
      <ThemedSafeView style={{ padding: pagePadding, flex: 1, gap: 20 }}>
        <ScrollView
          horizontal
          pagingEnabled
          scrollEnabled={false}
          ref={(ref) => scroll = ref}
        >
          <View style={styles.slide}>
            <UnitSelector
              unitList={['ft', 'm']}
              onPress={(i) => { onUnitChange(i == 0) }}
              style={{ minWidth: '100%' }}
              fontSize={30}
              textOnly
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <SimpleNumberInput
                initialValue={useUSUnit ? 6 : 1}
                fontSize={40}
                withEffect
                style={{ flex: 2 }}
              />
              <SimpleNumberInput
                initialValue={useUSUnit ? 0 : 80}
                fontSize={40}
                additionalAdder={useUSUnit ? undefined : 10}
                style={{ flex: 3 }}
                withEffect
                max={useUSUnit ? 11 : 99}
              />
            </View>
          </View>
          <View style={styles.slide}>
            <TextInput
              onChange={(e) => setState({ ...state, targetWeight: Number(e.nativeEvent.text) })}
              placeholder="Target Weight"
              placeholderTextColor={theme.colors.text}
              keyboardType="numeric"
              style={styles.input} 
            />
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {
            page > 0 ?  
            <Pressable onPress={() => { onPress(page - 1); }} style={styles.button}>
              <ThemedText>Back</ThemedText>
            </Pressable> : <></>
          }
          <Pressable onPress={() => { onPress(page + 1); }} style={styles.button}>
            <ThemedText>{page == pages - 1 ? 'Submit' : 'Next'}</ThemedText>
          </Pressable>
        </View>
      </ThemedSafeView>
    )
  }
}