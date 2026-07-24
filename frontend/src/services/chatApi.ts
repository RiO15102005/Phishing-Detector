/**
 * Kết nối tới backend AI Security Chatbot (ai_ANM - FastAPI).
 *
 * Lưu ý: đây là backend RIÊNG với backend "Phishing Detector" (VITE_API_BASE_URL,
 * dùng cho /analyze) - hai service khác nhau, chạy ở port khác nhau. Đặt
 * VITE_CHATBOT_API_URL trong .env để trỏ đúng tới chatbot (mặc định port 8001).
 */

const CHATBOT_API_BASE_URL =
  import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:8001";

const CHAT_ENDPOINT = `${CHATBOT_API_BASE_URL}/api/chat/`;
const CHAT_STREAM_ENDPOINT = `${CHATBOT_API_BASE_URL}/api/chat/stream`;
const CHAT_IMAGE_ENDPOINT = `${CHATBOT_API_BASE_URL}/api/chat/image/`;

/**
 * Gọi chatbot theo dạng thường (chờ đủ câu trả lời rồi trả về 1 lần).
 * Dùng làm fallback khi streaming lỗi.
 */
export async function sendChatMessage(message: string): Promise<string | null> {
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Chatbot API trả về lỗi ${response.status}`);
    }

    const data = await response.json();
    return data.reply as string;
  } catch (e) {
    console.warn("sendChatMessage failed:", e);
    return null;
  }
}

/**
 * Gọi chatbot theo dạng streaming (SSE) - gọi onChunk(text) mỗi khi có
 * đoạn text mới về. Trả về true nếu nhận được ít nhất 1 đoạn nội dung,
 * false nếu lỗi/không nhận được gì (để nơi gọi tự fallback sang
 * sendChatMessage).
 */
export async function sendChatMessageStream(
  message: string,
  onChunk: (chunk: string) => void
): Promise<boolean> {
  try {
    const response = await fetch(CHAT_STREAM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Chatbot Stream API trả về lỗi ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let receivedAny = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      // Giữ lại phần cuối chưa hoàn chỉnh (chưa có \n\n kết thúc event)
      buffer = events.pop() || "";

      for (const event of events) {
        const line = event.trim();
        if (!line.startsWith("data:")) continue;

        const raw = line.slice(5).trim();
        if (raw === "[DONE]") {
          return receivedAny;
        }

        try {
          const parsed = JSON.parse(raw);
          if (parsed.chunk) {
            receivedAny = true;
            onChunk(parsed.chunk);
          }
        } catch {
          // bỏ qua dòng không đúng định dạng JSON
        }
      }
    }

    return receivedAny;
  } catch (e) {
    console.warn("sendChatMessageStream failed:", e);
    return false;
  }
}

/**
 * Gửi ảnh (data URI base64) lên chatbot để phân tích dấu hiệu lừa đảo.
 */
export async function sendChatImage(
  imageBase64: string,
  message = ""
): Promise<string | null> {
  try {
    const response = await fetch(CHAT_IMAGE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: imageBase64, message }),
    });

    if (!response.ok) {
      throw new Error(`Chatbot Image API trả về lỗi ${response.status}`);
    }

    const data = await response.json();
    return data.reply as string;
  } catch (e) {
    console.warn("sendChatImage failed:", e);
    return null;
  }
}

/** Đọc 1 File ảnh thành data URI base64 để gửi lên backend. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
