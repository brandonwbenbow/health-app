import { useState } from "react";
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Theme, useTheme } from "@react-navigation/native";

export type DatePickerProps = {

}

type ViewContext = 'decade' | 'year' | 'month' | undefined;

const round = (n: number, to: number) => n - n % to;
const getStart = (date: Date) => new Date(round(date.getFullYear(), 10), 0, 1);
const daysInMonth = (month: number, year: number) => (new Date(year, month + 1, 0)).getDate();
const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
  'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];

export default function DatePicker(props: DatePickerProps) {
  const theme = useTheme();
  const [date, setDate] = useState<Date>(new Date);
  const [context, setContext] = useState<ViewContext>();

  return (
    <View style={{ backgroundColor: '#ffffff33', alignItems: 'center' }}>
      <DPSelect 
        date={date} 
        setDate={setDate} 
        theme={theme} 
        context={context} 
        setContext={setContext}
        size={25} 
      />
      <DPView 
        date={date} 
        setDate={setDate} 
        theme={theme} 
        context={context} 
        setContext={setContext}
      />
    </View>
  )
}

type DPViewProps = {
  theme: Theme,
  date: Date,
  setDate: (date: Date) => void,
  context?: ViewContext,
  setContext?: (context: ViewContext) => void
}

type DPSelectButtonEvent = ((event: GestureResponderEvent) => void) | null | undefined;

function DPSelect(props: DPViewProps & { size?: number }) {
  const getContextHeader = (context: ViewContext, date: Date): String => {
    switch(context) {
      case 'decade':
        return getStart(date).getFullYear().toString();
      case 'year':
        return date.getFullYear().toString();
      case 'month':
      default:
        return months[date.getMonth()] + ' ' + date.getFullYear();
        '-';
    }

    return '_'
  }

  const onContextUp = () => {
    switch(props.context) {
      case undefined:
      case 'month':
        props.setContext?.('year'); break;
      case 'year':
        props.setContext?.('decade'); break;
      case 'decade':
      default:
        break;
    }
  }

  const onContextLeft = () => {

  }

  const onContextRight = () => {

  }

  return (
    <View style={{ ...styles.row, gap: 5 }}>
      <Pressable onPress={onContextLeft} style={styles.selectorButton}>
        <Ionicons name="caret-back" color={props.theme.colors.text} size={props.size}/>
      </Pressable>
      <Pressable onPress={onContextUp} style={styles.selectorButton}>
        <ThemedText style={{ fontSize: props.size, lineHeight: props.size, paddingTop: 5 }}>
          {getContextHeader(props.context, props.date)}
        </ThemedText>
      </Pressable>
      <Pressable onPress={onContextRight} style={styles.selectorButton}>
        <Ionicons name="caret-forward" color={props.theme.colors.text} size={props.size}/>
      </Pressable>
    </View>
  )
}

function DPView(props: DPViewProps) {
  switch(props.context) {
    case 'decade':
      return (
        <DPDecade 
          date={props.date} 
          setDate={props.setDate} 
          setContext={props.setContext} 
          theme={props.theme} 
        />
      );
    case 'year':
      return (
        <DPYear 
          date={props.date} 
          setDate={props.setDate} 
          setContext={props.setContext} 
          theme={props.theme} 
        />
      );
    case 'month': 
    default:
      return (
        <DPMonth 
          date={props.date} 
          setDate={props.setDate} 
          setContext={props.setContext} 
          theme={props.theme} 
        />
      );
  }
}

function DPDecade(props: DPViewProps) {
  const getYears = (date: Date) => {
    let start = getStart(date);
    let arr = [];
    for(let i = 0; i < 10; i++) {
      arr.push(
        <Pressable key={i} 
          onPress={() => { 
            let d = new Date(start.getFullYear() + i, 0, 1);
            props.setDate(d); 
            props.setContext?.('year');
          }} 
          style={{ 
            padding: 15, 
            flexBasis: '33%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText>{start.getFullYear() + i}</ThemedText>
        </Pressable>
      )
    }

    return arr;
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      { getYears(props.date) }
    </View>
  );
}

function DPYear(props: DPViewProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {
        months.map((m, i) => 
          <Pressable key={i} onPress={() => {
            props.setDate(new Date(props.date.getFullYear(), i, 1));
            props.setContext?.('month');
          }}
          style={{
            padding: 15, 
            flexBasis: '33%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          >
            <ThemedText>{m}</ThemedText>
          </Pressable>
        )
      }
    </View>
  );
}

function DPMonth(props: DPViewProps) {
  const getWeeks = (date: Date) => {
    let lines: any[] = []; 
    let days = daysInMonth(date.getMonth(), date.getFullYear());
    let rows = Math.ceil((days + date.getDay()) / 7);
    for(let r = 0; r < rows; r++) {
      let line: any[] = [], pm = daysInMonth(date.getMonth() - 1, date.getFullYear());
      for(let c = 0; c < 7; c++) {
        let i = r * 7 + c, t = rows * 7;
        let offset = i - (t - pm);
        let text = offset <= 0 ? pm + offset : offset > days ? offset - days : offset
        line.push(
          <View style={{ 
            backgroundColor: text == offset ? '#ffffff33' : '#ffffff11', 
            borderRadius: 5, 
            // flexBasis: `${100/7}%` 
            flex: 1,
            padding: 3,
            paddingLeft: 6,
            height: 50
          }}>
            <ThemedText>{text}</ThemedText>
          </View>
        )
      }

      lines.push(
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {line}
        </View>
      );
    }

    return lines;
  }

  return (
    <View style={{ flexDirection: 'column', gap: 5 }}>
      <View style={{ flexDirection: 'row' }}>
        {
          days.map((d, i) => 
            <View key={i} style={{ flexBasis: `${100/7}%`, justifyContent: 'center', alignItems: 'center' }}>
              <ThemedText>{d}</ThemedText>
            </View>
          )
        }
      </View>
      {
        getWeeks(props.date)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center'
  },
  selectorButton: {
    padding: 10
  }
});