import bcrypt from "bcryptjs";

class User {
  constructor(name, email, password) {
    this.id = null; // ID será gerado pelo banco de dados
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async create(name, email, password) {
    if (!name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    const hashedPassword = await this.hashPassword(password);
    return new User(name, email, hashedPassword);
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 8);
  }
}

export default User;
