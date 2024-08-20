import { db } from '@/db/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {email,name,password} = await request.json();
        if(!email || !name || !password){
            return new NextResponse('Missing info', {status:400});
        }
    
        const hashedPassword = await bcrypt.hash(password, 12);
    
        const user = await db.insert(users).values({
            email: email,
            name: name, 
            hashedPassword: hashedPassword,
        });
    
        return NextResponse.json(user);
    } catch (error:any) {
        console.log(error, 'Registration_Error');
        return new NextResponse('Internal Error', {status:500});
    }
}