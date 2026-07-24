import { useChatStore } from "../../store/chatStore";
import SidebarHeader from "./SidebarHeader";
import SidebarNewChat from "./SidebarNewChat";
import SidebarHistory from "./SidebarHistory";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const { collapsed } = useChatStore();

  return (
    <aside
      className={`
        flex
        h-screen
        flex-col
        bg-white
        border-r
        transition-all
        duration-300
        overflow-hidden
        ${collapsed ? "w-14" : "w-80"}
      `}
    >
      <SidebarHeader />

      {!collapsed && (
        <>
          <SidebarNewChat />
          <SidebarHistory />
          <SidebarFooter />
        </>
      )}
    </aside>
  );
}