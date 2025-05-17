const { getDbConnection } = require("../index");
const spinHistory = require("./data/spin_history.json");

function seedSpinHistory() {
  const db = getDbConnection();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const promise = spinHistory.map((spinHistory) => {
        const query =
          "INSERT INTO spin_history (id, user_id, prize_id, spin_index) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET user_id = ?, prize_id = ?, spin_index = ?;";
        const params = [
          spinHistory.id,
          spinHistory.user_id,
          spinHistory.prize_id,
          spinHistory.spin_index,
          spinHistory.user_id,
          spinHistory.prize_id,
          spinHistory.spin_index,
        ];
        return new Promise((resolve, reject) => {
          db.run(query, params, (err) => {
            if (err) {
              console.error("Lỗi khi thêm lịch sử quay thưởng:", err.message);
              reject(err);
            } else {
              console.log(
                `Thêm lịch sử quay thưởng ${spinHistory.id} thành công`
              );
              resolve();
            }
          });
        });
      });
      Promise.all(promise).then(() => {
        console.log("Thêm lịch sử quay thưởng thành công");
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

module.exports = seedSpinHistory;
