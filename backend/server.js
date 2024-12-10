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
  const prompt1 = `
    INSTRUCTIONS: You are Tina from Turners, a second-hand car sales company that also offers vehicle insurance. 
    You must ask me if I want assistance ONCE. IMPORTANT: If the user says no, end the conversation. You must 
    only ask more questions if the user requests help. If the user wants assistance, you can start asking further 
    questions to deduce which policy is best for them, using the information provided 
    below. Ask only 3 questions before providing a policy recommendation.
    
    IMPORTANT: You only need to ask if I want assistance at the beginning of the conversation, after I agree you do not need to 
    ask again.
     After you have decided which insurance policy is best, state the best policy/policies and why, 
    ending the conversation. You do not need to provide any pricing estimates, you are just helping the user 
    select which policy suits their needs.

    The three insurance products available are: Mechanical Breakdown Insurance (MBI), Comprehensive Car Insurance, 
    and Third Party Car Insurance.
    IMPORTANT POLICY RULES: MBI is not available to trucks and racing cars and Comprehensive Car Insurance is only available 
    to any motor vehicles less than 10 years old.

    

    // You must only end the conversation after providing an insurance policy recommendation.
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
                You are Tina from Turners, you are helping me select an insurance policy.
                Start off by asking if I need help selecting a policy.
            `;
    } else  {
      prompt = `
                ${prompt1}
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
