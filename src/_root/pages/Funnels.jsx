import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import { getFunnels, deleteFunnel, addFunnel } from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";

function Funnels() {
  const [funnels, setFunnels] = useState([]);
  const [popupCreateVisible, setPopupCreateVisible] = useState(false);
  const [funnelName, setFunnelName] = useState({ name: "" });
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const inputs = [
    {
      label: "Воронка",
      key: "name",
      type: "text",
      placeholder: "Название воронки",
      options: [],
    },
  ];

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  useEffect(() => {
    renderFunnels();
  }, []);


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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const confirmDeleteFunnel = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить воронку?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedFunnel,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление воронки отменено");
  };

  const deleteSelectedFunnel = () => {
    if (currentRowData) {
      deleteFunnel(currentRowData.id)
        .then(function (response) {
          showToast("success", "Воронка успешно удалена");
          renderFunnels();
        })
        .catch(function (error) {
          console.log(error);
          showToast('error',"Ошибка удаления воронки");
        });
    }
  };

  const addNewFunnel = () => {
    addFunnel(funnelName.name)
      .then(function (response) {
        showToast("success", "Воронка создана успешно");
        setPopupCreateVisible(false);
        setFunnelName({ name: "" });
        renderFunnels();
      })
      .catch(function (error) {
        showToast('error',"Ошибка создания воронки");
        setFunnelName({ name: "" });
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
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={(e) => confirmDeleteFunnel(e, rowData)}
        icon="pi pi-trash"
        className="p-button-danger"
        style={{ maxWidth: "48px", margin: "0 auto" }}
      />
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
                  deleteSelectedFunnel();
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
        <h2 className="m-0">Воронки</h2>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setPopupCreateVisible}
        />

        <DialogComponent
          type="add"
          isDialogVisible={popupCreateVisible}
          setIsDialogVisible={setPopupCreateVisible}
          header={"Добавить воронку"}
          dialogInputObject={funnelName}
          setDialogInputObject={setFunnelName}
          inputs={inputs}
          handleAdd={addNewFunnel}
        />
      </div>

      <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
        <DataTable
          value={funnels}
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
          globalFilterFields={["name"]}
          header={renderHeader()}
          emptyMessage="Воронка не найдена."
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "30%" }}
          ></Column>
          <Column field="name" header="Воронка"></Column>
          <Column
            field="category"
            header="Действие"
            body={actionBodyTemplate}
            style={{ width: "30%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Funnels;
