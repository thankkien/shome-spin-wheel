const { getDbConnection } = require("./index");
const { createUsersTable, createPrizesTable, createSpinHistoryTable } = require("./schema");

/**
 * Khởi tạo database với schema đã định nghĩa
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
  const db = getDbConnection();

  return new Promise((resolve, reject) => {
    // Khởi chạy transaction để đảm bảo tính toàn vẹn khi tạo các bảng
    db.serialize(() => {
      db.run("PRAGMA foreign_keys = ON");

      // Tạo bảng users
      db.run(createUsersTable, (err) => {
        if (err) {
          console.error("Lỗi khi tạo bảng users:", err.message);
          reject(err);
        }
      });

      // Tạo bảng prizes
      db.run(createPrizesTable, (err) => {
        if (err) {
          console.error("Lỗi khi tạo bảng prizes:", err.message);
          reject(err);
        }
      });

      // Tạo bảng spin_history
      db.run(createSpinHistoryTable, (err) => {
        if (err) {
          console.error("Lỗi khi tạo bảng spin_history:", err.message);
          reject(err);
        } else {
          console.log("Khởi tạo database thành công!");
          resolve();
        }
      });
    });

    // Đóng kết nối
    db.close((err) => {
      if (err) {
        console.error("Lỗi khi đóng kết nối database:", err.message);
        reject(err);
      }
    });
  });
}

module.exports = initializeDatabase;
