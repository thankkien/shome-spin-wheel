import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/db/models/user";
import { signJwt, COOKIE_NAME } from "@/lib/jwt";

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

    // Tạo JWT và set vào cookie HttpOnly
    const token = signJwt({
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      fullname: user.fullname,
      department: user.department,
    });
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
        fullname: user.fullname,
        department: user.department,
      },
    });
    response.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    return response;
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
