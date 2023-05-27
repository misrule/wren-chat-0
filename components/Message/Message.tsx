import { useUser } from "@auth0/nextjs-auth0/client";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

type Props = {
  role: string;
  content: string;
};
export default function Message({ role, content }: Props) {
  const { user } = useUser();
  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 
    ${
      role === "assistant"
        ? "bg-gray-600"
        : role === "notice"
          ? "bg-red-600"
          : ""
    }`}
    >
      <div>
        {user && role === "user" && (
          <Image
            src={String(user?.picture)}
            width={30}
            height={30}
            alt="User avatar"
            className="rounded-sm"
          />
        )}
        {role === "assistant" && (
          <div
            className="flex h-[30px] w-[30px] items-center justify-center
          rounded-sm bg-gray-800 p-1"
          >
            <FontAwesomeIcon icon={faRobot} className="text-emerald-200" />
          </div>
        )}
      </div>
      <div className="prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
