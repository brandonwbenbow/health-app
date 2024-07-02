import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState, Children } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { ThemedText } from "./ThemedText";
import UnitSelector from "./UnitSelector";
import SimpleNumberInput from "./SimpleNumberInput";
import { useNavigation, useRouter } from "expo-router";
import { Profile } from "@/constants/Profile";
import { KG, METER } from "@/constants/Numbers";

export type ProfileSetupProps = {
  onSubmit: (profile: Profile) => void
}

export default function ProfileSetup(props: ProfileSetupProps) {
  const theme = useTheme();
  const nav = useNavigation();

  const scroll = useRef<ScrollView>(null);
  const [page, setPage] = useState<number>(0);

  // useEffect(() => {
  //   nav.addListener('beforeRemove', (e) => {
  //     console.log("beforeRemove...")
  
  //     if(page > 0) {
  //       e.preventDefault();
  //       setPage(page - 1);
  //     }
  //   });

  //   return () => { nav.removeListener('beforeRemove', () => {}); }
  // }, [nav])

  useEffect(() => {
    scroll.current?.scrollTo({x: page * Dimensions.get('window').width});
  }, [page]);

  const [heightUnit, setHeightUnit] = useState<'us' | 'eu'>('us');
  const [height, setHeight] = useState<{ b: number, s: number }>({ 
    b: heightUnit == 'us' ? 6 : 1, s: heightUnit == 'us' ? 0 : 80 
  });

  const switchHeightUnit = (isUs: boolean) => {
    setHeightUnit(isUs ? 'us' : 'eu');
    setHeight({ b: isUs ? 6 : 1, s: isUs ? 0 : 80 });
  }

  const onHeightPress = (b?: number, s?: number) => {
    setHeight({ b: b ?? height.b, s: s ?? height.s });
  }

  const [weightUnit, setWeightUnit] = useState<'us' | 'eu'>('us');
  const [weight, setWeight] = useState<number>(weightUnit == 'us' ? 150 : 75);

  const switchWeightUnit = (isUs: boolean) => {
    setWeight(isUs ? 150 : 75);
  }

  const styles = StyleSheet.create({
    input: {
      color: theme.colors.text,
      fontSize: 22,
      padding: 10
    },
    slide: {
      width: Dimensions.get('window').width,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      padding: 10
    },
    slideContainer: {
      minWidth: '100%', 
      flexDirection: 'row', 
      padding: 5,
      gap: 10
    },
    button: { 
      flex: 1,
      gap: 20,
      padding: 20, 
      backgroundColor: theme.colors.primary, 
      borderRadius: 10, 
      alignItems: 'center'
    },
    buttonText: {
      fontSize: 30
    }
  });

  const saveProfile = () => {
    let profile = new Profile({
      height: heightUnit == 'us' ? (height.b + height.s / 12) * METER : height.b * 100 + height.s,
      targetWeight: weightUnit == 'us' ? weight * KG : weight
    });

    if(profile.isValid()) {
      return props.onSubmit(profile);
    }

    ToastAndroid.show('Invalid Profile...', ToastAndroid.SHORT)
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      ref={scroll}
    >
      <View style={styles.slide}>
        <View style={styles.slideContainer}>
          <ThemedText style={{ flex: 1, fontSize: 25, lineHeight: 25 }}>Height</ThemedText>
          <UnitSelector
            unitList={['ft', 'm']}
            initialIndex={heightUnit == 'us' ? 0 : 1}
            onPress={(i) => { switchHeightUnit(i == 0); }}
            fontSize={25}
            textOnly
          />
        </View>
        <View style={styles.slideContainer}>
          <SimpleNumberInput
            initialValue={height.b}
            fontSize={40}
            withEffect
            style={{ flex: 2 }}
            onPress={(v) => { onHeightPress(v, undefined); }}
          />
          <SimpleNumberInput
            initialValue={height.s}
            fontSize={40}
            additionalAdder={heightUnit == 'us' ? undefined : 10}
            style={{ flex: 3 }}
            withEffect
            max={heightUnit == 'us' ? 11 : 99}
            onPress={(v) => { onHeightPress(undefined, v); }}
          />
        </View>
        <View style={styles.slideContainer}>
          <Pressable onPress={() => { setPage(page + 1); }} style={styles.button}>
            <ThemedText type="subtitle">Next</ThemedText>
          </Pressable>
        </View>
      </View>
      <View style={styles.slide}>
        <View style={{ minWidth: '100%', flexDirection: 'row', padding: 5 }}>
          <ThemedText style={{ flex: 1, fontSize: 25, lineHeight: 25 }}>Goal Weight</ThemedText>
          <UnitSelector 
            unitList={['lb', 'kg']}
            initialIndex={weightUnit == 'us' ? 0 : 1}
            onPress={(i) => { switchWeightUnit(i == 0) }}
            fontSize={25}
            textOnly
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <SimpleNumberInput 
            initialValue={weight}
            fontSize={40}
            additionalAdder={10}
            style={{ flex: 1 }}
            withEffect
            onPress={(v) => { setWeight(v); }}
          />
        </View>        
        <View style={styles.slideContainer}>
          <Pressable onPress={() => { setPage(page - 1); }} style={styles.button}>
            <ThemedText type="subtitle">Back</ThemedText>
          </Pressable>
          <Pressable onPress={() => { saveProfile(); }} style={styles.button}>
            <ThemedText type="subtitle">Done</ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}