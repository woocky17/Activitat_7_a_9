import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Paper,
} from "@mantine/core";

// Hooks personalizados para manejar historial
import { useFetchHistorial } from "../hooks/useFetchHistorial";
import { useSaveHistorialService } from "../hooks/useSaveHistorialService";
import { useDownloadHistorialService } from "../hooks/useDownloadHistorialService";

// Props esperadas: conexión WebSocket y nombre del usuario
interface ChatProps {
  socket: WebSocket | null;
  username: string;
}

const Chat: React.FC<ChatProps> = ({ socket, username }) => {
  const [input, setInput] = useState(""); // Mensaje actual escrito por el usuario

  // Cargar historial desde API
  const { error, messages, loading, setMessages } = useFetchHistorial();

  // Guardar mensaje en historial
  const { saveHistorial } = useSaveHistorialService();

  // Descargar historial en formato JSON
  const {
    downloadHistorial,
    loading: downloading,
    error: downloadError,
  } = useDownloadHistorialService();

  // Descargar historial como archivo
  const handleDownloadHistorial = async () => {
    const blob = await downloadHistorial();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historial_${username}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  };

  // Escuchar mensajes entrantes vía WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data]); // Agregar nuevo mensaje al estado
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [setMessages, socket]);

  // Mostrar error si falla la carga del historial
  if (error) {
    return (
      <Card
        shadow="md"
        padding="xl"
        radius="lg"
        withBorder
        style={{ maxWidth: 600, margin: "auto", textAlign: "center" }}
      >
        <Title order={2} ta="center" c="red.7">
          Error: {error}
        </Title>
      </Card>
    );
  }

  // Enviar mensaje
  const sendMessage = () => {
    if (!input || !socket) return;

    const message = {
      sender: username,
      message: input,
      timestamp: new Date().toISOString(),
    };

    saveHistorial(message); // Guardar en historial
    socket.send(JSON.stringify({ type: "chat", ...message })); // Enviar por WebSocket
    setInput(""); // Limpiar input
  };

  // Mostrar "Cargando..." mientras se obtiene el historial
  if (loading) {
    return (
      <Card
        shadow="md"
        padding="xl"
        radius="lg"
        withBorder
        style={{ maxWidth: 600, margin: "auto", textAlign: "center" }}
      >
        <Title order={2} ta="center" c="blue.7">
          Cargando historial...
        </Title>
      </Card>
    );
  }

  // Interfaz principal del chat
  return (
    <Card
      shadow="md"
      padding="xl"
      radius="lg"
      withBorder
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <Stack gap="md">
        <Title order={2} ta="center" c="blue.7">
          Chat en Tiempo Real
        </Title>

        {/* Botón para descargar historial */}
        <Button
          onClick={handleDownloadHistorial}
          loading={downloading}
          color="teal"
          radius="md"
          size="sm"
          mb={5}
        >
          Descargar historial
        </Button>

        {/* Mensaje de error al descargar historial */}
        {downloadError && (
          <Text c="red" size="sm" ta="center">
            Error al descargar historial
          </Text>
        )}

        {/* Mostrar mensajes en scroll */}
        <ScrollArea h={300} offsetScrollbars scrollbarSize={6}>
          <Stack gap="xs">
            {messages.map((msg, i) => (
              <Paper
                key={i}
                shadow="xs"
                radius="md"
                p="sm"
                bg={msg.sender === username ? "blue.0" : "gray.0"}
              >
                <Text size="sm">
                  <strong>{msg.sender}</strong>: {msg.message}
                  <br />
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </Text>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>

        {/* Input y botón de enviar */}
        <Group grow>
          <TextInput
            placeholder="Escribe un mensaje"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            radius="md"
            size="md"
          />
          <Button
            onClick={sendMessage}
            variant="filled"
            color="blue"
            radius="md"
            size="md"
          >
            Enviar
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default Chat;
