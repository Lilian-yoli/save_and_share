import "./App.scss";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.component";
import HomePage from "./pages/Home/Home.component";
import SearchPage from "./pages/Search/Search.component";
import SharePage from "./pages/Share/Share.component";
import SignUpPage from "./pages/SignUp/SignUp.component";
import SignInPage from "./pages/SignIn/SignIn.component";
import TransactionPage from "./pages/Transaction/Transaction.component";
import MySharePage from './pages/MyShare/MyShare.component';
import MyPurchasePage from "./pages/MyPurchase/MyPurchase.component";
import SearchDetail from "./pages/SearchDetail/SearchDetail.component";
import { useContext } from "react";
import { userContext } from "./contexts/userContext";
import { useSearchStore } from "./stores/searchStore";
import io from "socket.io-client"
const socket = io.connect("http://localhost:8877")

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(userContext);
  const location = useLocation();

  if (!currentUser.isLoggedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }
  return children;
}

function App() {
  const location = useLocation();
  const clearSearch = useSearchStore((state) => state.clearSearchStore);

  if (location.pathname !== '/search') {
    clearSearch();
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/details-:id" element={
          <ProtectedRoute>
            <SearchDetail />
          </ProtectedRoute>
        } />
        <Route path="/share" element={
          <ProtectedRoute>
            <SharePage />
          </ProtectedRoute>
        } />
        <Route path="/my-share" element={
          <ProtectedRoute>
            <MySharePage />
          </ProtectedRoute>
        } />
        <Route path="/my-purchase" element={
          <ProtectedRoute>
            <MyPurchasePage />
          </ProtectedRoute>
        } />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Routes>
    </>
  );
}

export default App;
