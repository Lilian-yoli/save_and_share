import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar/Navbar.component";
import HomePage from "./pages/Home/Home.component";
import SearchPage from "./pages/Search/Search.component";
import SharePage from "./pages/Share/Share.component";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/share" element={<SharePage />} />
      </Routes>
    </>
  );
}

export default App;
