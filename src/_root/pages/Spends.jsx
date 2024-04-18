import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  addSpend,
  getSpends,
  getUsers,
  deleteSpend,
  editSpend,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";

function Spends() {
  // Стейты
  const [spends, setSpends] = useState(null);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSpendID, setSelectedSpendID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    summary: "",
    date: "",
    user_id: "",
  });
  const toast = useRef(null);

  // Функция на рендер тоста
  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  // useEffect'ы для рендера, вывода логов
  useEffect(() => {
    getUsersArray();
    renderSpends();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setDialogInputObject((prevState) => ({
        ...prevState,
        name: selectedUser,
        user_id: getSelectedUserID(selectedUser),
      }));
    }
  }, [selectedUser]);

  useEffect(() => {
    console.log("_________________________________________");
    console.log("dialogInputObject: ", dialogInputObject);
    console.log("users: ", users);
    console.log("usersOptions: ", usersOptions);
    console.log("selectedUser", selectedUser);
    console.log("_________________________________________");
  }, [dialogInputObject, users, usersOptions, selectedUser]);

  // Инпуты для DialogComponent
  const addDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: usersOptions,
      setDropdownValue: setSelectedUser,
    },
    {
      label: "Сумма",
      key: "summary",
      type: "text",
      placeholder: "Введите сумму",
    },
    {
      label: "Дата",
      key: "date",
      type: "calendar",
      placeholder: "Выберите дату",
    },
  ];

  const editDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: usersOptions,
    },
    {
      label: "Сумма",
      key: "summary",
      type: "text",
      placeholder: "Введите сумму",
    },
    {
      label: "Дата",
      key: "date",
      type: "calendar",
      placeholder: "Выберите дату",
    },
  ];

  // Функции подтягиваний данных с бека
  const renderSpends = () => {
    getSpends().then(function (response) {
      setSpends(response.data);
    });
  };

  const getUsersArray = () => {
    getUsers().then((response) => {
      setUsers(response.data);
      setUsersOptions(response.data.map(({ name }) => name));
    });
  };

  // Обработчики для actionButtonsTemplate
  const handleEditActionClick = (rowData) => {
    setSelectedUser(rowData.name);
    setDialogInputObject({
      summary: rowData.summary,
      date: rowData.date,
    });
    setSelectedSpendID(rowData.id);
    setIsEditDialogVisible(true);
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedSpendID(rowData.id);
  };

  // Функция для управления плажкой на удаление данных из DataTable
  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteSpend(selectedSpendID)
      : showToast("info", "Удаление расхода отменено");
    hide();
    setSelectedSpendID(null);
  };

  // Сеттер фильтра глобального поиска
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Обработчики взаимодействия фронта с беком
  const handleAddSpend = ({ name, summary, date, user_id }) => {
    if (name !== "" && summary !== "" && (date !== "") & (user_id !== "")) {
      addSpend(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          showToast("success", "Расход успешно добавлен");
          renderSpends();
          clearDialogInputObject();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", "Ошибка добавления расхода");
        });
    } else {
      console.log("Fill all fields");
      showToast("info", "Заполните все поля");
    }
  };

  const handleEditSpend = ({ name, summary, date }) => {
    if (name !== "" && summary !== "" && date !== "") {
      editSpend(dialogInputObject, selectedSpendID)
        .then(function (response) {
          showToast("success", "Расход успешно редактирован");
          setIsEditDialogVisible(false);
          renderSpends();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", "Ошибка редактирования расхода");
        });
    } else {
      console.log("Fill all fields");
      showToast("info", "Заполните все поля");
    }
  };

  const handleDeleteSpend = () => {
    console.log(dialogInputObject, selectedSpendID);
    deleteSpend(selectedSpendID)
      .then(function (response) {
        showToast("success", "Расход успешно удалён");
        renderSpends();
      })
      .catch(function (error) {
        console.log(error);
        showToast("error", "Ошибка удаления расхода");
      });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
      summary: "",
      date: "",
      user_id: "",
    });
    setSelectedUser(null);
    setSelectedSpendID(null);
  };

  // Рендер плажки на удаление данных из DataTable
  const showConfirmDeletePopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить расход?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
    });
  };

  // Вспомогательные функции
  const getSelectedUserID = (name) => {
    const filteredArray = users.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const formatCalendarDate = (timestamp, option) => {
    if (option === "to string") {
      const originalDate = new Date(timestamp);
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, "0");
      const day = String(originalDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    } else if (option === "to Date") {
      if (timestamp) {
        const [year, month, day] = timestamp.split("-");
        const formattedDate = new Date(year, month - 1, day);
        return formattedDate;
      }
    }
  };

  // Шаблоны для DataTable
  const headerTemplate = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Поиск"
          />
        </span>
      </div>
    );
  };

  const actionButtonsTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          onClick={(e) => handleEditActionClick(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={(e) => handleDeleteActionClick(e, rowData)}
        />
      </div>
    );
  };

  const popUpContentTemplate = ({
    message,
    acceptBtnRef,
    rejectBtnRef,
    hide,
  }) => {
    return (
      <div className="border-round p-3">
        <span>{message}</span>
        <div className="flex align-items-center gap-2 mt-3">
          <Button
            ref={rejectBtnRef}
            label="Отменить"
            outlined
            severity="success"
            onClick={() => {
              handleConfirmPopUpButtonClick("reject", hide);
            }}
            className="p-button-sm p-button-outlined p-button-text"
          />
          <Button
            ref={acceptBtnRef}
            outlined
            label="Удалить"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("delete", hide);
            }}
            className="p-button-sm p-button-outlined p-button-danger"
          ></Button>
        </div>
      </div>
    );
  };

  const dateTemplate = (rowData) => {
    const dateString = rowData.date;
    const splittedDateString = dateString.split("-");
    const formattedDateString = `${splittedDateString[2]}-${splittedDateString[1]}-${splittedDateString[0]}`;
    return formattedDateString;
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <DialogComponent
        type="add"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header={"Добавить расход"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddSpend}
        formatCalendarDate={formatCalendarDate}
        clearDialogInputObject={clearDialogInputObject}
      />

      <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Редактировать расход"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditSpend}
        formatCalendarDate={formatCalendarDate}
        clearDialogInputObject={clearDialogInputObject}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Расходы</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={spends}
          paginator
          header={headerTemplate}
          rows={10}
          stripedRows
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorPosition="top"
          filters={filters}
          style={{ width: "90%" }}
        >
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Имя"></Column>
          <Column field="summary" header="Сумма"></Column>
          <Column field="date" header="Дата" body={dateTemplate}></Column>
          <Column
            header="Действия"
            body={(spends) => actionButtonsTemplate(spends)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Spends;
