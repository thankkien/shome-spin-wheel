import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/jwt";

/**
 * Xử lý đăng xuất người dùng
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
    });
    response.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    );
    return response;
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
