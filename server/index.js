import data from "./data.js";

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket solo para emitir mensajes
wss.on("connection", (ws) => {
  console.log("Cliente conectado");
  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

// Endpoint para enviar mensaje a todos los WebSocket conectados
app.post("/api/message", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mensaje vacío" });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  res.json({ sent: true });
});

const users = data.usuarios.map((user) => ({
  username: user.username,
  password: user.password,
}));

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.post("/api/login", (req, res) => {
  
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Faltan credenciales" });

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  res.json({ success: true, message: "Inicio de sesión exitoso", username });
});
