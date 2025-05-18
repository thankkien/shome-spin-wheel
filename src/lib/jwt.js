import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

export const COOKIE_NAME = "act";

export const jwtService = {
  sign: async (payload, expiresIn = "7d") => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 7 * 24 * 60 * 60; // 7 ngày
    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(secret);
  },

  verify: async (token) => {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (error) {
      console.error(error);
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

export function getUserFromRequest(response) {
  try {
    return JSON.parse(decodeURIComponent(response.headers.get("x-user")));
  } catch (error) {
    return null;
  }
}