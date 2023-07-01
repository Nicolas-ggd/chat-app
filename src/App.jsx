import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Auth } from "./components/Auth";
import { Page404 } from "./components/404Page/404";
import { Landing } from "./components/LandingPage/Landing";
import { PrivateRoutes } from "./utils/PrivateRoutes";

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
        </Route>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/signin" element={<Auth />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  )
}

export default App
