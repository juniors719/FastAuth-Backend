import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/users", AuthController.store);
router.post("/auth/token", AuthController.login);
router.put("/users", AuthMiddleware.authenticate, AuthController.update);
router.get("/users", AuthMiddleware.authenticate, AuthController.userProfile);
router.delete("/users", AuthMiddleware.authenticate, AuthController.deleteUser);

export default router;
