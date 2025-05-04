import { NextResponse } from "next/server";
import { getAllPrizes } from "@/lib/db/models/prize";
import { pick } from "lodash";

/**
 * Lấy danh sách giải thưởng
 * GET /api/prizes
 */
export async function GET() {
  try {
    const prizes = await getAllPrizes();

    return NextResponse.json({
      success: true,
      prizes: prizes.map((prize) => pick(prize, ["id", "label", "active"])),
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
