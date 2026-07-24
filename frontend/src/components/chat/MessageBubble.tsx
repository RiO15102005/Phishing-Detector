import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import shieldAvatar from "../../assets/avatars/shield.png";
import userAvatar from "../../assets/avatars/user.png";

import type { ChatMessage } from "../../types/message";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  if (message.role === "user") {
    return (
      <div className="mb-8 flex justify-end">
        <div className="flex max-w-4xl items-end gap-3">
          <div className="flex flex-col items-end gap-2">
            {message.image && (
              <img
                src={message.image}
                alt="Upload"
                className="max-w-sm rounded-2xl border shadow"
              />
            )}

            {message.text && (
              <div
                className="
                  rounded-3xl
                  rounded-br-lg
                  bg-green-600
                  px-5
                  py-3
                  text-white
                  shadow-sm
                "
              >
                {message.text}
              </div>
            )}
          </div>

          <img
            src={userAvatar}
            alt="User"
            className="
              h-10
              w-10
              shrink-0
              rounded-full
              border
              object-cover
              shadow-sm
            "
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex justify-start">
      <div className="flex max-w-4xl gap-3">
        <img
          src={shieldAvatar}
          alt="SHIELD AI"
          className="
            h-10
            w-10
            shrink-0
            rounded-full
            border
            object-cover
            shadow-sm
          "
        />

        <div
          className="
            flex-1
            rounded-3xl
            rounded-tl-lg
            border
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              SHIELD AI
            </span>

            <span
              className="
                rounded-full
                bg-green-100
                px-2
                py-0.5
                text-xs
                font-medium
                text-green-700
              "
            >
              AI
            </span>
          </div>

          {message.text && (
            <div className="markdown leading-8 text-gray-800">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({
                    inline,
                    className,
                    children,
                    ...props
                  }: any) {
                    const match = /language-(\w+)/.exec(
                      className || ""
                    );

                    if (!inline && match) {
                      return (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(
                            /\n$/,
                            ""
                          )}
                        </SyntaxHighlighter>
                      );
                    }

                    return (
                      <code
                        className="
                          rounded
                          bg-gray-100
                          px-1
                          py-0.5
                        "
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}