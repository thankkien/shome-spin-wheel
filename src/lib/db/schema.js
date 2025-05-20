/**
 * Định nghĩa schema cho database SQLite
 *
 * users: Thông tin người dùng
 * prizes: Danh sách giải thưởng
 * spin_history: Lịch sử quay của người dùng
 */

// Định nghĩa schema tạo bảng người dùng
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  password TEXT NOT NULL,
  employeeId TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  fullname TEXT NOT NULL,
  department TEXT NOT NULL,
  gender TEXT NOT NULL,
  season TEXT NOT NULL,
  workday INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

// Định nghĩa schema tạo bảng giải thưởng
const createPrizesTable = `
CREATE TABLE IF NOT EXISTS prizes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL UNIQUE,
  description TEXT
)
`;

// Định nghĩa schema tạo bảng lịch sử quay
const createSpinHistoryTable = `
CREATE TABLE IF NOT EXISTS spin_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  prize_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  spun_at TIMESTAMP,
  spin_index INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (prize_id) REFERENCES prizes (id) ON DELETE SET NULL
)
`;

// Export tất cả các schema để sử dụng trong module khởi tạo database
module.exports = {
  createUsersTable,
  createPrizesTable,
  createSpinHistoryTable,
};
