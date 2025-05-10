const { query, get, run } = require("../index");

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Array>} Danh sách người dùng
 */
async function getAllUsers() {
  return await query("SELECT id, email, employeeId, role, fullname, department FROM users ORDER BY id ASC");
}

/**
 * Lấy thông tin người dùng theo id
 * @param {number} id - ID của người dùng
 * @returns {Promise<Object>} Thông tin người dùng
 */
async function getUserById(id) {
  return await get("SELECT id, email, employeeId, role, fullname, department FROM users WHERE id = ?", [id]);
}

/**
 * Lấy thông tin người dùng theo email
 * @param {string} email - Email người dùng
 * @returns {Promise<Object>} Thông tin người dùng
 */
async function getUserByEmail(email) {
  return await get("SELECT * FROM users WHERE email = ?", [email]);
}

/**
 * Xác thực người dùng bằng email và mật khẩu
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu người dùng
 * @returns {Promise<Object|null>} Thông tin người dùng nếu xác thực thành công, null nếu thất bại
 */
async function authenticateUser(email, password) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return null;
    }

    // Đơn giản hóa cho demo, so sánh trực tiếp mật khẩu
    // Trong môi trường thực tế, nên sử dụng bcrypt hoặc argon2 để so sánh hash
    if (user.password === password) {
      // Trả về thông tin người dùng không bao gồm mật khẩu
      const { password, ...userInfo } = user;
      return userInfo;
    }

    return null;
  } catch (error) {
    console.error("Lỗi xác thực người dùng:", error);
    return null;
  }
}

/**
 * Tạo người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @param {string} userData.email - Email người dùng
 * @param {string} userData.password - Mật khẩu người dùng
 * @param {string} userData.employeeId - ID nhân viên
 * @param {string} userData.role - Role người dùng
 * @param {string} userData.fullname - Tên người dùng
 * @param {string} userData.department - Phòng ban người dùng
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function createUser({ email, password, employeeId, role = 'user', fullname, department }) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }
  // Kiểm tra employeeId đã tồn tại chưa
  const existingEmployee = await get("SELECT * FROM users WHERE employeeId = ?", [employeeId]);
  if (existingEmployee) {
    throw new Error("employeeId đã tồn tại");
  }
  // Chỉ cho phép role là 'admin' hoặc 'user'
  if (role !== 'admin' && role !== 'user') {
    throw new Error("Role không hợp lệ");
  }
  if (!fullname || !department) {
    throw new Error("fullname và department là bắt buộc");
  }
  return await run("INSERT INTO users (email, password, employeeId, role, fullname, department) VALUES (?, ?, ?, ?, ?, ?)", [
    email,
    password,
    employeeId,
    role,
    fullname,
    department,
  ]);
}

/**
 * Thay đổi mật khẩu người dùng
 * @param {number} userId - ID người dùng
 * @param {string} oldPassword - Mật khẩu cũ
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<boolean>} Kết quả thay đổi mật khẩu
 */
async function changePassword(userId, oldPassword, newPassword) {
  try {
    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra mật khẩu cũ
    if (user.password !== oldPassword) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    // Cập nhật mật khẩu mới
    await run("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);

    return true;
  } catch (error) {
    console.error("Lỗi thay đổi mật khẩu:", error);
    return false;
  }
}

/**
 * Xóa người dùng
 * @param {number} id - ID người dùng
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function deleteUser(id) {
  return await run("DELETE FROM users WHERE id = ?", [id]);
}

/**
 * Cập nhật thông tin người dùng
 * @param {number} id - ID người dùng
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function updateUser(id, data) {
  const fields = [];
  const values = [];
  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
  if (fields.length === 0) throw new Error('Không có trường nào để cập nhật');
  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  return await run(sql, values);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  authenticateUser,
  createUser,
  changePassword,
  deleteUser,
  updateUser,
};
