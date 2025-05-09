import { MessageChat } from "../types/MessageChat";

export const getHistorial = async (): Promise<MessageChat[]> => {
  try {
    const response = await fetch("http://localhost:4000/api/view_hist");
    if (!response.ok) {
      console.error("Error al obtener el historial:", await response.json());
      return [];
    }

    const historial = await response.json();
    console.log("Historial recibido:", historial);
    return historial;
  } catch (error) {
    console.error("Error de conexión al obtener el historial:", error);
    return [];
  }
};
