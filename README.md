[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9wDnMTRl)
# FunctionAgents
Call Function from LLM

Assignment Pset4 was a collaboration between Tom Hoyt and Ben Taylor. We each developed two new functions/tools, but really leveraged Tom's brilliance in seamlessly debugging the tool integration into the javascripts and html code.

In order to run the functions from the LLM:

Please make sure the following files are located in the local 'public' folder under the L04 subset of repository:
index.html
bridge.png

Make sure the following files are located in the 'functions' folder of code programming application explorer under L04:
calculate.js
getNote.js
listNotes.js
mathnotes.json
scratchpad.js
storeNote.js
campusDirectory.js
MIT_campus.json
unitConversions.js

Make sure the following files are located in the 'open' area of code programming application explorer under L04:
server.js
.env

If not already there, please create a .env file in the 'open' area of the L04 directory and in it place the OpenAI API key that will be used in the following format:
OPENAI_API_KEY = "Place API Key Here”

To initiate the code, please make sure proper node packages are installed (run 'npm install -g' in the terminal),
ensure you change the directory to L04 using cd L04,
then run "node server.js" in the terminal and allow localhost on Port 3000 to run in desired browser.

Run the following commands if needed:
npm i --save-dev @types/cors
npm i --save-dev @types/express

Upon activation of Port 3000, the user will be able to engage with the LLM in the desired web browser and utilize the following tools from the drop down menu:

Manage Notes - the user will be able to input new notes for the LLM to store for future reference.  The user is also able to call for information in previously entered lists (i.e. "add fruit and milk to my grocery list" then call "what were the items in my grocery list?")

Do Math - performs basic math operations such as addition, subtraction, multiplication, division, and exponents.

Unit Conversion - conducts common unit conversions such as distances (feet, meters, etc) and temperatures (F, C)

Campus Directory - provides high-level information of the MIT campus as to where someone can which building to go to for a specific course subject (i.e. physics, civil engineering, mathematics, engineering management, etc).  Additionally, the user can query what is offered in each building number and the LLM will provide the desired information.