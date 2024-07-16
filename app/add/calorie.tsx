import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Page() {
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ title: 'Add Calories' })
  }, [nav]);

  return (<ThemedText>Add Calories</ThemedText>)
}


// const CalorieModal = (props: { icon: any, text: string, onSubmit: Function }) => {
//   const [visible, setVisible] = useState<boolean>(false);
//   const [value, setValue] = useState<number>(profile?.useKG ? weights?.[0]?.kilos : weights?.[0]?.pounds)

//   return (
//     <>
//       <Pressable 
//         onPress={() => { setVisible(true); }} 
//         style={{ ...styles.recordButton, backgroundColor: theme.colors.primary }}
//       >
//         <Ionicons color={theme.colors.text} size={30} name={props.icon} />
//         <ThemedText>{props.text}</ThemedText>
//       </Pressable>
//       <Modal 
//         animationType='slide'
//         visible={visible}
//         onRequestClose={() => setVisible(false)}
//       >
//         <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
//             <TextInput 
//               placeholder="850"
//               placeholderTextColor={'#888'}
//               onChange={(e) => setValue(Number(e.nativeEvent.text))}
//               style={{ ...styles.textInput, backgroundColor: theme.colors.card, color: theme.colors.text }}
//             />
//             <ThemedText>Calories (K)</ThemedText>
//             <View style={{ flexDirection: 'row', gap: 20 }}>
//               <Pressable style={{ ...styles.button, backgroundColor: theme.colors.card }} onPress={() => { setVisible(false) }}>
//                 <ThemedText>Cancel</ThemedText>
//               </Pressable>
//               <Pressable style={{ ...styles.button, backgroundColor: theme.colors.primary }} 
//                 onPress={() => { props.onSubmit(value); setVisible(false); }}>
//                 <ThemedText>Save</ThemedText>
//               </Pressable>
//             </View>
//           </View>
//         </ThemedView>
//       </Modal>
//     </>
//   )
// }
