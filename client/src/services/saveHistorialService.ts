import { MessageChat } from "../types/MessageChat";

const saveHistService = async (message: MessageChat) => {
  try {
    const response = await fetch("http://localhost:4000/api/save_hist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Error al guardar el historial:", await response.json());
    }
  } catch (error) {
    console.error("Error de conexión al guardar el historial:", error);
  }
};

export default saveHistService;
