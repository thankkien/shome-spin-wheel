import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/db/models/user";

/**
 * Xử lý đăng nhập người dùng
 * POST /api/auth/login
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập đầy đủ email và mật khẩu",
        },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Email hoặc mật khẩu không chính xác",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi đăng nhập",
      },
      { status: 500 }
    );
  }
}
