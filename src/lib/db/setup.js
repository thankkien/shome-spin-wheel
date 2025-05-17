const initializeDatabase = require("./initializeDatabase");
const { seedDatabase } = require("./seed");

/**
 * Chuẩn bị cơ sở dữ liệu cho ứng dụng
 * - Khởi tạo cấu trúc database
 * - Thêm dữ liệu mẫu (nếu cần)
 */
async function setupDatabase() {
  try {
    console.log("Bắt đầu cài đặt database...");

    // Khởi tạo database
    await initializeDatabase();
    console.log("Khởi tạo cấu trúc database thành công");

    // Thêm dữ liệu mẫu
    await seedDatabase();
    console.log("Thêm dữ liệu mẫu thành công");

    console.log("=== CÀI ĐẶT DATABASE HOÀN TẤT ===");
    return true;
  } catch (error) {
    console.error("Lỗi trong quá trình cài đặt database:", error);
    return false;
  }
}

// Thực thi hàm setup khi chạy file trực tiếp
if (require.main === module) {
  setupDatabase()
    .then((success) => {
      if (success) {
        console.log("Cơ sở dữ liệu đã được chuẩn bị thành công");
        process.exit(0);
      } else {
        console.error("Không thể chuẩn bị cơ sở dữ liệu");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Lỗi không xác định:", error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
