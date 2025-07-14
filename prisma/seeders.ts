import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const types = ["Income", "Expenses"];

  for (const typeName of types) {
    const existing = await prisma.type.findFirst({
      where: { name: typeName },
    });

    if (!existing) {
      await prisma.type.create({
        data: { name: typeName },
      });
      console.log(`Seeded type: ${typeName}`);
    } else {
      console.log(`Type already exists: ${typeName}`);
    }
  }
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
