import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const COOKIE_NAME = "act";

export const jwtService = {
  sign: (payload, expiresIn = "7d") => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  decode: (token) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  },
};

export function getUserFromRequest(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const token = match[1];
  return jwtService.verify(token);
}