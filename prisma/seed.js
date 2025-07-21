// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const hashPassword = await bcrypt.hash("Secret1234", 10);
  await prisma.user.create({
    data: { username: "Superadmin", phone: "0838829298", password: hashPassword, role: "SUPERADMIN", createdBy: 1, updatedBy: 1, status: 1 },
  });

  // Add more seeding logic for other models if needed
}

main()
  .then(() => {
    console.log("✅ Seeding completed");
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
