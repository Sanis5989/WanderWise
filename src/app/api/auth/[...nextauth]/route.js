// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import connectDb from '../../../Utils/db';
import User from '../../../models/User';

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
       async authorize(credentials) {
        await connectDb();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          console.log("No user found with this email.");
          return null; // <-- CHANGE: Return null instead of throwing
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Incorrect password.");
          return null; // <-- CHANGE: Return null instead of throwing
        }

        // Return user object if everything is valid
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDb();
          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = await User.create({
              email: profile.email,
              name: profile.name,
              // Note: Google users won't have a password in your DB
            });
          }
        } catch (error) {
          console.log("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };