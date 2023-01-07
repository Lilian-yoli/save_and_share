import { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const userContext = createContext({
  currentUser: {
    id: "",
    isLoggedIn: false,
  },
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({ id: "", isLoggedIn: false });

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (userId) => {
    setCurrentUser({ id: userId, isLoggedIn: true })
    const origin = location.state?.from?.pathname ?? '/';
    navigate(origin);
  }

  useEffect(() => {
    const token = Cookies.get('Share&SaveToken');
    if (token) {
      setCurrentUser({ isLoggedIn: true });
    } else {
      setCurrentUser({ isLoggedIn: false });
    }
  }, [])

  const value = { currentUser, setCurrentUser, handleLogin };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
