import { NextResponse } from "next/server";

/**
 * Xử lý đăng xuất người dùng
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi đăng xuất",
      },
      { status: 500 }
    );
  }
}
