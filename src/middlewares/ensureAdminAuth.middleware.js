import jwt from "jsonwebtoken";
import "dotenv/config";

const ensureAdminAuthMiddleware = (req, res, next) => {
  let authorization = req.headers.authorization;
  return jwt.verify(
    authorization.split(" ")[1],
    "SECRET_KEY",
    (error, decoded) => {
      if (!decoded.isAdm) {
        return res.status(403).json({
          message: "Missing Admin Permissions",
        });
      }
      next();
    }
  );
};

export default ensureAdminAuthMiddleware;
