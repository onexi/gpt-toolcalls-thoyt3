// L04/functions/unitConversions.js
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const notesFilePath = path.join(__dirname, 'mathnotes.json');

// Function to read notes from mathnotes.json
function readNotes() {
  if (!fs.existsSync(notesFilePath)) {
    return [];
  }
  const data = fs.readFileSync(notesFilePath, 'utf8');
  if (data.trim() === '') {
    return [];
  }
  try {
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      // Wrap the object in an array
      return [parsedData];
    } else {
      console.error('mathnotes.json content is invalid. Resetting to empty array.');
      return [];
    }
  } catch (error) {
    console.error('Error parsing mathnotes.json:', error);
    return [];
  }
}

// Function to write mathnotes to mathnotes.json
function writeNotes(mathnotes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(mathnotes, null, 2), 'utf8');
}

// Conversion functions
const conversions = {
  length: {
    metersToFeet: (value) => value * 3.28084,
    feetToMeters: (value) => value / 3.28084,
    kilometersToMiles: (value) => value * 0.621371,
    milesToKilometers: (value) => value / 0.621371,
  },
  temperature: {
    celsiusToFahrenheit: (value) => (value * 9) / 5 + 32,
    fahrenheitToCelsius: (value) => ((value - 32) * 5) / 9,
  },
  // Add more conversions as needed
};

const execute = async (value, fromUnit, toUnit) => {
  try {
    value = Number(value);
    if (isNaN(value)) {
      return { status: 'error', message: 'Invalid value provided.' };
    }

    let result;
    let conversionDescription = '';

    // Define possible conversions
    if (fromUnit === 'meters' && toUnit === 'feet') {
      result = conversions.length.metersToFeet(value);
      conversionDescription = `${value} meters is equal to ${result} feet.`;
    } else if (fromUnit === 'feet' && toUnit === 'meters') {
      result = conversions.length.feetToMeters(value);
      conversionDescription = `${value} feet is equal to ${result} meters.`;
    } else if (fromUnit === 'kilometers' && toUnit === 'miles') {
      result = conversions.length.kilometersToMiles(value);
      conversionDescription = `${value} kilometers is equal to ${result} miles.`;
    } else if (fromUnit === 'miles' && toUnit === 'kilometers') {
      result = conversions.length.milesToKilometers(value);
      conversionDescription = `${value} miles is equal to ${result} kilometers.`;
    } else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      result = conversions.temperature.celsiusToFahrenheit(value);
      conversionDescription = `${value} degrees Celsius is equal to ${result} degrees Fahrenheit.`;
    } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      result = conversions.temperature.fahrenheitToCelsius(value);
      conversionDescription = `${value} degrees Fahrenheit is equal to ${result} degrees Celsius.`;
    } else {
      return { status: 'error', message: 'Conversion not supported.' };
    }

    // Write the conversion to mathnotes.json
    try {
      const mathnotes = readNotes();
      const mathnoteTitle = `Conversion: ${value} ${fromUnit} to ${toUnit}`;
      const mathnoteContent = conversionDescription;
      mathnotes.push({ title: mathnoteTitle, content: mathnoteContent });
      writeNotes(mathnotes);
      console.log(`Wrote to mathnotes.json: ${mathnoteContent}`);
    } catch (noteError) {
      console.error('Error writing to mathnotes.json:', noteError);
      // Proceed without blocking the main functionality
    }

    return { status: 'success', result: result };
  } catch (error) {
    console.error('Error performing unit conversion:', error);
    return { status: 'error', message: 'Failed to perform unit conversion.' };
  }
};

const details = {
  type: 'function',
  function: {
    name: 'convertUnits',
    description: 'Converts a value from one unit to another.',
    parameters: {
      type: 'object',
      properties: {
        value: {
          type: 'number',
          description: 'The numerical value to convert.',
        },
        fromUnit: {
          type: 'string',
          description: 'The unit to convert from.',
        },
        toUnit: {
          type: 'string',
          description: 'The unit to convert to.',
        },
      },
    },
  },
};

export { execute, details };
