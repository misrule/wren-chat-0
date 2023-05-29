import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemControls } from "./components/ListItemControls/ListItemControls";
import Link from "next/link";
import { useChatFunctions } from "@/context/ChatContext";

interface ChatListItemProps {
  chatId: string;
  title: string;
  active?: boolean;
}

export const ChatListItem = ({ active, chatId, title }: ChatListItemProps) => {
  const { editChatName, deleteChat, shareChat } = useChatFunctions();

  const handleDelete = () => {
    deleteChat(chatId)
  }
  const handleShare = () => {
    shareChat("With my friend")
  }
  const handleEdit = () => {
    editChatName("Now how about that?")
  }
    
  return (
    <div className="relative">
      <Link
        key={chatId}
        href={`/chat/${chatId}`}
        className={`m-2 flex items-center gap-4 rounded-md p-2 hover:bg-gray-800
        ${active ? "bg-gray-700" : ""}`}
      >
        <div className="chat-list-icon">
          <FontAwesomeIcon icon={faMessage} className="text-white/50" />
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </div>
        <div className="chat-list-controls ">
          <ListItemControls chatId={chatId} 
            deleteChat={handleDelete}
            editChatName={handleEdit}
            shareChat={handleShare}/>
        </div>
      </Link>
    </div>
  );
};
