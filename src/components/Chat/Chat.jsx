import { ChatSideBar } from "./components/ChatSideBar/ChatSideBar";
import { ChatBox } from "./components/ChatBox/ChatBox";

export const Chat = () => {
  return (
    <div className="flex h-screen antialiased text-gray-800 dark:bg-gray-900 transition duration-3s">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatSideBar />
        <ChatBox />
      </div>
    </div>
  );
};
