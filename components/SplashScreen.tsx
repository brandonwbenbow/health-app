import { Image, View } from 'react-native';
import { ThemedText } from './ThemedText';
import * as Config from '../app.json';

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Image source={require('../assets/images/icon.png')}/>
      <ThemedText>{Config.expo.name}</ThemedText>
    </View>
  )
}