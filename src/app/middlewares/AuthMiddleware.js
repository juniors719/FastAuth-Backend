import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

class AuthMiddleware {
  async authenticate(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ message: "Token not provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("Erro: Token expirado:", error);
        return response.status(401).json({ message: "Token expirado." });
      } else if (error.name === "JsonWebTokenError") {
        console.error("Erro: Token inválido:", error);
        return response.status(401).json({ message: "Token inválido." });
      } else {
        console.error("Erro ao verificar o token:", error);
        return response
          .status(500)
          .json({ message: "Erro ao verificar o token." });
      }
    }
  }
}

export default new AuthMiddleware();
