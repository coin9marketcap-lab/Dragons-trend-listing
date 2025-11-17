export async function verifyAdmin(username, password) {
  // In production, replace with secure database check or hashed password check
  const adminUser = 'admin';
  const adminPass = 'password123'; // Change this to a strong password

  return username === adminUser && password === adminPass;
}
