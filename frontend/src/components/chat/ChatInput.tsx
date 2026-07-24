import { ImagePlus, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore";

export default function ChatInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    preview,
    setImage,
    removeImage,
    sendImage,
    sendMessage,
    loading,
  } = useChatStore();

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";

    textareaRef.current.style.height =
      Math.min(
        textareaRef.current.scrollHeight,
        240
      ) + "px";
  }, [message]);

  function handleSelect() {
    inputRef.current?.click();
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
  }

  async function handleSend() {
    if (!preview && message.trim() === "") return;

    if (preview) {
      await sendImage();
    } else {
      const text = message;
      setMessage("");
      await sendMessage(text);
    }
  }

  return (
    <div className="border-t bg-white p-5">
      {preview && (
        <div className="mb-4 flex">
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="
                h-40
                max-w-xs
                rounded-2xl
                border
                object-cover
                shadow-md
              "
            />

            <button
              onClick={removeImage}
              className="
                absolute
                -right-3
                -top-3
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-red-500
                text-white
                shadow-lg
                transition
                hover:scale-110
                hover:bg-red-600
              "
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-3xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          shadow-sm
          transition
          focus-within:border-green-500
          focus-within:ring-2
          focus-within:ring-green-100
        "
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleChange}
        />

        <button
          onClick={handleSelect}
          disabled={loading}
          className="rounded-lg p-2 hover:bg-green-50 transition"
        >
          <ImagePlus className="text-green-600" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Nhập URL, Email, SĐT hoặc đặt câu hỏi..."
          className="
            flex-1
            resize-none
            border-0
            bg-transparent
            py-2
            text-[15px]
            leading-6
            text-gray-800
            placeholder:text-gray-400
            outline-none
          "
        />

        <button
          disabled={
            loading ||
            (!preview && message.trim() === "")
          }
          onClick={handleSend}
          className="
            rounded-xl
            bg-green-600
            p-3
            text-white
            transition
            disabled:opacity-40
          "
        >
          <SendHorizontal />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-gray-400">
        Nhập câu hỏi để SHIELD hỗ trợ nhé!
      </p>
    </div>
  );
}