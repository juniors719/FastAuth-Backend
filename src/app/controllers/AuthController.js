import AuthRepository from "../repositories/AuthRepository.js";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h"; // Tempo de expiração do token

class AuthController {
  async helloWorld(request, response) {
    response.json({ message: "Hello World" });
  }

  async login(request, response) {
    try {
      const { email, password } = request.body;
      console.log(request.body);

      if (!email || !password) {
        console.log("Validation failed: Missing fields");
        return response
          .status(400)
          .json({ message: "Missing required fields." });
      }

      const user = await AuthRepository.findByEmail(email);
      console.log("User found: ", user);

      if (!user) {
        console.log("Validation failed: User not found");
        return response.status(404).json({ message: "User not found." });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        console.log("Validation failed: Incorrect password");
        return response.status(401).json({ message: "Incorrect password." });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION, // Token expira em 1 hora
      });

      console.log("Login successful for user:", user.email);
      return response.status(200).json({
        message: "Login realizado com sucesso.",
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error in login method: ", error);
      response.status(500).json({ message: "Internal server error." });
    }
  }

  async store(request, response) {
    try {
      const { name, email, password } = request.body;
      console.log(request.body);

      if (!name || !email || !password) {
        console.log("Validation failed: Missing fields");
        return response
          .status(400)
          .json({ message: "Missing required fields." });
      }

      const exists = await AuthRepository.findByEmail(email);
      if (exists) {
        console.log("Validation failed: Email already registered");
        return response.status(409).json({ message: "Email já registrado." });
      }

      console.log("Validation passed: Creating user");
      try {
        const user = await User.create(name, email, password);
        await AuthRepository.create(user);

        console.log("User created successfully: ", user);
        response.status(201).json({ message: "User created successfully." });
      } catch (error) {
        console.error("Error creating user: ", error);
        response.status(500).json({ message: "Internal server error." });
      }
    } catch (error) {
      console.error("Error in store method: ", error);
      response.status(500).json({ message: "Internal server error." });
    }
  }

  async userProfile(request, response) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return response.status(401).json({ message: "Token not provided." });
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await AuthRepository.findPublicByEmail(decoded.email);
        if (!user) {
          return response.status(404).json({ message: "User not found." });
        }

        return response.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
        });
      } catch (error) {
        console.error("Token inválido:", error);
        return response.status(401).json({ message: "Token inválido." });
      }
    } catch (error) {
      console.error("Erro no método userProfile:", error);
      return response
        .status(500)
        .json({ message: "Erro interno do servidor." });
    }
  }
}

export default new AuthController();
