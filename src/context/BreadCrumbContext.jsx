import { createContext, useState } from "react";

export const BreadCrumbContext = createContext(null);

export function BreadCrumbArea({ children }) {
  const [breadCrumbModel, setBreadCrumbModel] = useState([
    { label: "Дашборд" },
  ]);
  return (
    <BreadCrumbContext.Provider value={{ breadCrumbModel, setBreadCrumbModel }}>
      {children}
    </BreadCrumbContext.Provider>
  );
}
