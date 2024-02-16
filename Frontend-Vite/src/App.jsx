import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route Component={HomePage} path="/" />
          <Route Component={TextEditor} path="/editor/:noteID" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
