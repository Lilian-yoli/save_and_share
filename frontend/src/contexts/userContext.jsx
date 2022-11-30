import { createContext, useState } from "react";

export const userContext = createContext({
  currentUser: {
    id: "",
    isLoggedIn: false,
  },
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({ id: "", isLoggedIn: false });
  const value = { currentUser, setCurrentUser };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
