import { create } from "zustand";
import type { ChatMessage } from "../types/message";
import type { Conversation } from "../types/conversation";
import {
  sendChatMessage,
  sendChatMessageStream,
  sendChatImage,
  fileToBase64,
} from "../services/chatApi";
import { generateTitle } from "../utils/generateTitle";
import {
  saveConversation,
  loadConversation,
} from "../utils/storage";
import { streamText } from "../utils/typewriter"; // dùng làm fallback khi streaming thật lỗi


interface ChatStore {
  conversations: Conversation[];
  currentConversationId: string;
  loading: boolean;
  selectedImage: File | null;
  preview: string | null;
  collapsed: boolean;
  
  getCurrentConversation: () => Conversation | undefined;
  newChat: () => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setImage: (file: File | null) => void;
  removeImage: () => void;
  sendImage: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
}

const firstConversation: Conversation = {
  id: crypto.randomUUID(),
  title: "Cuộc trò chuyện mới",
  messages: [],
  createdAt: new Date(),
  pinned: false,
};

const savedConversations = loadConversation();

const initialConversations =
  savedConversations && savedConversations.length > 0
    ? savedConversations.map((conversation: any) => ({
        ...conversation,
        createdAt: new Date(conversation.createdAt),
      }))
    : [firstConversation];

