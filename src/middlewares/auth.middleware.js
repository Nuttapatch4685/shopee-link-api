const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const validToken = process.env.CRIENT_SECRET;

  if (!token || token !== validToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = authMiddleware;
