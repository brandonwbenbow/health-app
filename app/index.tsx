import { Pressable, StyleSheet, View } from 'react-native';
import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { Database, DaySummary, WeekSummary, WeightRecord } from '@/types/Database';
import { useEffect, useState } from 'react';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CurrentStats } from '@/components/CurrentStats';
import { WeekList } from '@/components/WeekItem';
import { DayList } from '@/components/DayItem';
import { Link } from 'expo-router'

const getDayName = (date: Date) => {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export default function Page() {
  const theme = useTheme();
  const router = useRouter();
  const isFocus = useIsFocused();

  const [days, setDays] = useState<DaySummary[]>([]);
  const [weeks, setWeeks] = useState<WeekSummary[]>([]);
  const [weights, setWeights] = useState<WeightRecord[]>([]);

  useEffect(() => {
    Database.getInstance().getWeights().then(setWeights);
    Database.getInstance().getDaySummaries().then(setDays);
    Database.getInstance().getWeekSummaries().then(setWeeks);
  }, [isFocus]);

  const RecordLink = (props: { href: string, icon: string, text: string }) => {
    return (
      <Link asChild style={{ ...styles.link, backgroundColor: theme.colors.primary }} href={props.href}>
        <Pressable style={{ ...styles.recordButton }}>
          <Ionicons size={30} color={theme.colors.text} name={props.icon as any} />
          <ThemedText>{props.text}</ThemedText>
        </Pressable>
      </Link>
    )
  }

  return (
    <PageView style={styles.section} scroll>
      <View style={styles.row}>
        <ThemedText type='title' style={{ flex: 1 }}>{getDayName(new Date())}</ThemedText>
        <Pressable style={{ padding: 5 }} onPress={() => router.push({ pathname: 'settings' })}>
          <Ionicons name='settings' color={theme.colors.text} size={25}/>
        </Pressable>
      </View>
      <View style={{ ...styles.row, ...styles.section }}>
        <RecordLink href='add/weight' icon='scale' text='Add Weight' />
        <RecordLink href='add/calorie' icon='fast-food' text='Add Calories' />
        <RecordLink href='add/activity' icon='bicycle' text='Add Activity' />
      </View>
      <CurrentStats kilo={weights[0]?.kilos} />
      <DayList days={days} />
      <WeekList weeks={weeks} />
    </PageView>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 10
  },
  link: {
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: { 
    flexDirection: 'column',
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