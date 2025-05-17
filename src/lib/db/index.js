const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const {
  createUsersTable,
  createPrizesTable,
  createSpinHistoryTable,
} = require("./schema");

// Đường dẫn đến thư mục chứa database
const DB_DIR = path.join(process.cwd(), "data");
// Đường dẫn đến file database
const DB_PATH = path.join(DB_DIR, "spinwheel.db");

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

/**
 * Khởi tạo kết nối đến database
 * @returns {sqlite3.Database} Đối tượng kết nối đến database
 */
function getDbConnection() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Lỗi kết nối database:", err.message);
    } else {
      console.log("Đã kết nối thành công đến database SQLite");
    }
  });
}

/**
 * Thực hiện truy vấn đơn giản
 * @param {string} sql Câu lệnh SQL
 * @param {Array} params Tham số cho câu lệnh SQL
 * @returns {Promise<Array>} Kết quả truy vấn
 */
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDbConnection();

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Lỗi truy vấn:", err.message);
        reject(err);
      } else {
        resolve(rows);
      }

      db.close((err) => {
        if (err) {
          console.error("Lỗi khi đóng kết nối database:", err.message);
        }
      });
    });
  });
}

/**
 * Thực hiện câu lệnh SQL (INSERT, UPDATE, DELETE)
 * @param {string} sql Câu lệnh SQL
 * @param {Array} params Tham số cho câu lệnh SQL
 * @returns {Promise<Object>} Kết quả thực hiện
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDbConnection();

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Lỗi thực hiện câu lệnh SQL:", err.message);
        reject(err);
      } else {
        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
      }

      db.close((err) => {
        if (err) {
          console.error("Lỗi khi đóng kết nối database:", err.message);
        }
      });
    });
  });
}

/**
 * Lấy một dòng dữ liệu đầu tiên từ kết quả truy vấn
 * @param {string} sql Câu lệnh SQL
 * @param {Array} params Tham số cho câu lệnh SQL
 * @returns {Promise<Object>} Dòng dữ liệu
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDbConnection();

    db.get(sql, params, (err, row) => {
      if (err) {
        console.error("Lỗi truy vấn:", err.message);
        reject(err);
      } else {
        resolve(row);
      }

      db.close((err) => {
        if (err) {
          console.error("Lỗi khi đóng kết nối database:", err.message);
        }
      });
    });
  });
}

// Export các hàm để sử dụng trong ứng dụng
module.exports = {
  getDbConnection,
  query,
  run,
  get,
};
