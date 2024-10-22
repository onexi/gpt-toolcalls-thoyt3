// L04/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express server
const app = express();
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Global state
let state = {
  chatgpt: false,
  assistant_id: '',
  assistant_name: '',
  dir_path: '',
  news_path: '',
  thread_id: '',
  user_message: '',
  run_id: '',
  run_status: '',
  vector_store_id: '',
  tools: [],
  parameters: [],
};

// Messages array to maintain conversation history
let messages = [
  {
    role: 'system',
    content:
      'You are an assistant that helps manage notes, perform mathematical calculations, search the MIT campus directory, and perform unit conversions. You can store notes, retrieve them, list all notes, perform operations like addition, subtraction, multiplication, division, and exponentiation on two numbers, search for MIT subjects or buildings, and convert units. Use the provided functions (storeNote, getNote, listNotes, calculate, searchCampusDirectory, convertUnits) to perform these tasks. After executing a function, provide the user with a clear and informative response based on the function\'s result.',
  },
];

// Function to dynamically import all functions, excluding specified files
async function getFunctions() {
  const functionsDir = path.join(__dirname, 'functions');
  const files = fs.readdirSync(functionsDir);
  const functions = {};

  const excludeFiles = ['scratchpad.js'];

  for (const file of files) {
    if (file.endsWith('.js') && !excludeFiles.includes(file)) {
      const modulePath = path.join(functionsDir, file);
      const moduleUrl = pathToFileURL(modulePath).href;
      const { execute, details } = await import(moduleUrl);

      functions[details.function.name] = {
        execute: execute,
        details: details.function,
      };
    }
  }
  return functions;
}

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle OpenAI API calls
app.post('/api/openai-call', async (req, res) => {
  const { user_message } = req.body;

  const functions = await getFunctions();
  const availableFunctions = Object.values(functions).map((fn) => fn.details);
  console.log(`Available Functions: ${JSON.stringify(availableFunctions)}`);

  // Add user's message to messages array
  messages.push({ role: 'user', content: user_message });

  try {
    // First OpenAI API call
    const response = await openai.chat.completions.create({
      model: 'gpt-4-0613',
      messages: messages,
      functions: availableFunctions,
      function_call: 'auto',
    });

    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    // Check if the assistant wants to call a function
    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

      console.log(
        `Assistant is calling function ${functionName} with arguments ${JSON.stringify(
          functionArgs
        )}`
      );

      // Execute the function
      const functionResult = await functions[functionName].execute(
        ...Object.values(functionArgs)
      );

      // Add the function result to the messages
      messages.push({
        role: 'function',
        name: functionName,
        content: JSON.stringify(functionResult),
      });

      // Second OpenAI API call to get the assistant's response
      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4-0613',
        messages: messages,
      });

      const finalAssistantMessage = secondResponse.choices[0].message;
      messages.push(finalAssistantMessage);

      res.json({ message: messages, state: state });
    } else {
      // No function call, just return the assistant's message
      res.json({ message: messages, state: state });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'OpenAI API failed', details: error.message });
  }
});

// Route to handle user prompts
app.post('/api/prompt', async (req, res) => {
  // Update the state with the new prompt
  state = req.body;
  try {
    res.status(200).json({ message: `Received prompt: ${state.user_message}`, state: state });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'User Message Failed', state: state });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
