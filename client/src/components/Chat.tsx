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
import { getHistorial } from "../services/getHistService";
import { MessageChat } from "../types/MessageChat";
import saveHistService from "../services/saveHistService";

interface ChatProps {
  socket: WebSocket | null;
  username: string;
}

const Chat: React.FC<ChatProps> = ({ socket, username }) => {
  const [messages, setMessages] = useState<MessageChat[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial

  useEffect(() => {
    const fetchHistorial = async () => {
      const historial = await getHistorial();
      setMessages(historial); // Cargar el historial en el estado de mensajes
      setLoading(false); // Marcar como cargado
    };

    fetchHistorial();
  }, []);
  // Manejar mensajes recibidos en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  // Enviar mensaje
  const sendMessage = () => {
    if (!input || !socket) return;

    const message = {
      sender: username,
      message: input,
      timestamp: new Date().toISOString(),
    };

    saveHistService(message); // Guardar el mensaje en el historial

    socket.send(JSON.stringify({ type: "chat", ...message }));
    setInput(""); // Limpiar el campo de entrada
  };

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
