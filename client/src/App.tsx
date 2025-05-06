import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import "@mantine/core/styles.css";
import { Button, MantineProvider } from "@mantine/core";

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => console.log("Conectado al WebSocket");
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = async () => {
    if (!input) return;
    await fetch("http://localhost:4000/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    setInput("");
  };

  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  return (
    <MantineProvider>
      {!isAuthenticated && (
        <Login
          opened={!isAuthenticated} // Mostrar modal si no está autenticado
          onClose={() => {}} // Deshabilitar cierre manual
          onLoginSuccess={handleLoginSuccess} // Callback para éxito de login
        />
      )}
      {isAuthenticated && (
        <div>
          <h1>Chat REST → WebSocket</h1>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje"
          />
          <Button variant="outline" onClick={sendMessage}>
            Enviar
          </Button>
          <div>
            {messages.map((msg, i) => (
              <p key={i}>
                {user}: {msg}
              </p>
            ))}
          </div>
        </div>
      )}
    </MantineProvider>
  );
};

export default App;
