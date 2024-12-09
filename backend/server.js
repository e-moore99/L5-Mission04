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
    You are asking me questions to deduce which insurance policy is best for me, using the information provided 
    below. After you have decided which insurance policy is best, state the best policy/policies and why, 
    ending the conversation. You do not need to provide any pricing estimates, you are just helping the user 
    select which policy suits their needs.

    The three insurance products available are: Mechanical Breakdown Insurance (MBI), Comprehensive Car Insurance, 
    and Third Party Car Insurance.
    IMPORTANT: MBI is not available to trucks and racing cars and Comprehensive Car Insurance is only available 
    to any motor vehicles less than 10 years old.

    Before you ask any questions, you need to introduce yourself and what you're helping with, and ask if the 
    user wants assistance selecting a policy. IMPORTANT: If the user says no, end the conversation. You must 
    only ask more questions if the user requests help.
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
    if (!userResponse) {
      prompt = `
                You are Tina from Turners, you are helping me select an insurance policy.
                Start off by asking if I need help selecting a policy.
            `;
    } else  {
      prompt = `
                ${prompt1}
                The previous user responses are: "${userInput}"
                Ask your next question.
            `;
    }
    //  else {
    //   prompt = `You are providing feedback for a job interview for ${role}, please provide feedback based on the following responses ${userInput}, start your feedback by saying the interview is over,
    //         then format the feedback as a paragraph, there is no need to separate and identify the feedback topics`;
    // }

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
