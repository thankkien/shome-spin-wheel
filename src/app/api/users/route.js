import { NextResponse } from "next/server";
import { getAllUsers, createUser, deleteUser } from "@/lib/db/models/user";
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
  const users = await getAllUsers();
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
    const result = await createUser(data);
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
      const result = await deleteUser(id);
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
