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
        "Trần Thành KiênTT",
        "Chăn gà"
      ]);

      await run("INSERT INTO users (email, password, employeeId, role, fullname, department) VALUES (?, ?, ?, ?, ?, ?)", [
        "test@shome.vn",
        "022235",
        "NSH-TEST",
        "user",
        "KiênTT",
        "Chăn bò"
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
        { label: "Bento dinh dưỡng", quantity: 5, active: 1 },
        { label: "Bảo tháp Dư Dả", quantity: 5, active: 1 },
        { label: "Ánh sáng an nhiên", quantity: 20, active: 1 },
        { label: "Cơn Gió Thanh Xuân", quantity: 20, active: 1 },
        { label: "Găng Siêu Xayda", quantity: 10, active: 1 },
        { label: "Lá chắn vương giả", quantity: 5, active: 1 },
        { label: "Trạm sạc Năng Lượng", quantity: 1, active: 1 },
        { label: "Loa Phát Sóng Tình Yêu", quantity: 1, active: 1 },
        { label: "Hộp Cất Vàng", quantity: 5, active: 1 },
        { label: "Bento dinh dưỡng", quantity: 3, active: 1 },
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
