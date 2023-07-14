import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { socket } from "../../api/socket";

import { ChatSideBar } from "./components/ChatSideBar/ChatSideBar";
import { ChatBox } from "./components/ChatBox/ChatBox";

export const Chat = () => {
  const [connectedUsers, setConnectedUsers] = useState(null);
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  useEffect(() => {
    const userData = async () => {
      await axios
        .get(`http://localhost:8000/user/get-user?query=${userId}`)
        .then((res) => {
          const data = res.data;
          socket.emit("userConnected", data);
        });
    };

    userData();

    socket.on("connectedUsers", (data) => {
      console.log(data, "connectedUsers");
      const user = data?.filter((uId) => uId?._id === id)
      setConnectedUsers(user);
    });

    return () => {
      socket.off("connectedUsers");
    };
    
  }, []);

  useEffect(() => {
    socket.on("userDisconnected", (data) => {
      console.log('user disconnected', data);
      const user = data?.filter((uId) => uId?._id === id)
      setConnectedUsers(user);
    });

    return () => {
      socket.off("userDisconnected");
    };
  }, []);

  return (
    <div
      className="flex h-full antialiased text-gray-800 dark:bg-gray-900 transition duration-3s"
      style={{ height: "91.5vh" }}
    >
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatSideBar />
        <ChatBox connectedUsers={connectedUsers} />
      </div>
    </div>
  );
};
