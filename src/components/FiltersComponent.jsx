import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState, useRef, useContext } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { UserContext } from "../context/userContext";

function FiltersStyled({
  visible,
  setVisible,
  filtersArray,
  renderData,
  type,
  rows,
  page,
  setFiltersObjectForRefresh,
}) {
  const [filtersObject, setFiltersObject] = useState({});
  const [dates, setDates] = useState([]);
  const [datesSent, setDatesSent] = useState([]);
  const [datesDep, setDatesDep] = useState([]);

  const { user } = useContext(UserContext);

  console.log(JSON.parse(user).user);

  useEffect(() => {
    if (Object.keys(dates).length) {
      formatDatesState(dates, "create");
    }
    if (Object.keys(datesSent).length) {
      formatDatesState(datesSent, "sent");
    }
    if (Object.keys(datesDep).length) {
      formatDatesState(datesDep, "dep");
    }
  }, [dates, datesSent, datesDep]);

  const ref = useRef(0);

  // Вспомогательные функции
  const formatDatesState = (array, type) => {
    if (type === "create") {
      const formattedPostDates = array.map((date) => {
        if (date instanceof Date && !isNaN(date)) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        } else {
          return "";
        }
      });

      console.log("formattedPostDates: ", formattedPostDates);
      if (formattedPostDates[0] !== "" && formattedPostDates[1] !== "")
        handleFilterChange("start_filter", formattedPostDates[0]);
      handleFilterChange("end_filter", formattedPostDates[1]);
    } else if (type === "sent") {
      const formattedPostDates = array.map((date) => {
        if (date instanceof Date && !isNaN(date)) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        } else {
          return "";
        }
      });

      console.log("formattedPostDates: ", formattedPostDates);
      if (formattedPostDates[0] !== "" && formattedPostDates[1] !== "")
        handleFilterChange("start_send_filter", formattedPostDates[0]);
      handleFilterChange("end_send_filter", formattedPostDates[1]);
    } else if (type === "dep") {
      const formattedPostDates = array.map((date) => {
        if (date instanceof Date && !isNaN(date)) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        } else {
          return "";
        }
      });

      console.log("formattedPostDates: ", formattedPostDates);
      if (formattedPostDates[0] !== "" && formattedPostDates[1] !== "")
        handleFilterChange("start_ftd_filter", formattedPostDates[0]);
      handleFilterChange("end_ftd_filter", formattedPostDates[1]);
    }
  };

  const handleHide = () => {
    setVisible(false);
  };

  const handleFilterChange = (field, value) => {
    setFiltersObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log(field, value, rows, page);
  };

  useEffect(() => {
    console.log("filtersArray", filtersObject);
  }, [filtersObject]);

  useEffect(() => {
    handleFilterChange("perPage", rows);
    handleFilterChange("page", page + 1);
  }, [rows, page]);

  useEffect(() => {
    handleFilterChange("role", JSON.parse(user).user.role);
    handleFilterChange("user_id", JSON.parse(user).user.id);
  }, [user]);

  useEffect(() => {
    console.log("huy");
    if (ref.current) {
      renderData(filtersObject);
    }
    ref.current++;

    if (setFiltersObjectForRefresh) setFiltersObjectForRefresh(filtersObject);
  }, [filtersObject]);

  const handleClear = () => {
    setFiltersObject({
      perPage: rows,
      page: page + 1,
      role: JSON.parse(user).user.role,
      user_id: JSON.parse(user).user.id,
    });
    setDates({});
    setDatesSent({});
    setDatesDep({});
  };

  return (
    <Sidebar
      position="right"
      visible={visible}
      onHide={() => handleHide()}
      content={({ closeIconRef, hide }) => (
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-between px-3 pt-3 flex-shrink-0">
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
            <h2 className="m-0">Фильтры</h2>
          </div>
          <div className="overflow-y-auto">
            <ul className="list-none p-3 flex flex-column gap-3">
              {filtersArray.map((filter, index) => {
                return (
                  <li className="m-0-1" key={index}>
                    <div className="p-inputgroup flex max-w-full">
                      {filter.type === "text" ? (
                        <InputText
                          value={filtersObject[filter.key] || ""}
                          onChange={(e) => {
                            console.log(e.target.value);
                            handleFilterChange(filter.key, e.target.value);
                          }}
                          style={{ width: "85%", maxWidth: "85%" }}
                          placeholder={filter.placeholder}
                        />
                      ) : filter.type === "dropdown" ? (
                        <Dropdown
                          value={
                            filtersObject[filter.key] == "0"
                              ? 0
                              : filtersObject[filter.key] == "1"
                              ? 1
                              : []
                          }
                          onChange={(e) => {
                            console.log(e.value);
                            handleFilterChange(filter.key, e.value.toString());
                          }}
                          options={filter.options}
                          placeholder={filter.placeholder}
                          className="w-full"
                          optionLabel="name"
                        />
                      ) : filter.type === "calendar-creation" ? (
                        <Calendar
                          className="w-20rem"
                          dateFormat="dd-mm-yy"
                          value={dates}
                          onChange={(e) => {
                            console.log(e.value);
                            setDates(e.value);
                          }}
                          selectionMode="range"
                          placeholder={filter.placeholder}
                          locale="ru"
                          style={{ width: "85%", maxWidth: "85%" }}
                        />
                      ) : filter.type === "calendar-send" ? (
                        <Calendar
                          className="w-20rem"
                          dateFormat="dd-mm-yy"
                          value={datesSent}
                          onChange={(e) => {
                            console.log(e.value);
                            setDatesSent(e.value);
                          }}
                          selectionMode="range"
                          placeholder={filter.placeholder}
                          locale="ru"
                          style={{ width: "85%", maxWidth: "85%" }}
                        />
                      ) : filter.type === "calendar-dep" ? (
                        <Calendar
                          className="w-20rem"
                          dateFormat="dd-mm-yy"
                          value={datesDep}
                          onChange={(e) => {
                            console.log(e.value);
                            setDatesDep(e.value);
                          }}
                          selectionMode="range"
                          placeholder={filter.placeholder}
                          locale="ru"
                          style={{ width: "85%", maxWidth: "85%" }}
                        />
                      ) : filter.type === "multiselect" ? (
                        <MultiSelect
                          value={filtersObject[filter.key]}
                          onChange={(e) => {
                            handleFilterChange(filter.key, e.value);
                          }}
                          options={filter.options}
                          filter
                          maxSelectedLabels={3}
                          className="w-full"
                          placeholder={filter.placeholder}
                          style={{ width: "85%", maxWidth: "85%" }}
                        />
                      ) : filter.type === "switch" ? (
                        <InputSwitch
                          checked={Boolean(filtersObject[filter.key])}
                          onChange={(e) => {
                            handleFilterChange(filter.key, Number(e.value));
                          }}
                          style={{ width: "85%", maxWidth: "85%" }}
                        />
                      ) : (
                        <span>Другой тип filter</span>
                      )}

                      <Button
                        icon="pi pi-trash pi-filter"
                        className="p-button-success min-w-10 flex-1"
                        style={{ width: "40px", minWidth: "40px" }}
                        onClick={() => {
                          if (filter.key == "created_at") {
                            setDates([]);
                            handleFilterChange("start_filter", "");
                            handleFilterChange("end_filter", "");
                          } else if (filter.key == "sent_at") {
                            setDatesSent([]);
                            handleFilterChange("start_send_filter", "");
                            handleFilterChange("end_send_filter", "");
                          } else if (filter.key == "dep_at") {
                            setDatesDep([]);
                            handleFilterChange("start_ftd_filter", "");
                            handleFilterChange("end_ftd_filter", "");
                          }
                          handleFilterChange(filter.key, []);
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <Button onClick={() => handleClear()} className="ml-3">
              Обнулить всё
            </Button>
          </div>
        </div>
      )}
    ></Sidebar>
  );
}

export default FiltersStyled;
