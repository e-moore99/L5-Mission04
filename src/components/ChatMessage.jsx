import React from "react";

export function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "user-chat" : "bot-chat"}>
      <div>
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>
      <div>{content}</div>
    </div>
  );
}
