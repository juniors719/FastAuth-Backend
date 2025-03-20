import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5174",
  methods: "GET,POST,PUT,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());

//use routes
app.use(routes);

export default app;
