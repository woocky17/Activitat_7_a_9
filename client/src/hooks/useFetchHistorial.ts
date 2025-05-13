import { useEffect, useState } from "react";
import { fetchHistorialService } from "../services/fetchHistorialService";
import { MessageChat } from "../types/MessageChat";

// Hook personalizado para obtener el historial del chat
export const useFetchHistorial = () => {
  const [messages, setMessages] = useState<MessageChat[]>([]); // Estado para guardar los mensajes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  // Ejecuta la petición al montar el componente
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historial = await fetchHistorialService(); // Llama al servicio para obtener historial
        setMessages(historial); // Actualiza mensajes
        setError(null); // Limpia errores anteriores
      } catch (err) {
        // Captura y guarda el error como string
        setError(
          err instanceof Error ? err.message : "Failed to fetch chat history"
        );
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchHistorial();
  }, []);

  // Devuelve datos y funciones necesarias al componente que lo usa
  return {
    setMessages,
    messages,
    loading,
    error,
  };
};
