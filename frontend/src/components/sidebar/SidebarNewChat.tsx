import { Plus } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export default function SidebarNewChat() {
  const { newChat } = useChatStore();

  return (
    <div className="p-4">
      <button
        onClick={newChat}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-green-600
          px-4
          py-3
          text-white
          font-medium
          transition
          hover:bg-green-700
        "
      >
        <Plus size={18} />
        <span>New Chat</span>
      </button>
    </div>
  );
}