import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./services/auth/route.js";
import chatRoutes from "./services/chat/routes.js";
import multerRoutes from "./services/multer/routes.js";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const users = new Set();

wss.on("connection", (ws) => {
  console.log("Cliente conectado");
  users.add(ws);

  ws.on("message", (data) => {
    const message = JSON.parse(data);

    if (message.type === "chat") {
      // Retransmitir el mensaje a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  });

  ws.on("close", () => {
    users.delete(ws);
    console.log("Cliente desconectado");
  });
});

app.post("/message", (req, res) => {
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

app.use("/", authRouter);
app.use("/", chatRoutes);
app.use("/", multerRoutes);

app.post("/chat", (req, res) => {
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
