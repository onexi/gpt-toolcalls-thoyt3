// L04/functions/listNotes.js
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
    return {};
  }
  const data = fs.readFileSync(notesFilePath, 'utf8');
  return JSON.parse(data);
}

const execute = async () => {
  try {
    const notes = readNotes();
    const titles = Object.keys(notes);
    console.log('Listing all note titles.');
    return { notes: titles };
  } catch (error) {
    console.error('Error listing notes:', error);
    return { error: 'Failed to list notes.' };
  }
};

const details = {
  type: 'function',
  function: {
    name: 'listNotes',
    description: 'Lists all stored note titles.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
};

export { execute, details };
