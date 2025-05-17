import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/jwt";

/**
 * Xử lý đăng xuất người dùng
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    // Xóa cookie
    await cookies().delete(COOKIE_NAME);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
