import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface TokenData {
    id: string;
    username: string;
    email: string;
}

/**
 * Verify JWT token from request cookies
 * @param request - Next.js request object
 * @returns Token data if valid, null otherwise
 */
export function verifyToken(request: NextRequest): TokenData | null {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return null;
        }

        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not configured");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as TokenData;
        return decoded;
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
}

/**
 * Get user ID from token
 * @param request - Next.js request object
 * @returns User ID if token is valid, null otherwise
 */
export function getUserId(request: NextRequest): string | null {
    const tokenData = verifyToken(request);
    return tokenData?.id || null;
}
