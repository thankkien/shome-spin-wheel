import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/jwt";

const updateUserSchema = z.object({
  password: z.string().min(6).optional(),
  employeeId: z.string().min(1).optional(),
  role: z.enum(["admin", "user"]).optional(),
  fullname: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
});

async function isAdmin(request) {
  const user = getUserFromRequest(request);
  return user && user.role === "admin";
}

export async function PATCH(request, { params }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const id = params.id;
    const body = await request.json();
    const data = updateUserSchema.parse(body);

    // Kiểm tra user tồn tại
    const user = await get("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
      throw new Error("Không tìm thấy user");
    }

    // Kiểm tra employeeId mới nếu có
    if (data.employeeId && data.employeeId !== user.employeeId) {
      const existingEmployee = await get(
        "SELECT * FROM users WHERE employeeId = ? AND id != ?",
        [data.employeeId, id]
      );
      if (existingEmployee) {
        throw new Error("employeeId đã tồn tại");
      }
    }

    // Tạo câu lệnh UPDATE động
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new Error("Không có trường nào để cập nhật");
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    const result = await run(sql, values);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const id = params.id;
    const result = await run("DELETE FROM users WHERE id = ?", [id]);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
