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
  const [user, setUser] = useState<{ [field: string]: any }>({});
  const [useLb, setUseLb] = useState<boolean>(true);

  useEffect(() => {
    nav.setOptions({ headerShown: false, title: "Weight", headerBackVisible: false })
  }, [nav])

  useEffect(() => {
    setUser(LocalStorage.getJSON('user'));
    getWeights();
  }, [])

  const addWeight = async (pounds: number) => {
    const value = Math.round(pounds * 10) / 10
    await Database.getInstance().run(
      `INSERT INTO weights (user_id, value) values (?, ?)`,
      [1, value]
    );

    getWeights();
  }

  const getWeights = async () => {
    let result = await Database.getInstance().query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights`
    );

    setWeights(result);
    return result;
  }

  const deleteWeight = async (index: number) => {
    await Database.getInstance().run(
      `DELETE FROM weights WHERE id = ?`, [weights[index].id]
    )

    getWeights();
  }

  const chartConfig = {
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

  const data = () => {
    return {
      labels: weights?.map(w => {
        let d = new Date(w.ts);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }) ?? [],
      datasets: [
        { data: weights?.map(w => useLb ? w.value : w.value as number * KG) as number[] ?? [] },
        { data: [useLb ? 150 : 150 * KG], color: () => 'rgba(0,0,0,0)', strokeDashArray: [0, 1000], withDots: false, },
        { data: [useLb ? 225 : 225 * KG], color: () => 'rgba(0,0,0,0)', strokeDashArray: [0, 1000], withDots: false, }
      ]
    }
  }

  const lineData = () => {
    return weights?.map((w) => {
      let obj = { ...w };
      if(!useLb) { obj.value = obj.value as number * KG }
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
    return (
      <LineChartComponent
        data={data()}
        width={Dimensions.get("window").width - chartViewPadding * 2} // from react-native
        height={Math.max(Dimensions.get("window").height / 4, 220)}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier={params.bezier ?? true}
      />
    )
  }

  const Update = () => {
    return (
      <View style={styles.row}>
      {/* <ImportModal onSubmit={addWeight} style={{ ...styles.modalButton, backgroundColor: theme.colors.primary }}>
        <ThemedText style={{ fontWeight: 'bold' }}>Import Data</ThemedText>
      </ImportModal> */}
      <WeightModal style={styles.modalButton} addWeight={(pounds: number) => addWeight(pounds)} startLb={useLb}>
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
  }
});
