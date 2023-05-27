import {
  faMessage,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect } from "react";

interface ChatListMessage {
  _id: string;
  title: string;
}
interface Props {
  chatId: string;
}
export default function ChatSidebar({ chatId }: Props) {
  const [chatList, setChatList] = React.useState<ChatListMessage[]>([]);

  useEffect(() => {
    const loadChatList = async () => {
      const res = await fetch("/api/chat/getChatList", {
        method: "GET",
      });
      const data = await res.json();
      console.log("CHAT LIST: ", data);
      setChatList(data || []);
    };
    loadChatList();
  }, [chatId]);

  return (
    <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
      <Link
        href="/chat"
        className="side-menu-item bg-emerald-500 hover:bg-emerald-600"
      >
        <FontAwesomeIcon icon={faPlus} />
        New Chat
      </Link>
      <div className="flex-1 overflow-auto bg-gray-950">
        {chatList.map((chat) => (
          <Link
            key={chat._id}
            href={`/chat/${chat._id}`}
            className={`side-menu-item ${
              chatId === chat._id ? "bg-gray-700 hover:bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon icon={faMessage} className="text-white/50"/>
            <span
              title={chat.title}
              className="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {chat.title}
            </span>
          </Link>
        ))}
      </div>
      {/* <div className="flex items-center p-2 hover:bg-gray-800 cursor-pointer">
              <div className="flex flex-col">
                <div className="text-sm font-bold">{chat.name}</div>
                <div className="text-xs">{chat.lastMessage}</div>
              </div>
            </div> */}

      <Link href="/api/auth/logout" className="side-menu-item">
        <FontAwesomeIcon icon={faRightFromBracket} />
        Logout
      </Link>
    </div>
  );
}
