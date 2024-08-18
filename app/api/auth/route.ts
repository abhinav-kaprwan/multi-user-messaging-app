import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from '@/db/db'; 
import { getProviders } from 'next-auth/react';
import {eq} from 'drizzle-orm';
import { use } from 'react';



export const authOptions = {
    adapter: DrizzleAdapter(db),
    secret: process.env.SECRET,
    Providers:[
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
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid Credentials')
                } 
                const users = await db.query.users.findMany({
                    where: eq(users.id, 1)
                  }) 
               if(!users || !users?.hashedPassword) {
                     throw new Error('Invalid Credentials')
               }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if(!isCorrectPassword){
                    throw new Error('Invalid Credentials')
                }

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',

}
