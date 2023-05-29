import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemControls } from "./components/ListItemControls/ListItemControls";
import Link from "next/link";

interface ChatListItemProps {
  chatId: string;
  title: string;
  active?: boolean;
}

export const ChatListItem = ({ active, chatId, title }: ChatListItemProps) => {

  
  return (
    <div className="relative">
      <Link
        key={chatId}
        href={`/chat/${chatId}`}
        className={`m-2 p-2 flex items-center gap-4 rounded-md hover:bg-gray-800
        ${active ? 'bg-gray-700' : ''}`}
      >
        <div className="chat-list-icon">
          <FontAwesomeIcon icon={faMessage} className="text-white/50"/>
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </div>
        <div className="chat-list-controls ">
          <ListItemControls 
            chatId={chatId}
          />
        </div>
      </Link>
      </div>
  )
}