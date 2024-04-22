import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { Calendar } from "primereact/calendar";

import {
  getFunnels,
  getOffers,
  getUsers,
  postLeadsStats,
} from "../../utilities/api";

function Statistics() {
  const postDatesInitialState = {
    stat_start: "",
    stat_end: "",
  };

  const [leadsStats, setLeadsStats] = useState([]);
  const datesInitialState = [new Date(), new Date()];
  const [dates, setDates] = useState(datesInitialState);
  const [postDates, setPostDates] = useState(postDatesInitialState);
  const [expandedRows, setExpandedRows] = useState(null);
  

  // useEffect'ы для рендера, вывода логов
  useEffect(() => {
    console.log("dates: ", dates);
    console.log("postDates: ", postDates);
    console.log("leadsStats: ", leadsStats);
  }, [leadsStats]);

  useEffect(() => {
    formatDatesState(dates);
  }, [dates]);

  useEffect(() => {
    if (postDates !== postDatesInitialState) {
      getLeadsStatsData();
    }
  }, [postDates]);

  const getLeadsStatsData = () => {
    postLeadsStats(postDates).then((response) => {
      setLeadsStats(response.data);
    });
  };

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
  };

  const allowExpansion = (rowData) => {
    return rowData.name.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <>
        <h4 className="my-3">Статистика по {data.name}</h4>
        <DataTable value={data.geo_stats} className="statistics-inner">
          <Column field="geo" header="Гео"></Column>
          <Column field="total_leads_count" header="Тотал"></Column>
          <Column field="valid_leads_count" header="Валид"></Column>
          <Column field="invalid_leads_count" header="Невалид"></Column>
          <Column field="invalid_leads_percentage" header="% невалида"></Column>
          <Column field="deposited_count" header="Депозиты"></Column>
          <Column field="conversion_rate" header="Процент конверсии"></Column>
        </DataTable>
      </>
    );
  };

  return (
    <>
      <div className="flex w-full my-5">
        <div className="w-full flex">
          <Button className="mx-2" label="Сегодня"></Button>
          <Button className="mx-2" label="Текущая неделя"></Button>
          <Button className="mx-2" label="Прошлая неделя"></Button>
          <Button className="mx-2" label="Текущий месяц"></Button>
          <Button className="mx-2" label="Прошлый месяц"></Button>
        </div>
        <Calendar
          className="w-20rem"
          dateFormat="dd-mm-yy"
          value={dates}
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
        />
      </div>
      <DataTable
        value={leadsStats}
        rows={10}
        stripedRows
        // showGridlines
        style={{ width: "90%" }}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}

      >
        <Column style={{ width: "5rem" }} expander={allowExpansion} />
        <Column field="name" header="Юзер"></Column>
        <Column field="total_leads_count" header="Тотал"></Column>
        <Column field="valid_leads_count" header="Валид"></Column>
        <Column field="invalid_leads_count" header="Невалид"></Column>
        <Column field="invalid_leads_percentage" header="% невалида"></Column>
        <Column field="deposited_count" header="Депозиты"></Column>
        <Column field="conversion_rate" header="Процент конверсии"></Column>
        <Column field="total_spend" header="Затраты"></Column>
        <Column field="cpl" header="CPL"></Column>
      </DataTable>
    </>
  );
}

export default Statistics;
