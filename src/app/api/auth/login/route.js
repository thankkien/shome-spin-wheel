import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtService, COOKIE_NAME } from "@/lib/jwt";
import { get } from "@/lib/db";
import { omit } from "lodash";

/**
 * Xử lý đăng nhập người dùng
 * POST /api/auth/login
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const token = jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const userWithoutPassword = omit(user, ['password']);
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
