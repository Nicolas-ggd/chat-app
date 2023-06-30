import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Auth } from "./components/Auth";

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Auth />}/>
      </Routes>
    </Router>
  )
}

export default App
