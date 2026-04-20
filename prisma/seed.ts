import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as dotenv from "dotenv";
import { SECTOR_DATA } from "../src/lib/sectors";

dotenv.config();

const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding sectors...");

  for (const sector of SECTOR_DATA) {
    await prisma.sector.upsert({
      where: { slug: sector.slug },
      update: {},
      create: {
        name: sector.name,
        slug: sector.slug,
        description: sector.description,
        svgPathId: sector.svgPathId,
        controller: "CONTESTED",
        faithfulScore: 0,
        infernalScore: 0,
      },
    });
  }

  console.log(`Seeded ${SECTOR_DATA.length} sectors.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
