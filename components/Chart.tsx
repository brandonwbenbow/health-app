import { StyleSheet, ScrollView, ViewStyle, View } from "react-native";
import { LineChart, ContributionGraph } from 'react-native-chart-kit';
import { LineChartProps } from "react-native-chart-kit/dist/line-chart/LineChart";
import { useTheme } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ContributionGraphProps } from "react-native-chart-kit/dist/contribution-graph";
import { useEffect } from "react";

export type LineChartComponentProps = LineChartProps & {
  wrapperStyle?: ViewStyle,
}

export function LineChartComponent(props: LineChartComponentProps) {
  return (
    <View style={{ ...props.wrapperStyle }}>
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
          hidePointsAtIndex={props.hidePointsAtIndex}
        />
      }
    </View>
  )
}

export type CommitChartComponentProps = {
  wrapperStyle?: ViewStyle,
  color?: string,
  data: { weight?: boolean[], heart?: boolean[], water?: boolean[], sleep?: boolean[] }
}

export function CommitChartComponent(props: CommitChartComponentProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: 5, flexDirection: "row" }}>
      {
        Array(7).fill(0).map((_, i) => {
          let opac = 0.04;
          if(props.data.weight?.[i] == true) { opac += 0.24 }
          if(props.data.heart?.[i] == true) { opac += 0.24 }
          if(props.data.water?.[i] == true) { opac += 0.24 }
          if(props.data.sleep?.[i] == true) { opac += 0.24 }

          return (<View key={i} style={{
            flex: 1,
            minHeight: 45,
            height: "auto",
            minWidth: 40,
            backgroundColor: props.color ?? "#ffffff",
            opacity: opac,
            borderRadius: 5
          }}>

          </View>)
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    // flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})