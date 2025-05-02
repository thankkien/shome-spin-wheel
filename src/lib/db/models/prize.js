const { query, get, run } = require("../index");

/**
 * Lấy danh sách tất cả giải thưởng
 * @param {boolean} activeOnly - Chỉ lấy giải thưởng đang hoạt động
 * @returns {Promise<Array>} Danh sách giải thưởng
 */
async function getAllPrizes(activeOnly = false) {
  const sql = activeOnly
    ? "SELECT * FROM prizes WHERE active = 1 ORDER BY id ASC"
    : "SELECT * FROM prizes ORDER BY id ASC";

  return await query(sql);
}

/**
 * Lấy thông tin giải thưởng theo id
 * @param {number} id - ID của giải thưởng
 * @returns {Promise<Object>} Thông tin giải thưởng
 */
async function getPrizeById(id) {
  return await get("SELECT * FROM prizes WHERE id = ?", [id]);
}

/**
 * Lấy thông tin giải thưởng theo tên
 * @param {string} label - Tên giải thưởng
 * @returns {Promise<Object>} Thông tin giải thưởng
 */
async function getPrizeByLabel(label) {
  return await get("SELECT * FROM prizes WHERE label = ?", [label]);
}

/**
 * Thêm giải thưởng mới
 * @param {Object} prizeData - Thông tin giải thưởng
 * @param {string} prizeData.label - Tên giải thưởng
 * @param {number} prizeData.quantity - Số lượng giải thưởng
 * @param {boolean} prizeData.active - Trạng thái hoạt động
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function createPrize({ label, quantity, active = true }) {
  return await run(
    "INSERT INTO prizes (label, quantity, active) VALUES (?, ?, ?)",
    [label, quantity, active ? 1 : 0]
  );
}

/**
 * Cập nhật thông tin giải thưởng
 * @param {number} id - ID của giải thưởng
 * @param {Object} prizeData - Thông tin cập nhật
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function updatePrize(id, prizeData) {
  const prize = await getPrizeById(id);
  if (!prize) {
    throw new Error("Giải thưởng không tồn tại");
  }

  const updates = [];
  const values = [];

  if (prizeData.label !== undefined) {
    updates.push("label = ?");
    values.push(prizeData.label);
  }

  if (prizeData.quantity !== undefined) {
    updates.push("quantity = ?");
    values.push(prizeData.quantity);
  }

  if (prizeData.active !== undefined) {
    updates.push("active = ?");
    values.push(prizeData.active ? 1 : 0);
  }

  if (updates.length === 0) {
    return { changes: 0 };
  }

  values.push(id);

  return await run(
    `UPDATE prizes SET ${updates.join(", ")} WHERE id = ?`,
    values
  );
}

/**
 * Giảm số lượng giải thưởng
 * @param {number} id - ID của giải thưởng
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function decreasePrizeQuantity(id) {
  const prize = await getPrizeById(id);

  if (!prize) {
    throw new Error("Giải thưởng không tồn tại");
  }

  if (prize.quantity <= 0) {
    throw new Error("Số lượng giải thưởng đã hết");
  }

  return await run(
    "UPDATE prizes SET quantity = quantity - 1 WHERE id = ? AND quantity > 0",
    [id]
  );
}

/**
 * Xóa giải thưởng
 * @param {number} id - ID của giải thưởng
 * @returns {Promise<Object>} Kết quả thực hiện
 */
async function deletePrize(id) {
  return await run("DELETE FROM prizes WHERE id = ?", [id]);
}

module.exports = {
  getAllPrizes,
  getPrizeById,
  getPrizeByLabel,
  createPrize,
  updatePrize,
  decreasePrizeQuantity,
  deletePrize,
};
