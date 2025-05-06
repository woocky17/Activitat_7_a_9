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
} from "@mantine/core";

interface ChatProps {
  messages: string[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  username: string;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  input,
  setInput,
  onSend,
  username,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2}>Chat REST → WebSocket</Title>

        <ScrollArea h={300}>
          <Stack gap="xs">
            {messages.map((msg, i) => (
              <Text key={i}>
                {username}: {msg} 
              </Text>
            ))}
          </Stack>
        </ScrollArea>

        <Group grow>
          <TextInput
            placeholder="Escribe un mensaje"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <Button onClick={onSend} variant="outline">
            Enviar
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default Chat;
