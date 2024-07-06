import { LineChartComponent } from "@/components/Chart";
import DataList from "@/components/DataList";
import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WaitPage from "@/components/WaitPage";
import ImportModal from "@/components/modal/ImportModal";
import PressureModal from "@/components/modal/PressureModal";
import WaterModal from "@/components/modal/WaterModal";
import { Database, LocalStorage } from "@/constants/Database";
import { Profile } from "@/constants/Profile";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

const chartViewPadding = 10;

export type SleepPageParams = {
  style?: ViewStyle,
  graphBG?: string,
  graphGradientFrom?: string,
  graphGradientTo?: string,
  graphDecimalCount?: number,

  lineStrockColor?: string,
  bezier?: boolean
}

export default function SleepPage() {
  const params: SleepPageParams = useLocalSearchParams();
  const nav = useNavigation();
  const theme = useTheme();

  const [searchIndex, setSearchIndex] = useState<number>(0);
  const [sleep, setSleep] = useState<{ id: number, ts: any, value: number }[]>([]);
  const [daily, setDaily] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Sleep", headerBackVisible: false })
  }, [nav])

  useEffect(() => {

    setTimeout(async () => {
      setUser(new Profile(await LocalStorage.getJSON('user')));
      await getDrinks();
      setLoaded(true);
    }, 250);
    
  }, []);

  const getdailySleep = async () => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, SUM(value) total_value 
      FROM sleep_hours WHERE DATE(ts, 'localtime') = DATE('now', 'localtime')`,
      []
    );

    setDaily(result?.[0]?.total_value);
    return result.total_value;
  }

  const getDrinks = async (offset = 0, limit = sleep?.length || 31) => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value 
      FROM sleep_hours ORDER BY ts desc LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    if(offset > 0 && sleep.length > 0) {
      setSleep([...sleep, ...result]);
    } else {
      setSleep(result);
    }

    await getdailySleep();
    return result;
  }

  const addDrink = async (value: number) => {
    await Database.getInstance().run(
      `INSERT INTO sleep_hours (user_id, value) values (?, ?)`,
      [1, value]
    );

    getDrinks(undefined, sleep?.length + 1);
  }

  const deleteDrink = async (index: number) => {
    await Database.getInstance().run(
      `DELETE FROM sleep_hours WHERE id = ?`, [sleep[index].id]
    );

    getDrinks();
  }

  const Header = () => {
    return (
      <View style={{ ...styles.titleContainer }}>
        <Ionicons name='bed' size={30} color={theme.colors.text} />
        <ThemedText style={styles.title}>Sleep</ThemedText>
      </View>
    )
  }

  const chartConfig: AbstractChartConfig = {
    backgroundColor: params?.graphBG ?? params?.style?.backgroundColor as string | undefined,
    backgroundGradientFrom: params?.graphGradientFrom ?? theme.colors.primary ?? "#fb8c00",
    backgroundGradientTo: params?.graphGradientTo ?? theme.colors.primary ?? "#ffa726",
    decimalPlaces: params?.graphDecimalCount ?? 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "3",
      strokeWidth: "3",
      stroke: params?.lineStrockColor ?? "#ffffff44"
    },
    useShadowColorFromDataset: true,
    horizontalOffset: -20
  }

  const data = (): LineChartData => {
    const data: LineChartData = {
      labels: sleep?.map(p => {
        let d = new Date(p.ts);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }).reverse() ?? [],
      datasets: [
        { data: sleep?.map(d => d.value).reverse() as number[] ?? [] },
        // { data: [120], color: () => `rgba(0,1,0,0.5)`, strokeDashArray: [0, 1000], withDots: false },
        // { data: [140], color: () => `rgba(1,0,0,0.5)`, strokeDashArray: [0, 1000], withDots: false }
      ]
    }

    return data
  }
  const getData = useMemo(data, [sleep]);
  
  const Shows = () => {
    let show: number[] = [];
    let t = 0, count = 3;
    const length = getData.labels.length;
    for(let i = 0; i < length; i++) {
      if(i == length - 1) {
        continue;
      } else if(i == Math.round(((length - 1) / (count - 1)) * t)) {
        t += 1;
        continue;
      }

      show.push(i)
    }
    return show;
  }
  const getShows = useMemo(Shows, [getData]);

  const lineData = () => {
    return sleep ?? [];
  }
  const getLineData = useMemo(lineData, [sleep]);

  const Update = () => {
    return (
      <View style={styles.row}>
        {/* <ImportModal
          onSubmit={(v: any) => { console.log("Imported drinks:", v) }} 
          style={{ ...styles.modalButton, backgroundColor: theme.colors.primary }}
        >
          <ThemedText style={{ fontWeight: 'bold' }}>Import Data</ThemedText>
        </ImportModal> */}
        <WaterModal 
          initalValue={sleep[0]?.value} 
          style={styles.modalButton} 
          addPressure={addDrink}
        >
          <ThemedText style={{ fontWeight: 'bold' }}>Add Entry</ThemedText>
        </WaterModal>
      </View>
    )
  }

  return (
    <ThemedSafeView style={{ ...styles.container, backgroundColor: theme.colors.primary }}>
      <Header />
      <ThemedView style={{ flex: 1, gap: 10, padding: chartViewPadding, justifyContent: "center", alignItems: "center" }}>
        <WaitPage wait={loaded}>
          <ThemedText>Daily Sleep: {daily ?? 0} Hours</ThemedText>
          <LineChartComponent
            data={getData}
            width={Dimensions.get("window").width - chartViewPadding * 2} // from react-native
            height={Math.max(Dimensions.get("window").height / 4, 220)}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier={params.bezier ?? true}
            hidePointsAtIndex={getShows}
          />
          <Update />
          <DataList
            style={{ backgroundColor: theme.colors.primary }}
            listData={getLineData} 
            onDelete={deleteDrink}
            onScrollEnd={() => { getDrinks(searchIndex + 7, 8); setSearchIndex(searchIndex + 8); }}
          />
        </WaitPage>
      </ThemedView>
    </ThemedSafeView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    gap: 10
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  chart: {
    borderRadius: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
  }
})