import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatFunctions } from "@/context/ChatContext";

interface ListItemControlProps {
  chatId: string;
}
export const ListItemControls = ({ chatId }: ListItemControlProps) => {
  
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
    <div className="list-item-controls">
      <button className="ctrl-btn" onClick={handleShare}>
       <FontAwesomeIcon icon={faArrowUpFromBracket} />
      </button>
    
      <button className="ctrl-btn" onClick={handleEdit}>
        <FontAwesomeIcon icon={faPen} />
      </button>

      <button className="ctrl-btn" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>

      <button className="ctrl-btn vis">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
    </div>
  );
};