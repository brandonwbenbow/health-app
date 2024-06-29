import { StyleSheet, ScrollView, ViewStyle, View } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { LineChartProps } from "react-native-chart-kit/dist/line-chart/LineChart";
import { useTheme } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";

export type LineChartComponentProps = LineChartProps & {
  wrapperStyle?: ViewStyle,
}

export function LineChartComponent(props: LineChartComponentProps) {
  const theme = useTheme();

  return (
    <View style={props.wrapperStyle}>
      {
        props.data?.datasets?.length == 0 || props.data?.labels?.length == 0 ?
        <View style={styles.center}><ThemedText>No Data</ThemedText></View>
        :
        <LineChart
          data={props.data}
          width={props.width}
          height={props.height}
          chartConfig={props.chartConfig}
          bezier={props.bezier}
          style={props.style}
          yAxisLabel={props.yAxisLabel}
          yAxisSuffix={props.yAxisSuffix}
          yAxisInterval={props.yAxisInterval} 
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})