const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "shome-secret-key";
const COOKIE_NAME = "act";

function signJwt(payload, options = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d", ...options });
}

function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Lấy user từ request (Next.js API Route)
function getUserFromRequest(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const token = match[1];
  return verifyJwt(token);
}

module.exports = {
  signJwt,
  verifyJwt,
  getUserFromRequest,
  COOKIE_NAME,
};
