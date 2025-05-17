const { run, initializeDatabase, query } = require("./index");

/**
 * Thêm dữ liệu người dùng mẫu
 */
async function seedUsers() {
  try {
    await run(
      `INSERT INTO users (email, password, employeeId, role, fullname, department)
      VALUES (?, ?, ?, ?, ?, ?) 
      ON CONFLICT(email)
      DO UPDATE SET password = ?, employeeId = ?, role = ?, fullname = ?, department = ?`,
      [
        "admin@shome.vn",
        "022235",
        "NSH-ADMIN",
        "admin",
        "KiênTT",
        "Chăn gà",
        "022235",
        "NSH-ADMIN",
        "admin",
        "KiênTT",
        "Chăn gà",
      ]
    );

    await run(
      `INSERT INTO users (email, password, employeeId, role, fullname, department)
      VALUES (?, ?, ?, ?, ?, ?) 
      ON CONFLICT(email)
      DO UPDATE SET password = ?, employeeId = ?, role = ?, fullname = ?, department = ?`,
      [
        "test@shome.vn",
        "022235",
        "NSH-TEST",
        "user",
        "KiênTT",
        "Chăn bò",
        "022235",
        "NSH-TEST",
        "user",
        "KiênTT",
        "Chăn bò",
      ]
    );

    console.log("Đã thêm dữ liệu người dùng mẫu");
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu người dùng mẫu:", error);
  }
}

/**
 * Thêm dữ liệu giải thưởng mẫu
 */
async function seedPrizes() {
  try {
    const prizes = [
      { id: 1, label: "Bento dinh dưỡng", quantity: 5, active: 1 },
      { id: 2, label: "Bảo tháp Dư Dả", quantity: 5, active: 1 },
      { id: 3, label: "Ánh sáng an nhiên", quantity: 20, active: 1 },
      { id: 4, label: "Cơn Gió Thanh Xuân", quantity: 20, active: 1 },
      { id: 5, label: "Găng Siêu Xayda", quantity: 10, active: 1 },
      { id: 6, label: "Lá chắn vương giả", quantity: 5, active: 1 },
      { id: 7, label: "Trạm sạc Năng Lượng", quantity: 1, active: 1 },
      { id: 8, label: "Loa Phát Sóng Tình Yêu", quantity: 1, active: 1 },
      { id: 9, label: "Hộp Cất Vàng", quantity: 5, active: 1 },
      { id: 10, label: "Bento Dinh Dưỡng", quantity: 3, active: 1 },
      { id: 11, label: "Vạn Sự May Mắn", quantity: 129, active: 1 },
      { id: 12, label: "Vạn Sự Cát Tường", quantity: 129, active: 1 },
    ];

    for (const prize of prizes) {
      await run(
        "INSERT INTO prizes (id, label, quantity, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET label = ?, quantity = ?, active = ?",
        [prize.id, prize.label, prize.quantity, prize.active, prize.label, prize.quantity, prize.active]
      );
    }

    console.log("Đã thêm dữ liệu giải thưởng mẫu");
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
