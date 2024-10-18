// L04/functions/getNote.js
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

const execute = async (title) => {
  try {
    const notes = readNotes();
    if (notes.hasOwnProperty(title)) {
      console.log(`Note "${title}" retrieved.`);
      return { title: title, content: notes[title] };
    } else {
      console.log(`Note "${title}" not found.`);
      return { error: `Note "${title}" not found.` };
    }
  } catch (error) {
    console.error('Error retrieving note:', error);
    return { error: 'Failed to retrieve note.' };
  }
};

const details = {
  type: 'function',
  function: {
    name: 'getNote',
    description: 'Retrieves a note by its title.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the note to retrieve.',
        },
      },
      required: ['title'],
    },
  },
};

export { execute, details };
