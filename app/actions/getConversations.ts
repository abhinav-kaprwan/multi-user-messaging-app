import { db } from "@/db/db";
import getCurrentUser from "./getCurrentUser";
import { conversations, userConversations,users,messages,userSeenMessages } from "@/db/schema";
import { eq,desc} from "drizzle-orm";
import { ProcessedConversation } from "@/app/types/types";

const getConversations = async ()  => {
    const currentUser = await getCurrentUser();
    if(!currentUser?.id){
        return [];
    }

    try {
          
      // subquery aliasing for sender
      const senderSubquery = db
      .select({
      id: users.id,
      name: users.name,
      email: users.email,
      })
      .from(users)
      .as('sender');

      const allConversations = await db
      .select({
        conversation:conversations,
        userConversation:userConversations,
        messages:messages,
        sender: {
          id: senderSubquery.id,
          name: senderSubquery.name,
          email: senderSubquery.email
        },
        seenBy:userSeenMessages,
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
      .innerJoin(
          senderSubquery,
          eq(senderSubquery.id,messages.senderId)
        )
      .leftJoin(
        messages,
        eq(conversations.id,messages.conversationId)
      )
      .leftJoin(
        userSeenMessages,
        eq(messages.id,userSeenMessages.messageId)
      )
      .where(
        eq(userConversations.userId,currentUser.id)
      )
      .orderBy(desc(conversations.lastMessageAt))

      const processConversations = (allConversations: any[]) => {
        const processedConversations = allConversations.reduce<Record<string, ProcessedConversation>>((acc, row) => {
          const conversationId = row.conversation.id;
      
          if (!acc[conversationId]) {
            acc[conversationId] = {
              conversation: row.conversation,
              userConversation: row.userConversation,
              messages: [],
              seenBy: []
            };
          }
      
          if (row.messages) {
            const existingMessage = acc[conversationId].messages.find(m => m.id === row.messages.id);
            if (!existingMessage) {
              acc[conversationId].messages.push({
                ...row.messages,
                sender: row.sender
              });
            }
          }
      
          if (row.seenBy && !acc[conversationId].seenBy.some(sb => sb.userId === row.seenBy.userId && sb.messageId === row.seenBy.messageId)) {
            acc[conversationId].seenBy.push(row.seenBy);
          }
      
          return acc;
        }, {});
      
        return Object.values(processedConversations);
      };
      const result: ProcessedConversation[] =  processConversations(allConversations);
      return result;
    } catch (error:any) {
        return [];
    }
}
export default getConversations;