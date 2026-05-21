# 🌪️ Storm Chaser App

A mobile application for storm chasing hobbyist meteorologists to track and document weather events.

## Features

### ✅ Required Features Implemented

1. **Weather Data View**
   - Fetch and display current weather data based on device location
   - Display key meteorological information relevant to storm chasers
   - Show "Not found" view if weather data cannot be retrieved
   - Pull-to-refresh functionality

2. **Storm Documentation Feature**
   - Capture photos using device camera or gallery
   - Add metadata including:
     - Weather conditions
     - Location coordinates (demo mode)
     - Date and time
     - Notes/description
     - Storm type/classification

3. **Data Persistence Capabilities**
   - Save all captured storm data locally (mock implementation)
   - Implement proper data models and storage solutions
   - View saved storms with detailed information

4. **Intuitive Navigation**
   - Tab-based navigation between different sections
   - Modern, clean UI with consistent theming

### 🎯 Bonus Features (Senior Role Requirements)

- **Pull to refresh** in weather and saved storms screens
- **Modern UI/UX** with clean, distinctive design
- **Error handling** with user-friendly messages
- **Form validation** for storm documentation

## Technology Stack

- **React Native** with **Expo** for cross-platform development
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Expo Image Picker** for camera integration
- **Expo Location** for geolocation services

## Project Structure

```
StormChaser/
├── src/
│   ├── app/                    # App screens (Expo Router)
│   │   ├── index.tsx          # Home screen
│   │   ├── weather.tsx        # Weather data screen
│   │   ├── document.tsx       # Storm documentation screen
│   │   └── saved.tsx          # Saved storms screen
│   ├── components/            # Reusable components
│   ├── constants/             # Constants and theme
│   └── hooks/                 # Custom hooks
├── assets/                    # Images and icons
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web**: Press `w` in the terminal
- **Physical Device**: Scan QR code with Expo Go app

## Implementation Details

### Weather Data
- Uses mock data for demonstration
- In production, would integrate with Open-Meteo API or Weather.gov API
- Includes location permission handling

### Camera Integration
- Supports both camera capture and gallery selection
- Includes proper permission handling
- Image compression and editing options

### Data Models
```typescript
interface StormDocument {
  id: string;
  imageUri: string | null;
  weatherConditions: string;
  location: string;
  dateTime: string;
  notes: string;
  stormType: string;
}
```

### Navigation
- 4-tab navigation: Home, Weather, Document, Saved
- Consistent theming across all screens
- Smooth transitions and intuitive UX

## Design Philosophy

- **Modern & Clean**: Bright, distinctive aesthetic
- **User-Friendly**: Intuitive controls and clear feedback
- **Professional**: Clean code with proper architecture
- **Accessible**: Considerate of different user needs

## Future Enhancements

1. **Real API Integration**
   - Connect to Open-Meteo or Weather.gov APIs
   - Add weather forecast integration

2. **Advanced Features**
   - Map visualization of documented storm locations
   - Offline functionality with sync
   - Dark mode support
   - Cloud integration (Firebase, AWS, etc.)

3. **Testing**
   - Unit tests for components and utilities
   - Integration tests for navigation
   - End-to-end testing

## License

This project is created for the Speer Technologies Mobile Development Assessment.

## Author

Built with ❤️ for meteorology enthusiasts.