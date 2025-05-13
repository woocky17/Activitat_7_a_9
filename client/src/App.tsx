import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import "@mantine/core/styles.css";
import { Button, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // Usar useLocalStorage en vez de useState para persistencia
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>({
    key: "isAuthenticated",
    defaultValue: false,
  });
  const [user, setUser] = useLocalStorage<string>({
    key: "user",
    defaultValue: "",
  });

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser("");
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
      {isAuthenticated && (
        <>
          <Button
            onClick={handleLogout}
            color="red"
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
          >
            Cerrar sesión
          </Button>
          <Chat socket={socket} username={user} />
        </>
      )}
    </MantineProvider>
  );
};

export default App;
