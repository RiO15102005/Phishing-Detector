import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "../../store/chatStore";

export default function SidebarHeader() {
  const { collapsed, toggleSidebar } = useChatStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-gray-100"
    >
      <div 
        className={`flex items-center p-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 shadow-md flex-shrink-0">
              <ShieldCheck size={22} className="text-white" />
            </div>

            <div className="truncate">
              <h1 className="text-sm font-bold text-gray-900">
                SHIELD AI
              </h1>
              <p className="text-[11px] text-gray-500">
                Cyber Security
              </p>
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>
    </motion.div>
  );
}