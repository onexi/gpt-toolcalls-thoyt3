// L04/functions/calculate.js
import fs from 'fs'; // Import the fs module
import path from 'path'; // Import the path module
import { dirname } from 'path'; // Import the dirname function from the path module
import { fileURLToPath } from 'url'; // Import the fileURLToPath function from the url module

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = dirname(__filename); // Get the directory name of the current file

const mathNotesFilePath = path.join(__dirname, 'mathnotes.json'); // Define the path to the mathnotes.json file

function readMathNotes() { // Define the readMathNotes function
  if (!fs.existsSync(mathNotesFilePath)) { // Check if the mathnotes.json file exists
    return []; // Return an empty array if the file does not exist
  } // End of if statement
  const data = fs.readFileSync(mathNotesFilePath, 'utf8'); // Read the contents of the mathnotes.json file
  if (data.trim() === '') { // Check if the file is empty
    return []; // Return an empty array if the file is empty
  } // End of if statement
  try { // Try to parse the JSON data
    return JSON.parse(data); // Return the parsed JSON data
  } catch (error) { // Catch any errors that occur during parsing
    console.error('Error parsing mathnotes.json:', error);  // Log the error to the console
    return []; // Return an empty array
  } // End of try...catch block
} // End of readMathNotes function

function writeMathNotes(mathNotes) {  // Define the writeMathNotes function
  fs.writeFileSync(mathNotesFilePath, JSON.stringify(mathNotes, null, 2), 'utf8'); // Write the math notes to the mathnotes.json file
} // End of writeMathNotes function

const execute = async (number1, number2, operator) => { // Define the execute function
  try {
    // Convert inputs to numbers
    number1 = Number(number1); // Convert number1 to a number
    number2 = Number(number2); // Convert number2 to a number

    // Check for NaN (Not a Number)
    if (isNaN(number1) || isNaN(number2)) { // Check if either number is NaN
      return { status: 'error', message: 'Invalid numbers provided.' }; // Return an error message
    } // End of if statement

    let result; // Declare a variable to store the result of the calculation
    let operationStr; // Declare a variable to store the operation string

    switch (operator) { // Perform the calculation based on the operator
      case '+': // Addition
        result = number1 + number2; // Perform addition
        operationStr = `${number1} + ${number2} = ${result}`; // Create the operation string
        break; // Exit the switch statement
      case '-': // Subtraction
        result = number1 - number2; // Perform subtraction
        operationStr = `${number1} - ${number2} = ${result}`; // Create the operation string
        break; // Exit the switch statement
      case '×': // Multiplication
        result = number1 * number2;   // Perform multiplication
        operationStr = `${number1} × ${number2} = ${result}`; // Create the operation string
        break; // Exit the switch statement
      case '÷': // Division
        if (number2 === 0) { // Check for division by zero
          return { status: 'error', message: 'Cannot divide by zero.' }; // Return an error message
        } // End of if statement
        result = number1 / number2; // Perform division
        operationStr = `${number1} ÷ ${number2} = ${result}`; // Create the operation string
        break; // Exit the switch statement
      case '^': // Exponentiation
        result = Math.pow(number1, number2); // Perform exponentiation
        operationStr = `${number1} ^ ${number2} = ${result}`; // Create the operation string
        break; // Exit the switch statement
      default: // Invalid operator
        return { status: 'error', message: 'Invalid operator provided.' }; // Return an error message
    } // End of switch statement

    // Read existing math notes
    const mathNotes = readMathNotes(); // Read the existing math notes

    // Add the new operation
    mathNotes.push(operationStr); // Add the operation string to the math notes

    // Write back to mathnotes.json
    writeMathNotes(mathNotes); // Write the updated math notes to the mathnotes.json file

    console.log(`Performed calculation: ${operationStr}`); // Log the performed calculation to the console
    return { status: 'success', result: result }; // Return the result of the calculation
  } catch (error) { // Catch any errors that occur during the calculation
    console.error('Error performing calculation:', error); // Log the error to the console
    return { status: 'error', message: 'Failed to perform calculation.' }; // Return an error message
  } // End of try...catch block
};  // End of execute function

const details = { // Define the details object
  type: 'function', // Specify the type of the details
  function: { // Define the function details
    name: 'calculate', // Specify the name of the function
    description: 'Performs a mathematical operation on two numbers.', // Provide a description of the function
    parameters: { // Define the parameters expected by the function
      type: 'object', // Specify the type of the parameters
      properties: { // Define the properties of the parameters
        number1: { // Define the first number parameter
          type: 'number', // Specify the type of the parameter
          description: 'The first number.', // Provide a description of the parameter
        }, // End of number1 parameter
        number2: { // Define the second number parameter
          type: 'number', // Specify the type of the parameter
          description: 'The second number.', // Provide a description of the parameter
        }, // End of number2 parameter
        operator: { // Define the operator parameter
          type: 'string', // Specify the type of the parameter
          description: 'The operator to use. One of "+", "-", "×", "÷", "^".', // Provide a description of the parameter
          enum: ['+', '-', '×', '÷', '^'], // Specify the allowed values for the parameter
        }, // End of operator parameter
      }, // End of properties
      required: ['number1', 'number2', 'operator'], // Specify the required parameters
    }, // End of parameters
  }, // End of function
}; // End of details object

export { execute, details }; // Export the execute function and details object
