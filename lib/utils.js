import jwt from "jsonwebtoken";

// -----------------------------
// Verify admin username + password
// -----------------------------
export async function verifyAdmin(username, password) {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

// -----------------------------
// Verify JWT token from request
// -----------------------------
export function verifyAdminToken(req) {
  try {
    const authHeader = req.headers.get("authorization"); // req.headers.get() for App Router
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    return jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

// -----------------------------
// Generate JWT token for admin
// -----------------------------
export function generateAdminToken(username) {
  return jwt.sign({ username }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "8h",
  });
}
