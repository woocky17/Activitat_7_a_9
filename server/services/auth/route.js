import express from "express";
import users from "../../users.js";

const router = express.Router();

router.post("/login", (req, res) => {
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

export default router;
