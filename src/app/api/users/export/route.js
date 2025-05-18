import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/jwt";
import Papa from "papaparse";

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }
  const users = await query("SELECT u.* , sh.prize_id, sh.spin_index, sh.spun_at FROM users u LEFT JOIN spin_history sh ON u.id = sh.user_id WHERE sh.spun_at IS NOT NULL", []);
  const csv = Papa.unparse(users);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=users.csv"
    }
  });
}
