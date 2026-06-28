import { log } from "node:console";
import { prisma } from "./prisma.js";
import {
  createNewUser,
  listUsers,
  deleteUserByEmail,
} from "./services/user.service.js";
import {
  createCategory,
  deleteCategory,
  listCategories,
} from "./services/category.service.js";
import { createProduct, listProducts } from "./services/product.service.js";
import {
  logStockMovement,
  listStockMovements,
} from "./services/stock-movement.service.js";

async function runSystemValidation() {
  const TEST_EMAIL = "system.tester@miraj-ims.internal";

  try {
    log("🏁 Starting Miraj-IMS Full Service Integration Test...\n");

    // Clean out relational history in reverse order before running the test steps
    log("🧹 Executing isolated test environment purge...");
    await prisma.$transaction([
      prisma.stockMovement.deleteMany({
        where: { initiatedBy: { email: TEST_EMAIL } },
      }),
      prisma.product.deleteMany({ where: { addedBy: { email: TEST_EMAIL } } }),
      prisma.user.deleteMany({ where: { email: TEST_EMAIL } }),
      // Keeping categories intact since they aren't uniquely bound to a single user's lifecycle
    ]);
    log("✨ Test environment successfully isolated.");

    // 1. Validate User Persistence
    log("\n🧱 [Step 1] Testing User Service Creation Layer...");
    await createNewUser({
      name: "Mishal Tech Lead",
      email: TEST_EMAIL,
      hashedPassword:
        "$2b$12$DummyBcryptHashSimulationStringForInfrastructureTesting",
      role: "ADMIN",
    });
    // Re-query database to fetch the generated UUID
    const currentUsers = await listUsers();
    const liveUser = currentUsers.find((u) => u.email === TEST_EMAIL);
    if (!liveUser)
      throw new Error("Verification Failed: User not saved to Postgres.");
    const userUID = liveUser.id;

    // 2. Validate Category Assignment
    log("\n🧱 [Step 2] Testing Category Mapping Layer...");
    const uniqueSuffix = Date.now().toString().slice(-4);
    const categoryName = `Networking Gear ${uniqueSuffix}`;

    const mockCategory = await createCategory({
      name: categoryName,
      description:
        "High performance routers, enterprise switches and terminal infrastructure.",
    });

    const categories = await listCategories();
    const liveCategory = categories.find((c) => c.name === categoryName);
    if (!liveCategory)
      throw new Error("Verification Failed: Category entity missing.");
    const categoryUID = liveCategory.id;

    // 3. Validate Product Catalog Generation
    log("\n🧱 [Step 3] Testing Product Registration Layer...");
    const productSku = `NET-SW-48P-${uniqueSuffix}`;

    const mockProduct = await createProduct({
      name: "Miraj 48-Port PoE Layer 3 Managed Switch",
      sku: productSku,
      description:
        "Enterprise rack-mountable core switch featuring localized software control.",
      purchasePrice: 2000.5,
      retailPrice: 3450.5,
      sellingPrice: 3200.5,
      addedByUid: userUID, // Binding relations cleanly via validated UUID
      categoryId: categoryUID, // Binding relations cleanly via validated UUID
    });

    const products = await listProducts();
    const liveProduct = products.find((p) => p.sku === productSku);
    if (!liveProduct)
      throw new Error(
        "Verification Failed: Product map missing from Postgres.",
      );
    const productUID = liveProduct.id;

    // 4. Validate Immutable Auditing (Stock Movement)
    log("\n🧱 [Step 4] Testing Stock Movement Tracking Log...");
    await logStockMovement({
      type: "INCOMING",
      quantity: 50, // Added initial inventory allocation balance
      productId: productUID,
      initiatedByUid: userUID,
    });

    await logStockMovement({
      type: "OUTGOING",
      quantity: 5, // Simulating a storefront sale transaction
      productId: productUID,
      initiatedByUid: userUID,
    });

    // 5. Final Comprehensive Verification Check
    log("\n📊 [Step 5] Compiling Transaction History Logs...");
    const movements = await listStockMovements();
    const productHistory = movements.filter((m) => m.productId === productUID);

    // 6. Failing Case Test: Duplicate SKU Constraint Protection
    log("\n🧱 [Step 6] Testing Failing Case: Duplicate SKU Rejection...");
    try {
      await createProduct({
        name: "Cloned Switch for Constraint Failure Test",
        sku: productSku, // Reusing the exact same unique SKU generated in Step 3
        description:
          "This should fail at the database constraint layer immediately.",
        purchasePrice: 999.99,
        retailPrice: 1299.99,
        sellingPrice: 1099.99,
        addedByUid: userUID,
        categoryId: categoryUID,
      });
      throw new Error(
        "❌ CRITICAL FAILURE: Database allowed a duplicate SKU creation!",
      );
    } catch (error: any) {
      log("✅ Success: System safely intercepted and blocked a duplicate SKU.");
    }

    // 7. Failing Case Test: Restricted Referential Integrity Protection
    log("\n🧱 [Step 7] Testing Failing Case: Restricted Category Deletion...");
    try {
      await deleteCategory(categoryUID);
      throw new Error(
        "❌ CRITICAL FAILURE: Database allowed deleting a category containing active products!",
      );
    } catch (error: any) {
      log("✅ Success: System safely blocked hazardous category deletion.");
    }

    log(`\n🎉 Verification Complete!`);
    log(`   - Connected User: ${liveUser.name} (${liveUser.email})`);
    log(`   - Active SKU:     ${liveProduct.name} [${liveProduct.sku}]`);
    log(
      `   - Audit Trail:    Recorded ${productHistory.length} ledger logs for this item.`,
    );
  } catch (error) {
    console.error("\n❌ System Validation Run Aborted due to an error:", error);
  } finally {
    log("\n🔌 Severing active Prisma engine database sockets...");
    await prisma.$disconnect();
    log("🏁 Validation sequence shut down safely.");
  }
}

// Fire off the sequence
await runSystemValidation();
