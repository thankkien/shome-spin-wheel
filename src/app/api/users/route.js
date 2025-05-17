import { NextResponse } from "next/server";
import { query, run } from "@/lib/db";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/jwt";
import lodash from "lodash";

const userSchema = z.object({
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

  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const orderBy = searchParams.get("order-by") || "id";
  const order = (searchParams.get("order") || "asc").toUpperCase();

  const validColumns = ["id", "employeeId", "role", "fullname", "department"];
  const safeOrderBy = validColumns.includes(orderBy) ? orderBy : "id";
  const safeOrder = ["ASC", "DESC"].includes(order) ? order : "ASC";

  const fields = lodash.uniq(searchParams.getAll("fields[]") ?? validColumns);

  const search = searchParams.get("search") || "";
  const searchByParam = searchParams.get("search-by") || "fullname,department";
  const searchBy = searchByParam
    .split(",")
    .filter((field) => validColumns.includes(field));

  let sql = `SELECT ${fields || "*"} FROM users`;
  const params = [];

  if (search && searchBy.length > 0) {
    const searchConditions = searchBy
      .map((field) => `${field} LIKE ?`)
      .join(" OR ");
    sql += ` WHERE (${searchConditions})`;
    for (let i = 0; i < searchBy.length; i++) {
      params.push(`%${search}%`);
    }
  }

  sql += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const users = await query(sql, params);

  let countSql = "SELECT COUNT(*) as total FROM users";
  const countParams = [];

  if (search && searchBy.length > 0) {
    const searchConditions = searchBy
      .map((field) => `${field} LIKE ?`)
      .join(" OR ");
    countSql += ` WHERE (${searchConditions})`;
    for (let i = 0; i < searchBy.length; i++) {
      countParams.push(`%${search}%`);
    }
  }

  const totalResult = await query(countSql, countParams);
  const total = totalResult[0].total;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    success: true,
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
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

    // Kiểm tra employeeId đã tồn tại
    const existingEmployee = await query(
      "SELECT * FROM users WHERE employeeId = ?",
      [data.employeeId]
    );
    if (existingEmployee.length > 0) {
      throw new Error("employeeId đã tồn tại");
    }

    const result = await run(
      "INSERT INTO users (password, employeeId, role, fullname, department) VALUES (?, ?, ?, ?, ?, ?)",
      [
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
