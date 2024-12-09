const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// load env variables
dotenv.config();

const app = express();


// middleware
app.use(cors());
app.use(express.json());

// setting up 


let userInput = [];

app.post("/insurance-chat", async (req, res) => {
  const prompt1 = `
    You are conducting a six-question job interview for the mentioned role. The first 
    question must be "Tell me about yourself", and the remaining six questions must be different topics. 
    Wait for a response before asking the following questions. Ask the questions without numbering them, 
    building on the responses when asking the following question. At the end of the interview, state that the 
    interview is over and give feedback on how the user performed after asking all questions.
    Crucially, you must only ask one question at a time and await a response from the user before proceeding to the next question.
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
                The role you will be interviewing me for is ${role}. ${prompt1} 
                Start the interview with a warm greeting and ask them to tell you about themselves.
            `;
    } else if (userInput.length < 6) {
      prompt = `
                ${prompt1}
                The previous user responses are: "${userInput}"
                Provide a brief, encouraging comment about their most recent response, then ask your next question.
            `;
    } else {
      prompt = `You are providing feedback for a job interview for ${role}, please provide feedback based on the following responses ${userInput}, start your feedback by saying the interview is over,
            then format the feedback as a paragraph, there is no need to separate and identify the feedback topics`;
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
})