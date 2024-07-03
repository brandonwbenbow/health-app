import { ScrollView, Text, View } from 'react-native';

import SectionButton from '@/components/SectionButton';
import ThemedSafeView from '@/components/ThemedSafeView';
import AccountDisplaySection from '@/components/AccountDisplaySection';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedSafeView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 10, gap: 10 }}>
        <View style={{ gap: 10 }}>
          <AccountDisplaySection />
          <SectionButton href="/weight" title="Weight" icon="scale" style={{ backgroundColor: '#e0a428' }} />
          <SectionButton href="/heart" title="Heart" icon="heart" reverse style={{ backgroundColor: '#ed2f2f' }} />
          <SectionButton href="/water" title="Water" icon="water" style={{ backgroundColor: '#4c7efc' }} />
          <SectionButton href="/sleep" title="Sleep" icon="bed" reverse style={{ backgroundColor: '#15bf1d' }} />
        </View>
      </ScrollView>
    </ThemedSafeView>
  );
}