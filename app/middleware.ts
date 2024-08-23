import { auth } from "@/authoptions"

const ROOT = '/';
const PUBLIC_ROUTES = ['/login'];
const DEFAULT_REDIRECT = '/users';

export default auth((req) => {
    const { nextUrl } = req;
   
    const isAuthenticated = !!req.auth;
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
   
    if (isPublicRoute && isAuthenticated)
     return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
   
    if (!isAuthenticated && !isPublicRoute)
     return Response.redirect(new URL(ROOT, nextUrl));
   });

export const config = {
    matcher:['/users:path*']
}