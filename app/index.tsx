import { Button, GestureResponderEvent, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { useProfileContext, useProfileDispatchContext } from '@/components/ProfileProvider';
import { Database, LocalStorage } from '@/types/Database';
import { useEffect, useState } from 'react';
import { KG } from '@/constants/Numbers';
import { Profile, ProfileData } from '@/types/Profile';
import { Theme, useTheme } from '@react-navigation/native';
import { Weight } from '@/types/Weight';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import UnitSelector from '@/components/UnitSelector';

type WeightRecord = {
  ts: number,
  id: number,
  kilos: number,
  pounds: number
}

type WeekRecord = {
  value_list: number[], 
  id_list: number[], 
  row_list: number[],
  date_list: string[],
  week: number 
}

type CalorieRecord = {

}

type DataRecord = {
  weight?: WeightRecord,
  calorie?: CalorieRecord,
  date?: Date
}

const getDayName = (date: Date) => {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

const shortDate = (date: Date) => {
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
}

const monthDate = (date: Date) => {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];

  let suffix = ['st', 'nd', 'rd'];

  return months[date.getMonth()] + ` ${date.getDate()}${suffix?.[date.getDate()] ?? 'th'}`;
}

const getWeekOfYear = (date?: Date) => {
  let now = date ?? new Date();
  let onejan = new Date(now.getFullYear(), 0, 1);
  return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
}

export default function HomeScreen() {
  const theme = useTheme();
  const profile = useProfileContext();
  const router = useRouter();

  const [kg, useKG] = useState<boolean>(false);
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

    await getWeeks();
    return calc;
  }

  const addWeight = (kilos: number) => {
    Database.getInstance().run(
      `INSERT INTO weights (user_id, value) values (?, ?)`,
      [1, kilos]
    ).then(() => { getWeights(); })
  }

  const deleteWeight = () => {}

  const [weeks, setWeeks] = useState<WeekRecord[]>([]);
  const getWeeks = async () => {
    let result = await Database.getInstance().query(
      `
        SELECT 
          strftime('%W', ts) week,
          GROUP_CONCAT(value ORDER BY ts desc) as value_list,
          GROUP_CONCAT(id ORDER BY ts desc) as id_list,
          GROUP_CONCAT(ROWID ORDER BY ts desc) as row_list,
          GROUP_CONCAT(datetime(ts, 'localtime') ORDER BY ts desc) as date_list
        FROM weights
        GROUP BY week
        ORDER BY ts desc
        LIMIT 10
      `,
      []
    ).catch(console.warn) ?? [];

    setWeeks(result.map((r: any) => {
      return {
        value_list: r.value_list.split(',').map((v: string) => Number(v)),
        id_list: r.id_list.split(',').map((v: string) => Number(v)),
        row_list: r.row_list.split(',').map((v: string) => Number(v)),
        date_list: r.date_list.split(','),
        week: r.week
      }
    }));
  }

  const [data, setData] = useState<DataRecord[]>([]);
  const getData = async (offset = 0, limit = data?.length || 7) => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights ORDER BY ts desc LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  useEffect(() => {
    getWeights();
  }, [])

  const DayItem = (weight: WeightRecord, index: number) => {
    return (
      <View key={index} style={{ ...styles.dayItem, backgroundColor: theme.colors.card }}>
        <View style={styles.row}>
          <ThemedText style={{ flex: 1 }}>{getDayName(new Date(weight.ts))}, {shortDate(new Date(weight.ts))}</ThemedText>
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

  const DayItems = (week: WeekRecord) => {
    return week?.row_list?.map((r, i) => {
      let date = new Date(week.date_list[i])
      let weight = new Weight(week.value_list[i]);

      return (
        <View key={i} style={{ ...styles.dayItem, backgroundColor: theme.colors.card }}>
          <View style={styles.row}>
            <ThemedText style={{ flex: 1 }}>{monthDate(date)}</ThemedText>
            <ThemedText>{weight.toString(kg)}</ThemedText>
          </View>
          <View style={{ ...styles.row, gap: 5 }}>
            <Ionicons name="chevron-forward" color={theme.colors.text} />
            <ThemedText style={{ flex: 1 }}>Est. Calories:</ThemedText>
            <ThemedText>TODO</ThemedText>
          </View>
          <View style={{ ...styles.row, gap: 5 }}>
            <Ionicons name="chevron-forward" color={theme.colors.text} />
            <ThemedText style={{ flex: 1 }}>Exercise:</ThemedText>
            <ThemedText>TODO</ThemedText>
          </View>
        </View>
      )
    }) ?? <></>;
  }

  const WeekItem = (week: WeekRecord, index: number) => {
    return (
      <View key={index} 
        style={{ 
          ...styles.dayItem, 
          backgroundColor: week.value_list[0] >= week.value_list[week.value_list.length - 1] 
            ? theme.colors.primary + "66"
            : (theme.colors as any).negative + "66"
        }}>
        <ThemedText>Week: {week.week} - Count: {week.value_list.length}</ThemedText>
        <ThemedText>Min: {Math.min(...week.value_list)}</ThemedText>
        <ThemedText>Max: {Math.max(...week.value_list)}</ThemedText>
      </View>
    )
  }

  const WeightModal = (props: { icon: any, text: string, onSubmit: Function }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [_kg, _useKG] = useState<number>(kg ? 1 : 0);
    const [value, setValue] = useState<number>(kg ? weights?.[0]?.kilos : weights?.[0]?.pounds)

    return (
      <>
        <Pressable 
          onPress={() => { setVisible(true); }} 
          style={{ ...styles.recordButton, backgroundColor: theme.colors.primary }}
        >
          <Ionicons color={theme.colors.text} size={30} name={props.icon} />
          <ThemedText>{props.text}</ThemedText>
        </Pressable>
        <Modal 
          animationType='slide'
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
              <TextInput 
                placeholder="150"
                placeholderTextColor={'#888'}
                onChange={(e) => setValue(Number(e.nativeEvent.text))}
                style={{ ...styles.textInput, backgroundColor: theme.colors.card, color: theme.colors.text }}
              />
              <UnitSelector 
                initialIndex={_kg}
                unitList={['lb', 'kg']} 
                onPress={_useKG}
                textOnly
                fontSize={25}
              />
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Pressable style={{ ...styles.button, backgroundColor: theme.colors.card }} onPress={() => { setVisible(false) }}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} 
                  onPress={() => { props.onSubmit(_kg ? value : value * KG); setVisible(false); }}>
                  <ThemedText>Save</ThemedText>
                </Pressable>
              </View>
            </View>
          </ThemedView>
        </Modal>
      </>
    )
  }

  const CalorieModal = (props: { icon: any, text: string, onSubmit: Function }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [value, setValue] = useState<number>(kg ? weights?.[0]?.kilos : weights?.[0]?.pounds)

    return (
      <>
        <Pressable 
          onPress={() => { setVisible(true); }} 
          style={{ ...styles.recordButton, backgroundColor: theme.colors.primary }}
        >
          <Ionicons color={theme.colors.text} size={30} name={props.icon} />
          <ThemedText>{props.text}</ThemedText>
        </Pressable>
        <Modal 
          animationType='slide'
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
              <TextInput 
                placeholder="850"
                placeholderTextColor={'#888'}
                onChange={(e) => setValue(Number(e.nativeEvent.text))}
                style={{ ...styles.textInput, backgroundColor: theme.colors.card, color: theme.colors.text }}
              />
              <ThemedText>Calories (K)</ThemedText>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Pressable style={{ ...styles.button, backgroundColor: theme.colors.card }} onPress={() => { setVisible(false) }}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} 
                  onPress={() => { props.onSubmit(value); setVisible(false); }}>
                  <ThemedText>Save</ThemedText>
                </Pressable>
              </View>
            </View>
          </ThemedView>
        </Modal>
      </>
    )
  }

  const ActivityModal = (props: { icon: any, text: string, onSubmit: Function }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [value, setValue] = useState<number>(kg ? weights?.[0]?.kilos : weights?.[0]?.pounds)

    return (
      <>
        <Pressable 
          onPress={() => { setVisible(true); }} 
          style={{ ...styles.recordButton, backgroundColor: theme.colors.primary }}
        >
          <Ionicons color={theme.colors.text} size={30} name={props.icon} />
          <ThemedText>{props.text}</ThemedText>
        </Pressable>
        <Modal 
          animationType='slide'
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
              <TextInput 
                placeholder="1.5"
                placeholderTextColor={'#888'}
                onChange={(e) => setValue(Number(e.nativeEvent.text))}
                style={{ ...styles.textInput, backgroundColor: theme.colors.card, color: theme.colors.text }}
              />
              <ThemedText>Hours of Exercise</ThemedText>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Pressable style={{ ...styles.button, backgroundColor: theme.colors.card }} onPress={() => { setVisible(false) }}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} 
                  onPress={() => { props.onSubmit(value); setVisible(false); }}>
                  <ThemedText>Save</ThemedText>
                </Pressable>
              </View>
            </View>
          </ThemedView>
        </Modal>
      </>
    )
  }

  const CurrentStats = (props: { weight: number }) => {
    const prof = new Profile(profile);
    const weight = new Weight(props.weight);
    const bmi = prof.calculateBMI(weight);

    return (
      <>
        <View style={{ ...styles.row, backgroundColor: theme.colors.card, padding: 5, borderRadius: 5 }}>
          <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>Weight:</ThemedText>
          <ThemedText>{weight.toString(kg)}</ThemedText>
        </View>
        <View style={{ ...styles.row, padding: 5, borderRadius: 5 }}>
          <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>BMI:</ThemedText>
          <ThemedText style={{ color: prof.getBMIColor(Number(bmi)) }}>{bmi}</ThemedText>
        </View>
        <View style={{ ...styles.row, backgroundColor: theme.colors.card, padding: 5, borderRadius: 5 }}>
          <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>BMR:</ThemedText>
          <ThemedText>{prof.calculateBMR(weight)}</ThemedText>
        </View>
      </>
    )
  }

  return (
    <PageView style={styles.section} scroll>
      <View style={styles.row}>
        <ThemedText type='title' style={{ flex: 1 }}>{getDayName(new Date())}</ThemedText>
        <Pressable style={{ padding: 5 }} onPress={() => router.push({ pathname: 'profile' })}>
          <Ionicons name='person' color={theme.colors.text} size={25}/>
        </Pressable>
      </View>
      <View style={{ ...styles.row, ...styles.section }}>
        <WeightModal onSubmit={addWeight} text='Add Weight' icon='scale' />
        <CalorieModal onSubmit={() => {}} text='Add Calories' icon='fast-food' />
        <ActivityModal onSubmit={() => {}} text='Add Activity' icon='bicycle' />
      </View>
      <View>
        <CurrentStats weight={weights[0]?.kilos} />
      </View>
      <ThemedText type="subtitle">This Week</ThemedText>
      <View style={styles.section}>
        { 
          weeks[0]?.week == getWeekOfYear()
          ? DayItems(weeks[0]) 
          : <ThemedText>No data for this week...</ThemedText>
        }
      </View>
      <ThemedText type="subtitle">Previous Weeks</ThemedText>
      <View style={styles.section}>
      { weeks.slice(1).map(WeekItem) }
      </View>
    </PageView>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 10
  },
  dayItem: {
    flexDirection: 'column',
    padding: 10,
    borderRadius: 5
  },
  weekItem: {

  },
  recordButton: { 
    borderRadius: 5, 
    padding: 10,
    alignItems: 'center',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
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
});