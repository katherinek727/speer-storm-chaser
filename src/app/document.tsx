import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

interface StormDocument {
  id: string;
  imageUri: string | null;
  weatherConditions: string;
  location: string;
  dateTime: string;
  notes: string;
  stormType: string;
}

const STORM_TYPES = [
  'Thunderstorm',
  'Tornado',
  'Hurricane',
  'Blizzard',
  'Flood',
  'Dust Storm',
  'Heat Wave',
  'Other',
];

export default function DocumentScreen() {
  const [stormType, setStormType] = useState('Thunderstorm');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSubmit = async () => {
    if (!weatherConditions.trim()) {
      Alert.alert('Validation Error', 'Please describe the weather conditions');
      return;
    }

    if (!notes.trim()) {
      Alert.alert('Validation Error', 'Please add some notes about the storm');
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo, we'll simulate saving to local storage
      const newDocument: StormDocument = {
        id: Date.now().toString(),
        imageUri,
        weatherConditions,
        location: 'Current Location (Demo)', // In real app, get from GPS
        dateTime: new Date().toISOString(),
        notes,
        stormType,
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Success',
        'Storm documented successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setWeatherConditions('');
              setNotes('');
              setImageUri(null);
              setStormType('Thunderstorm');
            },
          },
        ]
      );

      console.log('Saved document:', newDocument);
      // In real app: Save to AsyncStorage or local database
      
    } catch (error) {
      console.error('Error saving document:', error);
      Alert.alert('Error', 'Failed to save storm documentation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              📸 Document Storm
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Capture and document weather events
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            {/* Image Capture Section */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="subtitle">Capture Photo</ThemedText>
              
              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <ThemedText type="default">Image selected ✓</ThemedText>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => setImageUri(null)}
                  >
                    <ThemedText type="default" style={styles.removeButtonText}>
                      Remove
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={[styles.imageButton, styles.cameraButton]}
                    onPress={takePhoto}
                  >
                    <ThemedText type="default" style={styles.buttonText}>
                      📷 Take Photo
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.imageButton, styles.galleryButton]}
                    onPress={pickImage}
                  >
                    <ThemedText type="default" style={styles.buttonText}>
                      🖼️ Choose from Gallery
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </ThemedView>

            {/* Storm Type Selection */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="subtitle">Storm Type</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.stormTypeScroll}
              >
                {STORM_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.stormTypeButton,
                      stormType === type && styles.stormTypeButtonActive,
                    ]}
                    onPress={() => setStormType(type)}
                  >
                    <ThemedText
                      type="default"
                      style={[
                        styles.stormTypeText,
                        stormType === type && styles.stormTypeTextActive,
                      ]}
                    >
                      {type}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

            {/* Weather Conditions */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="subtitle">Weather Conditions</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Describe current weather conditions..."
                placeholderTextColor="#999"
                value={weatherConditions}
                onChangeText={setWeatherConditions}
                multiline
                numberOfLines={3}
              />
            </ThemedView>

            {/* Notes */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="subtitle">Notes & Description</ThemedText>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Add detailed notes about the storm..."
                placeholderTextColor="#999"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </ThemedView>

            {/* Metadata Info */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="subtitle">Metadata</ThemedText>
              <View style={styles.metadataRow}>
                <ThemedText type="default">📍 Location:</ThemedText>
                <ThemedText type="default">Current Location (Demo)</ThemedText>
              </View>
              <View style={styles.metadataRow}>
                <ThemedText type="default">📅 Date & Time:</ThemedText>
                <ThemedText type="default">
                  {new Date().toLocaleString()}
                </ThemedText>
              </View>
            </ThemedView>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText type="title" style={styles.submitButtonText}>
                {isSubmitting ? 'Saving...' : '💾 Save Documentation'}
              </ThemedText>
            </TouchableOpacity>
          </View>
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
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    gap: Spacing.three,
  },
  section: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  imageButtons: {
    gap: Spacing.two,
  },
  imageButton: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#4A90E2',
  },
  galleryButton: {
    backgroundColor: '#7B68EE',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.two,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: Spacing.two,
  },
  removeButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    backgroundColor: '#FF6B6B',
    borderRadius: Spacing.one,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  stormTypeScroll: {
    marginHorizontal: -Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  stormTypeButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginRight: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  stormTypeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  stormTypeText: {
    fontSize: 14,
  },
  stormTypeTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: Spacing.two,
    padding: Spacing.two,
    fontSize: 16,
    minHeight: 80,
  },
  notesInput: {
    minHeight: 100,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  submitButton: {
    backgroundColor: '#2E8B57',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  submitButtonDisabled: {
    backgroundColor: '#7F8C8D',
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
  },
});