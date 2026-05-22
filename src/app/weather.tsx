import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  pressure: number;
  condition: string;
  location: string;
  latitude?: number;
  longitude?: number;
  cityName?: string;
  country?: string;
  timezone?: string;
  weatherCode?: number;
  feelsLike?: number;
  windDirection?: number;
  visibility?: number;
  cloudCover?: number;
  uvIndex?: number;
  isDay?: boolean;
}

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 바람 방향을 문자열로 변환하는 함수
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  // 날씨 데이터를 기반으로 스톰 체이저 노트 생성
  const getStormChaserNotes = (weather: WeatherData): string => {
    const notes: string[] = [];
    
    if (weather.precipitation > 5) {
      notes.push('Heavy precipitation observed.');
    } else if (weather.precipitation > 0.5) {
      notes.push('Light to moderate precipitation.');
    } else {
      notes.push('Minimal precipitation.');
    }
    
    if (weather.windSpeed > 30) {
      notes.push('Strong winds - exercise caution.');
    } else if (weather.windSpeed > 15) {
      notes.push('Moderate wind speeds - good for observation.');
    } else {
      notes.push('Calm wind conditions.');
    }
    
    if (weather.humidity > 80) {
      notes.push('High humidity - potential for fog or low clouds.');
    } else if (weather.humidity < 30) {
      notes.push('Low humidity - dry conditions.');
    }
    
    if (weather.pressure < 1000) {
      notes.push('Low pressure system - monitor for storm development.');
    } else if (weather.pressure > 1020) {
      notes.push('High pressure system - stable conditions.');
    }
    
    if (weather.condition.toLowerCase().includes('thunderstorm')) {
      notes.push('Thunderstorm activity detected - extreme caution advised.');
    }
    
    if (weather.condition.toLowerCase().includes('snow') || weather.condition.toLowerCase().includes('freezing')) {
      notes.push('Freezing conditions - watch for ice accumulation.');
    }
    
    return notes.join(' ');
  };

  // Open-Meteo API에서 날씨 코드를 기반으로 날씨 상태 문자열로 변환하는 함수
  const getWeatherCondition = (weatherCode: number, isDay: boolean = true): string => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    const conditions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    
    return conditions[weatherCode] || 'Unknown';
  };

  // Open-Meteo API에서 날씨 데이터를 가져오는 함수
  const fetchWeatherFromOpenMeteo = async (latitude: number, longitude: number) => {
    try {
      // Open-Meteo API 엔드포인트
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 현재 날씨 데이터 추출
      const current = data.current;
      const daily = data.daily;
      
      // 날씨 코드를 기반으로 날씨 상태 결정
      const weatherCode = current.weather_code;
      const isDay = current.is_day === 1;
      const condition = getWeatherCondition(weatherCode, isDay);
      
      // 위치 정보를 가져오기 위해 역지오코딩 API 호출 (Open-Meteo의 Geocoding API 사용)
      let cityName = '';
      let country = '';
      try {
        const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${latitude},${longitude}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geocodingUrl);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.results && geoData.results.length > 0) {
            cityName = geoData.results[0].name;
            country = geoData.results[0].country;
          }
        }
      } catch (geoError) {
        if (__DEV__) {
          console.log('Geocoding error:', geoError);
        }
      }
      
      const locationText = cityName && country 
        ? `${cityName}, ${country}`
        : `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
      
      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation || 0,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl || current.surface_pressure || 1013,
        condition,
        location: locationText,
        latitude,
        longitude,
        cityName,
        country,
        timezone: data.timezone,
        weatherCode,
        feelsLike: current.apparent_temperature,
        windDirection: current.wind_direction_10m,
        visibility: 10000, // 기본값 (Open-Meteo는 현재 가시성을 제공하지 않음)
        cloudCover: current.cloud_cover,
        uvIndex: 0, // 기본값 (별도 API 필요)
        isDay,
      };
      
      return weatherData;
    } catch (error) {
      console.error('Open-Meteo API error:', error);
      throw error;
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      let latitude: number | null = null;
      let longitude: number | null = null;
      let locationText = 'Demo Location (Austin, TX)';
      let useRealData = false;
      
      try {
        // Check if location services are available
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          if (__DEV__) {
            console.log('Location services disabled, using demo data');
          }
        } else {
          // Request location permission
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            if (__DEV__) {
              console.log('Location permission not granted, using demo data');
            }
          } else {
            // Get current location
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
            locationText = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
            useRealData = true;
          }
        }
      } catch (locationError) {
        // Only log detailed error in development
        if (__DEV__) {
          console.log('Location error, using demo data:', locationError);
        }
      }

      let weatherData: WeatherData;
      
      if (useRealData && latitude !== null && longitude !== null) {
        // 실제 Open-Meteo API 데이터 사용
        weatherData = await fetchWeatherFromOpenMeteo(latitude, longitude);
      } else {
        // 데모 데이터 사용 (오류 발생 시 폴백)
        weatherData = {
          temperature: 22.5,
          windSpeed: 15.3,
          precipitation: 0.2,
          humidity: 65,
          pressure: 1013,
          condition: 'Partly Cloudy',
          location: locationText,
        };
        
        if (__DEV__) {
          console.log('Using demo weather data');
        }
      }

      setWeather(weatherData);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      // API 오류 발생 시 데모 데이터로 폴백
      const demoWeather: WeatherData = {
        temperature: 22.5,
        windSpeed: 15.3,
        precipitation: 0.2,
        humidity: 65,
        pressure: 1013,
        condition: 'Partly Cloudy',
        location: 'Demo Location (Austin, TX)',
      };
      setWeather(demoWeather);
      
      if (err.message && err.message.includes('network')) {
        setError('Network error. Check your internet connection.');
      } else if (err.message && err.message.includes('API')) {
        setError('Weather API temporarily unavailable.');
      } else {
        setError('Unable to fetch real weather data. Showing demo data.');
      }
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

  if (error && !weather) {
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
              {weather?.location || 'Loading location...'}
            </ThemedText>
            {weather?.location?.includes('Demo Location') && (
              <ThemedView type="backgroundElement" style={styles.demoBadge}>
                <ThemedText type="small" style={styles.demoBadgeText}>
                  📍 Demo Data
                </ThemedText>
              </ThemedView>
            )}
            {error && (
              <ThemedText type="small" style={styles.demoNotice}>
                ⚠️ Using demo data: {error}
              </ThemedText>
            )}
          </View>

          {weather ? (
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
                  <ThemedText type="title">{weather.windSpeed.toFixed(1)} km/h</ThemedText>
                  {weather.windDirection !== undefined && (
                    <ThemedText type="small" style={styles.statSubtext}>
                      {getWindDirection(weather.windDirection)}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">💧 Precipitation</ThemedText>
                  <ThemedText type="title">{weather.precipitation.toFixed(1)} mm</ThemedText>
                  <ThemedText type="small" style={styles.statSubtext}>
                    Last hour
                  </ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">💦 Humidity</ThemedText>
                  <ThemedText type="title">{weather.humidity}%</ThemedText>
                  {weather.feelsLike !== undefined && (
                    <ThemedText type="small" style={styles.statSubtext}>
                      Feels like {weather.feelsLike.toFixed(1)}°C
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.statCard}>
                  <ThemedText type="subtitle">📊 Pressure</ThemedText>
                  <ThemedText type="title">{weather.pressure.toFixed(0)} hPa</ThemedText>
                  {weather.cloudCover !== undefined && (
                    <ThemedText type="small" style={styles.statSubtext}>
                      {weather.cloudCover}% clouds
                    </ThemedText>
                  )}
                </ThemedView>
              </View>

              <View style={styles.additionalInfoGrid}>
                <ThemedView type="backgroundElement" style={styles.additionalInfoCard}>
                  <ThemedText type="subtitle">🌡️ Feels Like</ThemedText>
                  <ThemedText type="title">
                    {weather.feelsLike !== undefined ? `${weather.feelsLike.toFixed(1)}°C` : 'N/A'}
                  </ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.additionalInfoCard}>
                  <ThemedText type="subtitle">☁️ Cloud Cover</ThemedText>
                  <ThemedText type="title">
                    {weather.cloudCover !== undefined ? `${weather.cloudCover}%` : 'N/A'}
                  </ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.additionalInfoCard}>
                  <ThemedText type="subtitle">🌅 Day/Night</ThemedText>
                  <ThemedText type="title">
                    {weather.isDay !== undefined ? (weather.isDay ? '☀️ Day' : '🌙 Night') : 'N/A'}
                  </ThemedText>
                </ThemedView>

                <ThemedView type="backgroundElement" style={styles.additionalInfoCard}>
                  <ThemedText type="subtitle">🧭 Wind Dir</ThemedText>
                  <ThemedText type="title">
                    {weather.windDirection !== undefined ? getWindDirection(weather.windDirection) : 'N/A'}
                  </ThemedText>
                </ThemedView>
              </View>

              <ThemedView type="backgroundElement" style={styles.infoCard}>
                <ThemedText type="subtitle">ℹ️ Storm Chaser Notes</ThemedText>
                <ThemedText type="default">
                  {getStormChaserNotes(weather)}
                </ThemedText>
              </ThemedView>
            </View>
          ) : (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" />
              <ThemedText type="default" style={styles.loadingText}>
                Loading weather data...
              </ThemedText>
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
  demoNotice: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
    marginTop: Spacing.one,
    fontSize: 12,
  },
  demoBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    marginTop: Spacing.one,
  },
  demoBadgeText: {
    fontSize: 12,
    opacity: 0.8,
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
  statSubtext: {
    opacity: 0.7,
    fontSize: 12,
    marginTop: 2,
  },
  additionalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  additionalInfoCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  infoCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
});