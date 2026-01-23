import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 Login attempt for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          throw new Error('Please provide email and password');
        }

        try {
          // Find user using raw SQL
          const result = await query(
            `SELECT id, email, name, password, role, "emailVerified" 
             FROM users 
             WHERE email = $1`,
            [credentials.email]
          );

          if (result.rows.length === 0) {
            console.log('❌ User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          const user = result.rows[0];
          console.log('✅ User found:', user.email, 'Role:', user.role);

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log('❌ Invalid password');
            throw new Error('Invalid email or password');
          }

          console.log('✅ Password valid');

          // Allow login regardless of email verification for now
          console.log('✅ Login successful');

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error('❌ Auth error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours (reduces API calls)
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Reduce the frequency of session checks
  events: {},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
