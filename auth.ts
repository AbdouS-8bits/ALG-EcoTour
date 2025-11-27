import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Define your admin users here (replace with DB lookup)
const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@ecotour.com",
    password: "Admin@123", // In production, use hashed passwords
    name: "Admin User",
  },
];

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        // Validate credentials
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid email or password");
        }

        const { email, password } = parsed.data;

        try {
          // Find user in PostgreSQL database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // For now, compare plaintext passwords (update to use bcrypt in production)
          // const isPasswordValid = await bcrypt.compare(password, user.password);
          const isPasswordValid = password === user.password;

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          // Check if user is admin
          if (user.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
          }

          // Return user object (without password)
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
          };
        } catch (error: any) {
          if (error.message.includes("Unauthorized")) {
            throw error;
          }
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};
