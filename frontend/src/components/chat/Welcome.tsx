import { ShieldCheck, Globe, Image, AlertTriangle, Scale } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Phát hiện website giả mạo",
  },
  {
    icon: Image,
    title: "Phân tích hình ảnh",
  },
  {
    icon: AlertTriangle,
    title: "Cảnh báo hành vi lừa đảo",
  },
  {
    icon: Scale,
    title: "Tư vấn Luật An ninh mạng",
  },
];

export default function Welcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8">

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
        <ShieldCheck size={52} />
      </div>

      <h1 className="mt-8 text-5xl font-bold text-gray-900">
        SHIELD AI
      </h1>

      <p className="mt-3 text-lg text-gray-500">
        Trợ lý AI hỗ trợ phát hiện lừa đảo trực tuyến
      </p>

      <p className="mt-1 text-gray-400">
        Tải ảnh, gửi URL hoặc đặt câu hỏi để bắt đầu.
      </p>

      <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-5">

        {features.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-green-500
                hover:shadow-lg
              "
            >
              <div className="rounded-xl bg-green-100 p-3">
                <Icon
                  size={28}
                  className="text-green-600"
                />
              </div>

              <span className="text-lg font-semibold text-gray-800">
                {item.title}
              </span>
            </div>
          );
        })}

      </div>

      <div className="mt-12 rounded-xl bg-green-50 px-6 py-4 text-center">

        <p className="font-semibold text-green-700">
          SHIELD AI có thể phân tích:
        </p>

        <p className="mt-2 text-gray-600">
          🌐 Website • 🖼 Hình ảnh • 📧 Email • 📱 Số điện thoại • 📄 Văn bản
        </p>

      </div>

    </div>
  );
}