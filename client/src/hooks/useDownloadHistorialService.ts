import { useState } from "react";
import { downloadHistorialService } from "../services/downloadHistorialService";

export function useDownloadHistorialService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadHistorial = async (): Promise<Blob | null> => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadHistorialService();
      return blob;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { downloadHistorial, loading, error };
}
