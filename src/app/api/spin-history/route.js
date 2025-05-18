import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/spin-history
export async function GET() {
  try {
    const spins = await query(
      `SELECT sh.id, u.fullname AS user_name, p.label AS prize_label, sh.spun_at
      FROM spin_history sh
      LEFT JOIN users u ON sh.user_id = u.id
      LEFT JOIN prizes p ON sh.prize_id = p.id
      WHERE sh.spun_at IS NOT NULL
      ORDER BY sh.spun_at DESC
      LIMIT 5`
    );
    return NextResponse.json({ success: true, spins });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử quay gần nhất:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi khi lấy lịch sử quay gần nhất" },
      { status: 500 }
    );
  }
}
