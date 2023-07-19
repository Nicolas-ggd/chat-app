import { useEffect } from "react";
import axios from "axios";
import { socket } from "../../api/socket";


import { ChatSideBar } from "./components/ChatSideBar/ChatSideBar";
import { ChatBox } from "./components/ChatBox/ChatBox";

export const Chat = () => {
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const user = async () => {
      await axios.get(`http://localhost:8000/user/get-user?query=${userId}`)
      .then((res) => {
        const data = res.data;
        socket.emit('userConnected', data);
      })
    }

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
