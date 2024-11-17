import React, { useState } from "react";
import "./ChatComponent.css";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Agregar el mensaje del usuario a la lista de mensajes
    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    setInput("");

    try {
      // Enviar el mensaje al backend
      const response = await fetch("http://127.0.0.1:5000/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      // Agregar la respuesta del bot a la lista de mensajes
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, user: false },
      ]);
    } catch (error) {
      console.error("Error:", error);
      // Agregar un mensaje de error si el backend falla
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Hubo un problema al conectar con el servidor.", user: false },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Bot</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user ? "message user-message" : "message bot-message"}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default ChatComponent;