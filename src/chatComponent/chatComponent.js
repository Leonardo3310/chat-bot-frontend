import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex"; // Habilita soporte para LaTeX
import rehypeRaw from "rehype-raw"; // Permite contenido HTML en Markdown
import "katex/dist/katex.min.css"; // Importa estilos de KaTeX
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
        <h1>Financhat</h1>
      </div>
      <div className="chat-messages">
      <div className="static-example">
        {/* Ejemplo estático para probar LaTeX */}
        <ReactMarkdown
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          children={staticExample}
        />
      </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user ? "message user-message" : "message bot-message"}
          >
            {!msg.user && (
              <img
                src="/logoCHat.png"
                alt="Bot Logo"
                className="bot-logo"
              />
            )}
            {msg.user ? (
              msg.text
            ) : (
              <ReactMarkdown
                rehypePlugins={[rehypeKatex, rehypeRaw]} // Activa soporte para LaTeX y HTML
                children={processMessage(msg.text)}
              />
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <img src="/logoCHat.png" alt="Bot Logo" className="bot-logo" />
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

const processMessage = (text) => {
  return text
    .replace(/\\\[/g, "$$") // Asegura delimitadores de bloque
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "\\(") // Asegura delimitadores inline
    .replace(/\\\)/g, "\\)")
    .replace(/\\\\/g, "\\") 
    .replace(/\n/g, "  \n"); // Convierte saltos de línea a Markdown
};
const staticExample = `
Aquí tienes un ejemplo estático de fórmula LaTeX:
$$ i = \\frac{5.5}{100} = 0.055 $$
`;
export default ChatComponent;