import shieldAvatar from "../../assets/avatars/shield.png";

export default function LoadingBubble() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <img
        src={shieldAvatar}
        alt="SHIELD AI"
        className="
          h-10
          w-10
          rounded-full
          border
          object-cover
          shadow-sm
        "
      />

      <div className="thinking-text">
        SHIELD đang suy nghĩ
        <span className="dots"></span>
      </div>
    </div>
  );
}