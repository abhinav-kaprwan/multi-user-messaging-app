import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import {db} from "@/db/db";
import {conversations,userConversations} from "@/db/schema";
import { eq,or } from "drizzle-orm";

export async function POST(request:Request){
    try {
        const currentUser = await getCurrentUser();
        const {userId,isGroup,members,name} = await request.json();

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized', {status:401});
        }

        if(isGroup && (!members || members.length<2 ||!name)){
            return new NextResponse('Invalid Request', {status:400});
        }

        if(isGroup){
            return await db.transaction(async (tsx)=> {
                const newConversation = await tsx.insert(conversations).values({
                    name,
                    isGroup
                }).returning({id:conversations.id});
                
                const userConversationValues = [
                    ...members.map((member:{value:string}) => ({
                        userId:member.value,
                        conversationId:newConversation[0].id
                    })),{
                        userId: currentUser.id,
                        conversationId: newConversation[0].id
                    }
                ]
                await tsx.insert(userConversations).values(userConversationValues);
    
                const conversationWithUsers = await tsx.query.conversations.findFirst({
                    where:eq(conversations.id,newConversation[0].id),
                    with:{user:true}
                });
                return NextResponse.json(conversationWithUsers);
            })
        }

        const existingConversation = await db.select().from(conversations)
            .innerJoin(userConversations,eq(conversations.id,userConversations.conversationId))
            .where(or())       
        
    } catch (error:any) {
        return new NextResponse('Internal Error', {status:500});
    }
}