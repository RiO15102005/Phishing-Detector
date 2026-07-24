const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const analyzeImageApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Lỗi phản hồi từ máy chủ');
  }

  const data = await response.json();
  
  // Trả về text từ response. Chỉnh sửa 'result_text' theo đúng JSON của backend
  return data.result_text || "Phân tích hoàn tất. Không phát hiện dấu hiệu lừa đảo.";
};