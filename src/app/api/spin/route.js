import { NextResponse } from "next/server";
import { query, run } from "@/lib/db";
import { getUserFromRequest } from "@/lib/jwt";
import lodash from "lodash";

//viết 1 hàm private dùng chung giữa GET và POST
async function getSpinHistory(request) {
  const user = getUserFromRequest(request);

  const spinHistory = await query(
    `SELECT sh.*, p.label AS prize_label
FROM spin_history sh
LEFT JOIN prizes p ON sh.prize_id = p.id
WHERE sh.user_id = ?
ORDER BY sh.spin_index ASC`,
    [user.id]
  );

  const { spun, notSpunPrizes } = spinHistory.reduce(
    (acc, item) => {
      if (item.spun_at) {
        acc.spun.push(item);
      } else {
        acc.notSpunPrizes.push(item);
      }
      return acc;
    },
    { spun: [], notSpunPrizes: [] }
  );

  const hasSpun = spun.length > 0;
  const isCanSpin = notSpunPrizes.length > 0;
  const prizes = spun?.length
    ? lodash.map(spun, (item) =>
        lodash.pick(item, ["id", "prize_id", "prize_label", "spun_at"])
      )
    : [];
  console.log({ spinHistory, user, hasSpun, isCanSpin, prizes, notSpunPrizes });
  return { spinHistory, user, hasSpun, isCanSpin, prizes, notSpunPrizes };
}

/**
 * Lấy thông tin người dùng và trạng thái quay
 * GET /api/spin
 */
export async function GET(request) {
  try {
    const { hasSpun, isCanSpin, prizes } = await getSpinHistory(request);

    return NextResponse.json({
      success: true,
      isCanSpin,
      hasSpun,
      prizes,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi lấy thông tin người dùng",
      },
      { status: 500 }
    );
  }
}

/**
 * Xử lý quay vòng quay
 * POST /api/spin
 */
export async function POST(request) {
  try {
    const { hasSpun, isCanSpin, notSpunPrizes, prizes } = await getSpinHistory(
      request
    );

    if (!isCanSpin) {
      return NextResponse.json({
        success: false,
        error: "Bạn đã hết lượt quay rồi!",
        isCanSpin,
        hasSpun,
      });
    }

    const [newPrize, ...remainingPrizes] = notSpunPrizes;
    const prize = { ...newPrize, spun_at: new Date() };
    await run("UPDATE spin_history SET spun_at = ? WHERE id = ?", [
      prize.spun_at,
      prize.id,
    ]);

    return NextResponse.json({
      success: true,
      prizes: [...prizes, prize],
      hasSpun: true,
      isCanSpin: remainingPrizes.length > 0,
    });
  } catch (error) {
    console.error("Lỗi khi quay vòng quay:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Đã xảy ra lỗi khi quay vòng quay",
      },
      { status: 500 }
    );
  }
}
