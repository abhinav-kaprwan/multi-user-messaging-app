"use client";

import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import { ProcessedConversation } from "@/app/types/types"
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react"
import clsx from "clsx"
import { MdOutlineGroupAdd } from "react-icons/md";
interface ConversationListProps {
  initialItems:ProcessedConversation[]
}

const ConversationList:React.FC<ConversationListProps> = ({
  initialItems
}) => {
  const [items,setItems] = useState(initialItems);
  const router = useRouter();
  const {conversationId,isOpen} = useConversation();

  useEffect(() => {
    console.log('Items:', items);
  }, [items]);

  return (
    <>
    <aside className={clsx(`
      fixed 
      inset-y-0 
      pb-20
      lg:pb-0
      lg:left-20 
      lg:w-80 
      lg:block
      overflow-y-auto 
      border-r 
      border-gray-200 
    `, isOpen ? 'hidden' : 'block w-full left-0')}>
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">
            Messages
          </div>
          <div className="
          rounded-full
          p-2 
          bg-gray-100
          text-gray-600
          cursor-pointer
          hover:opacity-75
          transition
          ">
            <MdOutlineGroupAdd/>
          </div>
        </div>
        
        {items.map((item) => (
            <ConversationBox
              key={item.userConversation.conversationId}
              data={item}
              selected={conversationId === item.conversation.id}
            />
          ))}
      </div>
    </aside>
    </>
  )
}

export default ConversationList