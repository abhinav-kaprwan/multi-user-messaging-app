import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnUsersPage = nextUrl.pathname.startsWith('/users');
      const isOnConversationPage = nextUrl.pathname.startsWith('/conversations');
      if (isOnUsersPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnConversationPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      else if (isLoggedIn) {
        return Response.redirect(new URL('/users', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;