// L04/functions/storeNote.js
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const notesFilePath = path.join(__dirname, 'notes.json');

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

const execute = async (title, content) => {
  try {
    const notes = readNotes();

    // Add the new note to the array
    notes.push({ title: title, content: content });

    // Write back to notes.json
    writeNotes(notes);

    console.log(`Stored note titled "${title}".`);
    return { status: 'success', message: `Note titled "${title}" has been stored.` };
  } catch (error) {
    console.error('Error storing note:', error);
    return { status: 'error', message: 'Failed to store note.' };
  }
};

const details = {
  type: 'function',
  function: {
    name: 'storeNote',
    description: 'Stores a note with a title and content.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the note.',
        },
        content: {
          type: 'string',
          description: 'The content of the note.',
        },
      },
      required: ['title', 'content'],
    },
  },
};

export { execute, details };
