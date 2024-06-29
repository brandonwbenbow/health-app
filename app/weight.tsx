import { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ViewStyle, View, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedSafeView from '@/components/ThemedSafeView';
import { LineChartComponent } from '@/components/Chart';
import { Database, LocalStorage } from '@/constants/Database';
import DataList from '@/components/DataList';
import ImportModal from '@/components/modal/ImportModal';
import WeightModal from '@/components/modal/WeightModal';
import { KG } from '@/constants/Numbers';
import { User } from '@/constants/User';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

const chartViewPadding = 10;

export type WeightComponentparams = {
  style?: ViewStyle,
  graphBG?: string,
  graphGradientFrom?: string,
  graphGradientTo?: string,
  graphDecimalCount?: number,

  lineStrockColor?: string,
  bezier?: boolean
}

export default function WeightComponent() {
  const params: WeightComponentparams = useLocalSearchParams();
  const nav = useNavigation();
  const theme = useTheme();

  const [weights, setWeights] = useState<{ id: number, ts: any, value: Number }[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [useLb, setUseLb] = useState<boolean>(true);

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Weight", headerBackVisible: false })
  }, [nav]);

  useEffect(() => {
    LocalStorage.getJSON('user').then((data) => {
      setUser(new User(data));
    });

    getWeights();
  }, []);

  const addWeight = async (kilos: number) => {
    const value = Math.round(kilos * 10) / 10
    await Database.getInstance().run(
      `INSERT INTO weights (user_id, value) values (?, ?)`,
      [1, value]
    );

    getWeights();
  }

  const addWeightFromCSV = async (arr: any, pounds = true) => {
    if(arr?.length == 0) { return; }
    for(let i = 0; i < arr.length; i++) {
      if(arr[i]?.length != 2) { return; }
      let w = pounds ? arr[i][1] * KG : arr[i][1];
      let p = arr[i][0].split('/');
      let d = new Date(p[2], p[0] - 1, p[1]);
      await Database.getInstance().run(
        `INSERT INTO weights (user_id, value, ts) values (?, ?, ?)`,
        [1, w, d.toISOString()]
      );
    }

    getWeights();
  }

  const clearWeights = async () => {
    await Database.getInstance().run(
      `DELETE FROM weights`
    );

    getWeights();
  }

  const deleteWeight = async (index: number) => {
    await Database.getInstance().run(
      `DELETE FROM weights WHERE id = ?`, [weights[index].id]
    )

    getWeights();
  }

  const getWeights = async (offset = 0, limit = 30) => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights ORDER BY ts desc LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    setWeights(result);
    return result;
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
    useShadowColorFromDataset: true
  }

  const data = (): LineChartData => {
    let tw = user?.getData()?.targetWeight;
    let min = tw ? (useLb ? tw / KG : tw) : undefined;

    const data: LineChartData = {
      labels: weights?.map(w => {
        let d = new Date(w.ts);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }).reverse() ?? [],
      datasets: [
        { data: weights?.map(w => useLb ? w.value as number / KG : w.value).reverse() as number[] ?? [] },
      ]
    }

    if(min) {
      data.datasets.push({
        data: [min], 
        color: () => 'rgba(0,0,0,0)', 
        strokeDashArray: [0, 1000], 
        withDots: false,
      })
    }

    return data
  }

  const lineData = () => {
    return weights?.map((w) => {
      let obj = { ...w };
      if(useLb) { obj.value = obj.value as number / KG }
      return obj;
    }) ?? [];
  }

  const Header = () => {
    return (
      <View style={{ ...styles.titleContainer }}>
        <Ionicons name='scale' size={30} color={theme.colors.text} />
        <ThemedText style={styles.title}>Weight</ThemedText>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
          <Pressable onPress={() => setUseLb(!useLb)} style={{ flexDirection: 'row', backgroundColor: theme.colors.card, borderRadius: 10 }}>
            <ThemedText style={{ 
              ...styles.togglePill, 
              backgroundColor: useLb ? theme.colors.border : theme.colors.card,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}>LB</ThemedText>
            <ThemedText style={{ 
              ...styles.togglePill,
              backgroundColor: !useLb ? theme.colors.border : theme.colors.card,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10
            }}>KG</ThemedText>
          </Pressable>
        </View>
      </View>
    )
  }

  const Chart = () => {
    let d = data();
    let show: number[] = [];

    let t = 0, count = 5;
    const length = d.labels.length;
    for(let i = 0; i < length; i++) {
      if(i == length - 1) {
        continue;
      } else if(i == Math.round(((length - 1) / (count - 1)) * t)) {
        t += 1;
        continue;
      }

      show.push(i)
    }

    return (
      <LineChartComponent
        data={d}
        width={Dimensions.get("window").width - chartViewPadding * 2} // from react-native
        height={Math.max(Dimensions.get("window").height / 4, 220)}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier={params.bezier ?? true}
        hidePointsAtIndex={show}
      />
    )
  }

  const Update = () => {
    return (
      <View style={styles.row}>
        <ImportModal onSubmit={addWeightFromCSV} style={{ ...styles.modalButton, backgroundColor: theme.colors.primary }}>
          <ThemedText style={{ fontWeight: 'bold' }}>Import Data</ThemedText>
        </ImportModal>
        <WeightModal style={styles.modalButton} addWeight={(kilos: number) => addWeight(kilos)} startLb={useLb}>
          <ThemedText style={{ fontWeight: 'bold' }}>Add Entry</ThemedText>
        </WeightModal>
      </View>
    )
  }

  return (
    <ThemedSafeView style={{ ...styles.container, backgroundColor: theme.colors.primary }}>
      <Header />
      <ThemedView style={{ ...styles.view }}>
        <Chart />
        <Update />
        <DataList
          style={{ backgroundColor: theme.colors.primary }}
          listData={lineData()} 
          onDelete={deleteWeight}
        />
        {/* {weights.length > 0 ? 
        <Pressable onPress={clearWeights} style={{ ...styles.delete, backgroundColor: theme.colors.notification }}>
          <ThemedText>Delete All</ThemedText>
        </Pressable>
        : <></>} */}
      </ThemedView>
    </ThemedSafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    padding: chartViewPadding,
    gap: 10
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
  },
  togglePill: {
    padding: 5,
    minWidth: 40,
    textAlign: 'center'
  },
  delete: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
