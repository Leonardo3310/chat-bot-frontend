import React, { useState, useEffect } from "react";
import "./ChatComponent.css";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Cargar mensajes desde Local Storage al iniciar el componente
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  // Guardar mensajes en Local Storage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

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
      setMessages([...newMessages, { text: data.response, user: false }]);
    } catch (error) {
      console.error("Error:", error);
      // Puedes agregar un mensaje de error al chat si lo deseas
    }
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
