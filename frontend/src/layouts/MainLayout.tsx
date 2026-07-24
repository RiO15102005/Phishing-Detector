import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import ChatArea from "../components/chat/ChatArea";
import ChatInput from "../components/chat/ChatInput";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#F7FAF7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Chat */}
        <ChatArea />

        {/* Footer */}
        <ChatInput />
      </div>
    </div>
  );
}