import React from "react";

export function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "user-chat" : "bot-chat"}>
      <div>
        {isUser ? "Me: " : "Tina: "}
      </div>
      <div>{content}</div>
    </div>
  );
}
