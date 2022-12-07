import users from "../database";

const ensureEmailExists = (req, res, next) => {
  const emailIndex = users.findIndex((e) => e.email === req.body.email);
  if (emailIndex >= 0) {
    return res.status(409).json({
      message: "Email already in use",
    });
  }

  return next();
};

export default ensureEmailExists;
