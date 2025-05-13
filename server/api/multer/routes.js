import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "image/jpeg",
  "image/png",
  "image/gif",
];

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { sala } = req.body;
    if (!sala) return cb(new Error("Sala no especificada"), null);
    const dir = path.join(__dirname, "../../uploads", sala);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  },
});

// Subida de archivos
router.post("/enviar_doc", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No se subió ningún archivo o tipo no permitido." });
  }
  res.status(200).json({
    message: "Archivo subido correctamente.",
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    sala: req.body.sala,
  });
});

// Listar archivos de una sala
router.get("/list_doc", (req, res) => {
  const sala = req.query.sala;
  if (!sala) return res.status(400).json({ error: "Sala no especificada" });
  const dir = path.join(__dirname, "../../uploads", sala);
  fs.readdir(dir, (err, files) => {
    if (err) {
      return res.status(200).json({ files: [] }); // Si no existe la sala, retorna lista vacía
    }
    res.json({ files });
  });
});

// Descargar archivo
router.get("/down_doc/:filename", (req, res) => {
  const sala = req.query.sala;
  const { filename } = req.params;
  if (!sala) return res.status(400).json({ error: "Sala no especificada" });
  const filePath = path.join(__dirname, "../../uploads", sala, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }
  res.download(filePath);
});

export default router;
