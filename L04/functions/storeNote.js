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
    return {};
  }
  const data = fs.readFileSync(notesFilePath, 'utf8');
  if (data.trim() === '') {
    // Handle empty file
    return {};
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing notes.json:', error);
    // Optionally, you can back up the corrupted file
    // fs.renameSync(notesFilePath, notesFilePath + '.backup');
    // Or reset the file
    // fs.writeFileSync(notesFilePath, '{}', 'utf8');
    return {};
  }
}

function writeNotes(notes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf8');
}

const execute = async (title, content) => {
  try {
    const notes = readNotes();
    notes[title] = content;
    writeNotes(notes);
    console.log(`Note "${title}" stored successfully.`);
    return { status: 'success', message: `Note "${title}" stored successfully.` };
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
