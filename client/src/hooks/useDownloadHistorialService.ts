import { useState } from "react";
import { downloadHistorialService } from "../services/downloadHistorialService";

// Hook personalizado para gestionar la descarga del historial
export function useDownloadHistorialService() {
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState<Error | null>(null); // Estado de error

  // Función para descargar el historial como Blob
  const downloadHistorial = async (): Promise<Blob | null> => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadHistorialService(); // Llama al servicio que realiza la descarga
      return blob;
    } catch (err) {
      setError(err as Error); // Captura y guarda el error
      return null;
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Devuelve la función de descarga y los estados asociados
  return { downloadHistorial, loading, error };
}
