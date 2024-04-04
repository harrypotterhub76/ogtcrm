import { useState, useEffect, useRef, useReducer } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  addLead,
  getCountries,
  getFunnels,
  getLeads,
  getOffers,
  getUsers,
  postLead,
} from "../../utilities/api";
import { deleteLead } from "../../utilities/api";
import { statuses } from "../../utilities/statuses";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { DialogComponent } from "../../components/DialogComponent";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [isLeadDialogVisible, setIsLeadDialogVisible] = useState(false);
  const [isLeadDialogDisabled, setIsLeadDialogDisabled] = useState(true);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [offers, setOffers] = useState([]);
  const [funnels, setFunnels] = useState([]);
  const [users, setUsers] = useState([]);
  const [geos, setGeos] = useState([]);
  const [selectedLeadID, setSelectedLeadID] = useState(null);
  const [isParameterDialogVisible, setIsParameterDialogVisible] =
    useState(false);
  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [selectedURLParams, setSelectedURLParams] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [postLeadDialogInputObject, setPostLeadDialogInputObject] = useState({
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

  const [addLeadDialogInputObject, setAddLeadDialogInputObject] = useState({
    full_name: "",
    domain: "",
    email: "",
    funnel: "",
    phone: "",
    offer: "",
    ip: "",
    geo: [],
    url_params: "",
  });

  const postLeadDialogInputs = [
    {
      label: "Имя",
      key: "full_name",
      type: "text",
      placeholder: "Имя",
    },
    {
      label: "Домен",
      key: "domain",
      type: "text",
      placeholder: "Домен",
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
      label: "Оффер",
      key: "offer",
      type: "dropdown",
      placeholder: "Оффер",
      options: offers,
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

  const addLeadDialogInputs = [
    {
      label: "Имя",
      key: "full_name",
      type: "text",
      placeholder: "Имя",
    },
    {
      label: "Домен",
      key: "domain",
      type: "text",
      placeholder: "Домен",
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
      label: "Гео",
      key: "geo",
      type: "dropdown",
      placeholder: "Гео",
      options: geos,
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
    console.log("addLeadDialogInputObject: ", addLeadDialogInputObject);
    console.log("postLeadDialogInputObject: ", postLeadDialogInputObject);
  }, [addLeadDialogInputObject, postLeadDialogInputObject]);

  useEffect(() => {
    renderLeads();
    getOffers().then((response) => {
      const updatedOffers = response.data.map(({ name }) => name);
      setOffers(updatedOffers);
    });
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
      setLeads(response.data);
      console.log(response);
    });
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedLeadID(rowData.id);
  };

  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteLead(selectedLeadID)
      : showToast("info", "Удаление лида отменено"),
      hide();
    setSelectedLeadID(null);
  };

  const handleAddLead = () => {
    addLead(addLeadDialogInputObject)
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
        showToast("error", error.response.data.message);
      });
  };

  const handleDeleteLead = () => {
    deleteLead(selectedLeadID)
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
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
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
            value={globalFilterValue}
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
    setSelectedLeadID(rowData.id);
    setIsParameterDialogVisible(true);
    setSelectedURLParams(selectedURLParamsArray);
  };

  const handleStatusClick = (rowData, parsedArray) => {
    setIsStatusDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedStatuses(parsedArray);
  };

  const handlePhoneClick = (rowData) => {
    console.log("rowData", rowData);
    const parsedStatusArray = JSON.parse(rowData.status);
    const newestStatus = parsedStatusArray[parsedStatusArray.length - 1];
    console.log(newestStatus);
    setSelectedLeadID(rowData.id);
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
    console.log(splittedURLParams);
    const selectedURLParamsArray = splittedURLParams.map((param) => {
      const [parameter, value] = param.split("=");
      return { parameter, value };
    });
    console.log(selectedURLParamsArray);

    const style =
      splittedURLParams.length > 1
        ? {
            cursor: "pointer",
            color: "#34d399",
            textDecoration: "underline",
            textUnderlineOffset: "5px",
          }
        : {};

    const handleClick =
      splittedURLParams.length > 1
        ? () => {
            handleURLParameterClick(rowData, selectedURLParamsArray);
          }
        : undefined;

    return (
      <div style={style} onClick={handleClick}>
        {splittedURLParams.length > 1
          ? splittedURLParams[0] + ` (+${splittedURLParams.length - 1})`
          : splittedURLParams[0]}
      </div>
    );
  };

  const createdAtTemplate = (rowData) => {
    return <div>{formatTimestamp(rowData.created_at)}</div>;
  };

  const dateDepositedTemplate = (rowData) => {
    return <div>{formatTimestamp(rowData.date_deposited)}</div>;
  };

  const leadSentTemplate = (rowData) => {
    return <div>{formatTimestamp(rowData.lead_sent)}</div>;
  };

  const statusTemplate = (rowData) => {
    console.log("rowData", rowData);
    const parsedArray = JSON.parse(rowData.status);
    const newestStatus = parsedArray[parsedArray.length - 1].status;
    console.log(parsedArray);
    return (
      <div
        style={{
          cursor: "pointer",
          color: "#34d399",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }}
        onClick={() => {
          handleStatusClick(rowData, parsedArray);
        }}
      >
        {newestStatus}
      </div>
    );
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

  const isDepositedTemplate = (rowData) => {
    const parsedValue = rowData.is_deposited === 1 ? "Yes" : "No";
    return (
      <div>
        {parsedValue === "Yes" ? (
          <div style={{ color: "#34d399" }}>{parsedValue}</div>
        ) : (
          <div>{parsedValue}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog
        className="w-full max-w-25rem min-w-25rem"
        header="Параметры"
        visible={isParameterDialogVisible}
        resizable={false}
        draggable={false}
        onHide={() => {
          setSelectedLeadID(null);
          setIsParameterDialogVisible(false);
        }}
      >
        <DataTable value={selectedURLParams} stripedRows showGridlines>
          <Column field="parameter" header="Параметр"></Column>
          <Column field="value" header="Значение"></Column>
        </DataTable>
      </Dialog>

      <Dialog
        className="w-full max-w-25rem min-w-25rem"
        header="Статусы"
        visible={isStatusDialogVisible}
        resizable={false}
        draggable={false}
        onHide={() => {
          setSelectedLeadID(null);
          setIsStatusDialogVisible(false);
        }}
      >
        <DataTable value={selectedStatuses} stripedRows showGridlines>
          <Column field="time" header="Время"></Column>
          <Column field="status" header="Статус"></Column>
        </DataTable>
      </Dialog>

      <DialogComponent
        type="lead"
        isDialogVisible={isLeadDialogVisible}
        setIsDialogVisible={setIsLeadDialogVisible}
        header="Лид"
        dialogInputObject={postLeadDialogInputObject}
        setDialogInputObject={setPostLeadDialogInputObject}
        isLeadDialogDisabled={isLeadDialogDisabled}
        setIsLeadDialogDisabled={setIsLeadDialogDisabled}
        formatCalendarDate={formatTimestampForCalendar}
        inputs={postLeadDialogInputs}
        handleAdd={handlePostLead}
      />

      <DialogComponent
        type="add lead"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header="Добавить лида"
        dialogInputObject={addLeadDialogInputObject}
        setDialogInputObject={setAddLeadDialogInputObject}
        formatCalendarDate={formatCalendarDate}
        inputs={addLeadDialogInputs}
        handleAdd={handleAddLead}
      />

      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Лиды</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={leads}
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
          <Column field="offer" header="Оффер"></Column>
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
          <Column
            field="is_deposited"
            header="Депозит"
            body={isDepositedTemplate}
          ></Column>
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
            field="lead_sent"
            header="Лид отправлен"
            body={leadSentTemplate}
          ></Column>
          <Column
            field="date_deposited"
            header="Дата депозита"
            body={dateDepositedTemplate}
          ></Column>
          <Column
            field="category"
            header="Действие"
            body={actionButtonsTemplate}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Leads;
