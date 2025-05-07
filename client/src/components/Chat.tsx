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
  const sendMessage = () => {
    if (!input || !socket) {
      console.log(
        "No se puede enviar el mensaje: input vacío o socket no conectado."
      );
      return;
    }

    const message = { autor: username, contenido: input };
    console.log("Enviando mensaje:", message);

    socket.send(JSON.stringify(message));
    messages.push(`${username}: ${input}`);
    setInput("");
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
