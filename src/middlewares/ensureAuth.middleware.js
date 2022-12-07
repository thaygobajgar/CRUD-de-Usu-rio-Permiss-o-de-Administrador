import jwt from "jsonwebtoken";
import "dotenv/config";

const ensureAuthMiddleware = (req, res, next) => {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Missing authorization headers",
    });
  }

  return jwt.verify(
    authorization.split(" ")[1],
    "SECRET_KEY",
    (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      req.user = { uuid: decoded.sub, isAdm: decoded.isAdm };

      return next();
    }
  );
};

export default ensureAuthMiddleware;
