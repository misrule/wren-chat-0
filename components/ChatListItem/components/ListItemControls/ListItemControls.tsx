import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ListItemControlProps {
  deleteFn: () => void;
  edit: () => void;
  upload: () => void;
}
export const ListItemControls = ({ upload, edit, deleteFn }: ListItemControlProps) => {
  return (
    <div className="list-item-controls">
      <button className="ctrl-btn" onClick={upload}>
       <FontAwesomeIcon icon={faArrowUpFromBracket} />
      </button>
    
      <button className="ctrl-btn" onClick={edit}>
        <FontAwesomeIcon icon={faPen} />
      </button>

      <button className="ctrl-btn" onClick={deleteFn}>
        <FontAwesomeIcon icon={faTrash} />
      </button>

      <button className="ctrl-btn vis">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
    </div>
  );
};