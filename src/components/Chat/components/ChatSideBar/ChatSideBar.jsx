import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export const ChatSideBar = () => {
  const [isSearch, setIsSearch] = useState("");
  const [isResult, setIsResult] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState([]);
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
  }, [id]);

  return (
    <div className="flex px-5 dark:bg-gray-800 transition duration-3s rounded-2xl h-full flex-col py-5 w-64 bg-white flex-shrink-0">
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
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
              console.log(item);
              return (
                <div
                  key={index}
                  className="flex animate transition duration-3s flex-col space-y-1 mt-4 -mx-2 overflow-y-auto"
                >
                  <Link
                    to={`/chat/${item._id}`}
                    className="flex flex-row transition duration-1s items-center hover:bg-gray-100 rounded-xl p-2"
                  >
                    <div className="relative">
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        {item?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      {item?.online && (
                        <div className="absolute top-0 right-0">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
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
          <span className="font-bold dark:text-white">Conversations</span>
        </div>
        <div>
          {id &&
            selectedConversation?.map((item, index) => {
              console.log(item, "conversation");
              return (
                <Link to={`/chat/${item._id}`} key={index}>
                  <div className="flex flex-col space-y-1 mt-4 -mx-2">
                    <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        {item?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-2 text-sm font-semibold dark:text-white">
                        {item?.name}
                      </div>
                    </button>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};
