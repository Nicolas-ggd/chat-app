import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Switcher } from "../../utils/Switcher";

export const Header = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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

  return (
    <header className="bg-white dark:bg-gray-900 transition duration-3s">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <div className="relative">
            <a
              href="#"
              className="flex dark:text-white items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              aria-expanded="false"
            >
              Product
            </a>
          </div>

          <Link
            to="/"
            className="text-sm dark:text-white font-semibold leading-6 text-gray-900"
          >
            Features
          </Link>
          <a
            href="#"
            className="text-sm dark:text-white font-semibold leading-6 text-gray-900"
          >
            Marketplace
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!userId && (
            <Link
              to="/signin"
              className="text-sm dark:text-white font-semibold leading-6 text-gray-900"
            >
              Sign In <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
          {userId && (
            <div
              onClick={userLogOut}
              className="text-sm dark:text-white font-semibold leading-6 text-gray-900 cursor-pointer"
            >
              Log Out
            </div>
          )}
        </div>
        <div className="px-5">
          <Switcher />
        </div>
      </nav>
    </header>
  );
};
