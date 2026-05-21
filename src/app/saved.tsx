import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

interface SavedStorm {
  id: string;
  stormType: string;
  weatherConditions: string;
  location: string;
  dateTime: string;
  notes: string;
  imageUri?: string;
}

const MOCK_SAVED_STORMS: SavedStorm[] = [
  {
    id: '1',
    stormType: 'Thunderstorm',
    weatherConditions: 'Heavy rain with lightning',
    location: 'Austin, TX',
    dateTime: '2024-03-15T14:30:00Z',
    notes: 'Major thunderstorm with frequent lightning strikes. Wind gusts up to 45 mph.',
  },
  {
    id: '2',
    stormType: 'Tornado',
    weatherConditions: 'Rotating clouds, high winds',
    location: 'Oklahoma City, OK',
    dateTime: '2024-03-10T16:45:00Z',
    notes: 'Funnel cloud spotted but did not touch down. Severe weather warning issued.',
  },
  {
    id: '3',
    stormType: 'Blizzard',
    weatherConditions: 'Heavy snow, low visibility',
    location: 'Denver, CO',
    dateTime: '2024-02-28T09:15:00Z',
    notes: 'Snow accumulation of 12 inches. Wind chill -15°F.',
  },
  {
    id: '4',
    stormType: 'Flood',
    weatherConditions: 'Torrential rain, rising water',
    location: 'Houston, TX',
    dateTime: '2024-03-05T11:20:00Z',
    notes: 'Flash flooding in low-lying areas. Several roads closed.',
  },
  {
    id: '5',
    stormType: 'Heat Wave',
    weatherConditions: 'Extreme heat, low humidity',
    location: 'Phoenix, AZ',
    dateTime: '2024-03-12T13:00:00Z',
    notes: 'Temperature reached 112°F. Heat advisory in effect.',
  },
];

const STORM_TYPE_ICONS: Record<string, string> = {
  Thunderstorm: '⛈️',
  Tornado: '🌪️',
  Hurricane: '🌀',
  Blizzard: '❄️',
  Flood: '🌊',
  'Dust Storm': '🌫️',
  'Heat Wave': '🔥',
  Other: '🌤️',
};

export default function SavedScreen() {
  const [savedStorms, setSavedStorms] = useState<SavedStorm[]>(MOCK_SAVED_STORMS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const deleteStorm = (id: string) => {
    Alert.alert(
      'Delete Storm',
      'Are you sure you want to delete this storm documentation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedStorms(prev => prev.filter(storm => storm.id !== id));
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStormItem = ({ item }: { item: SavedStorm }) => (
    <ThemedView type="backgroundElement" style={styles.stormCard}>
      <View style={styles.stormHeader}>
        <View style={styles.stormTypeContainer}>
          <ThemedText type="title" style={styles.stormIcon}>
            {STORM_TYPE_ICONS[item.stormType] || '🌤️'}
          </ThemedText>
          <View>
            <ThemedText type="subtitle">{item.stormType}</ThemedText>
            <ThemedText type="small" style={styles.location}>
              {item.location}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteStorm(item.id)}
        >
          <ThemedText type="default" style={styles.deleteButtonText}>
            🗑️
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stormDetails}>
        <View style={styles.detailRow}>
          <ThemedText type="default" style={styles.detailLabel}>
            Conditions:
          </ThemedText>
          <ThemedText type="default">{item.weatherConditions}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText type="default" style={styles.detailLabel}>
            Date:
          </ThemedText>
          <ThemedText type="default">{formatDate(item.dateTime)}</ThemedText>
        </View>

        <View style={styles.notesContainer}>
          <ThemedText type="default" style={styles.detailLabel}>
            Notes:
          </ThemedText>
          <ThemedText type="default" style={styles.notesText}>
            {item.notes}
          </ThemedText>
        </View>
      </View>

      <View style={styles.stormFooter}>
        <TouchableOpacity style={styles.viewButton}>
          <ThemedText type="default" style={styles.viewButtonText}>
            👁️ View Details
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton}>
          <ThemedText type="default" style={styles.shareButtonText}>
            📤 Share
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ThemedText type="title" style={styles.emptyStateTitle}>
        📁 No Saved Storms
      </ThemedText>
      <ThemedText type="default" style={styles.emptyStateText}>
        Document your first storm using the camera icon!
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            💾 Saved Storms
          </ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            {savedStorms.length} documented events
          </ThemedText>
        </View>

        <FlatList
          data={savedStorms}
          renderItem={renderStormItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={renderEmptyState}
        />

        {savedStorms.length > 0 && (
          <View style={styles.statsContainer}>
            <ThemedView type="backgroundElement" style={styles.statItem}>
              <ThemedText type="subtitle">Total Storms</ThemedText>
              <ThemedText type="title">{savedStorms.length}</ThemedText>
            </ThemedView>
            
            <ThemedView type="backgroundElement" style={styles.statItem}>
              <ThemedText type="subtitle">Storm Types</ThemedText>
              <ThemedText type="title">
                {new Set(savedStorms.map(s => s.stormType)).size}
              </ThemedText>
            </ThemedView>
          </View>
        )}
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
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
    paddingTop: Spacing.three,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  listContent: {
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  stormCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  stormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stormTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stormIcon: {
    fontSize: 24,
  },
  location: {
    opacity: 0.7,
  },
  deleteButton: {
    padding: Spacing.one,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  stormDetails: {
    gap: Spacing.one,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  detailLabel: {
    fontWeight: '600',
    opacity: 0.8,
  },
  notesContainer: {
    marginTop: Spacing.one,
  },
  notesText: {
    opacity: 0.9,
    lineHeight: 20,
  },
  stormFooter: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#7B68EE',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  emptyStateTitle: {
    textAlign: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  statItem: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
});