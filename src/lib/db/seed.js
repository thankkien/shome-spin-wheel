const { run, initializeDatabase, query } = require("./index");

/**
 * Thêm dữ liệu người dùng mẫu
 */
async function seedUsers() {
  try {
    const existingUsers = await query("SELECT COUNT(*) as count FROM users");

    if (existingUsers[0].count === 0) {
      await run("INSERT INTO users (email, password, employeeId, role, fullname, department) VALUES (?, ?, ?, ?, ?, ?)", [
        "admin@shome.vn",
        "022235",
        "NSH-ADMIN",
        "admin",
        "Trần Thành Kiên",
        "Quản trị hệ thống"
      ]);

      console.log("Đã thêm dữ liệu người dùng mẫu");
    } else {
      console.log("Dữ liệu người dùng đã tồn tại, bỏ qua seeding");
    }
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu người dùng mẫu:", error);
  }
}

/**
 * Thêm dữ liệu giải thưởng mẫu
 */
async function seedPrizes() {
  try {
    const existingPrizes = await query("SELECT COUNT(*) as count FROM prizes");

    if (existingPrizes[0].count === 0) {
      const prizes = [
        { label: "Voucher 500.000đ", quantity: 5, active: 1 },
        { label: "Voucher 300.000đ", quantity: 10, active: 1 },
        { label: "Voucher 200.000đ", quantity: 15, active: 1 },
        { label: "Voucher 100.000đ", quantity: 20, active: 1 },
        { label: "Phiếu giảm giá 10%", quantity: 30, active: 1 },
        { label: "Chúc may mắn lần sau", quantity: 999, active: 1 },
      ];

      for (const prize of prizes) {
        await run(
          "INSERT INTO prizes (label, quantity, active) VALUES (?, ?, ?)",
          [prize.label, prize.quantity, prize.active]
        );
      }

      console.log("Đã thêm dữ liệu giải thưởng mẫu");
    } else {
      console.log("Dữ liệu giải thưởng đã tồn tại, bỏ qua seeding");
    }
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu giải thưởng mẫu:", error);
  }
}

/**
 * Thực hiện seed dữ liệu
 */
async function seedDatabase() {
  try {
    await initializeDatabase();

    await seedUsers();
    await seedPrizes();

    console.log("Seed dữ liệu hoàn tất");
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu:", error);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
