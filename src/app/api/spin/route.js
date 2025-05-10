import { NextResponse } from "next/server";
import { query, get, run } from "@/lib/db";

/**
 * Lấy thông tin người dùng và trạng thái quay
 * GET /api/spin?user-id={userId}
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID người dùng không hợp lệ",
        },
        { status: 400 }
      );
    }

    // Kiểm tra user tồn tại
    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy người dùng",
        },
        { status: 404 }
      );
    }

    // Kiểm tra trạng thái quay trong ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    const spinHistory = await get(
      "SELECT * FROM spin_history WHERE user_id = ? AND date(created_at) = date(?)",
      [userId, todayISO]
    );
    const hasSpun = !!spinHistory;

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name },
      hasSpun,
      prize: spinHistory ? spinHistory.prize_label : null,
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
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID người dùng không hợp lệ",
        },
        { status: 400 }
      );
    }

    // Kiểm tra user tồn tại
    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy người dùng",
        },
        { status: 404 }
      );
    }

    // Kiểm tra đã quay hôm nay chưa
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    const spinHistory = await get(
      "SELECT * FROM spin_history WHERE user_id = ? AND date(created_at) = date(?)",
      [userId, todayISO]
    );
    if (spinHistory) {
      return NextResponse.json({
        success: false,
        error: "Bạn đã quay hôm nay rồi!",
        prize: spinHistory.prize_label,
        hasSpun: true,
      });
    }

    // Lấy danh sách giải thưởng còn active
    const prizes = await query("SELECT * FROM prizes WHERE active = 1");
    if (!prizes || prizes.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Không có giải thưởng nào khả dụng",
      });
    }

    // Quay random giải thưởng
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];

    // Lưu lịch sử quay
    await run(
      "INSERT INTO spin_history (user_id, prize_id, prize_label, created_at) VALUES (?, ?, ?, datetime('now'))",
      [userId, prize.id, prize.label]
    );

    return NextResponse.json({
      success: true,
      prize: prize.label,
      hasSpun: true,
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
