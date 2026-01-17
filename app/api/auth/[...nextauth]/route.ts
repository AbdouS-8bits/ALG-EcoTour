import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { loginSchema, validateRequest } from "@/lib/validation";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          console.log('✅ User found:', user.email, 'Role:', user.role);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

          if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return null;
          }

          console.log('✅ Password valid');

          // Check if emailVerified is boolean or timestamp
          const isEmailVerified = typeof user.emailVerified === 'boolean' 
            ? user.emailVerified 
            : !!user.emailVerified;

          // Allow login even if email not verified (you can change this)
          if (!isEmailVerified) {
            console.log('⚠️  Email not verified, but allowing login');
          }

          // Try to update refresh token if columns exist
          try {
            const crypto = await import("crypto");
            const refreshTokenPlain = crypto.randomBytes(32).toString("hex");
            const refreshTokenHash = await bcrypt.hash(refreshTokenPlain, 10);
            const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            await prisma.user.update({
              where: { id: user.id },
              data: {
                refreshToken: refreshTokenHash,
                refreshTokenExpires,
              } as any,
            });

            console.log('✅ Login successful with refresh token');

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              refreshToken: refreshTokenPlain,
            };
          } catch (refreshError) {
            // If refresh token columns don't exist, just return user without it
            console.log('⚠️  Refresh token update failed (columns may not exist), continuing anyway');
            
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if ((user as any).refreshToken) token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.refreshToken = token.refreshToken as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs
});

export { handler as GET, handler as POST };
