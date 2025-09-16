// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }) {
      // This is called on sign-in
      if (user) {
        await connectDb();
        const dbUser = await User.findOne({ email: user.email });
        // Add custom properties to the token
        token.id = dbUser._id;
        token.role = dbUser.role; // Assuming you have a 'role' field in your User model
      }
      return token;
    },
    async session({ session, token }) {
      // This is called whenever a session is checked
      // Pass the custom properties from the token to the session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }