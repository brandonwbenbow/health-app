import { StyleSheet, ScrollView, View } from 'react-native';

import SectionButton from '@/components/SectionButton';
import ThemedSafeView from '@/components/ThemedSafeView';
import AccountDisplaySection from '@/components/AccountDisplaySection';

export default function HomeScreen() {
  return (
    <ThemedSafeView style={{ ...styles.container }}>
      <ScrollView style={{ flex: 1 }}>
        <AccountDisplaySection />
        <SectionButton href="/weight" title="Weight" icon="scale" style={{ backgroundColor: '#4c7efc' }} />
        <SectionButton href="/heart" title="Heart" icon="heart" reverse style={{ backgroundColor: "#ed2f2f" }} />
      </ScrollView>
    </ThemedSafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
