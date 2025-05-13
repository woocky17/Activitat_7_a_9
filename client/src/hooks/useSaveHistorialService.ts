import { MessageChat } from "../types/MessageChat";
import saveHistorialService from "../services/saveHistorialService";

interface SaveHistorialResponse {
  message: string;
}

export const useSaveHistorialService = () => {
  const saveHistorial = async (
    message: MessageChat
  ): Promise<SaveHistorialResponse> => {
    try {
      saveHistorialService(message);
      return { message: "" };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err instanceof Error ? err.message : "An error occurred",
        };
      }
      return { message: "An unknown error occurred" };
    }
  };

  return { saveHistorial }; // Return the saveHistorial function
};
