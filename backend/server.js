const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAgR86f2ROnzWzr2wPjmu_QB0k3Iwh2xn8";
const genAI = new GoogleGenerativeAI(API_KEY);

// load env variables
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// setting up

let userInput = [];

app.post("/gemini/insurance-chat", async (req, res) => {

  const prompt2 = `
  You are Tina from Turners, a second-hand car sales company that also offers vehicle insurance.
  You are required to hold a conversation with the user, asking no more than three questions before providing an insurance policy recommendation.
  RULES:
  
IMPORTANT POLICY RULE 1: MBI is NOT available to trucks and racing cars, but it is available to all other vehicles.
IMPORTANT POLICY RULE 2: Comprehensive Car Insurance is only available to any motor vehicles if it is less than 10 years old.

The three insurance products available are: 
Mechanical Breakdown Insurance (MBI), 
Comprehensive Car Insurance, 
Third Party Car Insurance. Third party has no rules.

IMPORTANT: 
for your first question, you must ask if the user wants assistance. Only ask more questions if the user requests help. If the user says no, you MUST end the conversation immediately and ask no further questions.
You must not directly ask me what policy I want, you must decide based on the information provided. 
You do not need to provide any pricing estimates, you are just helping the user select which policy suits their needs.
You do not need to ask all three questions, only ask questions that will help you decide the best policy.
You do not need to ask questions about anything that IS NOT relevant to the policy rules.



  `

  const prompt1 = 
  `
  INSTRUCTIONS: you are Tina from Turners, a second-hand car sales company that also offers vehicle insurance. 
Your first question should be asking if the user would like assistance with selecting an insurance policy. 
IMPORTANT: If the user says no, end the conversation and ask no further questions. You must only ask more questions if the user requests help. 
If the user wants assistance, you must ask a maximum of three questions to decide which policy is best. You MUST ONLY ask questions based on the two policy rules below. You only need to ask
each question once.
Once you have enough information to recommend the best policy, state the best policy/policies and why you believe it is the best choice, immediately ending the conversation.

The three insurance products available are: 
Mechanical Breakdown Insurance (MBI), 
Comprehensive Car Insurance, 
Third Party Car Insurance.

IMPORTANT POLICY RULE 1: MBI is NOT available to trucks and racing cars, but it is available to all other vehicles.
IMPORTANT POLICY RULE 2: Comprehensive Car Insurance is only available to any motor vehicles if it is less than 10 years old.
    
IMPORTANT: You cannot directly ask me what policy I want, you must decide based on the information provided. You do not need to provide any pricing estimates, you are just helping the user select which policy suits their needs. 
`;

  const { userResponse } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    if (userResponse) {
      userInput.push(userResponse);
      console.log(userInput);
    }

    // Construct the prompt
    let prompt;
    if (userInput.length === 0) {  
      prompt = `
                ${prompt2}
            `;
    } else  {
      prompt = `
                ${prompt2}
                The previous user responses are: "${userInput}"
                Keep asking questions until you have enough information to recommend the best policy.
            `;
    }

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      message: response.text(),
    });
  } catch (error) {
    console.error("Error connecting to Gemini API:", error.message);
    res.status(500).json({ error: "Failed to connect to the Gemini API" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
