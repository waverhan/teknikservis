import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export async function comparePasswords(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
}

export async function signJWT(payload: { businessId: string; email: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as { businessId: string; email: string };
    } catch {
        return null;
    }
}

export async function getSession() {
    let token = cookies().get("token")?.value;

    if (!token) {
        const authHeader = headers().get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    }

    if (!token) return null;
    return verifyJWT(token);
}
