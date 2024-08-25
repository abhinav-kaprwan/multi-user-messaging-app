import { users } from "@/db/schema";
import { getSession } from "./getSession";
import { ne,desc} from "drizzle-orm";
import { db } from "@/db/db";


const getUsers = async () => {
    const session = await getSession();

    if(!session?.user?.email){
        return [];
    }

    try {
        const allUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .where(ne(users.email, session.user.email));
    
        return allUsers;
    } catch (error: any) {
        return [];
    }
}

export default getUsers;