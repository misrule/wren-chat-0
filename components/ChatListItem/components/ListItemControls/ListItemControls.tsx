import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatFunctions } from "@/context/ChatContext";

interface ListItemControlProps {
  chatId: string;
  deleteChat: () => void;
  editChatName: () => void;
  shareChat: () => void;
}
export const ListItemControls = ({ chatId, deleteChat, editChatName, shareChat }: ListItemControlProps) => {
  
  return (
    <div className="list-item-controls">
      <button className="ctrl-btn" onClick={shareChat}>
       <FontAwesomeIcon icon={faArrowUpFromBracket} />
      </button>
    
      <button className="ctrl-btn" onClick={editChatName}>
        <FontAwesomeIcon icon={faPen} />
      </button>

      <button className="ctrl-btn" onClick={deleteChat}>
        <FontAwesomeIcon icon={faTrash} />
      </button>

      <button className="ctrl-btn vis">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
    </div>
  );
};