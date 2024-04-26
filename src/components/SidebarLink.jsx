import { Ripple } from "primereact/Ripple";
import React from "react";
import { Link } from "react-router-dom";

function SidebarLink({ handleHide, link }) {
  return (
    <li>
      <Link
        onClick={() => handleHide()}
        to={link.to}
        className="p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 hover:surface-100 transition-duration-150 transition-colors w-full no-underline"
      >
        <i className={`pi ${link.icon} mr-2`}></i>
        <span className="text-lg font-medium">{link.name}</span>
        <Ripple />
      </Link>
    </li>
  );
}

export default SidebarLink;
