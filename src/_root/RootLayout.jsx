import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { Button } from "primereact/button";
import SidebarStyled from "../components/SidebarStyled";
import { InputSwitch } from "primereact/inputswitch";

function RootLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [theme, setTheme] = useState("lara-dark-green");

  let themeLink = document.getElementById("app-theme");

  useEffect(() => {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme && themeLink) {
      setTheme(savedTheme);
      themeLink.href = `/themes/${savedTheme}/theme.css`;
    } else {
      setTheme("lara-dark-green");
      if (themeLink) {
        themeLink.href = `/themes/lara-dark-green/theme.css`;
      }
    }
  }, []);

  const switchThemeHandler = (value) => {
    setChecked(value);
    const newTheme =
      theme === "lara-dark-green" ? "lara-light-green" : "lara-dark-green";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (themeLink) {
      themeLink.href = `/themes/${newTheme}/theme.css`;
    }
  };

  return (
    <>
      <header className="card flex justify-content-between">
        <Button icon="pi pi-bars" onClick={() => setSidebarVisible(true)} />
        <SidebarStyled
          visible={sidebarVisible}
          setVisible={setSidebarVisible}
          theme={theme}
        />

        <InputSwitch
          checked={checked}
          onChange={(e) => switchThemeHandler(e.value)}
        />
      </header>

      <section>
        <Outlet />
      </section>
    </>
  );
}

export default RootLayout;
