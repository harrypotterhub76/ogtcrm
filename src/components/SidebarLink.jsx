import { Ripple } from "primereact/Ripple";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";
import { UserContext } from "../context/userContext";

function SidebarLink({ handleHide, link }) {
  const { sidebarModel, setSidebarModel } = useContext(SidebarContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    if (link.to === "/login") {
      setUser(null);
      localStorage.removeItem("loginData");
    }

    console.log(link);
    handleHide();
    setSidebarModel(link);
    navigate(`${link.to}`);
  };

  if (user.user.role === "Buyer" && link.adminOnly) {
    return "";
  }
  
  return (
    <li>
      <div
        onClick={() => handleLinkClick(link)}
        className={
          sidebarModel == link
            ? "p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 surface-100 transition-duration-150 transition-colors w-full no-underline"
            : "p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 hover:surface-100 transition-duration-150 transition-colors w-full no-underline"
        }
      >
        <i className={`pi ${link.icon} mr-2`}></i>
        <span className="text-lg font-medium">{link.name}</span>
        <Ripple />
      </div>
    </li>
  );
}

export default SidebarLink;
