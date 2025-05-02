import { NextResponse } from "next/server";
import { getUserById } from "@/lib/db/models/user";
import { getUserSpinStatus } from "@/lib/db/services/spinService";

/**
 * Lấy thông tin người dùng và trạng thái quay
 * GET /api/auth/user?id={userId}
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

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

    const spinStatus = await getUserSpinStatus(parseInt(userId, 10));

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      spinStatus,
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
