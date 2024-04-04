import React from "react";
import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import {
  getStatuses,
  deleteStatus,
  addStatus,
  editStatus,
} from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";

function Statuses() {
  const [statuses, setStatuses] = useState([]);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [dialogInputObject, setDialogInputObject] = useState({
    broker_status: "",
    crm_status: "",
    broker_name: "",
  });

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const inputs = [
    {
      label: "Статус брокера",
      key: "broker_status",
      type: "text",
      placeholder: "Введите статус брокера",
      disabled: true,
    },
    {
      label: "Статус CRM",
      key: "crm_status",
      type: "text",
      placeholder: "Введите статус CRM",
    },
  ];

  useEffect(() => {
    console.log("dialogInputObject", dialogInputObject);
  }, [dialogInputObject]);

  useEffect(() => {
    renderStatuses();
  }, []);

  const renderStatuses = () => {
    getStatuses()
      .then((response) => {
        const renamedData = response.data.map((item) => ({
          ...item,
          name: item.name,
        }));
        setStatuses(renamedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке статусов");
      });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const confirmDeleteStatus = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить статус?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedStatuse,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление статуса отменено");
  };

  const deleteSelectedStatuse = () => {
    if (currentRowData) {
      deleteStatus(currentRowData.id)
        .then(function () {
          showToast("success", "Статус успешно удалён");
          renderStatuses();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", "Ошибка удаления статуса");
        });
    }
  };

  const addNewStatuse = () => {
    addStatus(dialogInputObject)
      .then(function () {
        showToast("success", "Статус успешно добавлен");
        setIsAddDialogVisible(false);
        setDialogInputObject({});
        renderStatuses();
      })
      .catch(function (error) {
        console.log(error);
        showToast("error", "Ошибка добавления статуса");
      });
  };

  const handleEdit = (event, status) => {
    setCurrentRowData(status.id);
    setIsEditDialogVisible(true);
    setDialogInputObject({
      broker_name: status.broker_name,
      broker_status: status.broker_status,
      crm_status: status.crm_status
    });
  };

  const editCurrentStatuse = () => {
    editStatus(dialogInputObject, currentRowData)
      .then(function (response) {
        showToast("success", "Статус успешно изменён");
        setIsEditDialogVisible(false);
        setDialogInputObject({});
        renderStatuses();
      })
      .catch(function (error) {
        showToast("error", "Ошибка редактирования Статуса");
      });
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
    console.log(rowData);
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleEdit(e, rowData)}
        />

        <Button
          onClick={(e) => confirmDeleteStatus(e, rowData)}
          icon="pi pi-trash"
          className="p-button-danger"
        />
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
                  deleteSelectedStatuse();
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
        <h2 className="m-0">Статусы</h2>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setIsAddDialogVisible}
        />
        <DialogComponent
          type="add"
          isDialogVisible={isAddDialogVisible}
          setIsDialogVisible={setIsAddDialogVisible}
          header="Добавить статус"
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleAdd={addNewStatuse}
        />
        <DialogComponent
          type="edit"
          isDialogVisible={isEditDialogVisible}
          setIsDialogVisible={setIsEditDialogVisible}
          header="Редактировать статус"
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleEdit={editCurrentStatuse}
        />
      </div>

      <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
        <DataTable
          value={statuses}
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
          header={renderHeader()}
          emptyMessage="Статус не найден."
        >
          <Column field="id" header="ID" style={{ width: "20%" }}></Column>
          <Column field="broker_status" header="Статус брокера"></Column>
          <Column field="crm_status" header="Статус CRM"></Column>
          <Column field="broker_name" header="Брокер"></Column>
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

export default Statuses;
