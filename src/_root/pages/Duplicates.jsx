import { useState, useEffect, useRef, useReducer } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  addLead,
  deleteOffer,
  getCountries,
  getFunnels,
  getLeads,
  getUsers,
  postLead,
} from "../../utilities/api";
import { statuses } from "../../utilities/statuses";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { DialogComponent } from "../../components/DialogComponent";

function Duplicates() {
  const [isLeadDialogVisible, setIsLeadDialogVisible] = useState(false);
  const [isLeadDialogDisabled, setIsLeadDialogDisabled] = useState(true);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [funnels, setFunnels] = useState([]);
  const [users, setUsers] = useState([]);
  const [geos, setGeos] = useState([]);
  const [dialogInputObject, setDialogInputObject] = useState({
    full_name: "",
    domain: "",
    email: "",
    funnel: "",
    phone: "",
    offer: "",
    ip: "",
    status: "",
    user: "",
    geo: [],
    created_at: "",
    url_params: "",
  });
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_PROPERTY":
        return {
          ...state,
          [action.property]: action.payload,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    leads: [],
    isParameterDialogVisible: false,
    isLeadDialogVisible: false,
    selectedLeadID: null,
    selectedURLParams: [],
  });

  const leadDialogInputs = [
    {
      label: "Имя",
      key: "full_name",
      type: "text",
      placeholder: "Имя",
    },
    {
      label: "URL",
      key: "domain",
      type: "text",
      placeholder: "URL",
    },
    {
      label: "Email",
      key: "email",
      type: "text",
      placeholder: "Email",
    },
    {
      label: "Воронка",
      key: "funnel",
      type: "dropdown",
      placeholder: "Воронка",
      options: funnels,
    },
    {
      label: "Телефон",
      key: "phone",
      type: "text",
      placeholder: "Телефон",
    },
    {
      label: "IP",
      key: "ip",
      type: "text",
      placeholder: "IP",
    },
    {
      label: "Статус",
      key: "status",
      type: "dropdown",
      placeholder: "Статус",
      options: statuses,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Пользователь",
      options: users,
    },
    {
      label: "Гео",
      key: "geo",
      type: "dropdown",
      placeholder: "Гео",
      options: geos,
    },
    {
      label: "Дата создания",
      key: "created_at",
      type: "calendar",
      placeholder: "Дата создания",
    },
    {
      label: "Параметры",
      key: "url_params",
      type: "text",
      placeholder: "Параметры",
    },
  ];

  const toast = useRef(null);

  useEffect(() => {
    console.log("dialogInputObject: ", dialogInputObject);
  }, [dialogInputObject]);

  useEffect(() => {
    console.log("state: ", state);
  }, [state]);

  useEffect(() => {
    renderLeads();
    getFunnels().then((response) => {
      const updatedFunnels = response.data.map(({ name }) => name);
      setFunnels(updatedFunnels);
    });
    getCountries().then((response) => {
      const updatedGeos = response.data.map(({ iso }) => iso);
      setGeos(updatedGeos);
    });
    getUsers().then((response) => {
      setUsers(response.data.map((obj) => obj.name));
    });
  }, []);

  const renderLeads = () => {
    getLeads().then(function (response) {
        console.log(response.data);
      const filteredObjects = response.data.filter((object) => {
        console.log(object.status);
        const lastStatus = object.status.substr(0, -1)
        console.log(lastStatus);
        // return lastStatus === "System duplicate";
      });
      dispatch({
        type: "SET_PROPERTY",
        property: "leads",
        payload: filteredObjects,
      });
      console.log(filteredObjects);
      console.log(response);
    });
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    dispatch({ type: "SET_SELECTED_OFFER_ID", payload: rowData.id });
  };

  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteOffer(state.selectedOfferID)
      : showToast("info", "Удаление оффера отменено"),
      hide();
    dispatch({ type: "SET_SELECTED_OFFER_ID", payload: null });
  };

  const handleAddLead = () => {
    addLead(dialogInputObject)
      .then(function (response) {
        setIsLeadDialogVisible(false);
        showToast("success", response.data.message);
        renderLeads();
      })
      .catch(function (error) {
        console.log(error);
        showToast("error", response.data.message);
      });
  };

  const handlePostLead = () => {
    postLead(dialogInputObject)
      .then(function (response) {
        setIsLeadDialogVisible(false);
        showToast("success", response.data.message);
        renderLeads();
      })
      .catch(function (error) {
        console.log(error);
        showToast("error", response.data.message);
      });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const formattedTimestamp = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;

    return formattedTimestamp;
  };

  const formatTimestampForCalendar = (timestamp) => {
    return new Date(timestamp);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...state.filters };
    _filters["global"].value = value;

    dispatch({ type: "SET_FILTERS", payload: _filters });
    dispatch({ type: "SET_GLOBAL_FILTER_VALUE", payload: value });
  };

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const handleDeleteOffer = () => {
    deleteOffer(state.selectedOfferID)
      .then(function (response) {
        console.log(response);
        showToast("success", response.data.message);
        renderLeads();
      })
      .catch(function (error) {
        showToast("error", response.data.message);
        console.log(error);
      });
  };

  const showConfirmDeletePopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить лида?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
    });
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

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={state.globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Поиск"
          />
        </span>
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
            className="p-button-sm w-full"
          />
          <Button
            ref={acceptBtnRef}
            outlined
            label="Удалить"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("delete", hide);
            }}
            className="p-button-sm w-full"
          ></Button>
        </div>
      </div>
    );
  };

  const handleURLParameterClick = (rowData, selectedURLParamsArray) => {
    dispatch({
      type: "SET_PROPERTY",
      property: "selectedLeadID",
      payload: rowData.id,
    });
    dispatch({
      type: "SET_PROPERTY",
      property: "isParameterDialogVisible",
      payload: true,
    });
    dispatch({
      type: "SET_PROPERTY",
      property: "selectedURLParams",
      payload: selectedURLParamsArray,
    });
  };

  const handlePhoneClick = (rowData) => {
    console.log("rowData", rowData);
    const parsedStatusArray = JSON.parse(rowData.status);
    const newestStatus = parsedStatusArray[parsedStatusArray.length - 1];
    console.log(newestStatus);
    dispatch({
      type: "SET_PROPERTY",
      property: "selectedLeadID",
      payload: rowData.id,
    });
    setIsLeadDialogVisible(true);
    setDialogInputObject({
      id: rowData.id,
      full_name: rowData.full_name,
      domain: rowData.domain,
      email: rowData.email,
      funnel: rowData.funnel,
      phone: rowData.phone,
      offer: rowData.offer,
      ip: rowData.ip,
      status: newestStatus,
      user: rowData.user,
      geo: rowData.geo,
      created_at: formatTimestampForCalendar(rowData.created_at),
      url_params: rowData.url_params,
    });
  };

  const URLParamsTemplate = (rowData) => {
    const splittedURLParams = rowData.url_params.split("&");
    const selectedURLParamsArray = splittedURLParams.map((param) => {
      const [parameter, value] = param.split("=");
      return { parameter, value };
    });

    return (
      <div
        style={{
          cursor: "pointer",
          color: "#34d399",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }}
        onClick={() => {
          handleURLParameterClick(rowData, selectedURLParamsArray);
        }}
      >
        {splittedURLParams[0]}
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={() => console.log("lol")}
        icon="pi pi-trash"
        className="p-button-danger"
        style={{ maxWidth: "48px", margin: "0 auto" }}
      />
    );
  };

  const createdAtTemplate = (rowData) => {
    return <div>{formatTimestamp(rowData.created_at)}</div>;
  };

  const statusTemplate = (rowData) => {
    const parsedArray = JSON.parse(rowData.status);
    return <div>{parsedArray[parsedArray.length - 1]}</div>;
  };

  const phoneTemplate = (rowData) => {
    return (
      <div
        style={{
          cursor: "pointer",
          color: "#34d399",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }}
        onClick={() => {
          handlePhoneClick(rowData);
        }}
      >
        {rowData.phone}
      </div>
    );
  };

  return (
    <>
      <Dialog
        className="w-full max-w-25rem min-w-25rem"
        header="Параметры"
        visible={state.isParameterDialogVisible}
        resizable={false}
        draggable={false}
        onHide={() => {
          dispatch({
            type: "SET_PROPERTY",
            property: "selectedLeadID",
            payload: null,
          });
          dispatch({
            type: "SET_PROPERTY",
            property: "isParameterDialogVisible",
            payload: false,
          });
        }}
      >
        <DataTable value={state.selectedURLParams} stripedRows showGridlines>
          <Column field="parameter" header="Параметр"></Column>
          <Column field="value" header="Значение"></Column>
        </DataTable>
      </Dialog>

      <DialogComponent
        type="lead"
        isDialogVisible={isLeadDialogVisible}
        setIsDialogVisible={setIsLeadDialogVisible}
        header="Лид"
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        isLeadDialogDisabled={isLeadDialogDisabled}
        setIsLeadDialogDisabled={setIsLeadDialogDisabled}
        formatCalendarDate={formatTimestampForCalendar}
        inputs={leadDialogInputs}
        handleAdd={handlePostLead}
      />

      <DialogComponent
        type="add lead"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header="Добавить лида"
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        formatCalendarDate={formatCalendarDate}
        inputs={leadDialogInputs}
        handleAdd={handleAddLead}
      />

      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Системные дубли</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={state.leads}
          paginator
          header={headerTemplate}
          rows={10}
          stripedRows
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorPosition="top"
          filters={state.filters}
          style={{ width: "90%" }}
        >
          <Column field="id" header="ID"></Column>
          <Column
            field="phone"
            header="Номер телефона"
            body={phoneTemplate}
          ></Column>
          <Column field="full_name" header="Имя/Фамилия"></Column>
          <Column field="email" header="Почта"></Column>
          <Column field="geo" header="Гео"></Column>
          <Column field="domain" header="Домен"></Column>
          <Column field="funnel" header="Воронка"></Column>
          <Column field="status" header="Статус" body={statusTemplate}></Column>
          <Column field="user" header="Пользователь"></Column>
          <Column
            field="url_params"
            header="Параметры"
            body={URLParamsTemplate}
          ></Column>
          <Column
            field="created_at"
            header="Лид создан"
            body={createdAtTemplate}
          ></Column>
          <Column
            field="category"
            header="Действие"
            body={actionBodyTemplate}
            style={{ width: "30%" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Duplicates;
