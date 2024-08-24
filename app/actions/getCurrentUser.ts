import {db} from '@/db/db';
import {eq} from 'drizzle-orm';

import { getSession } from './getSession';
import { users } from '@/db/schema';

const getCurrentUser = async () => {
    try {
        const session = await getSession();
        if(!session?.user?.email){
            return null;
        }
        const currentUser = await db.select().from(users).where(eq(users.email, session.user.email))

        if(!currentUser){
            return null;
        }

        return currentUser[0];
    } catch (error:any) {
        return null;
    }
}