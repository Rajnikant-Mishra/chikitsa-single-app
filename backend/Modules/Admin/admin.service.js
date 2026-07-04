import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../Admin/admin.repository.js";

class AuthService {
  async register(data) {
    const exists = await userRepository.findByEmail(data.email);

    if (exists) {
      throw new Error("Email already exists");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role || "user",
    });

    return user;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email");
    }

    const match = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!match) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      user,
    };
  }
}

export default new AuthService();