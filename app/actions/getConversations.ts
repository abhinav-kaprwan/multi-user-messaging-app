import { db } from "@/db/db";
import getCurrentUser from "./getCurrentUser";
import { conversations, userConversations,users,messages,userSeenMessages } from "@/db/schema";
import { eq,desc} from "drizzle-orm";


const getConversations = async ()  => {
    const currentUser = await getCurrentUser();
    if(!currentUser?.id){
        return [];
    }

    try {
      const allConversations = await db
      .select({
        // conversation:conversations,
        // userConversation:userConversations,
        messages:messages
      })
      .from(conversations)
      .innerJoin(
        userConversations,
        eq(conversations.id,userConversations.conversationId)
      )
      .innerJoin(
        users,
        eq(userConversations.userId,currentUser.id)
        )
      .leftJoin(
        messages,
        eq(conversations.id,messages.conversationId)
      )
      
    } catch (error:any) {
        return [];
    }
}
export default getConversations;