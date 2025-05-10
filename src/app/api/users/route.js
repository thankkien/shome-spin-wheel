import { NextResponse } from "next/server";
import { query, run } from "@/lib/db";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/jwt";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  employeeId: z.string().min(1),
  role: z.enum(["admin", "user"]).default("user"),
  fullname: z.string().min(1),
  department: z.string().min(1),
});

async function isAdmin(request) {
  const user = getUserFromRequest(request);
  return user && user.role === "admin";
}

export async function GET(request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  const users = await query(
    "SELECT id, email, employeeId, role, fullname, department FROM users ORDER BY id ASC"
  );
  return NextResponse.json({ success: true, users });
}

export async function POST(request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const body = await request.json();
    const data = userSchema.parse(body);

    // Kiểm tra email đã tồn tại
    const existingUser = await query(
      "SELECT * FROM users WHERE email = ?",
      [data.email]
    );
    if (existingUser.length > 0) {
      throw new Error("Email đã tồn tại");
    }

    // Kiểm tra employeeId đã tồn tại
    const existingEmployee = await query(
      "SELECT * FROM users WHERE employeeId = ?",
      [data.employeeId]
    );
    if (existingEmployee.length > 0) {
      throw new Error("employeeId đã tồn tại");
    }

    const result = await run(
      "INSERT INTO users (email, password, employeeId, role, fullname, department) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.email,
        data.password,
        data.employeeId,
        data.role,
        data.fullname,
        data.department,
      ]
    );
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: "Thiếu danh sách id" },
        { status: 400 }
      );
    }
    const ids = idsParam
      .split(",")
      .map((id) => parseInt(id))
      .filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Danh sách id không hợp lệ" },
        { status: 400 }
      );
    }
    const results = [];
    for (const id of ids) {
      const result = await run("DELETE FROM users WHERE id = ?", [id]);
      results.push({ id, result });
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
