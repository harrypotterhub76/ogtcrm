import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState, useRef } from "react";
import { getFilteredSpends } from "../utilities/api";

function FiltersStyled({
  visible,
  setVisible,
  filtersArray,
  formatCalendarDate,
  setFilteredData,
}) {
  const postDatesInitialState = {
    stat_start: "",
    stat_end: "",
  };

  const [filtersObject, setFiltersObject] = useState({});
  // const datesInitialState = [new Date(), new Date()];
  const [dates, setDates] = useState([]);
  const [postDates, setPostDates] = useState(postDatesInitialState);

  useEffect(() => {
    if (Object.keys(dates).length) {
      formatDatesState(dates);
    }
  }, [dates]);

  const ref = useRef(0);

  // Вспомогательные функции
  const formatDatesState = (array) => {
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
      setPostDates({
        stat_start: formattedPostDates[0],
        stat_end: formattedPostDates[1],
      });

    handleFilterChange("start_filter", formattedPostDates[0]);
    handleFilterChange("end_filter", formattedPostDates[1]);
  };

  const handleHide = () => {
    setVisible(false);
  };

  const handleFilterChange = (field, value) => {
    setFiltersObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log(field, value);
  };

  useEffect(() => {
    if (ref.current) {
      getFilteredSpends(filtersObject).then((response) => {
        setFilteredData(response.data);
      });
    }
    ref.current++;
  }, [filtersObject]);

  const handleClear = (key) => {
    if (key === "all") {
      setFiltersObject({});
      setDates({});
    }
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
            <ul className="list-none p-3">
              {filtersArray.map((filter, index) => {
                return (
                  <li className="m-0-1" key={index}>
                    {filter.type === "text" ? (
                      <InputText
                        onChange={(e) => {}}
                        style={{ width: "100%" }}
                        placeholder={filter.placeholder}
                      />
                    ) : filter.type === "dropdown" ? (
                      <Dropdown
                        value={filtersObject[filter.key]}
                        onChange={(e) => {
                          console.log(e.value);
                          handleFilterChange(filter.key, e.value);
                        }}
                        options={filter.options}
                        placeholder={filter.placeholder}
                        className="w-full"
                      />
                    ) : filter.type === "calendar" ? (
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
                      />
                    ) : filter.type === "switch" ? (
                      <filterSwitch
                        checked={Boolean(filtersObject[filter.key])}
                        onChange={(e) => {
                          handleFilterChange(filter.key, Number(e.value));
                        }}
                      />
                    ) : (
                      <span>Другой тип filter</span>
                    )}
                  </li>
                );
              })}
            </ul>

            <Button onClick={() => handleClear("all")}>Обнулить всё</Button>
          </div>
        </div>
      )}
    ></Sidebar>
  );
}

export default FiltersStyled;
