import { useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import Welcome from "./Welcome";
import MessageBubble from "./MessageBubble";
import LoadingBubble from "./LoadingBubble";

export default function ChatArea() {
  const { conversations, currentConversationId, loading } = useChatStore();

  const conversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  const messages = conversation?.messages ?? [];

  const containerRef = useRef<HTMLDivElement>(null);

  // Chỉ scroll khi số lượng tin nhắn thay đổi
  useAutoScroll(containerRef, messages.length);

  return (
    <div
      ref={containerRef}
      className="
        flex-1
        overflow-y-auto
        bg-[#F7FAF7]
        px-8
        py-6
      "
    >
      {messages.length === 0 && !loading ? (
        <Welcome />
      ) : (
        <div className="flex flex-col gap-5">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}

          {loading && <LoadingBubble />}
        </div>
      )}
    </div>
  );
}