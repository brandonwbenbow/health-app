import { DataRecord, DaySummary } from "@/types/Database"
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { ComponentType, JSXElementConstructor, ReactElement } from "react"

export type DayListProps = {
  days: DaySummary[],
  header?: ComponentType<any> | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined,
  footer?: ComponentType<any> | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined,
  scrollEnabled?: boolean
}

export function DayList(props: DayListProps) {

  function DayItem(props: ListRenderItemInfo<DaySummary>) {
    return (<View><ThemedText>{props.item.date}</ThemedText></View>)
  }

  return (
    <FlatList
      scrollEnabled={props.scrollEnabled ?? false}
      data={props.days}
      renderItem={DayItem}
      keyExtractor={item => item.date}
      ListHeaderComponent={props.header}
      ListFooterComponent={props.footer}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

// const _day = (weight: WeightRecord, index: number) => {
//   return (
//     <View key={index} style={{ backgroundColor: theme.colors.card }}>
//       <View style={styles.row}>
//         <ThemedText style={{ flex: 1 }}>{getDayName(new Date(weight.ts))}, {shortDate(new Date(weight.ts))}</ThemedText>
//         <ThemedText>{weight.pounds.toFixed(1)}</ThemedText>
//       </View>
//       <View style={styles.row}>
//         <ThemedText>Calories (Estimated/Recorded): TODO</ThemedText>
//       </View>
//       <View style={styles.row}>
//         <ThemedText>Some Other Calculated Data</ThemedText>
//       </View>
//     </View>
//   )
// }

// const DayItems = (week: WeekRecord) => {
//   return week?.row_list?.map((r, index) => {
//     let i = week.row_list.length - (1 + index);
//     let date = new Date(week.date_list[i])
//     let weight = new Weight(week.value_list[i]);

//     const renderRightActions = (
//       progress: Animated.AnimatedInterpolation<string | number>,
//       dragAnimatedValue: Animated.AnimatedInterpolation<string | number>
//     ) => {
//       const opacity = dragAnimatedValue.interpolate({
//         inputRange: [-150, 0],
//         outputRange: [1, 0],
//         extrapolate: 'clamp',
//       });

//       return (
//         <View style={{ ...styles.row, backgroundColor: (theme.colors as any).negative + "bb", borderRadius: 5, marginLeft: 10 }}>
//           <Animated.View style={{ padding: 10 }}>
//             <TouchableOpacity 
//               onPress={() => deleteWeight(week.id_list[i])}
//               style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity }}
//             >
//               <ThemedText type='subtitle'>Delete</ThemedText>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       )
//     }

//     return (
//       <GestureHandlerRootView key={i} style={{ flexDirection: 'column' }}>
//         <Swipeable renderRightActions={renderRightActions}>
//           <View style={{ backgroundColor: theme.colors.card, padding: 10, borderRadius: 5 }}>
//             <View style={styles.row}>
//               <ThemedText style={{ flex: 1 }}>{monthDate(date)}</ThemedText>
//               <ThemedText>{weight.toString(profile?.useKG)}</ThemedText>
//             </View>
//             <View style={{ ...styles.row, gap: 5 }}>
//               <Ionicons name="chevron-forward" color={theme.colors.text} />
//               <ThemedText style={{ flex: 1 }}>Est. Calories:</ThemedText>
//               <ThemedText>-</ThemedText>
//             </View>
//             <View style={{ ...styles.row, gap: 5 }}>
//               <Ionicons name="chevron-forward" color={theme.colors.text} />
//               <ThemedText style={{ flex: 1 }}>Exercise:</ThemedText>
//               <ThemedText>-</ThemedText>
//             </View>
//           </View>
//         </Swipeable>
//       </GestureHandlerRootView>
//     )
//   }) ?? <></>;
// }