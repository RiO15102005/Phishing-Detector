import {
  Pencil,
  Pin,
  Trash2,
} from "lucide-react";

interface Props {
  onRename: () => void;
  onPin: () => void;
  onDelete: () => void;
}

export default function ConversationMenu({
  onRename,
  onPin,
  onDelete,
}: Props) {
  return (
    <div
      className="
        absolute
        right-0
        top-8
        z-50
        w-44
        rounded-xl
        border
        bg-white
        shadow-lg
      "
    >
      <button
        onClick={onRename}
        className="flex w-full items-center gap-2 px-4 py-3 hover:bg-gray-100"
      >
        <Pencil size={16} />
        Đổi tên
      </button>

      <button
        onClick={onPin}
        className="flex w-full items-center gap-2 px-4 py-3 hover:bg-gray-100"
      >
        <Pin size={16} />
        Ghim
      </button>

      <button
        onClick={onDelete}
        className="flex w-full items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} />
        Xóa
      </button>
    </div>
  );
}