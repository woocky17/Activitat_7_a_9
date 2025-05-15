// Servicio para descargar el historial del chat como un archivo Blob
export const downloadHistorialService = async (): Promise<Blob> => {
  try {
    // Realiza una petición GET al endpoint del backend
    const response = await fetch("http://localhost:4000/download_hist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Lanza un error si la respuesta no es exitosa
    if (!response.ok) {
      throw new Error("Error downloading historial");
    }

    // Convierte la respuesta en un Blob (archivo binario)
    const blob = await response.blob();
    return blob;
  } catch (error) {
    // Imprime el error en consola y lo propaga
    console.error("Error in downloadHistorialService:", error);
    throw error;
  }
};
