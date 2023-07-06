import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { socket } from "../../../../api/socket";

export const ChatBox = () => {
  const [isMessage, setIsMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  const inputTypedValue = (e) => {
    setIsMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (id) {
      await axios
        .post("http://localhost:8000/chat/create-conversation", {
          data: {
            participants: [id, userId],
            message: {
              sender: userId,
              recipient: id,
              content: isMessage,
            },
          },
        })
        .then((res) => {
          const data = res.data;
          socket.emit("private-message", data);
        });
    }
  };

  useEffect(() => {
    if (id) {
      const getConversation = async () => {
        await axios
          .get(`http://localhost:8000/chat/get-conversation?query=${id}`)
          .then((res) => {
            const data = res.data;
            setSelectedConversation(data);
          });
      };

      getConversation();
    }
  }, [id]);

  useEffect(() => {
    socket.on("private-message-received", (data) => {
      setSelectedConversation((prevData) => [...prevData, data]);
    });
  
    return () => {
      socket.off("private-message-received");
    };
  }, []);

  return (
    <>
      {id && (
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 dark:bg-gray-800 transition duration-3s">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {selectedConversation &&
                    selectedConversation?.map((item, index) => {
                      const message = item?.message[0];
                      const senderId = message?.sender?._id;
                      const isCurrentUser = userId === senderId;

                      return (
                        <div
                          key={index}
                          className={`${isCurrentUser ? 'col-start-1 col-end-8 p-3 py-1 rounded-lg' : 'col-start-6 col-end-13 p-3 py-1 rounded-lg' }`}
                        >
                          <div className={`${isCurrentUser ? 'flex flex-row items-center' : 'flex items-center flex-row-reverse'}`}>
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              A
                            </div>
                            <div className={`relative ${isCurrentUser ? 'ml-3' : 'mr-3'} text-sm dark:bg-gray-700 bg-white py-2 px-4 shadow rounded-xl`}>
                              <div className={`dark:text-white`}>
                                {message?.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="flex dark:bg-gray-700 flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <form onSubmit={(e) => sendMessage(e)}>
                  <div className="relative w-full">
                    <input
                      placeholder="Type message..."
                      type="text"
                      className="flex w-full dark:text-white dark:bg-gray-700 dark:border-gray-500 border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      onChange={(e) => inputTypedValue(e)}
                    />
                    <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
              <div className="ml-4">
                <button
                  onClick={(e) => sendMessage(e)}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!selectedConversation && !id && (
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 dark:bg-gray-800 transition duration-3s">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="flex grid-cols-12 gap-y-2 justify-center items-center h-full">
                  <h1 className="flex font-semibold text-white">
                    Select chat to start conversation...
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
