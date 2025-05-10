import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    // Lấy token từ header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    // Kiểm tra user trong database
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy user" },
        { status: 401 }
      );
    }

    // Trả về thông tin user (không bao gồm password)
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return NextResponse.json(
      { success: false, error: "Token không hợp lệ" },
      { status: 401 }
    );
  }
}
