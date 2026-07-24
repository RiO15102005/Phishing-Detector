import { Bell, ShieldCheck, User } from "lucide-react";

export default function Header() {
  return (
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white
        px-6
        shadow-sm
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          SHIELD AI
        </h1>

        <div className="mt-1 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70"></span>

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
          </span>

          <span className="text-xs font-medium text-green-600">
            Online
          </span>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <button
          className="
            rounded-xl
            p-2
            transition
            hover:bg-gray-100
          "
        >
          <Bell
            size={20}
            className="text-gray-600"
          />
        </button>

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-gray-200
            bg-gray-100
            transition
            hover:bg-gray-200
            hover:border-green-500
          "
        >
          <User
            size={22}
            className="text-gray-600"
          />
        </button>
      </div>
    </header>
  );
}