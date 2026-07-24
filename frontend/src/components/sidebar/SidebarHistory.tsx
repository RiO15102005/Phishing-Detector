import { useChatStore } from "../../store/chatStore";
import { groupConversation } from "../../utils/groupConversation";
import SidebarHistoryGroup from "./SidebarHistoryGroup";

export default function SidebarHistory() {
  const { conversations } = useChatStore();

  const pinned = conversations.filter((c) => c.pinned);
  const normal = conversations.filter((c) => !c.pinned);

  const {
    today,
    yesterday,
    week,
    older,
  } = groupConversation(normal);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">
      <SidebarHistoryGroup
        title="Đã ghim"
        conversations={pinned}
      />

      <SidebarHistoryGroup
        title="Hôm nay"
        conversations={today}
      />

      <SidebarHistoryGroup
        title="Hôm qua"
        conversations={yesterday}
      />

      <SidebarHistoryGroup
        title="7 ngày trước"
        conversations={week}
      />

      <SidebarHistoryGroup
        title="Cũ hơn"
        conversations={older}
      />
    </div>
  );
}