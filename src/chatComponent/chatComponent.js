import "katex/dist/katex.min.css"; // Importa estilos de KaTeX
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex"; // Habilita soporte para LaTeX
import rehypeRaw from "rehype-raw"; // Permite contenido HTML en Markdown
import remarkGfm from "remark-gfm"; //habilita el soporte para las tablas
import remarkMath from "remark-math"; // Detecta matemáticas en Markdown
import "./ChatComponent.css";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga
  const messagesEndRef = useRef(null); // Referencia al final del contenedor de mensajes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Desplázate al último mensaje cuando cambien los mensajes
  }, [messages]);

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

      // Verificar si la respuesta es JSON
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Procesar la respuesta JSON, asegurándose de que `data.response` exista
      if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, user: false },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Respuesta no válida del servidor.", user: false },
        ]);
      }
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
      <img
          src="/FINANCHAT_round.png"
          alt="Bot Logo"
          className="bot-logo"
              />
        <h1>  FINANCHAT</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user ? "message user-message" : "message bot-message"}
          >
            {!msg.user && (
          <div className="bot-message-content">
            <div className="bot-header">
              <img
                src="/FINANCHAT_round.png"
                alt="Bot Logo"
                className="bot-logo"
              />
              <span className="bot-name">Financhat</span> {/* Nombre del bot */}
            </div>
            <div className="bot-message-text">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]} // Procesa las matemáticas
                rehypePlugins={[rehypeKatex, rehypeRaw]} // Renderiza las matemáticas y HTML
              >
                {sanitizeMessage(msg.text)}
              </ReactMarkdown>
            </div>
          </div>
        )}

            {msg.user && <span>{msg.text}</span>}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <img src="/FINANCHAT_LOGO.png" alt="Bot Logo" className="bot-logo" />
            <div className="spinner"></div>
            <span>Escribiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Ancla para desplazarse al final */}
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

const sanitizeMessage = (text) => {
  return text
    .replace(/\\\$/g, "$$") // Asegura delimitadores de bloque
    .replace(/\\\\/g, "\\") // Limpia escapes adicionales
    .trim(); // Elimina espacios innecesarios
};

export default ChatComponent;
