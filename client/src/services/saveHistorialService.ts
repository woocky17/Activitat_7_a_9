import { MessageChat } from "../types/MessageChat";

// Servicio para guardar el mensaje en el historial
const saveHistService = async (message: MessageChat) => {
  try {
    const response = await fetch("http://localhost:4000/api/save_hist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    // Si la respuesta no es exitosa, muestra el error
    if (!response.ok) {
      console.error("Error al guardar el historial:", await response.json());
    }
  } catch (error) {
    // Maneja errores de conexión
    console.error("Error de conexión al guardar el historial:", error);
  }
};

export default saveHistService;
