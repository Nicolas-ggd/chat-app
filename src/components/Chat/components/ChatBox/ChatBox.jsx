import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { socket } from "../../../../api/socket";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GitHubIcon from "@mui/icons-material/GitHub";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const ChatBox = () => {
  const [isMessage, setIsMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState([]);
  const [reciptionUser, setReciptionUser] = useState(null);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const containerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const inputTypedValue = (event) => {
    setIsMessage(event.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (id) {
      const roomName = [id, userId].sort().join("-");
      await axios
        .post("http://localhost:8000/chat/create-conversation", {
          data: {
            participants: [id, userId],
            message: {
              sender: userId,
              recipient: id,
              content: isMessage,
              readBy: userId,
            },
          },
        })
        .then((res) => {
          const data = res.data;
          socket.emit("private-message", { room: roomName, data });
          scrollToBottom();
        });
    }

    setIsMessage("");
  };

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationMessage = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
          setIsMessage(locationMessage);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (id) {
      const getConversation = async () => {
        await axios
          .get(`http://localhost:8000/chat/get-conversation`, {
            params: {
              userId: userId,
              receiver: id
            }
          })
          .then((res) => {
            const data = res.data;
            console.log(data)
            setSelectedConversation(data);
          })
          .catch((res) => {
            const error = res?.response?.data?.message;
            console.log(error);
          });
      };

      const getReciptionUser = async () => {
        await axios
          .get(`http://localhost:8000/user/get-user?query=${id}`)
          .then((res) => {
            const data = res?.data;
            setReciptionUser([data]);
          });
      };

      getConversation();
      getReciptionUser();
    }
  }, [id]);

  useEffect(() => {
    socket.on("private-message-received", (data) => {
      console.log(data, "dd");
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
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 dark:bg-gray-800 transition duration-300">
            <div className="flex py-3 border-b-slate-500">
              {reciptionUser &&
                reciptionUser?.map((item, index) => {
                  return (
                    <div className="flex items-center px-2" key={index}>
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        <GitHubIcon />
                      </div>
                      <h3 className="text-sans text-base text-dark dark:text-white px-2">
                        {item?.name}
                      </h3>
                    </div>
                  );
                })}
            </div>
            <div
              className="flex flex-col h-full overflow-x-auto mb-4"
              ref={containerRef}
            >
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {selectedConversation &&
                    selectedConversation.map((item, index) => {
                      const message = item?.message[0];
                      const senderId = item?.message[0]?.sender?._id
                        ? item?.message[0]?.sender?._id
                        : item?.message[0]?.sender;
                      const isCurrentUser = userId === senderId;
                      const formattedTime = new Date(
                        message?.timestamps
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <div
                          key={index}
                          className={`${
                            isCurrentUser
                              ? "col-start-6 col-end-13 p-3 py-1 rounded-lg"
                              : "col-start-1 col-end-8 p-3 py-1 rounded-lg "
                          }`}
                        >
                          <div
                            className={`${
                              isCurrentUser
                                ? "flex items-center flex-row-reverse"
                                : "flex flex-row items-center"
                            }`}
                          >
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              <GitHubIcon />
                            </div>
                            <div
                              className={`relative ${
                                isCurrentUser ? "mr-3" : "ml-3"
                              } text-sm dark:bg-gray-700 bg-white flex py-2 px-4 shadow rounded-xl`}
                            >
                              <div className={`dark:text-white`}>
                                {message?.content}
                              </div>
                              <p className="px-1 mt-1 text-dark dark:text-white text-xs">
                                {formattedTime}

                                {!message[0]?.seen && (
                                  <CheckIcon
                                    style={{
                                      fontSize: "15px",
                                      marginLeft: "5px",
                                    }}
                                  />
                                )}

                                {message[0]?.seen && (
                                  <DoneAllIcon
                                    style={{
                                      fontSize: "15px",
                                      marginLeft: "5px",
                                    }}
                                  />
                                )}
                              </p>
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
                <button
                  onClick={sendLocation}
                  className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <LocationOnIcon />
                </button>
              </div>
              <div className="flex-grow ml-4">
                <form onSubmit={sendMessage}>
                  <div className="relative w-full">
                    <input
                      placeholder="Message..."
                      type="text"
                      className="flex w-full dark:text-white dark:bg-gray-700 dark:border-gray-500 border rounded-3xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      onChange={inputTypedValue}
                      value={isMessage}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {!selectedConversation && !id && (
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 dark:bg-gray-800 transition duration-300">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="flex grid-cols-12 gap-y-2 justify-center items-center h-full">
                  <h1 className="flex font-semibold text-dark dark:text-white">
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
