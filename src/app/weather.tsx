import { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  pressure: number;
  condition: string;
  location: string;
}

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if location services are available
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        setError('Location services are disabled. Please enable location services in your device settings.');
        setLoading(false);
        return;
      }

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please enable location permissions in app settings.');
        setLoading(false);
        return;
      }

      // Get current location with timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000, // 10 second timeout
      });
      
      const { latitude, longitude } = location.coords;

      // For demo purposes, using mock data
      // In a real app, you would call Open-Meteo API or Weather.gov API
      const mockWeather: WeatherData = {
        temperature: 22.5,
        windSpeed: 15.3,
        precipitation: 0.2,
        humidity: 65,
        pressure: 1013,
        condition: 'Partly Cloudy',
        location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWeather(mockWeather);
    } catch (err: any) {
      if (err.code === 'E_LOCATION_SERVICES_DISABLED') {
        setError('Location services are disabled. Please enable location services in your device settings.');
      } else if (err.code === 'E_LOCATION_TIMEOUT') {
        setError('Location request timed out. Please check your network connection and try again.');
      } else if (err.code === 'E_LOCATION_UNAVAILABLE') {
        setError('Current location is unavailable. Make sure that location services are enabled.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <ThemedText type="default" style={styles.loadingText}>
              Fetching weather data...
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.errorContainer}>
              <ThemedText type="title" style={styles.errorTitle}>
                ⚠️ Weather Unavailable
              </ThemedText>
              <ThemedText type="default" style={styles.errorText}>
                {error}
              </ThemedText>
              <ThemedText type="small" style={styles.retryText}>
                Pull down to retry
              </ThemedText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              🌤️ Current Weather
            </ThemedText>
            <ThemedText type="default" style={styles.location}>
              {weather?.location}
            </ThemedText>
          </View>

          {weather && (
            <View style={styles.weatherContainer}>
              <ThemedView type="backgroundElement" style={styles.primaryCard}>
                <ThemedText type="title" style={styles.temperature}>
                  {weather.temperature}°C
                </ThemedText>
                <ThemedText type="subtitle" style={styles.condition}>
                  {weather.condition}
                </ThemedText>
              </ThemedView>

              <View style={styles.statsGrid}>
                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">💨 Wind</ThemedText>
                  <ThemedText type="title">{weather.windSpeed} km/h</ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">💧 Precipitation</ThemedText>
                  <ThemedText type="title">{weather.precipitation} mm</ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">💦 Humidity</ThemedText>
                  <ThemedText type="title">{weather.humidity}%</ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">📊 Pressure</ThemedText>
                  <ThemedText type="title">{weather.pressure} hPa</ThemedText>
                </ThemedView>
              </View>

              <ThemedView type="backgroundElement" style={styles.infoCard}>
                <ThemedText type="subtitle">ℹ️ Storm Chaser Notes</ThemedText>
                <ThemedText type="default">
                  Moderate wind speeds with light precipitation. Good conditions for storm observation.
                </ThemedText>
              </ThemedView>
            </View>
          )}
        </ScrollView>
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
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingVertical: Spacing.three,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  loadingText: {
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  retryText: {
    opacity: 0.6,
    marginTop: Spacing.two,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  location: {
    textAlign: 'center',
    opacity: 0.7,
  },
  weatherContainer: {
    gap: Spacing.three,
  },
  primaryCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 20,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
  },
  infoCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
});