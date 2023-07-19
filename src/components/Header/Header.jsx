import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Switcher } from "../../utils/Switcher";
import axios from "axios";

export const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const userLogOut = async () => {
    await axios
      .post("http://localhost:8000/logout", {
        userId: userId,
      })
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userId");
        navigate("/");
      });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="bg-white border-gray-200 px-4 transition duration-300 py-2.5 lg:px-6 dark:bg-gray-900">
      <div className="flex lg:justify-between items-center mx-auto max-w-screen-xl">
        <div className="flex justify-start items-center lg:order-2 py-5">
          <button
            onClick={handleMobileMenuToggle}
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${isMobileMenuOpen ? "w-6 h-6" : "hidden"} z-50 absolute right-5 animate duration-300`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 001.414 1.414L10 11.414z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              className={!isMobileMenuOpen ? "w-6 h-6" : "hidden"}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isMobileMenuOpen ? "fixed inset-0 z-999" : "hidden"
          } justify-between bg-white transition duration-300 dark:bg-gray-900 transition duration-300 items-center w-full lg:flex lg:w-auto lg:order-1`}
          id="mobile-menu-2"
        >
          <ul className="lg:flex p-5 flex-col mt-12 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <a
                onClick={scrollToBottom}
                className="cursor-pointer text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 mx-4"
              >
                Features
              </a>
            </li>
          </ul>
        </div>
        {!isMobileMenuOpen && <div className="flex w-full justify-end items-center lg:order-3">
          <a onClick={userLogOut} className="cursor-pointer text-gray-700 border-gray-100 lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 mx-4">LogOut</a>
          <Switcher />
        </div>}
      </div>
    </div>
  );
};
