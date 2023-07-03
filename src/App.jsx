import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Auth } from "./components/Auth/Auth";
import { Page404 } from "./components/404Page/404";
import { Landing } from "./components/LandingPage/Landing";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import { Chat } from "./components/Chat/Chat";
import { Header } from "./components/Header/Header";
import { ForgotPassword } from "./components/ForgotPassword/ForgotPassword";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route exact path="/chat" element={<Chat />} />
        </Route>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/signin" element={<Auth />} />
        <Route exact path="/reset-password" element={<ForgotPassword />}></Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
