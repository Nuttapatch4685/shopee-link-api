const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        user_id: Number(user_id),
      },
    });

    const role = user?.role;

    if (role === "SUPERADMIN") {
      const users = await prisma.user.findMany({
        where: {
          NOT: {
            role: "SUPERADMIN",
          },
        },
      });

      res.json(users);
    } else if (role === "ADMIN") {
      const users = await prisma.user.findMany({
        where: {
          role: "USER",
        },
      });

      res.json(users);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, password, phone, credit, role, status, created_by, updated_by } = req.body;

    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            phone: phone,
          },
        ],
      },
    });

    if (checkDuplicate) {
      return res.status(400).json({
        message: "มีชื่อผู้ใช้ หรือ เบอร์โทรศัพท์นี้ในระบบแล้ว",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
        phone: phone,
        role: role,
        credit: Number(credit),
        status: Number(status),
        createdBy: created_by,
        updatedBy: updated_by,
      },
    });

    res.json({
      message: "เพิ่มผู้ใช้งานสำเร็จ",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        user_id: Number(user_id),
      },
    });
    delete user.password;
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { username, status, role, credit, phone, password } = req.body;

    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            phone: phone,
          },
        ],
        NOT: {
          user_id: Number(user_id),
        },
      },
    });

    if (checkDuplicate) throw new Error("มีชื่อผู้ใช้ หรือ เบอร์โทรศัพท์นี้ในระบบแล้ว");

    if (password.length > 0) {
      const hashPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: {
          username: username,
          status: Number(status),
          credit: Number(credit),
          phone: phone,
          role: role,
          password: hashPassword,
        },
      });
      res.json({ message: "แก้ไขผู้ใช้งานสำเร็จ" });
    } else {
      await prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: {
          username: username,
          status: Number(status),
          credit: Number(credit),
          phone: phone,
          role: role,
        },
      });
      res.json({ message: "แก้ไขผู้ใช้งานสำเร็จ" });
    }
  } catch (error) {
    console.log("error", error.message);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await prisma.user.delete({
      where: { user_id: parseInt(user_id) },
    });
    res.json({ message: "ลบผู้ใช้งานสำเร็จ" });
  } catch (error) {
    next(error);
  }
};

exports.updateUserCredit = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { credit } = req.body;

    await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: {
        credit: Number(credit),
      },
    });
    res.json({
      message: "Update credit completed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "ไม่มีผู้ใช้งานนี้ในระบบ",
      });
    }

    if (user.role === "USER") {
      if (user.credit <= 0 || user.status != 1) {
        return res.status(400).json({
          message: "ชื่อผู้ใช้งานนี้ไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
        });
      }
    }

    const checkPassword = await bcrypt.compare(password, user?.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }

    const existingSession = await prisma.session.findUnique({
      where: { user_id: user.user_id },
    });

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    if (existingSession && existingSession.lastActive > fiveMinutesAgo && existingSession.expiresAt > now) {
      return res.status(400).json({ message: "ชื่อผู้ใช้ของคุณกำลังเข้าใช้งานอยู่ในขณะนี้ โปรดรอสักครู่" });
    }

    // Delete old session if expired
    if (existingSession) {
      await prisma.session.delete({ where: { user_id: user.user_id } });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await prisma.session.create({
      data: {
        user_id: user.user_id,
        token,
        lastActive: now,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
      },
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, phone, role, created_by, updated_by } = req.body;

    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            phone: phone,
          },
        ],
      },
    });

    if (checkDuplicate) {
      return res.status(400).json({
        message: "มีชื่อผู้ใช้ หรือ เบอร์โทรศัพท์นี้ในระบบแล้ว",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
        phone: phone,
        role: role,
        status: 2,
        createdBy: created_by,
        updatedBy: updated_by,
      },
    });

    res.json({
      message: "ลงทะเบียนสำเร็จ",
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  await prisma.session.delete({ where: { user_id: req.body.user_id } });
  res.sendStatus(200);
};

// exports.me = async (req, res, next) => {
//   const user = req.user;
//   res.json(user);
// };
