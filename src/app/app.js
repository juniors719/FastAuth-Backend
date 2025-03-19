import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Permitir apenas o frontend que está rodando em localhost:3000
  methods: "GET,POST,PUT,DELETE", // Permitir esses métodos
  allowedHeaders: "Content-Type, Authorization", // Permitir esses cabeçalhos
  credentials: true, // Habilitar envio de cookies se necessário (caso esteja usando JWT em cookies)
};

app.use(cors(corsOptions));
app.use(express.json());

//use routes
app.use(routes);

export default app;
