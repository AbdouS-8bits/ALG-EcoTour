import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

async function sendEmail(to: string, subject: string, text: string) {
  try {
    const nodemailer = await import("nodemailer");
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
      return;
    }
  } catch (e) {
    // ignore and fallback to console
  }
  // fallback
  console.log("Email to:", to, "subject:", subject, "body:", text);
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = body?.email;
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true });

  const crypto = await import("crypto");
  const token = crypto.randomBytes(20).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpires: expires,
    },
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify-email`;
  await sendEmail(email, "Verify your email", `Your verification code: ${token}\nPOST to: ${verifyUrl}`);

  return NextResponse.json({ ok: true });
}
