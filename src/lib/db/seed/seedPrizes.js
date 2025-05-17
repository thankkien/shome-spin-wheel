const { getDbConnection } = require("../index");
const prizes = require("./data/prizes.json");

/**
 * Thêm dữ liệu giải thưởng mẫu
 */
function seedPrizes() {
  const db = getDbConnection();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const promise = prizes.map((prize) => {
        const query =
          "INSERT INTO prizes (id, label, description) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET label = ?, description = ?;";
        const params = [
          prize.id,
          prize.label,
          prize.description,
          prize.label,
          prize.description,
        ];
        return new Promise((resolve, reject) => {
          db.run(query, params, (err) => {
            if (err) {
              console.error("Lỗi khi thêm giải thưởng:", err.message);
              reject(err);
            } else {
              console.log(`Thêm giải thưởng ${prize.id} thành công`);
              resolve();
            }
          });
        });
      });
      Promise.all(promise).then(() => {
        console.log("Thêm giải thưởng thành công");
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

module.exports = seedPrizes;
