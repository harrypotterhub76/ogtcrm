import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import {
  getDomains,
  deleteDomain,
  addDomain,
  editDomain,
  getUsers,
} from "../../utilities/api";
import { MultiSelect } from "primereact/multiselect";
import { DialogComponent } from "../../components/DialogComponent";

function Domains() {
  const [domains, setDomains] = useState([]);
  const [domainsOptions, setDomainsOptions] = useState([]);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const dialogInputObjectInitialState = { name: "", user: "", user_id: "" };

  const [dialogInputObject, setDialogInputObject] = useState(
    dialogInputObjectInitialState
  );

  const toast = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setDialogInputObject((prevState) => ({
        ...prevState,
        user: selectedUser,
        user_id: getSelectedUserID(selectedUser),
      }));
    }
    console.log("selectedUser", selectedUser);
  }, [selectedUser]);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const editDomainInputs = [
    {
      label: "Название",
      key: "name",
      type: "dropdown",
      placeholder: "Введите название домена",
      options: domainsOptions,
      disabled: true,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Выберите пользователя",
      options: usersOptions,
      setDropdownValue: true,
    },
  ];

  const addDomainInputs = [
    {
      label: "Название",
      key: "name",
      type: "text",
      placeholder: "Введите название домена",
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Выберите пользователя",
      options: usersOptions,
      setDropdownValue: true,
    },
  ];

  useEffect(() => {
    console.log("dialogInputObject", dialogInputObject);
    console.log("users", users);
    console.log("selectedUser", selectedUser);
    console.log("usersArray", usersOptions);
    console.log("domains", domainsOptions);
  }, [dialogInputObject, users, selectedUser, usersOptions, domainsOptions]);

  useEffect(() => {
    renderDomains();
    getUsers()
      .then((response) => {
        setUsers(response.data.map((obj) => getUpdatedUsers(obj)));
        setUsersOptions(response.data.map(({ name }) => name));
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке пользователей");
      });
  }, []);

  const getUpdatedUsers = (obj) => {
    return { id: obj.id, name: obj.name };
  };

  const renderDomains = () => {
    getDomains()
      .then((response) => {
        setDomains(response.data);
        setDomainsOptions(response.data.map(({ domain }) => domain));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке доменов");
      });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const confirmDeleteDomain = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить домен?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedDomain,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление домена отменено");
  };

  const deleteSelectedDomain = () => {
    if (currentRowData) {
      deleteDomain(currentRowData.id)
        .then(function (response) {
          showToast("success", "Домен успешно удалён");
          renderDomains();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", "Ошибка удаления домена");
        });
    }
  };

  const addNewDomain = () => {
    addDomain(dialogInputObject)
      .then(function (response) {
        showToast("success", response.data.message);
        setIsAddDialogVisible(false);
        setDialogInputObject({});
        renderDomains();
      })
      .catch(function (error) {
        console.log(error);
        showToast("error", error.response.data.message);
      });
  };

  const handleEdit = (rowData) => {
    setCurrentRowData(rowData.id);
    setIsEditDialogVisible(true);
    setSelectedUser(rowData.name);
    setDialogInputObject({
      name: rowData.domain,
    });
  };

  const editCurrentDomain = () => {
    editDomain(dialogInputObject, currentRowData)
      .then(function (response) {
        showToast("success", response.data.message);
        setIsEditDialogVisible(false);
        clearDialogInputObject();
        renderDomains();
      })
      .catch(function (error) {
        showToast("error", response.data.message);
      });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject(dialogInputObjectInitialState);
    setSelectedUser("");
  };

  const getSelectedUserID = (name) => {
    const filteredArray = users.filter((obj) => obj.name === name);
    return filteredArray[0].id;
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

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleEdit(rowData)}
        />

        <Button
          onClick={(e) => confirmDeleteDomain(e, rowData)}
          icon="pi pi-trash"
          className="p-button-danger"
        />
      </div>
    );
  };

  const representativeFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={users}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Any"
        optionLabel="name"
        optionValue="name"
        className="p-column-filter"
      />
    );
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.name}</span>
      </div>
    );
  };

  return (
    <div className="" style={{ maxWidth: "80%", margin: "0 auto" }}>
      <Toast ref={toast} />
      <ConfirmPopup
        group="headless"
        content={({ message, acceptBtnRef, rejectBtnRef, hide }) => (
          <div className="border-round p-3">
            <span>{message}</span>
            <div className="flex align-items-center gap-2 mt-3">
              <Button
                ref={acceptBtnRef}
                label="Да"
                onClick={() => {
                  deleteSelectedDomain();
                  hide();
                }}
                className="p-button-sm p-button-outlined p-button-danger"
              ></Button>
              <Button
                ref={rejectBtnRef}
                label="Отменить"
                outlined
                onClick={() => {
                  rejectDeletion();
                  hide();
                }}
                className="p-button-sm p-button-text"
              ></Button>
            </div>
          </div>
        )}
      />
      <div className="flex justify-content-between items-center mb-6">
        <h2 className="m-0">Домены</h2>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setIsAddDialogVisible}
        />
        <DialogComponent
          type="add"
          isDialogVisible={isAddDialogVisible}
          setIsDialogVisible={setIsAddDialogVisible}
          header="Добавить домен"
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={addDomainInputs}
          handleAdd={addNewDomain}
          clearDialogInputObject={clearDialogInputObject}
          setDropdownValue={setSelectedUser}
        />
        <DialogComponent
          type="edit"
          isDialogVisible={isEditDialogVisible}
          setIsDialogVisible={setIsEditDialogVisible}
          header="Редактировать домен"
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={editDomainInputs}
          handleEdit={editCurrentDomain}
          clearDialogInputObject={clearDialogInputObject}
          setDropdownValue={setSelectedUser}
        />
      </div>

      <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
        <DataTable
          value={domains}
          paginator
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          stripedRows
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          paginatorPosition="both"
          dataKey="id"
          filters={filters}
          loading={loading}
          globalFilterFields={[
            "domain",
            "name",
            "representative.name",
            "status",
          ]}
          header={renderHeader()}
          emptyMessage="Домен не найден."
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "20%" }}
          ></Column>
          <Column field="domain" header="Домен"></Column>
          <Column
            field="name"
            header="Пользователь"
            filter
            filterField="name"
            showFilterMatchModes={false}
            optionLabel="username"
            body={representativeBodyTemplate}
            filterElement={representativeFilterTemplate}
          ></Column>
          <Column
            field="category"
            header="Действие"
            body={actionBodyTemplate}
            style={{ width: "20%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Domains;
