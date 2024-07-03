import { LineChartComponent } from "@/components/Chart";
import DataList from "@/components/DataList";
import ThemedSafeView from "@/components/ThemedSafeView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WaitPage from "@/components/WaitPage";
import ImportModal from "@/components/modal/ImportModal";
import PressureModal from "@/components/modal/PressureModal";
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

export type HeartPageParams = {
  style?: ViewStyle,
  graphBG?: string,
  graphGradientFrom?: string,
  graphGradientTo?: string,
  graphDecimalCount?: number,

  lineStrockColor?: string,
  bezier?: boolean
}

export default function HeartPage() {
  const params: HeartPageParams = useLocalSearchParams();
  const nav = useNavigation();
  const theme = useTheme();

  const [searchIndex, setSearchIndex] = useState<number>(0);
  const [pressures, setPressures] = useState<{ id: number, ts: any, lower: number, upper: number }[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Heart", headerBackVisible: false })
  }, [nav])

  useEffect(() => {

    setTimeout(async () => {
      setUser(new Profile(await LocalStorage.getJSON('user')));
      await getPressures();
      setLoaded(true);
    }, 250);
    
  }, []);

  const getPressures = async (offset = 0, limit = pressures?.length || 31) => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, lower_value as lower, upper_value as upper 
      FROM bloodpressures ORDER BY ts desc LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    if(offset > 0 && pressures.length > 0) {
      setPressures([...pressures, ...result]);
    } else {
      setPressures(result);
    }

    return result;
  }

  const addPressure = async (upper: number, lower: number) => {

  }

  const deletePressure = async (index: number) => {
    await Database.getInstance().run(
      `DELETE FROM bloodpressures WHERE id = ?`, [pressures[index].id]
    );

    getPressures();
  }

  const Header = () => {
    return (
      <View style={{ ...styles.titleContainer }}>
        <Ionicons name='heart' size={30} color={theme.colors.text} />
        <ThemedText style={styles.title}>Heart</ThemedText>
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
      labels: pressures?.map(p => {
        let d = new Date(p.ts);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }).reverse() ?? [],
      datasets: [
        { data: pressures?.map(p => p.lower).reverse() as number[] ?? [] },
        { data: pressures?.map(p => p.upper).reverse() as number[] ?? [] },
        { data: [120], color: () => ``, strokeDashArray: [0, 1000], withDots: false },
        { data: [140], color: () => ``, strokeDashArray: [0, 1000], withDots: false }
      ]
    }

    return data
  }
  const getData = useMemo(data, [pressures]);
  
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

  const Update = () => {
    return (
      <View style={styles.row}>
        <ImportModal
          onSubmit={(v: any) => { console.log("Imported Pressures:", v) }} 
          style={{ ...styles.modalButton, backgroundColor: theme.colors.primary }}
        >
          <ThemedText style={{ fontWeight: 'bold' }}>Import Data</ThemedText>
        </ImportModal>
        <PressureModal 
          initalValue={{ upper: pressures[0]?.upper, lower: pressures[0]?.lower }} 
          style={styles.modalButton} 
          addPressure={addPressure}
        >
          <ThemedText style={{ fontWeight: 'bold' }}>Add Entry</ThemedText>
        </PressureModal>
      </View>
    )
  }

  return (
    <ThemedSafeView style={{ ...styles.container, backgroundColor: theme.colors.primary }}>
      <Header />
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <WaitPage wait={loaded}>
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
            listData={pressures} 
            onDelete={deletePressure}
            onScrollEnd={() => { getPressures(searchIndex + 7, 8); setSearchIndex(searchIndex + 8); }}
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