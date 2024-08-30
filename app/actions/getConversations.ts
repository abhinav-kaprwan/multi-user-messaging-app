import { db } from "@/db/db";
import getCurrentUser from "./getCurrentUser";
import { conversations, userConversations,users,messages,userSeenMessages } from "@/db/schema";
import { eq,desc} from "drizzle-orm";

const getConversations = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser?.id){
        return [];
    }

    try {
      const senderAlias = users;
      const result = await db
      .select({
        conversation: conversations,
        user: users,
        message: messages,
        sender: senderAlias,
        seenBy: userSeenMessages
      })
      .from(conversations)
      .innerJoin(
        userConversations,
        eq(conversations.id, userConversations.conversationId)
      )
      .innerJoin(
        users,
        eq(userConversations.userId, users.id)
      )
      .leftJoin(
        messages,
        eq(conversations.id, messages.conversationId)
      )
      .leftJoin(
        senderAlias,
        eq(messages.senderId, senderAlias.id)
      )
      .leftJoin(
        userSeenMessages,
        eq(messages.id, userSeenMessages.messageId)
      )
      .where(
        eq(userConversations.userId, currentUser.id)
      )
      .orderBy(desc(conversations.lastMessageAt));
        
      return result;
    } catch (error:any) {
        return [];
    }
}
export default getConversations;