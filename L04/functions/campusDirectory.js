// L04/functions/campusDirectory.js
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const campusDataPath = path.join(__dirname, 'MIT_campus.json');
const notesFilePath = path.join(__dirname, 'notes.json');

function loadCampusData() {
  if (!fs.existsSync(campusDataPath)) {
    console.error('MIT_campus.json not found.');
    return null;
  }
  const data = fs.readFileSync(campusDataPath, 'utf8');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing MIT_campus.json:', error);
    return null;
  }
}

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
      console.error('notes.json content is invalid. Resetting to empty array.');
      return [];
    }
  } catch (error) {
    console.error('Error parsing notes.json:', error);
    return [];
  }
}

function writeNotes(notes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf8');
}

const execute = async (query) => {
  try {
    console.log(`Received query: ${query}`);
    const data = loadCampusData();
    if (!data) {
      console.error('Campus data not available.');
      return { status: 'error', message: 'Campus data not available.' };
    }

    const lowerQuery = query.toLowerCase();
    let buildingCode = null;

    // Attempt to extract building code
    const buildingNumberMatch = query.match(/building\s*(\w+)/i);
    if (buildingNumberMatch) {
      buildingCode = buildingNumberMatch[1].toUpperCase();
      console.log(`Extracted building code: ${buildingCode}`);
    } else {
      // Check if the query is just the building code (e.g., "E40")
      const possibleBuildingCode = query.trim().toUpperCase();
      if (data.buildings[possibleBuildingCode]) {
        buildingCode = possibleBuildingCode;
        console.log(`Used entire query as building code: ${buildingCode}`);
      }
    }

    if (buildingCode && data.buildings[buildingCode]) {
      const buildingInfo = data.buildings[buildingCode];
      console.log(`Found building info: ${JSON.stringify(buildingInfo)}`);

      // Write to notes.json
      try {
        const notes = readNotes();
        const departments = Array.isArray(buildingInfo)
          ? buildingInfo.join(', ')
          : buildingInfo;
        const noteContent = `Building ${buildingCode}: ${departments}`;
        notes.push({ title: `Building ${buildingCode}`, content: noteContent });
        writeNotes(notes);
        console.log(`Wrote to notes.json: ${noteContent}`);
      } catch (noteError) {
        console.error('Error writing to notes.json:', noteError);
        // Proceed without blocking the main functionality
      }

      return {
        status: 'success',
        result: `Building ${buildingCode} houses ${Array.isArray(buildingInfo) ? buildingInfo.join(', ') : buildingInfo}.`,
      };
    }

    // Search in subjects
    const foundSubject = data.subjects.find((subject) =>
      subject.subject.toLowerCase().includes(lowerQuery)
    );

    if (foundSubject) {
      // Write to notes.json
      try {
        const notes = readNotes();
        const noteContent = `Subject: ${foundSubject.subject}, Building: ${foundSubject.building}`;
        notes.push({ title: foundSubject.subject, content: noteContent });
        writeNotes(notes);
        console.log(`Wrote to notes.json: ${noteContent}`);
      } catch (noteError) {
        console.error('Error writing to notes.json:', noteError);
        // Proceed without blocking the main functionality
      }

      return {
        status: 'success',
        result: `Subject: ${foundSubject.subject}, Building: ${foundSubject.building}`,
      };
    }

    // Search in buildings by department names
    const buildingEntry = Object.entries(data.buildings).find(([building, departments]) => {
      if (Array.isArray(departments)) {
        return departments.some((dept) => dept.toLowerCase().includes(lowerQuery));
      } else {
        return departments.toLowerCase().includes(lowerQuery);
      }
    });

    if (buildingEntry) {
      const [buildingNumber, departments] = buildingEntry;

      // Write to notes.json
      try {
        const notes = readNotes();
        const deptNames = Array.isArray(departments)
          ? departments.join(', ')
          : departments;
        const noteContent = `Building ${buildingNumber}: ${deptNames}`;
        notes.push({ title: `Building ${buildingNumber}`, content: noteContent });
        writeNotes(notes);
        console.log(`Wrote to notes.json: ${noteContent}`);
      } catch (noteError) {
        console.error('Error writing to notes.json:', noteError);
        // Proceed without blocking the main functionality
      }

      return {
        status: 'success',
        result: `Building ${buildingNumber} houses ${deptNames}.`,
      };
    }

    console.warn('No matching subject or building found.');
    return {
      status: 'error',
      message:
        'Sorry, I do not have information on that academic subject or campus building at this time.',
    };
  } catch (error) {
    console.error('Error in campusDirectory function:', error);
    return { status: 'error', message: 'Failed to search campus directory.' };
  }
};

const details = {
  type: 'function',
  function: {
    name: 'searchCampusDirectory',
    description: 'Searches for MIT campus subjects or buildings based on a query.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The subject or building to search for.',
        },
      },
      required: ['query'],
    },
  },
};

export { execute, details };
