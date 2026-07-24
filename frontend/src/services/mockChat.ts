export async function mockChat(
  message?: string
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Bạn vừa gửi: ${message ?? "Ảnh"}

Đây là phản hồi giả lập từ SHIELD AI.`);
    }, 1500);
  });
}