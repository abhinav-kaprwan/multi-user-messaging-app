import NextAuth from "next-auth"
import authoptions from "@/authoptions"

const {auth} = NextAuth(authoptions)
export const config = {
    matcher: '/users/:path*',
  }