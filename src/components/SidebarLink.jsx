import { Ripple } from "primereact/Ripple";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";

function SidebarLink({ handleHide, link }) {
  const { sidebarModel, setSidebarModel } = useContext(SidebarContext);

  const handleLinkClick = () => {
    handleHide();
    setSidebarModel(link);
  };

  return (
    <li>
      <Link
        onClick={() => handleLinkClick()}
        to={link.to}
        className={
          sidebarModel == link
            ? "p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 surface-100 transition-duration-150 transition-colors w-full no-underline"
            : "p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 hover:surface-100 transition-duration-150 transition-colors w-full no-underline"
        }
      >
        <i className={`pi ${link.icon} mr-2`}></i>
        <span className="text-lg font-medium">{link.name}</span>
        <Ripple />
      </Link>
    </li>
  );
}

export default SidebarLink;
