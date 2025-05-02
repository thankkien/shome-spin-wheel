import { NextResponse } from "next/server";
import { spinWheel } from "@/lib/db/services/spinService";

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

    const result = await spinWheel(parseInt(userId, 10));

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          prize: result.prize,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      prize: result.prize,
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
