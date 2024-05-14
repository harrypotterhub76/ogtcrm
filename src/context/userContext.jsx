import { createContext, useState } from "react";

export const UserContext = createContext(null);

export function UserArea({ children }) {
  const [user, setUser] = useState(localStorage.getItem("loginData"));

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
