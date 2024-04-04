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
  const [selectedUser, setSelectedUser] = useState(null);
  const [spends, setSpends] = useState(null);
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

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  useEffect(() => {
    if (selectedUser) {
      setDialogInputObject((prevState) => ({
        ...prevState,
        name: selectedUser,
        user_id: selectedUser.id,
      }));
    }
    console.log("selectedUser", selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    console.log("dialogInputObject: ", dialogInputObject);
  }, [dialogInputObject]);

  useEffect(() => {
    console.log("users: ", users);
  }, [users]);

  const addDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: users,
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
      options: users,
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

  useEffect(() => {
    getUsers().then((response) => {
      setUsers(response.data.map((obj) => getUpdatedUsers(obj)));
    });
    console.log(users);
    renderSpends();
  }, []);

  const getUpdatedUsers = (obj) => {
    return { id: obj.id, name: obj.name };
  };

  const renderSpends = () => {
    getSpends().then(function (response) {
      setSpends(response.data);
      console.log(response.data);
    });
  };

  const handleEditActionClick = (rowData) => {
    const userObject = users.find((obj) => obj.name === rowData.name);
    // setSelectedUser(userObject)
    // setDialogInputObject({
    //   name: rowData.name,
    //   summary: rowData.summary,
    //   date: rowData.date,
    //   user_id: userObject.id,
    // });
    setIsEditDialogVisible(true);
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedSpendID(rowData.id)
  };

  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteSpend(selectedSpendID)
      : showToast("info", "Удаление расхода отменено");
    hide();
    setSelectedSpendID(null);
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

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

  const handleAddSpend = ({ name, summary, date, user_id }) => {
    if (name !== "" && summary !== "" && date !== "" & user_id !== "") {
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

  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
      summary: "",
      date: "",
    });
  };

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
            ref={acceptBtnRef}
            outlined
            label="Да"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("delete", hide);
            }}
            className="p-button-sm p-button-outlined p-button-danger"
          ></Button>
          <Button
            ref={rejectBtnRef}
            label="Отменить"
            outlined
            severity="success"
            onClick={() => {
              handleConfirmPopUpButtonClick("reject", hide);
            }}
            className="p-button-sm p-button-text"
          />
        </div>
      </div>
    );
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
        setSelectedUser={setSelectedUser}
        isUserIDDropdown={true}
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
