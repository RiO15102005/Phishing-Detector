interface Props {
  title: string;
}

export default function FeatureCard({
  title,
}: Props) {
  return (
    <div
      className="
      cursor-pointer
      rounded-2xl
      border
      bg-white
      p-6
      transition
      hover:scale-105
      hover:border-green-600
      hover:shadow-lg
    "
    >
      <div className="text-green-600 text-3xl">
        🛡
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>
    </div>
  );
}