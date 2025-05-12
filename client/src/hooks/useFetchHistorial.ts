import { useEffect, useState } from "react";
import { fetchHistorialService } from "../services/fetchHistorialService";
import { MessageChat } from "../types/MessageChat";

export const useFetchHistorial = () => {
  const [messages, setMessages] = useState<MessageChat[]>([]); // State to store chat messages

  const [loading, setLoading] = useState(true); // State to manage the loading status

  const [error, setError] = useState<string | null>(null); // State to manage error messages

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historial = await fetchHistorialService(); // Fetch chat history from the service
        setMessages(historial); // Update the state with the fetched messages
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch chat history"
        );
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchHistorial();
  }, []);

  return {
    setMessages, // Function to update messages
    messages, // Return the chat messages
    loading, // Return the loading status
    error, // Return any error messages
  };
};
