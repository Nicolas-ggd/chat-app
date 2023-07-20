import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../../../../api/socket";

import GitHubIcon from "@mui/icons-material/GitHub";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { RoomModal } from "./RoomModal/RoomModal";

export const ChatSideBar = () => {
  const [isSearch, setIsSearch] = useState("");
  const [isResult, setIsResult] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState([]);
  const [allActiveUser, setAllActiveUser] = useState(null);
  const [isRoom, setIsRoom] = useState(false);
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  const searchUser = async (e) => {
    e.preventDefault();

    const searchQuery = isSearch.trim();

    if (searchQuery.length === 0) {
      setIsResult([]);
      return;
    }

    try {
      await axios
        .get(
          `http://localhost:8000/user/search-user?query=${searchQuery}&userId=${userId}`
        )
        .then((res) => {
          const data = res.data;
          setIsResult(data.length > 0 ? data : []);
        });
    } catch (error) {
      const data = error?.response?.data?.message;
      console.log(data);
    }
  };

  const readMessage = () => {
    const roomName = [id, userId].sort().join("-");
    socket.emit("join-room", roomName);
  };

  useEffect(() => {
    const getActiveUsers = async () => {
      await axios
        .get(`http://localhost:8000/user/get-all-user?_id=${userId}`)
        .then((res) => {
          const data = res.data;
          setAllActiveUser(data);
        });
    };

    getActiveUsers();
  }, [userId]);

  useEffect(() => {
    const getActiveConversation = async () => {
      await axios
        .get(`http://localhost:8000/user/user-conversation?_id=${id}`)
        .then((res) => {
          const data = res.data;
          setSelectedConversation([data]);
        })
        .catch((res) => {
          const data = res?.response?.data?.message;
          console.log(data);
        });
    };

    getActiveConversation();
  }, [id, selectedConversation]);

  const toggleRoomModal = () => {
    setIsRoom(prevData => !prevData);
  };

  return (
    <div className="flex ml-2 px-5 dark:bg-gray-800 transition duration-300 rounded-2xl h-full flex-col py-5 w-64 bg-white flex-shrink-0">
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
          <ElectricBoltIcon />
        </div>
        <div className="ml-2 font-bold dark:text-white text-2xl">QuickChat</div>
      </div>

      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <form onKeyUp={searchUser}>
        <div className="relative w-full py-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
            placeholder="Search conversation..."
            required
            onChange={(e) => setIsSearch(e.target.value)}
          />
        </div>
      </form>
      {isSearch.length > 0 && (
        <div>
          {isResult &&
            isResult.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex animate transition duration-300 flex-col space-y-1 mt-4 -mx-2 overflow-y-auto"
                >
                  <Link
                    to={`/chat/${item._id}`}
                    onClick={() => readMessage(item?._id)}
                    className="flex flex-row transition duration-1s items-center hover:bg-gray-100 rounded-xl p-2"
                  >
                    <div className="relative">
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        <GitHubIcon />
                      </div>
                    </div>
                    <div className="flex items-center ml-2 text-sm dark:text-white text-dark dark:hover:text-dark focus:text-dark font-semibold">
                      {item?.name}
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      )}

      <div className="flex flex-col mt-2">
        <div className="flex flex-row items-center justify-between text-xs mt-3">
          <h3 className="font-bold text-base dark:text-white">Active Users</h3>
        </div>
        <div>
          {allActiveUser &&
            allActiveUser?.map((item, index) => {
              return (
                <Link
                  onClick={readMessage}
                  to={`/chat/${item._id}`}
                  key={index}
                >
                  <div className="flex flex-col space-y-1 mt-4 -mx-2">
                    <button className="flex flex-row items-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl py-2 px-2">
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        <GitHubIcon />
                      </div>
                      <div className="ml-2 text-sm font-sans dark:text-white">
                        {item?.name}
                      </div>
                    </button>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <div className="flex flex-row items-center justify-between text-xs mt-3">
          <h3 className="font-bold text-base dark:text-white">Conversation</h3>
        </div>
        <div>
          {selectedConversation &&
            selectedConversation?.map((item, index) => {
              return (
                <Link
                  onClick={readMessage}
                  to={`/chat/${item._id}`}
                  key={index}
                >
                  <div className="flex flex-col space-y-1 mt-4 -mx-2">
                    <button className="flex flex-row items-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl py-2 px-2">
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        <GitHubIcon />
                      </div>
                      <div className="ml-2 text-sm font-sans dark:text-white">
                        {item?.name}
                      </div>
                    </button>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <div className="flex flex-row items-center justify-between text-xs mt-3">
          <h3 className="font-bold text-base dark:text-white">Join Room</h3>
        </div>
        <div>
          <Link onClick={readMessage}>
            <div className="flex flex-col space-y-1 mt-4 -mx-2">
              <button onClick={toggleRoomModal} className="flex flex-row items-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl py-2 px-2">
                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                  <GroupAddIcon />
                </div>
                <div className="ml-2 text-sm font-sans dark:text-white">
                  Join Room
                </div>
              </button>
            </div>
          </Link>
        </div>
      </div>

      {isRoom && <RoomModal toggleRoomModal={toggleRoomModal} />}
    </div>
  );
};
