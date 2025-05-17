import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * Lấy danh sách giải thưởng
 * GET /api/prizes
 */
export async function GET() {
  try {
    const prizes = await query("SELECT id, label, quantity, active FROM prizes ORDER BY id ASC");

    return NextResponse.json({
      success: true,
      prizes,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giải thưởng:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi lấy danh sách giải thưởng",
      },
      { status: 500 }
    );
  }
}
