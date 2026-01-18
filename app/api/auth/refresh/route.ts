import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const { refreshToken } = body || {};
  if (!refreshToken) return NextResponse.json({ error: "Missing refreshToken" }, { status: 400 });

  // find the user with a refresh token (we store hashed token)
  const users = await prisma.user.findMany({ where: { refreshToken: { not: null } }, select: { id: true, email: true, role: true, refreshToken: true, refreshTokenExpires: true } });
  for (const user of users) {
    if (!user.refreshToken) continue;
    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (match) {
      if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
        return NextResponse.json({ error: "Refresh token expired" }, { status: 401 });
      }

      // rotate refresh token
      const crypto = await import("crypto");
      const newPlain = crypto.randomBytes(32).toString("hex");
      const newHash = await bcrypt.hash(newPlain, 10);
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newHash, refreshTokenExpires: expires } });

      return NextResponse.json({ ok: true, refreshToken: newPlain, user: { id: user.id, email: user.email, role: user.role } });
    }
  }

  return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
}
