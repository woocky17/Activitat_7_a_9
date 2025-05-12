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
import saveHistService from "../services/saveHistService";
import { useFetchHistorial } from "../hooks/useFetchHistorial";

interface ChatProps {
  socket: WebSocket | null; // WebSocket connection for real-time communication
  username: string; // Username of the current user
}

const Chat: React.FC<ChatProps> = ({ socket, username }) => {
  const [input, setInput] = useState(""); // State to store the current input message

  const { error, messages, loading, setMessages } = useFetchHistorial(); // Custom hook to fetch chat history

  // Handle real-time messages received via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data); // Parse the incoming message
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data]); // Append the new message to the state
      }
    };

    socket.addEventListener("message", handleMessage); // Listen for incoming messages

    return () => {
      socket.removeEventListener("message", handleMessage); // Cleanup the listener on unmount
    };
  }, [setMessages, socket]);

  // Show error message if there's an error fetching the chat history
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
  // Function to send a message
  const sendMessage = () => {
    if (!input || !socket) return; // Do nothing if input is empty or socket is unavailable

    const message = {
      sender: username, // Current user's username
      message: input, // Message content
      timestamp: new Date().toISOString(), // Current timestamp
    };

    saveHistService(message); // Save the message to the history service

    socket.send(JSON.stringify({ type: "chat", ...message })); // Send the message via WebSocket
    setInput(""); // Clear the input field
  };

  // Show a loading card while the chat history is being fetched
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

  // Render the chat interface
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

        {/* Scrollable area to display chat messages */}
        <ScrollArea h={300} offsetScrollbars scrollbarSize={6}>
          <Stack gap="xs">
            {messages.map((msg, i) => (
              <Paper
                key={i}
                shadow="xs"
                radius="md"
                p="sm"
                bg={msg.sender === username ? "blue.0" : "gray.0"} // Different background for sent/received messages
              >
                <Text size="sm">
                  <strong>{msg.sender}</strong>: {msg.message}
                  <br />
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>{" "}
                  {/* Format the timestamp */}
                </Text>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>

        {/* Input field and send button */}
        <Group grow>
          <TextInput
            placeholder="Escribe un mensaje"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)} // Update input state on change
            radius="md"
            size="md"
          />
          <Button
            onClick={sendMessage} // Trigger sendMessage on click
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
