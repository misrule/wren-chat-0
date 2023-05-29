import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemControls } from "./components/ListItemControls/ListItemControls";
import Link from "next/link";

interface ChatListItemProps {
  chatId: string;
  title: string;
}

export const ChatListItem = ({ chatId, title }: ChatListItemProps) => {
  const upload = () => alert("Uploading...");
  const edit = () => alert("Editing...");
  const deleteFn = () => alert(`DELETE: ${title}`);
  
  return (
    <div className="relative">
      <Link
        key={chatId}
        href={`/chat/${chatId}`}
        className="m-2 p-2 flex items-center gap-4 rounded-md hover:bg-gray-800
        "
      >
        <div className="chat-list-icon">
          <FontAwesomeIcon icon={faMessage} className="text-white/50"/>
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </div>
        <div className="chat-list-controls ">
          <ListItemControls 
            edit={edit}
            upload={upload}
            deleteFn={deleteFn}
          />
        </div>
      </Link>
      </div>
  )
}