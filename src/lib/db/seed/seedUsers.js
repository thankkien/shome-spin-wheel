const { getDbConnection } = require("../index");
const users = require("./data/user.json");

/**
 * Thêm dữ liệu người dùng mẫu
 */
function seedUsers() {
  const db = getDbConnection();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const promise = users.map(async (user) => {
        if (!user.role) {
          user.role = "user";
        }
        const query =
          "INSERT INTO users (id, password, employeeId, role, fullname, department, gender, season, workday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(employeeId) DO UPDATE SET password = ?, employeeId = ?, role = ?, fullname = ?, department = ?, gender = ?, season = ?, workday = ?;";
        const params = [
          user.id,
          user.password,
          user.employeeId,
          user.role,
          user.fullname,
          user.department,
          user.gender,
          user.season,
          user.workday,
          user.password,
          user.employeeId,
          user.role,
          user.fullname,
          user.department,
          user.gender,
          user.season,
          user.workday,
        ];

        return new Promise((resolve, reject) => {
          db.run(query, params, (err) => {
            if (err) {
              console.error("Lỗi khi thêm người dùng:", err.message);
              reject(err);
            } else {
              console.log(`Thêm dữ liệu người dùng ${user.id} thành công`);
              resolve();
            }
          });
        });
      });
      Promise.all(promise).then(() => {
        console.log("Thêm dữ liệu người dùng thành công");
        resolve();
      });
    });

    db.close((err) => {
      if (err) {
        console.error("Lỗi khi đóng kết nối database:", err.message);
        reject(err);
      }
    });
  });
}

module.exports = seedUsers;
