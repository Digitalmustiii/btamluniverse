// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Digitalmustiii' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USER!;
        const adminPassword = process.env.ADMIN_PASS!;

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {
          return {
            id: adminUsername,
            name: adminUsername,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
