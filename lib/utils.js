import jwt from "jsonwebtoken";
import clientPromise from "./mongodb";

export function signAdminToken() {
  const secret = process.env.JWT_ADMIN_SECRET || "devsecret";
  return jwt.sign({ admin: true }, secret, { expiresIn: "7d" });
}

export function verifyAdminToken(token) {
  try {
    const secret = process.env.JWT_ADMIN_SECRET || "devsecret";
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}
