import { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { getFunnels, deleteFunnel, addFunnel } from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";
import FiltersStyled from "../../components/FiltersComponent";
import { TitleContext } from "../../context/TitleContext";
import { Skeleton } from "primereact/skeleton";
import PaginatorComponent from "../../components/PaginatorComponent";

function Funnels() {
  const [funnels, setFunnels] = useState([]);
  const [popupCreateVisible, setPopupCreateVisible] = useState(false);
  const [dialogInputObject, setDialogInputObject] = useState({ name: "" });
  const [currentRowData, setCurrentRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [funnelsNames, setFunnelsNames] = useState([]);
  const { setTitleModel } = useContext(TitleContext);

  const inputs = [
    {
      label: "Воронка",
      key: "name",
      type: "text",
      placeholder: "Название воронки",
      options: [],
    },
  ];

  //фильтры для FitersComponent

  const filtersArray = [
    {
      label: "Воронка",
      key: "name",
      type: "multiselect",
      placeholder: "Название воронки",
      options: funnelsNames,
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
    // renderFunnels();
    setTitleModel("Воронки");
    console.log("funnels", funnels);
  }, [funnels]);

  const renderFunnels = () => {
    getFunnels()
      .then((response) => {
        setFunnels(response.data);
        setFunnelsNames(response.data.map((funnel) => funnel.name));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке воронок");
      });
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
          showToast("success", response.data.message);
          renderFunnels();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", error.response.data.message);
        });
    }
  };

  const addNewFunnel = () => {
    addFunnel(dialogInputObject.name)
      .then(function (response) {
        showToast("success", response.data.message);
        setPopupCreateVisible(false);
        setDialogInputObject({ name: "" });
        renderFunnels();
      })
      .catch(function (error) {
        showToast("error", error.response.data.message);
        setDialogInputObject({ name: "" });
      });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <Button icon="pi pi-filter" className="button-invisible" />

        <PaginatorComponent
          renderFunction={getFunnels}
          setData={setFunnels}
          setLoading={setLoading}
        />

        <span className="p-input-icon-left">
          <Button icon="pi pi-filter" onClick={() => setSidebarVisible(true)} />
          <FiltersStyled
            visible={sidebarVisible}
            setVisible={setSidebarVisible}
            filtersArray={filtersArray}
            type="funnels"
            setFilteredData={setFunnels}
          />
        </span>
      </div>
    );
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
    });
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

  const actionSkeletonTemplate = () => {
    return (
      <div className="flex gap-3">
        <Skeleton size="3rem" />
        <Skeleton size="3rem" />
      </div>
    );
  };

  return (
    <div className="" style={{ maxWidth: "90%", margin: "0 auto" }}>
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
      <div className="flex justify-content-between items-center mb-5">
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
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleAdd={addNewFunnel}
          clearDialogInputObject={clearDialogInputObject}
        />
      </div>

      <div style={{ margin: "0 auto" }}>
        <DataTable
          value={loading ? skeletonData : funnels}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          header={renderHeader()}
          emptyMessage="Воронка не найдена."
        >
          <Column field="id" header="ID" style={{ width: "30%" }}></Column>
          <Column field="name" header="Воронка"></Column>
          <Column
            field="category"
            header="Действие"
            body={loading ? actionSkeletonTemplate : actionBodyTemplate}
            style={{ width: "30%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Funnels;

const skeletonData = [
  {
    id: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
  },
];
