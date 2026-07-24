import { Search } from "lucide-react";

export default function SidebarSearch() {
  return (
    <div className="px-5 py-4">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          placeholder="Tìm kiếm cuộc hội thoại..."
          className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          py-3
          pl-10
          pr-4
          outline-none
          transition
          focus:border-green-500
        "
        />

      </div>

    </div>
  );
}