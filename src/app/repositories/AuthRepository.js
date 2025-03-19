import connection from "../../config/database/connection.js";
import User from "../model/User.js";
import UserPublic from "../model/UserPublic.js";

class AuthRepository {
  queryAuth(sql, params = "") {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (error, result) => {
        if (error) {
          const erro = {
            erro: "SQL - reject",
            message: error.message,
          };
          return reject(erro);
        } else {
          const row = JSON.parse(JSON.stringify(result.rows));
          return resolve(row);
        }
      });
    });
  }

  create(user) {
    const sql = "INSERT INTO users (name,email,password) VALUES ($1,$2,$3);";
    return this.queryAuth(sql, [user.name, user.email, user.password]);
  }

  /**
   * Busca um usuário no banco de dados pelo email.
   *
   * @param {string} email - O email do usuário.
   * @returns {Promise<User|null>} Retorna uma instância de User ou null se o usuário não for encontrado.
   */
  async findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = $1;";
    const result = await this.queryAuth(sql, [email]);

    if (result.length === 0) {
      return null; // Retorna null se o usuário não for encontrado
    }

    const userData = result[0];
    return new User(userData.name, userData.email, userData.password); // Cria uma instância do modelo User
  }

  async findPublicByEmail(email) {
    const sql = "SELECT id, name, email FROM users WHERE email = $1;";
    const result = await this.queryAuth(sql, [email]);

    if (result.length === 0) {
      return null; // Retorna null se o usuário não for encontrado
    }

    const userData = result[0];
    return new UserPublic(userData); // Retorna uma instância do modelo UserPublic
  }
}

export default new AuthRepository();
