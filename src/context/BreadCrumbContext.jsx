import { createContext, useState } from "react";

export const BreadCrumbContext = createContext(null);

export function BreadCrumbArea({ children }) {
  const [items, setItems] = useState([{ label: "Дашборд" }]);
  return (
    <BreadCrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadCrumbContext.Provider>
  );
}
