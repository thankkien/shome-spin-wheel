import { NextResponse } from "next/server";
import { spinWheel } from "@/lib/db/services/spinService";
import { getUserById } from "@/lib/db/models/user";
import { getUserSpinStatus } from "@/lib/db/services/spinService";

/**
 * Lấy thông tin người dùng và trạng thái quay
 * GET /api/spin?user-id={userId}
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user-id");
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID người dùng không hợp lệ",
        },
        { status: 400 }
      );
    }

    const user = await getUserById(parseInt(userId, 10));

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy người dùng",
        },
        { status: 404 }
      );
    }

    const data = await getUserSpinStatus(parseInt(userId, 10));

    return NextResponse.json({
      success: true,
      ...data,
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

    const result = await spinWheel(parseInt(userId, 10));

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          prize: result.prize,
          hasSpun: result.hasSpun,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      prize: result.prize,
      hasSpun: result.hasSpun,
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
