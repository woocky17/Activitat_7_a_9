import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => console.log("Conectado al WebSocket");

    setSocket(ws);
    return () => ws.close();
  }, []);

  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  return (
    <MantineProvider>
      {!isAuthenticated && (
        <Login
          opened={!isAuthenticated}
          onClose={() => {}}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {isAuthenticated && <Chat socket={socket} username={user} />}
    </MantineProvider>
  );
};

export default App;
