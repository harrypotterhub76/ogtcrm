import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/StyleClass";

import { sidebarLinks } from "../utilities/renderSidebarLinks";
import SidebarLink from "./SidebarLink";
import { useRef } from "react";

function SidebarStyled({ visible, setVisible, theme }) {
  const btnRef3 = useRef(null);
  //TODO если будут ещё раскрывающиеся списки, придумать решение получше для рефов

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => handleHide()}
      content={({ closeIconRef, hide }) => (
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-between px-3 pt-3 flex-shrink-0">
            <span className="inline-flex align-items-center gap-2">
              {theme === "lara-dark-green" ? (
                <img src="/assets/images/ogt-logo-light.png" width={140} />
              ) : (
                <img src="/assets/images/ogt-logo-dark.png" width={140} />
              )}
            </span>
            <span>
              <Button
                type="button"
                ref={closeIconRef}
                onClick={(e) => hide(e)}
                outlined
                icon="pi pi-chevron-right"
                className="h-3rem w-3rem"
              ></Button>
            </span>
          </div>
          <div className="overflow-y-auto">
            <ul className="list-none p-3 m-0">
              {sidebarLinks.map((link, index) => {
                if ("links" in link) {
                  return (
                    <li key={index}>
                      <StyleClass
                        nodeRef={btnRef3}
                        selector="@next"
                        enterClassName="hidden"
                        enterActiveClassName="slidedown"
                        leaveToClassName="hidden"
                        leaveActiveClassName="slideup"
                      >
                        <a
                          ref={btnRef3}
                          className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                        >
                          <i className="pi pi-chart-line mr-2"></i>
                          <span className="font-medium">{link.name}</span>
                          <i className="pi pi-chevron-down ml-auto mr-1"></i>
                          <Ripple />
                        </a>
                      </StyleClass>
                      <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                        {link.links.map((link, index) => {
                          return (
                            <SidebarLink
                              key={index}
                              link={link}
                              handleHide={handleHide}
                            />
                          );
                        })}
                      </ul>
                    </li>
                  );
                }
                return (
                  <SidebarLink
                    key={index}
                    link={link}
                    handleHide={handleHide}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      )}
    ></Sidebar>
  );
}

export default SidebarStyled;
