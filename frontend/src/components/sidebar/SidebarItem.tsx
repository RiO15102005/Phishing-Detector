import { Clock3 } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import type { Conversation } from "../../types/conversation";

interface Props {
  conversation: Conversation;
}

export default function SidebarItem({ conversation }: Props) {
  const { currentConversationId, switchConversation } = useChatStore();
  
  // Tự tính toán trạng thái active dựa vào store
  const active = currentConversationId === conversation.id;

  return (
    <button
      onClick={() => switchConversation(conversation.id)}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-left
        transition-all
        ${
          active
            ? "bg-green-100 text-green-700"
            : "hover:bg-gray-100 text-gray-700"
        }
      `}
    >
      <Clock3 size={18} className="flex-shrink-0" />

      <span className="truncate">
        {conversation.title}
      </span>
    </button>
  );
}