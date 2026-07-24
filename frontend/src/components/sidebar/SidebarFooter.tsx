import { User } from "lucide-react";

export default function SidebarFooter() {
  return (
    <div className="mt-auto border-t border-gray-200 p-4">
      <button
        className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          p-2
          transition
          hover:bg-gray-100
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-green-600
            text-white
          "
        >
          <User size={20} />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-800">
            Người dùng
          </span>

          <span className="text-xs text-gray-500">
            Chưa đăng nhập
          </span>
        </div>
      </button>
    </div>
  );
}