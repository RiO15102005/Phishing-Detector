export function generateTitle(text?: string) {
  if (!text) return "Phân tích hình ảnh";

  const value = text.trim();

  if (value.startsWith("http")) {
    try {
      const host = new URL(value).hostname;

      return host
        .replace("www.", "")
        .split(".")[0]
        .replace(/^\w/, (c) => c.toUpperCase());
    } catch {
      return value.slice(0, 30);
    }
  }

  return value.length > 30
    ? value.slice(0, 30) + "..."
    : value;
}