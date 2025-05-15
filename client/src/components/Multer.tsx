import React, { useRef, useState } from "react";
import {
  Button,
  Group,
  Text,
  FileInput,
  Divider,
  List,
  ThemeIcon,
  Title,
  Stack,
  Notification,
  Card,
} from "@mantine/core";
import { IconFile, IconDownload } from "@tabler/icons-react";

const Multer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subir archivo
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadMsg("Selecciona un archivo.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/enviar_doc", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMsg("Archivo subido correctamente.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadMsg(data.error || "Error al subir archivo.");
      }
    } catch {
      setUploadMsg("Error de red al subir archivo.");
    }
  };

  // Listar archivos
  const handleList = async () => {
    try {
      const res = await fetch(`http://localhost:4000/list_doc`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch {
      setFiles([]);
    }
  };

  // Descargar archivo
  const handleDownload = (filename: string) => {
    window.open(
      `http://localhost:4000/down_doc/${encodeURIComponent(filename)}`,
      "_blank"
    );
  };

  return (
    <Card
      shadow="md"
      padding="xl"
      radius="lg"
      withBorder
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <Stack gap="md">
        <Title order={3}>Subir archivo</Title>
        <form onSubmit={handleUpload}>
          <Group align="end" gap="sm">
            <FileInput
              placeholder="Selecciona archivo"
              value={file}
              onChange={setFile}
              accept=".pdf,.docx,image/*"
              clearable
              style={{ flex: 1 }}
            />
            <Button type="submit">Subir</Button>
          </Group>
        </form>
        {uploadMsg && (
          <Notification
            color={uploadMsg.includes("correctamente") ? "green" : "red"}
            onClose={() => setUploadMsg("")}
          >
            {uploadMsg}
          </Notification>
        )}

        <Divider my="md" />

        <Title order={4}>Archivos disponibles</Title>
        <Button onClick={handleList} variant="outline" mb="sm">
          Listar archivos
        </Button>
        <List
          spacing="xs"
          size="sm"
          icon={
            <ThemeIcon color="blue" variant="light" radius="xl">
              <IconFile size={18} />
            </ThemeIcon>
          }
        >
          {files.length === 0 && (
            <Text c="dimmed">No hay archivos disponibles.</Text>
          )}
          {files.map((fname) => (
            <List.Item key={fname}>
              <Group justify="space-between">
                <Text>{fname}</Text>
                <Button
                  size="xs"
                  leftSection={<IconDownload size={16} />}
                  variant="light"
                  onClick={() => handleDownload(fname)}
                >
                  Descargar
                </Button>
              </Group>
            </List.Item>
          ))}
        </List>
      </Stack>
    </Card>
  );
};

export default Multer;
