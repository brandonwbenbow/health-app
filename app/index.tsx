import { Button, StyleSheet, View } from 'react-native';
import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { useProfileContext, useProfileDispatchContext } from '@/components/ProfileProvider';
import { Database, LocalStorage } from '@/types/Database';
import { useEffect, useState } from 'react';
import { KG } from '@/constants/Numbers';
import { ProfileData } from '@/types/Profile';
import { Theme, useTheme } from '@react-navigation/native';

type WeightRecord = {
  ts: number,
  id: number,
  kilos: number,
  pounds: number
}

export default function HomeScreen() {
  const theme = useTheme();
  const profile = useProfileContext();
  const saveProfile = useProfileDispatchContext();

  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const getWeights = async (offset = 0, limit = weights?.length || 7) => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights ORDER BY ts desc LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    let calc = result.map((r: {id: any, ts: any, value: any}) => {
      return {
        id: r.id,
        ts: r.ts,
        kilos: r.value,
        pounds: r.value / KG
      }
    });

    if(offset > 0 && weights.length > 0) {
      setWeights([...weights, ...calc]);
    } else {
      setWeights(calc);
    }

    return calc;
  }

  const addWeight = () => {}
  const deleteWeight = () => {}

  const getYearsOld = () => {
    return (new Date()).getFullYear() - (new Date(profile.birthday ?? Date.now())).getFullYear();
  }

  const getBMR = () => {
    if(weights.length < 1) { return 'No Weight Data' }
    let years = getYearsOld();
    let bmr = 10 * weights[0].kilos + 6.25 * (profile.height ?? 170) - 5 * years;
    bmr += profile.male ? 5 : -161;
    return bmr.toFixed(2);;
  }

  const getBMI = () => {
    if(weights.length < 1) { return 'No Weight Data' }
    if(profile.height == undefined) { return 'No Height Data' }
    let meters = profile.height / 100;
    let heightSquared = meters * meters;
    return (weights[0].kilos / heightSquared).toFixed(2);
  }

  useEffect(() => {
    getWeights();
  }, [])

  const DayItem = (weight: WeightRecord, index: number) => {
    return (
      <View key={index} style={{ ...styles.dayItem, backgroundColor: theme.colors.card }}>
        <View style={styles.row}>
          <ThemedText style={{ flex: 1 }}>{(new Date(weight.ts)).toDateString()}</ThemedText>
          <ThemedText>{weight.pounds.toFixed(1)}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText>Calories (Estimated/Recorded): TODO</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText>Some Other Calculated Data</ThemedText>
        </View>
      </View>
    )
  }

  return (
    <PageView style={{ gap: 10 }} scroll>
      <ThemedText>Height: {profile.height ? profile.height + 'cm' : 'No Height Data'}</ThemedText>
      <ThemedText>Weight: {weights[0]?.pounds ? weights[0].pounds + 'lbs' : 'No Weight Data'}</ThemedText>
      <ThemedText>Age: {getYearsOld()} Years</ThemedText>
      <ThemedText>BMR: {getBMR()} Calories</ThemedText>
      <ThemedText>BMI: {getBMI()}</ThemedText>
      <Button title='Delete Profile' onPress={() => { saveProfile({}); }} />
      <View style={{ gap: 10 }}>
        { weights.map(DayItem) }
      </View>
    </PageView>
  )
}

const styles = StyleSheet.create({
  dayItem: {
    flexDirection: 'column',
    padding: 10,
    borderRadius: 5
  },
  row: {
    flexDirection: 'row'
  }
});