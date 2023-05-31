import { useUser } from "@auth0/nextjs-auth0/client";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type Props = {
  role: string;
  content: string;
};
export default function UserMessage({ role, content }: Props) {
  const { user } = useUser();
  return (
    <div
      className="grid grid-cols-[30px_1fr] gap-5 px-5 py-6 bg-gray-700">
      <div>  
          <Image
            src={String(user?.picture)}
            width={30}
            height={30}
            alt="User avatar"
            className="rounded-sm"
          />
      </div>
      <div className="prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
