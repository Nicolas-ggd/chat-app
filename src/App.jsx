import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Auth } from "./components/Auth";
import { Page404 } from "./components/404Page/404";

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/signin" element={<Auth />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  )
}

export default App
