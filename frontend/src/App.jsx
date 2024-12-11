import { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import "./App.css";

function App() {
  // setting state for chat messages
  const [state, setState] = useState({
    messages: [],
    isLoading: false,
    isComplete: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [initialResponseLoaded, setInitialResponseLoaded] = useState(false);

  const handleSubmitResponse = async (e) => {
    e.preventDefault(); //prevents default form sub
    const message = inputValue;
    setInputValue("");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "user", content: message }],
      isLoading: true,
    }));

    try {
      const response = await fetch(
        "http://localhost:3000/gemini/insurance-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userResponse: message,
          }),
        },
        console.log(message)
  
      );

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();
      console.log("Response from API:", data);

      if (data.isComplete) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          messages: [...prev.messages,
             { role: "assistant", content: data.message }],
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: data.message,
          },
        ],
      }));
    } catch (error) {
      console.error("Error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  // Function to load the initial response from the AI
  const loadInitialResponse = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await fetch(
        "http://localhost:3000/gemini/insurance-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userResponse: "", // Initial empty response
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();
      console.log("Initial response from API:", data);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        messages: [
          ...prev.messages,
          { role: "assistant", content: data.message },
        ],
      }));
    } catch (error) {
      console.error("Error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  // Call the function to load the initial response if not already loaded
  if (!initialResponseLoaded) {
    loadInitialResponse();
    setInitialResponseLoaded(true);
  }

  return (
    <>
      <header id="header">
        <h1>Turners Car Insurance</h1>
      </header>

      <div className="body">
        <div className="tina-paragraph">
          <img
            src="/images/tina.jpg"
            alt="Tina from Turners"
            className="tina-img"
          />
          <h3>
            On the lookout for a new insurance policy? Have a chat with Tina!{" "}
            <br />
            She'll let you know your other options and help you find the best
            policy for you.
          </h3>
        </div>
        <div className="chat-window chat-width">
          {state.messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
        <div className="input-div chat-width">
          <input
            type="text"
            className="input-box"
            placeholder="Send Tina a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSubmitResponse}>Submit</button>
        </div>
      </div>
    </>
  );
}

export default App;
