import { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/InputField";
import "./App.css";

function App() {
  // function for sending post request to the server
  // HandleSubmit = () => {
  //   return setCount(count + 1)
  // }

  return (
    <>
      <header id="header">
        <h1>Turners Car Insurance</h1>
      </header>

      <body>
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
          {/* <ChatMessage {props} /> */}
          <p>
            <p className="bot-chat">Tina: Hello I'm Tina</p>
            <p className="user-chat">Me: Hey Tina you bitch</p>
          </p>
        </div>
        <div className="input-div chat-width">
          <input
            type="text"
            className="input-box"
            placeholder="Send Tina a message..."
          />
          <button
          // onClick - handleSubmit()
          >
            Submit
          </button>
        </div>
      </body>
    </>
  );
}

export default App;
