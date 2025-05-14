import { useEffect, useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Multer from "./components/Multer";
import "@mantine/core/styles.css";
import { Button, Group, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const App = () => {
  // Estado para manejar la conexión WebSocket
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Estado persistente para saber si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>({
    key: "isAuthenticated",
    defaultValue: false,
  });

  // Estado persistente para almacenar el nombre del usuario autenticado
  const [user, setUser] = useLocalStorage<string>({
    key: "user",
    defaultValue: "",
  });

  // useEffect para establecer la conexión WebSocket al montar el componente
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    ws.onopen = () => console.log("Conectado al WebSocket");
    setSocket(ws);

    // Cerrar conexión WebSocket al desmontar el componente
    return () => ws.close();
  }, []);

  // Función que se llama cuando el login es exitoso
  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  // Función para cerrar sesión y limpiar estados
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser("");
  };

  return (
    // Proveedor de Mantine para estilos y configuración del tema
    <MantineProvider>
      {/* Mostrar login si el usuario no está autenticado */}
      {!isAuthenticated && (
        <Login
          opened={!isAuthenticated}
          onClose={() => {}}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Mostrar el chat y Multer si el usuario está autenticado */}
      {isAuthenticated && (
        <>
          {/* Botón para cerrar sesión */}
          <Button
            onClick={handleLogout}
            color="red"
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
          >
            Cerrar sesión
          </Button>

          <Group>
            {/* Componente del chat que recibe el socket y el nombre del usuario */}
            <Chat socket={socket} username={user} />

            {/* Componente para subir y listar archivos */}
            <Multer />
          </Group>
        </>
      )}
    </MantineProvider>
  );
};

export default App;
