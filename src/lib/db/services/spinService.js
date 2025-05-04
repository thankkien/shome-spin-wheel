const { decreasePrizeQuantity, getAllPrizes } = require("../models/prize");
const {
  recordSpin,
  hasUserSpun,
  getUserPrize,
} = require("../models/spinHistory");

/**
 * Lấy thông tin người dùng đã quay hay chưa
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Kết quả kiểm tra và thông tin giải thưởng (nếu có)
 */
async function getUserSpinStatus(userId) {
  try {
    const hasSpun = await hasUserSpun(userId);

    if (hasSpun) {
      const prize = await getUserPrize(userId);
      return {
        hasSpun: true,
        prize,
      };
    }

    return {
      hasSpun: false,
      prize: null,
    };
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái quay:", error);
    throw error;
  }
}

/**
 * Quay vòng quay và trả về kết quả
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Kết quả quay
 * @throws {Error} Lỗi nếu người dùng đã quay trước đó hoặc không còn giải thưởng
 */
async function spinWheel(userId) {
  try {
    // Kiểm tra xem người dùng đã quay chưa
    const spinStatus = await getUserSpinStatus(userId);
    if (spinStatus.hasSpun) {
      return {
        success: false,
        error: "Bạn đã quay vòng quay trước đó",
        prize: spinStatus.prize,
        hasSpun: spinStatus.hasSpun,
      };
    }

    // Lấy danh sách giải thưởng còn hàng
    const availablePrizes = (await getAllPrizes(true)).filter(
      (prize) => prize.quantity > 0
    );

    if (availablePrizes.length === 0) {
      throw new Error("Đã hết giải thưởng, vui lòng quay lại sau");
    }

    // Tính tổng số lượng của tất cả giải thưởng
    const totalItems = availablePrizes.reduce(
      (sum, prize) => sum + prize.quantity,
      0
    );

    // Chọn giải thưởng ngẫu nhiên
    let randomNumber = Math.floor(Math.random() * totalItems);
    let selectedPrize = null;

    // Thuật toán lựa chọn dựa trên số lượng
    for (const prize of availablePrizes) {
      if (randomNumber < prize.quantity) {
        selectedPrize = prize;
        break;
      }
      randomNumber -= prize.quantity;
    }

    if (!selectedPrize) {
      // Nếu không chọn được giải, lấy giải đầu tiên còn hàng
      selectedPrize = availablePrizes[0];
    }

    // Giảm số lượng giải thưởng
    await decreasePrizeQuantity(selectedPrize.id);

    // Ghi nhận lịch sử quay
    await recordSpin({
      userId,
      prizeId: selectedPrize.id,
    });

    return {
      success: true,
      prize: {
        id: selectedPrize.id,
        label: selectedPrize.label,
      },
      hasSpun: true,
    };
  } catch (error) {
    console.error("Lỗi khi quay vòng quay:", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi quay vòng quay",
    };
  }
}

module.exports = {
  getUserSpinStatus,
  spinWheel,
};
