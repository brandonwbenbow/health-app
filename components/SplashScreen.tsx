import { Dimensions, Image, View } from 'react-native';
import { ThemedText } from './ThemedText';
import * as Config from '../app.json';

export default function SplashScreen() {
  const style = {
    width: Dimensions.get('window').width / 2, 
    height: Dimensions.get('window').width / 2 
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 0 }}>
      <Image style={style} source={require('../assets/images/icon.png')}/>
      <ThemedText>{Config.expo.name}</ThemedText>
    </View>
  )
}