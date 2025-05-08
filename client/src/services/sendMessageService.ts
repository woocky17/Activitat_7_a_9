const sendMessage = async (
  input: string,
  username: string,
  messages: string[],
  setInput: (value: string) => void,
  socket: WebSocket | null
) => {
  if (!input || !socket) {
    console.log(
      "No se puede enviar el mensaje: input vacío o socket no conectado."
    );
    return;
  }

  const message = { autor: username, contenido: input };
  console.log("Enviando mensaje:", message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket no está abierto.");
  }

  messages.push(`${username}: ${input}`);
  setInput("");

  try {
    const response = await fetch("http://localhost:4000/api/save_hist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        sender: username,
      }),
    });

    if (!response.ok) {
      console.error("Error al guardar el historial:", await response.json());
    }
  } catch (error) {
    console.error("Error de conexión al guardar el historial:", error);
  }
};

export default sendMessage;
