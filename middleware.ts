import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      if (pathname === '/admin/login') {
        return true;
      }

      return Boolean(token?.admin);
    },
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};
