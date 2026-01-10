import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

async function sendEmail(to: string, subject: string, text: string) {
  try {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: { 
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASSWORD 
        },
      });
      await transporter.sendMail({ 
        from: process.env.EMAIL_USER, 
        to, 
        subject, 
        text 
      });
      return;
    }
  } catch (e) {
    console.error('Email send error:', e);
  }
  // fallback
  console.log("Email to:", to, "subject:", subject, "body:", text);
}

export async function POST(req: Request) {
  try {
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
    await sendEmail(
      email, 
      "Verify your email", 
      `Your verification code: ${token}\nVerify at: ${verifyUrl}?token=${token}`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}