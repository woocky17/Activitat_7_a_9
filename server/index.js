import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
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
