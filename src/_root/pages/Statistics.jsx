import { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { Calendar } from "primereact/calendar";

import {
  getFunnels,
  getOffers,
  getUsers,
  postFunnelsStats,
  postLeadsStats,
  postOffersStats,
} from "../../utilities/api";
import { BreadCrumbContext } from "../../context/BreadCrumbContext";

function Statistics() {
  const postDatesInitialState = {
    stat_start: "",
    stat_end: "",
  };
  const datesInitialState = [new Date(), new Date()];

  const [leadsStats, setLeadsStats] = useState([]);
  const [offersStats, setOffersStats] = useState([]);
  const [funnelsStats, setFunnelsStats] = useState([]);
  const [dates, setDates] = useState(datesInitialState);
  const [postDates, setPostDates] = useState(postDatesInitialState);
  const [expandedRows, setExpandedRows] = useState(null);
  const { setItems } = useContext(BreadCrumbContext);

  // useEffect'ы для рендера, вывода логов
  useEffect(() => {
    console.log("dates: ", dates);
    console.log("postDates: ", postDates);
    console.log("leadsStats: ", leadsStats);
    console.log("offersStats: ", offersStats);
    console.log("funnelsStats: ", funnelsStats);
  }, [leadsStats, offersStats, funnelsStats]);

  useEffect(() => {
    formatDatesState(dates);
  }, [dates]);

  useEffect(() => {
    if (postDates !== postDatesInitialState) {
      getLeadsStatsData();
      getOffersStatsData();
      getFunnelsStatsData();
    }
  }, [postDates]);

  const getLeadsStatsData = () => {
    postLeadsStats(postDates).then((response) => {
      setLeadsStats(response.data);
    });
  };

  const getOffersStatsData = () => {
    postOffersStats(postDates).then((response) => {
      setOffersStats(response.data);
    });
  };

  const getFunnelsStatsData = () => {
    postFunnelsStats(postDates).then((response) => {
      setFunnelsStats(response.data);
    });
  };

  const handleDateButtonClick = (option) => {
    switch (option) {
      case "today":
        setDates(datesInitialState);
        break;
      case "current week":
        setDates([getLatestMondayDate(), getCurrentDate()]);
        break;
      case "last week":
        setDates([getBeginningOfLastWeekDate(), getEndOfLastWeekDate()]);
        break;
      case "current month":
        setDates([getBegginingOfCurrentMonthDate(), getCurrentDate()]);
        break;
      case "last month":
        setDates([getBeginningOfLastMonthDate(), getEndOfLastMonthDate()]);
        break;
    }
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

  const getBeginningOfLastWeekDate = () => {
    const today = new Date();
    const lastMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 6
    );
    return lastMonday;
  };

  const getEndOfLastWeekDate = () => {
    const today = new Date();
    const lastMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 6
    );
    const endOfLastWeek = new Date(lastMonday);
    endOfLastWeek.setDate(lastMonday.getDate() + 6);
    if (endOfLastWeek.getDay() === 1) {
      endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
    }
    return endOfLastWeek;
  };

  const getLatestMondayDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToAdd = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const latestMonday = new Date(today);
    latestMonday.setDate(today.getDate() - daysToAdd);

    return latestMonday;
  };

  const getBegginingOfCurrentMonthDate = () => {
    const today = new Date();
    const beginningOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return beginningOfMonth;
  };

  const getBeginningOfLastMonthDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  };

  const getEndOfLastMonthDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 0);
  };

  const getCurrentDate = () => {
    return new Date();
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
          <Button
            onClick={() => {
              handleDateButtonClick("today");
            }}
            className="mx-2"
            label="Сегодня"
          ></Button>
          <Button
            onClick={() => {
              handleDateButtonClick("current week");
            }}
            className="mx-2"
            label="Текущая неделя"
          ></Button>
          <Button
            onClick={() => {
              handleDateButtonClick("last week");
            }}
            className="mx-2"
            label="Прошлая неделя"
          ></Button>
          <Button
            onClick={() => {
              handleDateButtonClick("current month");
            }}
            className="mx-2"
            label="Текущий месяц"
          ></Button>
          <Button
            onClick={() => {
              handleDateButtonClick("last month");
            }}
            className="mx-2"
            label="Прошлый месяц"
          ></Button>
        </div>
        <Calendar
          className="w-20rem"
          dateFormat="dd-mm-yy"
          value={dates}
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
          locale="ru"
        />
      </div>
      <DataTable
        value={leadsStats}
        rows={10}
        // showGridlines
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        className="mb-5"
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

      <DataTable
        value={offersStats}
        rows={10}
        // showGridlines
        className="mb-5"
      >
        <Column field="offer" header="Оффер"></Column>
        <Column field="total_leads_count" header="Тотал"></Column>
        <Column field="valid_leads_count" header="Валид"></Column>
        <Column field="deposited_count" header="Депозиты"></Column>
        <Column field="conversion_rate" header="Процент конверсии"></Column>
      </DataTable>

      <DataTable
        value={funnelsStats}
        rows={10}
        // showGridlines
      >
        <Column field="funnel" header="Воронка"></Column>
        <Column field="total_leads_count" header="Тотал"></Column>
        <Column field="valid_leads_count" header="Валид"></Column>
        <Column field="deposited_count" header="Депозиты"></Column>
        <Column field="conversion_rate" header="Процент конверсии"></Column>
      </DataTable>
    </>
  );
}

export default Statistics;