const initialConversationId =
  initialConversations[0].id;

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: initialConversations,
  currentConversationId: initialConversationId,
  loading: false,
  selectedImage: null,
  preview: null,
  collapsed: false,

  getCurrentConversation() {
    const { conversations, currentConversationId } = get();
    return conversations.find((c) => c.id === currentConversationId);
  },

  newChat() {
    const current = get().getCurrentConversation();

    if (current && current.messages.length === 0) {
      set({
        currentConversationId: current.id,
      });
      return;
    }

    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: "Cuộc trò chuyện mới",
      messages: [],
      createdAt: new Date(),
      pinned: false,
    };

    set((state) => {
      const conversations = [conversation, ...state.conversations];
      saveConversation(conversations);
      
      return {
        conversations,
        currentConversationId: conversation.id,
      };
    });
  },

  switchConversation(id) {
    set({
      currentConversationId: id,
    });
  },

  deleteConversation(id) {
    set((state) => {
      let conversations = state.conversations.filter(
        (c) => c.id !== id
      );

      if (conversations.length === 0) {
        const conversation: Conversation = {
          id: crypto.randomUUID(),
          title: "Cuộc trò chuyện mới",
          messages: [],
          createdAt: new Date(),
          pinned: false,
        };

        conversations = [conversation];
        saveConversation(conversations);
        
        return {
          conversations,
          currentConversationId: conversation.id,
        };
      }

      const currentExists = conversations.some(
        (c) => c.id === state.currentConversationId
      );

      saveConversation(conversations);
      
      return {
        conversations,
        currentConversationId: currentExists
          ? state.currentConversationId
          : conversations[0].id,
      };
    });
  },

  pinConversation(id) {
    set((state) => {
      const conversations = state.conversations.map((c) =>
        c.id === id
          ? {
              ...c,
              pinned: !c.pinned,
            }
          : c
      );
      
      saveConversation(conversations);
      
      return { conversations };
    });
  },

  renameConversation(id, title) {
    set((state) => {
      const conversations = state.conversations.map((c) =>
        c.id === id
          ? {
              ...c,
              title,
            }
          : c
      );
      
      saveConversation(conversations);
      
      return { conversations };
    });
  },

  toggleSidebar() {
    set((state) => ({
      collapsed: !state.collapsed,
    }));
  },

  setLoading: (loading) =>
    set({
      loading,
    }),

  setImage(file) {
    const currentPreview = get().preview;
    
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    if (!file) {
      set({
        selectedImage: null,
        preview: null,
      });
      return;
    }

    set({
      selectedImage: file,
      preview: URL.createObjectURL(file),
    });
  },

  removeImage() {
    const currentPreview = get().preview;
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    set({
      selectedImage: null,
      preview: null,
    });
  },

  async sendImage() {
    const image = get().preview;
    const file = get().selectedImage;
    const { currentConversationId } = get();

    if (!image || !file || !currentConversationId) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      image,
      createdAt: new Date(),
    };

    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id !== state.currentConversationId) return c;

        return {
          ...c,
          title: c.messages.length === 0 ? "Phân tích hình ảnh" : c.title,
          messages: [...c.messages, userMessage],
        };
      });
      
      saveConversation(conversations);
      
      return {
        conversations,
        loading: true,
        selectedImage: null,
        preview: null,
      };
    });

    let answer: string;

    try {
      const imageBase64 = await fileToBase64(file);
      answer =
        (await sendChatImage(imageBase64)) ??
        "Xin lỗi, hiện chưa phân tích được ảnh này. Bạn thử lại sau ít phút nhé.";
    } catch {
      answer =
        "Xin lỗi, hiện chưa phân tích được ảnh này. Bạn thử lại sau ít phút nhé.";
    }

    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: answer,
      createdAt: new Date(),
    };

    set((state) => {
      const conversations = state.conversations.map((c) =>
        c.id === state.currentConversationId
          ? { ...c, messages: [...c.messages, aiMessage] }
          : c
      );
      
      saveConversation(conversations);
      
      return {
        conversations,
        loading: false,
      };
    });
  },

  async sendMessage(text: string) {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      createdAt: new Date(),
    };

    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id !== state.currentConversationId) return c;

        return {
          ...c,
          title: c.messages.length === 0 ? generateTitle(text) : c.title,
          messages: [...c.messages, userMessage],
        };
      });
      
      saveConversation(conversations);
      
      return {
        conversations,
        loading: true,
      };
    });

    try {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "",
        createdAt: new Date(),
      };

      // Chỉ thêm message assistant vào danh sách khi ĐÃ CÓ nội dung
      // (chunk đầu tiên / kết quả typewriter đầu tiên). Trước đó chỉ
      // hiện LoadingBubble, tránh hiện 1 bubble rỗng chồng lên
      // "SHIELD đang suy nghĩ...".
      const updateAiMessage = (
        mode: "append" | "set",
        value: string
      ) => {
        set((state) => ({
          loading: false,
          conversations: state.conversations.map((c) => {
            if (c.id !== state.currentConversationId) return c;

            const exists = c.messages.some(
              (m) => m.id === aiMessage.id
            );

            if (!exists) {
              return {
                ...c,
                messages: [
                  ...c.messages,
                  { ...aiMessage, text: value },
                ],
              };
            }

            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === aiMessage.id
                  ? {
                      ...m,
                      text:
                        mode === "append"
                          ? m.text + value
                          : value,
                    }
                  : m
              ),
            };
          }),
        }));
      };

      const appendChunk = (chunk: string) => {
        updateAiMessage("append", chunk);
      };

      // Ưu tiên gọi chatbot theo dạng streaming (SSE) để chữ chạy dần thật
      const streamedAny = await sendChatMessageStream(text, appendChunk);

      if (!streamedAny) {
        // Backend stream lỗi/offline -> gọi API thường rồi giả lập gõ chữ
        const answer =
          (await sendChatMessage(text)) ??
          "Xin lỗi, hiện chưa kết nối được với máy chủ. Bạn thử lại sau ít phút nhé.";

        await streamText(answer, (value) => {
          updateAiMessage("set", value);
        });
      }

      // Lưu lại kết quả cuối cùng sau khi stream xong
      saveConversation(get().conversations);
      
    } catch {
      set({
        loading: false,
      });
    }
  },

  clearMessages() {
    const currentPreview = get().preview;
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    set((state) => {
      const conversations = state.conversations.map((c) =>
        c.id === state.currentConversationId
          ? { ...c, messages: [] }
          : c
      );
      
      saveConversation(conversations);
      
      return {
        conversations,
        loading: false,
        selectedImage: null,
        preview: null,
      };
    });
  },
}));