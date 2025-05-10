import { NextResponse } from "next/server";
import { getUserById, deleteUser, updateUser } from "@/lib/db/models/user";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/jwt";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
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
    const result = await updateUser(id, data);
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
    const result = await deleteUser(id);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
