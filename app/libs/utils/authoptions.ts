import bcrypt from 'bcrypt';
import NextAuth,{NextAuthConfig} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from '@/db/db'; 
import {users} from "@/db/schema";
import { getProviders } from 'next-auth/react';
import {eq} from 'drizzle-orm';
import { authConfig } from '@/auth.config';


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
  }= NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db),
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'}
            },
            async authorize(credentials){ 
                const email = credentials.email as string | undefined;
                const password = credentials.password as string | undefined; 
                if(!email || !password){
                    throw new Error('Please provide both email and password')
                }
                const user = await db.select().from(users).where(eq(users.email, email));

                if(!user.length || !user[0].hashedPassword){
                    throw new Error('Invalid Credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    password,
                    user[0].hashedPassword
                );
                
                if(!isCorrectPassword){
                    throw new Error('Invalid Credentials')
                }
                return user[0];
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
