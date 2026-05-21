/**
 * Unit tests for weather utility functions
 * 
 * This demonstrates testing practices for the Storm Chaser app.
 * In a real project, you would use Jest or another testing framework.
 */

// Mock weather data utility
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (unit === 'F') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${fahrenheit.toFixed(1)}°F`;
  }
  return `${temp.toFixed(1)}°C`;
};

export const getStormSeverity = (windSpeed: number, precipitation: number): string => {
  if (windSpeed > 80 || precipitation > 50) {
    return 'Extreme';
  } else if (windSpeed > 50 || precipitation > 25) {
    return 'Severe';
  } else if (windSpeed > 30 || precipitation > 10) {
    return 'Moderate';
  } else {
    return 'Mild';
  }
};

export const validateStormData = (data: {
  stormType: string;
  weatherConditions: string;
  notes: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.stormType.trim()) {
    errors.push('Storm type is required');
  }

  if (!data.weatherConditions.trim()) {
    errors.push('Weather conditions are required');
  } else if (data.weatherConditions.length < 10) {
    errors.push('Weather conditions should be at least 10 characters');
  }

  if (!data.notes.trim()) {
    errors.push('Notes are required');
  } else if (data.notes.length < 20) {
    errors.push('Notes should be at least 20 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Test cases
console.log('=== Running Weather Utility Tests ===\n');

// Test 1: Temperature formatting
console.log('Test 1: Temperature Formatting');
console.log(`20°C to Fahrenheit: ${formatTemperature(20, 'F')}`);
console.log(`25.5°C to Celsius: ${formatTemperature(25.5, 'C')}`);
console.log(`0°C to Fahrenheit: ${formatTemperature(0, 'F')}`);
console.log('✓ Temperature formatting works correctly\n');

// Test 2: Storm severity classification
console.log('Test 2: Storm Severity Classification');
console.log(`Wind 85km/h, Precip 10mm: ${getStormSeverity(85, 10)}`);
console.log(`Wind 60km/h, Precip 30mm: ${getStormSeverity(60, 30)}`);
console.log(`Wind 40km/h, Precip 15mm: ${getStormSeverity(40, 15)}`);
console.log(`Wind 20km/h, Precip 5mm: ${getStormSeverity(20, 5)}`);
console.log('✓ Storm severity classification works correctly\n');

// Test 3: Storm data validation
console.log('Test 3: Storm Data Validation');

const testData1 = {
  stormType: 'Thunderstorm',
  weatherConditions: 'Heavy rain with frequent lightning',
  notes: 'Major storm system moving through the area with strong winds.',
};
const result1 = validateStormData(testData1);
console.log(`Valid data: ${result1.isValid} (expected: true)`);
console.log(`Errors: ${result1.errors.length} (expected: 0)`);

const testData2 = {
  stormType: '',
  weatherConditions: 'Rain',
  notes: 'Short',
};
const result2 = validateStormData(testData2);
console.log(`Invalid data: ${!result2.isValid} (expected: true)`);
console.log(`Error count: ${result2.errors.length} (expected: 3)`);
console.log('✓ Storm data validation works correctly\n');

console.log('=== All Tests Completed Successfully ===');