const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateCredit = async (req, res, next) => {
  try {
    console.log("Call schedules update credit");
    await prisma.$transaction([
      prisma.user.updateMany({
        where: {
          credit: {
            gt: 0,
          },
        },
        data: {
          credit: {
            increment: -1,
          },
        },
      }),
      prisma.user.updateMany({
        where: {
          credit: 0,
        },
        data: {
          status: 3,
        },
      }),
    ]);
  } catch (error) {
    console.log("Error schedules", error.message);
    next(error);
  }
};
