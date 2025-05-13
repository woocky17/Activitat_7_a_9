import { MessageChat } from "../types/MessageChat";

// Servicio para obtener el historial de mensajes desde el backend
export const fetchHistorialService = async (): Promise<MessageChat[]> => {
  try {
    // Realiza una petición GET al endpoint del backend
    const response = await fetch("http://localhost:4000/api/view_hist");

    // Si la respuesta no es exitosa, se maneja el error y se devuelve un array vacío
    if (!response.ok) {
      console.error("Error al obtener el historial:", await response.json());
      return [];
    }

    // Convierte la respuesta a formato JSON (lista de mensajes)
    const historial = await response.json();
    console.log("Historial recibido:", historial);

    // Devuelve el historial de mensajes
    return historial;
  } catch (error) {
    // Maneja cualquier error de conexión y muestra el error en consola
    console.error("Error de conexión al obtener el historial:", error);
    return [];
  }
};
