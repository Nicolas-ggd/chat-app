import { useState } from "react";

import { SignIn } from "../Authorization/SignIn";
import { SignUp } from "../Register/SignUp";

export const Auth = ({ themeClass, isDarkMode }) => {
  const [isAuth, setIsAuth] = useState(true);

  const toggleAuth = () => {
    setIsAuth(prevIsAuth => !prevIsAuth);
  };

  return (
    <>
      {isAuth ? (
        <SignIn closeSignIn={toggleAuth} themeClass={themeClass} isDarkMode={isDarkMode} />
      ) : (
        <SignUp closeSignUp={toggleAuth} themeClass={themeClass} isDarkMode={isDarkMode}/>
      )}
    </>
  );
};
