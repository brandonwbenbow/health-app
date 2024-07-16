import { WeekRecord, WeekSummary } from "@/types/Database";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ComponentType, JSXElementConstructor, ReactElement } from "react"
import { useTheme } from "@react-navigation/native";

export type WeekListProps = {
  weeks: WeekSummary[],
  header?: ComponentType<any> | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined,
  footer?: ComponentType<any> | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined,
  scrollEnabled?: boolean
}

export function WeekList(props: WeekListProps) {
  const theme = useTheme();

  function WeekItem(props: ListRenderItemInfo<WeekSummary>) {
    let weights = props.item.kilos.split(',');
    let lost = weights[0] < weights[weights.length - 1];
    return (<View><ThemedText style={{ color: lost ? theme.colors.primary : (theme.colors as any).negative }}>
      {props.item.year} - {props.item.week}: {props.item.kilos}
    </ThemedText></View>)
  }

  return (
    <FlatList
      scrollEnabled={props.scrollEnabled ?? false}
      data={props.weeks}
      renderItem={WeekItem}
      keyExtractor={item => `${item.year}${item.week}`}
      ListHeaderComponent={props.header}
      ListFooterComponent={props.footer}
    />
  )
}

// function WeekItem(props: ListRenderItemInfo<WeekSummary>) {
//   // let count = week.value_list.length;
//   // let weight = { start: new Weight(week.value_list[0]), end: new Weight(week.value_list[count - 1]) }

//   let weights = props.item.kilos.split(',');
//   let lost = weights[0] <= weights[weights.length - 1];
//   return (<View><ThemedText style={{ color: lost ? theme.colors.primary : (theme.colors as any).negative }}>{props.item.year} - {props.item.week}</ThemedText></View>)
  
//   // return (
//   //   <View key={index} 
//   //     style={{ 
//   //       flexDirection: 'column',
//   //       padding: 10,
//   //       borderRadius: 5,
//   //       backgroundColor: week.value_list[0] >= week.value_list[week.value_list.length - 1] 
//   //         ? theme.colors.primary + "66"
//   //         : (theme.colors as any).negative + "66"
//   //     }}>
//   //     <View style={styles.row}>
//   //       <ThemedText>{shortDate(new Date(week.date_list[0]))}</ThemedText>
//   //       <View style={{ flex: 1 }}></View>
//   //       <ThemedText>{shortDate(new Date(week.date_list[count - 1]))}</ThemedText>
//   //     </View>
//   //     <View style={styles.row}>
//   //       <View style={{ flex: 1 }}>
//   //         <ThemedText >Start: {weight.start.toString(profile?.useKG)}</ThemedText>
//   //         <ThemedText>End: {weight.end.toString(profile?.useKG)}</ThemedText>
//   //       </View>
//   //       <View style={{ alignItems: 'flex-end' }}>
//   //         {
//   //           week.value_list[0] > week.value_list[count - 1]
//   //           ? <ThemedText>Lost</ThemedText>
//   //           : <ThemedText>Gained</ThemedText>
//   //         }
//   //         <ThemedText type='subtitle'>{new Weight(Math.abs(week.value_list[0] - week.value_list[count - 1])).toString(profile?.useKG)}</ThemedText>
//   //       </View>
//   //     </View>
//   //   </View>
//   // )
// }