import AuthRepository from "../repositories/AuthRepository.js";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

class AuthController {
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
        expiresIn: JWT_EXPIRATION,
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
      const user = await AuthRepository.findPublicByEmail(request.user.email);

      if (!user) {
        return response
          .status(404)
          .json({ message: "Usuário não encontrado." });
      }

      return response.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Erro no método userProfile:", error);
      return response
        .status(500)
        .json({ message: "Erro interno do servidor." });
    }
  }

  async update(request, response) {
    try {
      const { name, email, password } = request.body;

      if (!name && !email && !password) {
        return response
          .status(400)
          .json({ message: "Nenhum campo para atualizar foi fornecido." });
      }

      const user = await AuthRepository.findByEmail(request.user.email);

      if (!user) {
        return response
          .status(404)
          .json({ message: "Usuário não encontrado." });
      }

      if (email && email !== user.email) {
        const emailExists = await AuthRepository.findByEmail(email);
        if (emailExists) {
          return response.status(409).json({ message: "Email já registrado." });
        }
      }

      const updatedUser = {
        name: name || user.name,
        email: email || user.email,
        password: password ? await User.hashPassword(password) : user.password, // Certifique-se de que o método hashPassword existe
      };

      await AuthRepository.update(user, updatedUser);

      const token = jwt.sign({ email: updatedUser.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });

      return response.status(200).json({
        message: "Usuário atualizado com sucesso.",
        token: token,
      });
    } catch (error) {
      console.error("Erro no método update:", error);
      return response
        .status(500)
        .json({ message: "Erro interno do servidor." });
    }
  }

  async deleteUser(request, response) {
    try {
      const user = await AuthRepository.findByEmail(request.user.email);

      if (!user) {
        return response
          .status(404)
          .json({ message: "Usuário não encontrado." });
      }

      await AuthRepository.delete(user);

      return response
        .status(200)
        .json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
      console.error("Erro no método deleteUser:", error);
      return response
        .status(500)
        .json({ message: "Erro interno do servidor." });
    }
  }
}

export default new AuthController();
