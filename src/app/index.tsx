import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const navigateToWeather = () => {
    router.push('/weather');
  };

  const navigateToDocument = () => {
    router.push('/document');
  };

  const navigateToSaved = () => {
    router.push('/saved');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <ThemedText type="title" style={styles.appLogo}>
            🌪️
          </ThemedText>
          <ThemedText type="title" style={styles.appTitle}>
            STORM CHASER
          </ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            Professional Meteorology Companion
          </ThemedText>
        </View>

        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={styles.featureCardTouchable}
            onPress={navigateToWeather}
            activeOpacity={0.7}
          >
            <ThemedView type="backgroundElement" style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <ThemedText type="title" style={styles.featureIcon}>
                  🌤️
                </ThemedText>
                <View style={styles.featureTextContainer}>
                  <ThemedText type="subtitle" style={styles.featureTitle}>
                    Weather Data
                  </ThemedText>
                  <ThemedText type="small" style={styles.featureSubtitle}>
                    Tap to view →
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="default" style={styles.featureDescription}>
                Get real-time weather information for your current location with detailed meteorological data
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCardTouchable}
            onPress={navigateToDocument}
            activeOpacity={0.7}
          >
            <ThemedView type="backgroundElement" style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <ThemedText type="title" style={styles.featureIcon}>
                  📸
                </ThemedText>
                <View style={styles.featureTextContainer}>
                  <ThemedText type="subtitle" style={styles.featureTitle}>
                    Storm Documentation
                  </ThemedText>
                  <ThemedText type="small" style={styles.featureSubtitle}>
                    Tap to document →
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="default" style={styles.featureDescription}>
                Capture photos and add comprehensive metadata for professional storm tracking
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCardTouchable}
            onPress={navigateToSaved}
            activeOpacity={0.7}
          >
            <ThemedView type="backgroundElement" style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <ThemedText type="title" style={styles.featureIcon}>
                  💾
                </ThemedText>
                <View style={styles.featureTextContainer}>
                  <ThemedText type="subtitle" style={styles.featureTitle}>
                    Data Persistence
                  </ThemedText>
                  <ThemedText type="small" style={styles.featureSubtitle}>
                    Tap to view saved →
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="default" style={styles.featureDescription}>
                Save, manage, and analyze all captured storm data locally on your device
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" style={styles.footerText}>
            Built for professional meteorology enthusiasts
          </ThemedText>
          <ThemedText type="small" style={styles.footerHint}>
            Select any feature above to get started
          </ThemedText>
        </View>
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
    marginTop: Spacing.four,
    marginBottom: Spacing.four,
  },
  appLogo: {
    fontSize: 64,
    marginBottom: Spacing.two,
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#208AEF',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
  featureCardTouchable: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
  },
  featureCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#208AEF',
  },
  featureSubtitle: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  featureDescription: {
    opacity: 0.9,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.four,
  },
  footerText: {
    opacity: 0.7,
    textAlign: 'center',
  },
  footerHint: {
    opacity: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});