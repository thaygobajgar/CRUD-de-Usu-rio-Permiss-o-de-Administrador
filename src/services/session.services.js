import users from "../database";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const createSessionService = async (userData) => {
  const user = users.find((obj) => obj.email === userData.email);
  if (user) {
    const passwordVerify = await compare(userData.password, user.password);
    if (passwordVerify) {
      const token = jwt.sign({ isAdm: user.isAdm }, "SECRET_KEY", {
        expiresIn: "24h",
        subject: user.uuid,
      });
      return [200, { token: token }];
    }
    return [401, { message: "Email or password incorrect" }];
  }
  return [401, { message: "Email or password incorrect" }];
};
