import { MessageChat } from "../types/MessageChat";
import saveHistorialService from "../services/saveHistorialService";

interface SaveHistorialResponse {
  message: string; // Mensaje de éxito o error
}

// Hook personalizado para guardar mensajes en el historial
export const useSaveHistorialService = () => {
  // Función que intenta guardar un mensaje
  const saveHistorial = async (
    message: MessageChat
  ): Promise<SaveHistorialResponse> => {
    try {
      saveHistorialService(message); // Llama al servicio de guardado
      return { message: "" }; // Retorna éxito (sin mensaje)
    } catch (err: unknown) {
      // Manejo de errores con verificación de tipo
      if (err instanceof Error) {
        return {
          message: err.message,
        };
      }
      return { message: "An unknown error occurred" };
    }
  };

  return { saveHistorial };
};
