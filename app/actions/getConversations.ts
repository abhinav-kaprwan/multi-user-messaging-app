import { db } from "@/db/db";
import getCurrentUser from "./getCurrentUser";
import { conversations } from "@/db/schema";

const getConversations = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser?.id){
        return [];
    }

    try {
        const allConversations = await db.query.conversations.findMany({
            orderBy:{
                lastMessage:"desc"
            }
        })
        
        
    } catch (error:any) {
        return [];
    }
}