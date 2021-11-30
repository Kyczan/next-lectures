import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  database: process.env.MONGODB_URI + '?entityPrefix=nextauth_',

  secret: process.env.SECRET,

  callbacks: {
    async signIn(user, account, profile) {
      const isAllowedToSignIn = user.email === process.env.ALLOWED_EMAIL
      return isAllowedToSignIn
    },
  },
})
