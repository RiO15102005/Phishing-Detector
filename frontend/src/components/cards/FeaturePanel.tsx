import FeatureCard from "./FeatureCard";

export default function FeaturePanel() {
  const features = [
    "Kiểm tra URL",
    "Kiểm tra Email",
    "Kiểm tra SĐT",
    "Phân tích ảnh",
    "Tư vấn pháp luật",
    "Hỏi đáp AI",
  ];

  return (
    <div className="grid grid-cols-3 gap-5">
      {features.map((item) => (
        <FeatureCard
          key={item}
          title={item}
        />
      ))}
    </div>
  );
}