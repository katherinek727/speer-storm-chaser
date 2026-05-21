import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            🌪️ Storm Chaser
          </ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            Track and document weather events
          </ThemedText>
        </View>

        <View style={styles.featuresContainer}>
          <ThemedView type="backgroundElement" style={styles.featureCard}>
            <ThemedText type="subtitle">🌤️ Weather Data</ThemedText>
            <ThemedText type="default">
              Get real-time weather information for your current location
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.featureCard}>
            <ThemedText type="subtitle">📸 Storm Documentation</ThemedText>
            <ThemedText type="default">
              Capture photos and add metadata for storm tracking
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.featureCard}>
            <ThemedText type="subtitle">💾 Data Persistence</ThemedText>
            <ThemedText type="default">
              Save all captured storm data locally on your device
            </ThemedText>
          </ThemedView>
        </View>

        <ThemedText type="small" style={styles.footer}>
          Built for meteorology enthusiasts
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    marginTop: Spacing.six,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    marginTop: Spacing.four,
  },
  featureCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  footer: {
    marginTop: Spacing.four,
    opacity: 0.6,
  },
});