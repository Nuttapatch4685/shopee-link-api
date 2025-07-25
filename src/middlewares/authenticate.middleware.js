const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // import Prisma client

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const session = await prisma.session.findUnique({
      where: { user_id: payload.user_id },
      include: { user: true },
    });

    if (!session || session.token !== token || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    // อัปเดตเวลา lastActive
    await prisma.session.update({
      where: { user_id: payload.user_id },
      data: { lastActive: new Date() },
    });

    req.user = session.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
