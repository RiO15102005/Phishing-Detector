import { useState } from "react";
import { MoreHorizontal, Pin } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import type { Conversation } from "../../types/conversation";
import ConversationMenu from "./ConversationMenu";

interface Props {
  conversation: Conversation;
}

export default function SidebarHistoryItem({
  conversation,
}: Props) {
  const [open, setOpen] = useState(false);

  const {
    currentConversationId,
    switchConversation,
    renameConversation,
    pinConversation,
    deleteConversation,
  } = useChatStore();

  const active =
    currentConversationId === conversation.id;

  return (
    <button
      onClick={() => switchConversation(conversation.id)}
      className={`
        group
        relative
        flex
        w-full
        items-center
        justify-between
        rounded-lg
        px-3
        py-2
        text-left
        transition-colors
        ${
          active
            ? "bg-green-100 text-green-700"
            : "hover:bg-gray-100"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-2">
        {conversation.pinned && (
          <Pin
            size={14}
            className="shrink-0 text-green-600"
          />
        )}

        <span className="truncate text-sm font-medium">
          {conversation.title}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="
          rounded-md
          p-1
          opacity-0
          transition
          group-hover:opacity-100
          hover:bg-gray-200
        "
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <ConversationMenu
          onRename={() => {
            const title = prompt(
              "Tên cuộc trò chuyện",
              conversation.title
            );

            if (title?.trim()) {
              renameConversation(
                conversation.id,
                title
              );
            }

            setOpen(false);
          }}
          onPin={() => {
            pinConversation(conversation.id);
            setOpen(false);
          }}
          onDelete={() => {
            if (
              confirm(
                "Bạn có chắc muốn xóa?"
              )
            ) {
              deleteConversation(
                conversation.id
              );
            }

            setOpen(false);
          }}
        />
      )}
    </button>
  );
}