import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatComponent.css";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, user: false },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Hubo un problema al conectar con el servidor.", user: false },
      ]);
    } finally {
      setIsLoading(false);
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
            {!msg.user && (
              <img
                src="/logoCHat.png" // Cambia esto por la ruta de tu logo
                alt="Bot Logo"
                className="bot-logo"
              />
            )}
            {msg.user ? (
              msg.text
            ) : (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <img
              src="/logoCHat.png" // Ruta de tu logo
              alt="Bot Logo"
              className="bot-logo"
            />
            <div className="spinner"></div>
            <span>Escribiendo...</span>
          </div>
        )}
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