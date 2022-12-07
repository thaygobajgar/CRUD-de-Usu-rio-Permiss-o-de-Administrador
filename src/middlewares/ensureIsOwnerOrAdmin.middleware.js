const ensureIsOwnerOrAdmin = (req, res, next) => {
  if (!req.user.isAdm) {
    if (req.user.uuid === req.params.id) {
      next();
    }
    return res.status(403).json({ message: "Missing admin permissions" });
  }

  next();
};

export default ensureIsOwnerOrAdmin;
