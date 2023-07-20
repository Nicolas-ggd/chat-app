import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../../api/socket";

import { ChatSideBar } from "./components/ChatSideBar/ChatSideBar";
import { ChatBox } from "./components/ChatBox/ChatBox";

export const Chat = () => {
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  useEffect(() => {
    const user = async () => {
      await axios
        .get(`http://localhost:8000/user/get-user?query=${userId}`)
        .then((res) => {
          const data = res.data;
          socket.emit("userConnected", data);
          const roomName = [id, userId].sort().join("-");
          socket.emit("join-room", roomName);
        });
    };

    user();
  }, [userId]);

  return (
    <div
      className="flex h-full antialiased text-gray-800 dark:bg-gray-900 transition duration-300"
      style={{ height: "91.5vh" }}
    >
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatSideBar />
        <ChatBox />
      </div>
    </div>
  );
};
