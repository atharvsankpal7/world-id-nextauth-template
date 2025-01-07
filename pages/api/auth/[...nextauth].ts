import NextAuth, { NextAuthOptions } from "next-auth";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "worldcoin") {
        await dbConnect();
        const existingUser = await User.findOne({ worldId: user.id });
        
        if (!existingUser) {
          // New user needs to complete registration
          return `/register?worldId=${user.id}`;
        }
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session?.user) {
        await dbConnect();
        const user = await User.findOne({ worldId: token.sub });
        session.user.role = user?.role;
        session.user.id = user?._id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);