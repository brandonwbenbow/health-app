import { NativeScrollEvent, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import { ThemedText } from "./ThemedText"
import { ThemedView } from "./ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import ConfirmModal from "./modal/ConfirmModal"
import { useState } from "react"

export type DataListProps = {
  onDelete: (index: number) => void,
  listData?: { [field: string]: any }[],
  style?: ViewStyle,
  onScrollEnd?: () => void
}

export default function DataList(props: DataListProps) {
  const theme = useTheme();
  const [modalData, setModalData] = useState<{ visible: boolean, index?: number, data?: any }>({ visible: false });

  const getShortDate = (ts: any) => {
    let date = new Date(ts)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const onConfirmDelete = (yes: boolean) => {
    if(yes && typeof(modalData.index) == 'number') {
      props.onDelete(modalData.index);
    }

    setModalData({ visible: false })
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  }

  return (
    <ScrollView onScroll={(e) => {
      if(isCloseToBottom(e.nativeEvent)) {
        props.onScrollEnd?.();
      }
    }}>
      <ConfirmModal 
        style={props.style} 
        visible={modalData.visible} 
        report={`Deleting Entry for ${getShortDate(modalData.data?.ts)}: ${modalData.data?.value}`} 
        response={onConfirmDelete} 
      />
      {
        props.listData?.map((d, i) => {
          let topRadius = i == 0 ? 10 : 0;
          let bottomRadius = props.listData?.length == 0 || i + 1 == props.listData?.length ? 10 : 0;

          return (
            <View key={i} style={{ 
              ...styles.row, 
              ...(i % 2 ? styles.oddRow : {}),
              borderTopLeftRadius: topRadius, 
              borderTopRightRadius: topRadius, 
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius
            }}>
              <ThemedText style={{ 
                ...styles.text, 
                ...styles.rowHeader, 
                borderTopLeftRadius: topRadius, 
                borderBottomLeftRadius: bottomRadius 
              }}>
                {getShortDate(d.ts)}
              </ThemedText>
              <ThemedText style={{ 
                ...styles.text, 
                ...styles.rowText,
                borderTopRightRadius: topRadius, 
                borderBottomRightRadius: bottomRadius 
              }}>
                {Math.round(d.value * 10) / 10}
              </ThemedText>
              <Pressable style={styles.delete} onPress={() => setModalData({ visible: true, index: i, data: d }) }>
                <Ionicons name="trash" color={theme.colors.text} size={20} />
              </Pressable>
            </View>
          )
        })
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1
  },
  oddRow: {
    backgroundColor: '#ffffff11'
  },
  text: {
    padding: 10
  },
  rowHeader: {
    flex: 2,
    flexShrink: 0,
    textAlign: 'center',
    backgroundColor: '#ffffff11'
  },
  rowText: {
    flex: 9,
    fontWeight: 'bold'
  },
  delete: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})