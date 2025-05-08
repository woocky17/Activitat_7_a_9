import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import users from "./data.js";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

app.post("/api/message", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mensaje vacío" });

  const payload = JSON.stringify({ type: "broadcast", message });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.json({ sent: true });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Faltan credenciales" });

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  res.json({
    success: true,
    message: "Inicio de sesión exitoso",
    nombre: user.nombre,
  });
});

app.post("/api/chat", (req, res) => {
  const { message, sender } = req.body;

  if (!message || !sender) {
    return res.status(400).json({ error: "Mensaje o remitente faltante" });
  }

  const chatMessage = {
    type: "chat",
    message,
    sender,
    timestamp: new Date().toISOString(),
  };

  const payload = JSON.stringify(chatMessage);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.json({ success: true });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.post("/api/save_hist", (req, res) => {
  const { message, sender } = req.body;

  if (!message || !sender) {
    return res.status(400).json({ error: "Faltan datos en la solicitud." });
  }

  const filePath = path.join(__dirname, "historial.json");

  // Leer el archivo historial.json
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer el historial." });
    }

    let historial = [];
    try {
      historial = JSON.parse(data);
    } catch (parseError) {
      console.error("Error al parsear el archivo:", parseError);
    }

    // Agregar el nuevo mensaje al historial
    historial.push({ sender, message, timestamp: new Date().toISOString() });

    // Guardar el historial actualizado
    fs.writeFile(filePath, JSON.stringify(historial, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error al escribir en el archivo:", writeErr);
        return res
          .status(500)
          .json({ error: "Error al guardar el historial." });
      }

      res.status(200).json({ message: "Historial guardado correctamente." });
    });
  });
});
