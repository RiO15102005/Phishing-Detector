import type { Conversation } from "../../types/conversation";
import SidebarHistoryItem from "./SidebarHistoryItem";

interface Props {
  title: string;
  conversations: Conversation[];
}

export default function SidebarHistoryGroup({
  title,
  conversations,
}: Props) {
  if (conversations.length === 0) return null;

  return (
    <div className="mb-5">

      <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">
        {title}
      </h3>

      <div className="space-y-1">
        {conversations.map((conversation) => (
          <SidebarHistoryItem
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </div>

    </div>
  );
}