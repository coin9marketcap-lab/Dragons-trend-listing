import { NextResponse } from "next/server";
import { signAdminToken } from "../../../lib/utils";
import bcrypt from "bcryptjs";

export default async function handler(req) {
  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  const { password } = await req.json();
  const ADMIN = process.env.ADMIN_PASSWORD || "admin123";
  // simple compare
  if (password === ADMIN) {
    const token = signAdminToken();
    return NextResponse.json({ success: true, token });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
