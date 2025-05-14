import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guardar historial
router.post("/save_hist", (req, res) => {
  const message = req.body;

  if (!message) {
    return res.status(400).json({ error: "Faltan datos en la solicitud." });
  }

  const filePath = path.join(__dirname, "../../historial.json");

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

    historial.push(message);

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

// Ver historial
router.get("/view_hist", (req, res) => {
  const filePath = path.join(__dirname, "../../historial.json");
  const format = req.query.format || "json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer el historial." });
    }

    try {
      const historial = JSON.parse(data);

      if (format === "txt") {
        const txtContent = historial
          .map(
            (entry) => `${entry.timestamp} - ${entry.sender}: ${entry.message}`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/plain");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=historial.txt"
        );
        return res.send(txtContent);
      }

      res.json(historial);
    } catch (parseError) {
      console.error("Error al parsear el archivo:", parseError);
      res.status(500).json({ error: "Error al procesar el historial." });
    }
  });
});

// Descargar historial
router.get("/download_hist", (req, res) => {
  const filePath = path.join(__dirname, "../../historial.json");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=historial.json");
  res.sendFile(filePath);
});

export default router;
