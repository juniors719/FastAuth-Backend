import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.get("/", AuthController.helloWorld);
router.post("/register", AuthController.store);
router.post("/login", AuthController.login);
router.get("/user-profile", AuthController.userProfile);

export default router;
