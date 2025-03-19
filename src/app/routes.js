import { Router } from "express";
import authRouter from "./routes/Auth.js";

const router = Router();

router.use(authRouter);

export default router;
