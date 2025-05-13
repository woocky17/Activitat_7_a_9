export const downloadHistorialService = async (): Promise<Blob> => {
  try {
    const response = await fetch("http://localhost:4000/api/download_hist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error downloading historial");
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error in downloadHistorialService:", error);
    throw error;
  }
};
