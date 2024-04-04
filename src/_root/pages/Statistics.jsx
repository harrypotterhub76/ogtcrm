import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { Calendar } from "primereact/calendar";

import { getFunnels, getOffers, getUsers } from "../../utilities/api";
import { getLeads } from "../../dummyData/DummyLeads";

function Statistics() {
  const [funnels, setFunnels] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [leads, setLeads] = useState([]);

  const toast = useRef(null);

  const initStartDate = () => {
    const currentDate = new Date(); // Получить текущую дату и время
    const startToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ); // Установить время на 00:00

    setDates([
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ),
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      ),
    ]);

    setStartDate(startToday);
  };

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  useEffect(() => {
    renderFunnels();
    renderOffers();
    renderUsers();
    initStartDate();
  }, []);

  useEffect(() => {
    setLeads(getLeads().filter(filterLeadsByDate));
  }, [startDate, endDate]);

  const renderFunnels = () => {
    getFunnels()
      .then((response) => {
        setFunnels(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке воронок");
      });
  };
  const renderOffers = () => {
    getOffers()
      .then((response) => {
        setOffers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке оферов");
      });
  };
  const renderUsers = () => {
    getUsers()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке пользователей");
      });
  };

  function filterLeadsByDate(item) {
    const itemDate = new Date(item.dateArrived);
    return itemDate >= startDate && itemDate <= endDate;
  }

  const filteredData = leads.filter(filterLeadsByDate);

  function filterLeadsByUser(item, username) {
    return item.user === username;
  }

  function filterLeadsValide(item) {
    return item.isValid === true;
  }

  const filteredDataByUser = leads.filter((item) =>
    filterLeadsByUser(item, "Dirty Harry")
  );
  console.log(filteredDataByUser);

  console.log(leads);
  console.log(filteredData);

  function handleTodayButtonClick() {
    const currentDate = new Date();
    setStartDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      )
    ); // Start of today (00:00)
    setEndDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      )
    ); // End of today (23:59)
    setDates([
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ),
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      ),
    ]);
  }

  function handleCurrentWeekButtonClick() {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    const endOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6);
    setStartDate(
      new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate()
      )
    ); // Start of the week (00:00)
    setEndDate(
      new Date(
        endOfWeek.getFullYear(),
        endOfWeek.getMonth(),
        endOfWeek.getDate(),
        23,
        59,
        59
      )
    ); // End of the week (23:59)
    setDates([
      new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate()
      ),
      new Date(
        endOfWeek.getFullYear(),
        endOfWeek.getMonth(),
        endOfWeek.getDate(),
        23,
        59,
        59
      ),
    ]);
  }

  function handleLastWeekButtonClick() {
    const currentDate = new Date();
    const startOfLastWeek = new Date(currentDate);
    const endOfLastWeek = new Date(currentDate);
    startOfLastWeek.setDate(currentDate.getDate() - currentDate.getDay() - 7);
    endOfLastWeek.setDate(currentDate.getDate() - currentDate.getDay() - 1);
    setStartDate(
      new Date(
        startOfLastWeek.getFullYear(),
        startOfLastWeek.getMonth(),
        startOfLastWeek.getDate()
      )
    ); // Start of last week (00:00)
    setEndDate(
      new Date(
        endOfLastWeek.getFullYear(),
        endOfLastWeek.getMonth(),
        endOfLastWeek.getDate(),
        23,
        59,
        59
      )
    ); // End of last week (23:59)
    setDates([
      new Date(
        startOfLastWeek.getFullYear(),
        startOfLastWeek.getMonth(),
        startOfLastWeek.getDate()
      ),
      new Date(
        endOfLastWeek.getFullYear(),
        endOfLastWeek.getMonth(),
        endOfLastWeek.getDate(),
        23,
        59,
        59
      ),
    ]);
  }

  function handleCurrentMonthButtonClick() {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    setStartDate(
      new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth(),
        startOfMonth.getDate()
      )
    ); // Start of the month (00:00)
    setEndDate(
      new Date(
        endOfMonth.getFullYear(),
        endOfMonth.getMonth(),
        endOfMonth.getDate(),
        23,
        59,
        59
      )
    ); // End of the month (23:59)
    setDates([
      new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth(),
        startOfMonth.getDate()
      ),
      new Date(
        endOfMonth.getFullYear(),
        endOfMonth.getMonth(),
        endOfMonth.getDate(),
        23,
        59,
        59
      ),
    ]);
  }

  function handleLastMonthButtonClick() {
    const currentDate = new Date();
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    setStartDate(
      new Date(
        startOfLastMonth.getFullYear(),
        startOfLastMonth.getMonth(),
        startOfLastMonth.getDate()
      )
    ); // Start of last month (00:00)
    setEndDate(
      new Date(
        endOfLastMonth.getFullYear(),
        endOfLastMonth.getMonth(),
        endOfLastMonth.getDate(),
        23,
        59,
        59
      )
    ); // End of last month (23:59)

    setDates([
      new Date(
        startOfLastMonth.getFullYear(),
        startOfLastMonth.getMonth(),
        startOfLastMonth.getDate()
      ),
      new Date(
        endOfLastMonth.getFullYear(),
        endOfLastMonth.getMonth(),
        endOfLastMonth.getDate(),
        23,
        59,
        59
      ),
    ]);
  }

  return (
    <div className="" style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Toast ref={toast} />

      <div>
        <h2 className="m-0">Статистика</h2>
        <div className="card flex justify-content-between my-4">
          <Button label="Сегодня" onClick={handleTodayButtonClick} />
          <Button
            label="Текущая неделя"
            onClick={handleCurrentWeekButtonClick}
          />
          <Button label="Прошлая неделя" onClick={handleLastWeekButtonClick} />
          <Button
            label="Текущий месяц"
            onClick={handleCurrentMonthButtonClick}
          />
          <Button label="Прошлый месяц" onClick={handleLastMonthButtonClick} />

          <Calendar
            value={dates}
            onChange={(e) => {
              setDates(e.value);
              setStartDate(e.value[0]);
              setEndDate(e.value[1]);
            }}
            selectionMode="range"
            readOnlyInput
          />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ flex: "1 0 48%" }}>
          <DataTable
            value={users}
            stripedRows
            showGridlines
            dataKey="id"
            loading={loading}
            emptyMessage="Пользователи не найдены."
          >
            <Column field="name" header="Юзер"></Column>
            <Column
              field="leads"
              header="Лиды"
              body={(rowData) =>
                leads.filter((item) => filterLeadsByUser(item, rowData.name))
                  .length
              }
            ></Column>
            <Column
              field="valid"
              header="Валид"
              body={(rowData) =>
                leads
                  .filter((item) => filterLeadsByUser(item, rowData.name))
                  .filter((item) => filterLeadsValide(item)).length
              }
            ></Column>
            <Column
              field="id"
              header="Невалид"
              body={(rowData) =>
                leads.filter((item) => filterLeadsByUser(item, rowData.name))
                  .length -
                leads
                  .filter((item) => filterLeadsByUser(item, rowData.name))
                  .filter((item) => filterLeadsValide(item)).length
              }
            ></Column>
            <Column
              field="id"
              header="% невалида"
              body={(rowData) =>
                (
                  (leads.filter((item) => filterLeadsByUser(item, rowData.name))
                    .length -
                    leads
                      .filter((item) => filterLeadsByUser(item, rowData.name))
                      .filter((item) => filterLeadsValide(item)).length) /
                  leads.filter((item) => filterLeadsByUser(item, rowData.name))
                    .length
                ).toFixed(2) *
                  100 +
                "%"
              }
            ></Column>
            <Column field="id" header="Конверсии"></Column>
            <Column field="id" header="%CR"></Column>
            <Column field="id" header="Запрошено"></Column>
            <Column field="id" header="CPL"></Column>
          </DataTable>
        </div>
        <div style={{ flex: "1 0 48%" }}>
          <DataTable
            value={offers}
            stripedRows
            showGridlines
            dataKey="id"
            loading={loading}
            emptyMessage="Воронки не найдена."
          >
            <Column field="name" header="Оффер"></Column>
            <Column field="id" header="Лиды"></Column>
            <Column field="category" header="Валид"></Column>
            <Column field="id" header="Невалид"></Column>
            <Column field="id" header="% невалида"></Column>
            <Column field="id" header="Конверсии"></Column>
            <Column field="id" header="%CR"></Column>
            <Column field="id" header="Доход"></Column>
          </DataTable>
        </div>
        <div style={{ flex: "0 1 50%" }}>
          <DataTable
            value={funnels}
            stripedRows
            showGridlines
            dataKey="id"
            loading={loading}
            emptyMessage="Воронки не найдена."
          >
            <Column field="name" header="Воронка"></Column>
            <Column field="id" header="Лиды"></Column>
            <Column field="category" header="Валид"></Column>
            <Column field="id" header="Конверсии"></Column>
            <Column field="id" header="%CR"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
