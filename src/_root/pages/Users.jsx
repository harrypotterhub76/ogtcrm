import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { getUsers, deleteUser, addUser, editUser } from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";

function Users() {
  const [users, setUsers] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const dialogRoles = ["Admin", "Buyer"];

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const addDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "text",
      placeholder: "Введите имя",
    },
    {
      label: "Почта",
      key: "email",
      type: "text",
      placeholder: "Введите почту",
    },
    {
      label: "Пароль",
      key: "password",
      type: "text",
      placeholder: "Введите пароль",
    },
    {
      label: "Роль",
      key: "role",
      type: "dropdown",
      placeholder: "Выберите роль",
      options: dialogRoles,
    },
  ];

  const editDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "text",
      placeholder: "Введите имя",
    },
    {
      label: "Почта",
      key: "email",
      type: "text",
      placeholder: "Введите почту",
    },
    {
      label: "Роль",
      key: "role",
      type: "dropdown",
      placeholder: "Выберите роль",
      options: dialogRoles,
    },
  ];

  useEffect(() => {
    renderUsers();
  }, []);

  const renderUsers = () => {
    getUsers().then(function (response) {
      setUsers(response.data);
      console.log(response.data);
    });
  };

  const handleTogglePopUp = (option, e, users) => {
    if (option === "add") {
      showPopUp(e);
    } else {
      console.log(users);
      setDialogInputObject({
        name: users.name,
        email: users.email,
        role: users.role,
      });
      setIsEditDialogVisible(true);
    }
    setSelectedUserID(users.id);
  };

  useEffect(() => {
    console.log(selectedUserID);
  }, [selectedUserID]);

  const handleConfirmPopUpButtonClick = (option, hide) => {
    if (option === "accept") {
      handleDeleteUser(selectedUserID);
    } else {
      showRejectToast();
    }
    hide();
    setSelectedUserID(null);
  };

  const actionButtonsTemplate = (users) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleTogglePopUp("edit", e, users)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={(e) => handleTogglePopUp("add", e, users)}
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

  const renderHeader = () => {
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

  const header = renderHeader();

  const showAcceptToast = () => {
    showToast("success", "Пользователь успешно удалён");
  };

  const showRejectToast = () => {
    showToast("info", "Удаление пользователя отменено");
  };

  const handleAddUser = ({ name, email, password, role }) => {
    if (name !== "" && email !== "" && password !== "" && role !== "") {
      addUser(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          showToast("success", "Пользователь успешно добавлен");
          renderUsers();
        })
        .catch(function (error) {
          showToast("error", "Ошибка добавления пользователя");
        });
    } else {
      console.log("Fill all fields");
      showToast("info", "Заполните все поля");
    }
  };

  const handleEditUser = ({ name, email, role }) => {
    if (name !== "" && email !== "" && role !== "") {
      editUser(dialogInputObject, selectedUserID)
        .then(function (response) {
          showToast("success", "Пользователь успешно редактирован");
          setIsEditDialogVisible(false);
          renderUsers();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", "Ошибка редактирования пользователя");
        });
    } else {
      console.log("Fill all fields");
      showToast("info", "Заполните все поля");
    }
  };

  const handleDeleteUser = () => {
    console.log(dialogInputObject, selectedUserID);
    deleteUser(selectedUserID)
      .then(function (response) {
        showToast("success", "Пользователь успешно удален");
        renderUsers();
      })
      .catch(function (error) {
        console.log(error);
        showToast("error", "Ошибка удаления пользователя");
      });
  };

  const showPopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить пользователя?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: showAcceptToast,
      reject: showRejectToast,
    });
  };
  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setSelectedUserID(null);
  };


  const popUpContent = ({ message, acceptBtnRef, rejectBtnRef, hide }) => {
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
              handleConfirmPopUpButtonClick("accept", hide);
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

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContent} />

      <DialogComponent
        type="add"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header={"Добавить пользователя"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddUser}
        clearDialogInputObject={clearDialogInputObject}
      />

      <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Редактировать пользователя"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditUser}
        clearDialogInputObject={clearDialogInputObject}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Пользователи</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={users}
          paginator
          header={header}
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
          <Column field="email" header="Почта"></Column>
          <Column field="role" header="Роль"></Column>
          <Column
            header="Действия"
            body={(users) => actionButtonsTemplate(users)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Users;
