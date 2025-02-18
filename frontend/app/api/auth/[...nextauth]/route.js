import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users = [
  { username: 'doctor', password: 'doctor123', role: 'doctor' },
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'patient', password: 'patient123', role: 'patient' },
  { username: 'pharmacist', password: 'pharmacist123', role: 'pharmasist' }
];

// NextAuth configuration
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = users.find(
          (user) => user.username === credentials.username && user.password === credentials.password
        );
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    jwt: true
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { username: user.username, role: user.role };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user.username = token.user.username;
        session.user.role = token.user.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

// Handle GET and POST methods
export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
