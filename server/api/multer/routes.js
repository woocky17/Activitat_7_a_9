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
    const dir = path.join(__dirname, "../../uploads");
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
  });
});

// Listar archivos
router.get("/list_doc", (req, res) => {
  const dir = path.join(__dirname, "../../uploads");
  fs.readdir(dir, (err, files) => {
    if (err) {
      if (err && err.code === "ENOENT") {
        fs.mkdirSync(dir, { recursive: true });
        return res.status(200).json({ files: [] }); // Si no existe la carpeta, retorna lista vacía
      }
      if (err) {
        return res.status(500).json({ error: "Error al leer los archivos" });
      }
    }
    res.json({ files });
  });
});

// Descargar archivo
router.get("/down_doc/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../uploads", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }
  res.download(filePath);
});

export default router;
