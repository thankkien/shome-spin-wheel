const seedUsers = require("./seedUsers");
const seedPrizes = require("./seedPrizes");
const seedSpinHistory = require("./seedSpinHistory");

/**
 * Thực hiện seed dữ liệu
 */
async function seedDatabase() {
  try {
    await seedUsers();
    await seedPrizes();
    await seedSpinHistory();

    console.log("Seed dữ liệu hoàn tất");
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu:", error);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
