const { query, get, run } = require("../index");

/**
 * Lấy lịch sử quay của một người dùng
 * @param {number} userId - ID người dùng
 * @returns {Promise<Array>} Lịch sử quay của người dùng
 */
async function getUserSpinHistory(userId) {
  return await query(
    `SELECT h.id, h.created_at, p.label as prize_label, p.id as prize_id
     FROM spin_history h
     LEFT JOIN prizes p ON h.prize_id = p.id
     WHERE h.user_id = ?
     ORDER BY h.created_at DESC`,
    [userId]
  );
}

/**
 * Kiểm tra xem người dùng đã quay chưa
 * @param {number} userId - ID người dùng
 * @returns {Promise<boolean>} Kết quả kiểm tra
 */
async function hasUserSpun(userId) {
  const result = await get(
    "SELECT COUNT(*) as count FROM spin_history WHERE user_id = ?",
    [userId]
  );
  return result && result.count > 0;
}

/**
 * Lấy thông tin giải thưởng của người dùng
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Thông tin giải thưởng
 */
async function getUserPrize(userId) {
  return await get(
    `SELECT h.prize_id, p.label as prize_label, h.created_at
     FROM spin_history h
     JOIN prizes p ON h.prize_id = p.id
     WHERE h.user_id = ?`,
    [userId]
  );
}

/**
 * Lấy thông tin một lần quay cụ thể
 * @param {number} spinId - ID của lần quay
 * @returns {Promise<Object>} Thông tin lần quay
 */
async function getSpinById(spinId) {
  return await get(
    `SELECT h.id, h.user_id, h.prize_id, p.label as prize_label, h.created_at, 
            u.email as user_email
     FROM spin_history h
     JOIN users u ON h.user_id = u.id
     JOIN prizes p ON h.prize_id = p.id
     WHERE h.id = ?`,
    [spinId]
  );
}

/**
 * Thêm một lần quay mới vào lịch sử
 * @param {Object} spinData - Thông tin lần quay
 * @param {number} spinData.userId - ID người dùng
 * @param {number} spinData.prizeId - ID giải thưởng
 * @returns {Promise<Object>} Kết quả thực hiện
 * @throws {Error} Lỗi nếu người dùng đã quay trước đó
 */
async function recordSpin({ userId, prizeId }) {
  // Kiểm tra xem người dùng đã quay chưa
  const hasSpun = await hasUserSpun(userId);
  if (hasSpun) {
    throw new Error("Người dùng đã quay trước đó");
  }

  return await run(
    "INSERT INTO spin_history (user_id, prize_id) VALUES (?, ?)",
    [userId, prizeId]
  );
}

/**
 * Lấy thống kê về lịch sử quay
 * @returns {Promise<Object>} Thống kê lịch sử quay
 */
async function getSpinStats() {
  // Tổng số lần quay
  const totalSpins = await get("SELECT COUNT(*) as count FROM spin_history");

  // Số người đã quay
  const uniqueUsers = await get(
    "SELECT COUNT(DISTINCT user_id) as count FROM spin_history"
  );

  // Thống kê theo giải thưởng
  const prizeStats = await query(
    `SELECT p.label as prize_label, COUNT(*) as count 
     FROM spin_history h
     JOIN prizes p ON h.prize_id = p.id
     GROUP BY p.label 
     ORDER BY count DESC`
  );

  return {
    totalSpins: totalSpins.count,
    uniqueUsers: uniqueUsers.count,
    prizeStats,
  };
}

/**
 * Khôi phục quyền quay cho người dùng
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function resetUserSpin(userId) {
  return await run("DELETE FROM spin_history WHERE user_id = ?", [userId]);
}

/**
 * Đặt lại tất cả lịch sử quay (chỉ dùng cho mục đích admin)
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function resetAllSpins() {
  return await run("DELETE FROM spin_history");
}

module.exports = {
  getUserSpinHistory,
  hasUserSpun,
  getUserPrize,
  getSpinById,
  recordSpin,
  getSpinStats,
  resetUserSpin,
  resetAllSpins,
};
