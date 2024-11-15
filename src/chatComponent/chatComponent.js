import React, { useState } from "react";
import "./chatComponent.css"; // Importa el archivo CSS para los estilos

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, user: true }]);
    setInput("");

    const response = await fetch("http://127.0.0.1:5000/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    setMessages([...messages, { text: input, user: true }, { text: data.response, user: false }]);
  };

  return (
    <div className="chat-container">
      <h1>Chat Bot</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatComponent;
