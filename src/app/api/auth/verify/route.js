import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtService, COOKIE_NAME } from "@/lib/jwt";
import { get } from "@/lib/db";
import { omit } from "lodash";

export async function POST() {
  try {
    const token = await (await cookies()).get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy token" },
        { status: 401 }
      );
    }

    const decoded = jwtService.verify(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const user = await get(
      `SELECT * FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy user" },
        { status: 401 }
      );
    }

    const userWithoutPassword = omit(user, ['password']);
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
