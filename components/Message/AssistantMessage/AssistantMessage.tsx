import { useUser } from "@auth0/nextjs-auth0/client";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";

type Props = {
  role: string;
  content: string;
}
export default function AssistantMessage({ role, content }: Props) {
  const { user } = useUser();
  return (
    <div
      className=" bg-gray-700 rounded-2x">
        
        <div className="grid grid-cols-[30px_1fr] gap-5 py-5 px-2 mx-3 
          bg-gray-800 rounded-2xl">
      <div>
          <div className="flex h-6 aspect-square items-center justify-center
              rounded-sm bg-gray-800 p-1">
            <FontAwesomeIcon icon={faRobot} 
            className="text-emerald-200 text-xl" />
          </div>
      </div>
      <div className="prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      </div>  

    </div>
  );
}