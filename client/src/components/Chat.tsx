import React from "react";
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

interface ChatProps {
  messages: string[];
  input: string;
  setInput: (value: string) => void;
  socket: WebSocket | null;
  username: string;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  input,
  setInput,
  socket,
  username,
}) => {
  const sendMessage = async () => {
    if (!input || !socket) {
      console.log(
        "No se puede enviar el mensaje: input vacío o socket no conectado."
      );
      return;
    }

    const message = { autor: username, contenido: input };
    console.log("Enviando mensaje:", message);

    // Enviar mensaje al WebSocket
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket no está abierto.");
    }
    messages.push(`${username}: ${input}`);
    setInput("");

    // Guardar el mensaje en el historial a través del endpoint
    try {
      const response = await fetch("http://localhost:4000/api/save_hist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sender: username,
        }),
      });

      if (!response.ok) {
        console.error("Error al guardar el historial:", await response.json());
      }
    } catch (error) {
      console.error("Error de conexión al guardar el historial:", error);
    }
  };

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
          Chat REST → WebSocket
        </Title>

        <ScrollArea h={300} offsetScrollbars scrollbarSize={6}>
          <Stack gap="xs">
            {messages.map((msg, i) => (
              <Paper
                key={i}
                shadow="xs"
                radius="md"
                p="sm"
                bg={msg.startsWith(username) ? "blue.0" : "gray.0"}
              >
                <Text size="sm">{msg}</Text>
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
