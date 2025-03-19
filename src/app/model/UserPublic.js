class UserPublic {
  constructor({ id, name, email }) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromUser(user) {
    return new UserPublic({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

export default UserPublic;
