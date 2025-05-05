import { useState } from "react";
import {
    TextInput,
    PasswordInput,
    Button,
    Box,
    Paper,
    Title,
    Stack,
    Notification,
} from "@mantine/core";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });



            const data = await res.json();

            if (res.ok) {

            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <Box maw={400} mx="auto" mt={50}>
            <Paper withBorder shadow="md" p="xl">
                <Title order={2} mb="md" style={{ align: "center" }}>
                    Iniciar sesión
                </Title>

                <form onSubmit={handleSubmit} method="POST">
                    <Stack>
                        <TextInput
                            label="Usuario"
                            placeholder="Tu nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.currentTarget.value)}
                            required
                        />

                        <PasswordInput
                            label="Contraseña"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            required
                        />

                        {error && (
                            <Notification color="red" title="Error" withCloseButton={false}>
                                {error}
                            </Notification>
                        )}

                        <Button type="submit" fullWidth>
                            Entrar
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;
