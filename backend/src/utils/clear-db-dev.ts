import { log } from "node:console";
import { prisma } from "../prisma.js";

async function purgeDatabase() {
  try {
    log("🏁 Miraj-IMS Dev Database Purge Starting...\n");
    log("⚠️  WARNING: This will wipe ALL data from the database.");
    log("⚠️  Only run this in development!\n");

    // Delete in reverse order of dependencies to avoid FK constraint violations
    log("🧹 [Step 1] Purging Stock Movements...");
    const { count: movementsDeleted } = await prisma.stockMovement.deleteMany();
    log(`   ✅ Removed ${movementsDeleted} stock movement records.`);

    log("🧹 [Step 2] Purging Products...");
    const { count: productsDeleted } = await prisma.product.deleteMany();
    log(`   ✅ Removed ${productsDeleted} product records.`);

    log("🧹 [Step 3] Purging Categories...");
    const { count: categoriesDeleted } = await prisma.category.deleteMany();
    log(`   ✅ Removed ${categoriesDeleted} category records.`);

    log("🧹 [Step 4] Purging Users...");
    const { count: usersDeleted } = await prisma.user.deleteMany();
    log(`   ✅ Removed ${usersDeleted} user records.`);

    log("\n🎉 Database successfully purged and ready for fresh seeding.");
    log(`   - Stock Movements : ${movementsDeleted} removed`);
    log(`   - Products        : ${productsDeleted} removed`);
    log(`   - Categories      : ${categoriesDeleted} removed`);
    log(`   - Users           : ${usersDeleted} removed`);
  } catch (error) {
    console.error("\n❌ Purge aborted due to an error:", error);
  } finally {
    log("\n🔌 Severing active Prisma engine database sockets...");
    await prisma.$disconnect();
    log("🏁 Purge sequence shut down safely.");
  }
}

// Invoke method when required.
await purgeDatabase();
