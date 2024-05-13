import { useState, useEffect, useRef, useReducer, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  addLead,
  editLead,
  getCountries,
  getFunnels,
  getLeads,
  getOffers,
  getStatusesCRM,
  getUsers,
  postLead,
  postOfferForLead,
} from "../../utilities/api";
import { deleteLead } from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { DialogComponent } from "../../components/DialogComponent";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { BreadCrumbContext } from "../../context/BreadCrumbContext";
import { TitleContext } from "../../context/TitleContext";
import { Checkbox } from "primereact/checkbox";

import FiltersStyled from "../../components/FiltersComponent";

function Leads() {
  // Стейты
  const [leads, setLeads] = useState([]);
  const [funnels, setFunnels] = useState({});
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);

  const [offersOptions, setOffersOptions] = useState([]);
  const [funnelsOptions, setFunnelsOptions] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [geosOptions, setGeosOptions] = useState([]);
  const [statusesCRMOptions, setStatusesCRMOptions] = useState([]);

  const [selectedOfferDialog, setSelectedOfferDialog] = useState(null);
  const [selectedFunnelDialog, setSelectedFunnelDialog] = useState(null);
  const [selectedUserDialog, setSelectedUserDialog] = useState(null);
  const [selectedURLParams, setSelectedURLParams] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedLeadID, setSelectedLeadID] = useState(null);

  const [isLeadDialogVisible, setIsLeadDialogVisible] = useState(false);
  const [leadDialogType, setLeadDialogType] = useState("post-lead");
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isParameterDialogVisible, setIsParameterDialogVisible] =
    useState(false);
  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [isSendLeadDialogVisible, setIsSendLeadDialogVisible] = useState(false);
  const [allLeadsChecked, setAllLeadsChecked] = useState(false);
  const [selectedLeadsArray, setSelectedLeadsArray] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(false);

  const { setBreadCrumbModel } = useContext(BreadCrumbContext);
  const { setTitleModel } = useContext(TitleContext);

  const addLeadDialogInitialState = {
    full_name: "",
    domain: "",
    email: "",
    funnel: "",
    phone: "",
    ip: "",
    geo: [],
    url_params: "",
  };

  const postLeadDialogInitialState = {
    full_name: "",
    domain: "",
    email: "",
    funnel: "",
    phone: "",
    ip: "",
    status: "",
    user: "",
    geo: [],
    created_at: "",
    url_params: "",
  };

  const [postLeadDialogInputObject, setPostLeadDialogInputObject] = useState(
    postLeadDialogInitialState
  );

  const [addLeadDialogInputObject, setAddLeadDialogInputObject] = useState(
    addLeadDialogInitialState
  );

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
    console.log("addLeadDialogInputObject: ", addLeadDialogInputObject);
    console.log("postLeadDialogInputObject: ", postLeadDialogInputObject);
    console.log("leadDialogType: ", leadDialogType);
    console.log("statusesOptions: ", statusesCRMOptions);
    console.log("funnels: ", funnels);
    console.log("leads: ", leads);
    console.log('offers:', offers);
  }, [
    addLeadDialogInputObject,
    postLeadDialogInputObject,
    leadDialogType,
    statusesCRMOptions,
    funnels,
    leads,
  ]);

  useEffect(() => {
    if (selectedFunnelDialog) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        funnel: selectedFunnelDialog,
        funnel_id: getSelectedFunnelID(selectedFunnelDialog),
      }));
    }
    console.log("selectedFunnelDialog", selectedFunnelDialog);
  }, [selectedFunnelDialog]);

  useEffect(() => {
    if (selectedOfferDialog) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        offer: selectedOfferDialog,
        offer_id: getSelectedOfferID(selectedOfferDialog),
      }));
    }
    console.log("selectedOfferDialog", selectedOfferDialog);
  }, [selectedOfferDialog]);

  useEffect(() => {
    if (selectedUserDialog) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        user: selectedUserDialog,
        user_id: getSelectedUserID(selectedUserDialog),
      }));
    }
    console.log("selectedFunnelDialog", selectedUserDialog);
  }, [selectedUserDialog]);

  useEffect(() => {
    if (isMounted.current) {
      getOffersOptionsData();
    }
    isMounted.current = true;
  }, [isMounted, postLeadDialogInputObject]);

  useEffect(() => {
    setBreadCrumbModel([{ label: "Лиды" }, { label: "Лиды" }]);
    renderLeads();
    getCountriesData();
    getFunnelsData();
    getOffersData();
    getStatusesCRMData();
    getUsersData();
    setTitleModel("Лиды");
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [leads]);

  useEffect(() => {
    console.log("selected", selectedLeadsArray);
  }, [selectedLeadsArray]);

  // Инпуты для DialogComponent
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
      options: funnelsOptions,
      setDropdownValue: setSelectedFunnelDialog,
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
      options: statusesCRMOptions,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Пользователь",
      options: usersOptions,
      setDropdownValue: setSelectedUserDialog,
    },
    {
      label: "Гео",
      key: "geo",
      type: "dropdown",
      placeholder: "Гео",
      options: geosOptions,
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
      options: funnelsOptions,
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
      options: geosOptions,
    },
    {
      label: "Параметры",
      key: "url_params",
      type: "text",
      placeholder: "Параметры",
    },
  ];

  //фильтры для FitersComponent

  const filtersArray = [
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
      label: "Оффер",
      key: "offer",
      type: "dropdown",
      placeholder: "Оффер",
      options: offersOptions,
      setDropdownValue: setSelectedOfferDialog,
    },
    {
      label: "Воронка",
      key: "funnel",
      type: "dropdown",
      placeholder: "Воронка",
      options: funnelsOptions,
      setDropdownValue: setSelectedFunnelDialog,
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
      options: statusesCRMOptions,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Пользователь",
      options: usersOptions,
      setDropdownValue: setSelectedUserDialog,
    },
    {
      label: "Гео",
      key: "geo",
      type: "dropdown",
      placeholder: "Гео",
      options: geosOptions,
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

  // Функции подтягиваний данных с бека
  const renderLeads = () => {
    getLeads().then(function (response) {
      setLeads(response.data);
    });
  };

  const getOffersData = () => {
    getOffers().then((response) => {
      const updatedOffers = response.data.map(({ name }) => name);
      setOffers(response.data);
      setOffersOptions(updatedOffers);
    });
  };
  const getOffersOptionsData = () => {
    postOfferForLead({
      funnel: postLeadDialogInputObject.funnel,
      geo: postLeadDialogInputObject.geo,
    }).then((response) => {
      const updatedOffers = response.data.map(({ name }) => name);
      setOffersOptions(updatedOffers);
    });
  };
  const getFunnelsData = () => {
    getFunnels().then((response) => {
      const updatedFunnels = response.data.map(({ name }) => name);
      setFunnels(response.data);
      setFunnelsOptions(updatedFunnels);
    });
  };

  const getCountriesData = () => {
    getCountries().then((response) => {
      const updatedGeos = response.data.map(({ iso }) => iso);
      setGeosOptions(updatedGeos);
    });
  };

  const getUsersData = () => {
    getUsers().then((response) => {
      setUsers(response.data);
      setUsersOptions(response.data.map(({ name }) => name));
    });
  };

  const getStatusesCRMData = () => {
    getStatusesCRM().then((response) => {
      const updatedStatusesCRM = response.data.map(
        ({ crm_status }) => crm_status
      );
      setStatusesCRMOptions(updatedStatusesCRM);
    });
  };

  // Обработчики кликов по данным таблицы
  const handleIdClick = (rowData) => {
    const parsedStatusArray = JSON.parse(rowData.status);
    const newestStatusObject = parsedStatusArray[parsedStatusArray.length - 1];
    setIsLeadDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedFunnelDialog(rowData.funnel);
    setSelectedUserDialog(rowData.user);
    setPostLeadDialogInputObject({
      id: rowData.id,
      full_name: rowData.full_name,
      domain: rowData.domain,
      email: rowData.email,
      phone: rowData.phone,
      ip: rowData.ip,
      status: newestStatusObject.status,
      geo: rowData.geo,
      created_at: formatTimestampForCalendar(rowData.created_at),
      url_params: rowData.url_params,
    });
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedLeadID(rowData.id);
  };

  const handleURLParameterClick = (rowData, selectedURLParamsArray) => {
    setIsParameterDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedURLParams(selectedURLParamsArray);
  };

  const handleStatusClick = (rowData, parsedArray) => {
    setIsStatusDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedStatuses(parsedArray);
  };

  const handleOpenSendLeadDialog = () => {
    setIsSendLeadDialogVisible(true);
  };

  // Функция для управления плажкой на удаление данных из DataTable
  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteLead(selectedLeadID)
      : showToast("info", "Удаление лида отменено"),
      hide();
    setSelectedLeadID(null);
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
  const handleAddLead = () => {
    if (isAllFieldsFilled(addLeadDialogInputObject)) {
      addLead(addLeadDialogInputObject)
        .then(function (response) {
          if (response.data.message === "Dublicate System") {
            showToast("success", response.data.message);
            return;
          }
          showToast("success", response.data.message);
          setIsAddDialogVisible(false);
          renderLeads();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", response.data.message);
        });
    } else {
      showToast("error", "Пожалуйста, введите все поля");
    }
  };

  const handlePostLead = () => {
    if (isAllFieldsFilled(postLeadDialogInputObject)) {
      postLead(postLeadDialogInputObject)
        .then(function (response) {
          setIsLeadDialogVisible(false);
          setIsSendLeadDialogVisible(false);
          showToast("success", response.data.message);
          renderLeads();
        })
        .catch(function (error) {
          console.log(error);
          showToast("error", error.response.data.message);
        });
    } else {
      showToast("error", "Пожалуйста, введите все поля");
    }
  };

  const handleEditLead = () => {
    editLead(postLeadDialogInputObject, selectedLeadID)
      .then(function (response) {
        showToast("success", response.data.message);
        setLeadDialogType("post-lead");
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
        showToast("success", response.data.message);
        renderLeads();
      })
      .catch(function (error) {
        showToast("error", response.data.message);
        console.log(error);
      });
  };

  // Функция для сброса стейтов
  const clearDialogInputObject = () => {
    setAddLeadDialogInputObject(addLeadDialogInitialState);
    setPostLeadDialogInputObject(postLeadDialogInitialState);
    setLeadDialogType("post-lead");
    setSelectedLeadID(null);
    setSelectedOfferDialog(null);
    setSelectedFunnelDialog(null);
    setSelectedUserDialog(null);
    setSelectedURLParams(null);
  };

  // Рендер плажки на удаление данных из DataTable
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

  // Вспомогательные функции
  const getSelectedFunnelID = (name) => {
    const filteredArray = funnels.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const getSelectedOfferID = (name) => {
    const filteredArray = offers.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const getSelectedUserID = (name) => {
    const filteredArray = users.filter((obj) => obj.name === name);
    return filteredArray[0].id;
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

  const isAllFieldsFilled = (object) => {
    return Object.values(object).every((value) => {
      return value !== "" && value !== null && value.length !== 0;
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

  const onLeadSelect = (e) => {
    let _selectedLeadsArray = [...selectedLeadsArray];

    if (e.checked) _selectedLeadsArray.push(e.value);
    else _selectedLeadsArray.splice(_selectedLeadsArray.indexOf(e.value), 1);

    setSelectedLeadsArray(_selectedLeadsArray);
  };

  const refreshData = () => {
    setLoading(true);
    renderLeads();
  };

  // Шаблоны для DataTable
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
      <div className="flex justify-content-between">
        <Button
          icon="pi pi-refresh"
          label=""
          loading={loading}
          onClick={refreshData}
        ></Button>
        {/* <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Поиск"
          />
        </span> */}

        <span className="p-input-icon-left">
          <Button icon="pi pi-filter" onClick={() => setSidebarVisible(true)} />
          <FiltersStyled
            visible={sidebarVisible}
            setVisible={setSidebarVisible}
            filtersArray={filtersArray}
            type="leads"
            setFilteredData={setLeads}
          />
        </span>
      </div>
    );
  };

  const checkboxTemplate = (rowData) => {
    return (
      <Checkbox
        onChange={onLeadSelect}
        value={rowData.id}
        checked={selectedLeadsArray.includes(rowData.id)}
      ></Checkbox>
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

  const URLParamsTemplate = (rowData) => {
    const splittedURLParams = rowData.url_params.split("&");
    const selectedURLParamsArray = splittedURLParams.map((param) => {
      const [parameter, value] = param.split("=");
      return { parameter, value };
    });

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
    return (
      <div>
        {!!rowData.date_deposited
          ? formatTimestamp(rowData.date_deposited)
          : ""}
      </div>
    );
  };

  const leadSentTemplate = (rowData) => {
    return (
      <div>{!!rowData.lead_sent ? formatTimestamp(rowData.lead_sent) : ""}</div>
    );
  };

  const statusTemplate = (rowData) => {
    const parsedArray = JSON.parse(rowData.status);
    const newestStatus = parsedArray[parsedArray.length - 1].status;
    return (
      <div
        style={{
          cursor: "pointer",
          // color: rowData.is_valid ? "#34d399" : "#ff6666",
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

  const fraudTemplate = (rowData) => {
    return (
      <div className="flex justify-content-center">
        <i
          className="pi pi-circle-fill"
          style={{
            color: rowData.is_fraud ? "#ff6666" : "#34d399",
          }}
        ></i>
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
          handleIdClick(rowData);
        }}
      >
        {rowData.id}
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
        <DataTable value={selectedURLParams} showGridlines>
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
        <DataTable value={selectedStatuses} showGridlines>
          <Column field="time" header="Время"></Column>
          <Column field="status" header="Статус"></Column>
        </DataTable>
      </Dialog>

      <Dialog
        header="Выбрать оффер"
        visible={isSendLeadDialogVisible}
        style={{ maxWidth: "calc(50% - 0.5rem)" }}
        onHide={() => setIsSendLeadDialogVisible(false)}
      >
        <Dropdown
          value={postLeadDialogInputObject["offer"]}
          onChange={(e) => {
            setSelectedOfferDialog(e.value);
          }}
          options={offersOptions}
          placeholder={"Офферы"}
          className="w-full mb-5"
        />
        <Button label="Отправить" onClick={handlePostLead} />
      </Dialog>

      <DialogComponent
        type="lead"
        isDialogVisible={isLeadDialogVisible}
        setIsDialogVisible={setIsLeadDialogVisible}
        header="Лид"
        dialogInputObject={postLeadDialogInputObject}
        setDialogInputObject={setPostLeadDialogInputObject}
        leadDialogType={leadDialogType}
        setLeadDialogType={setLeadDialogType}
        formatCalendarDate={formatTimestampForCalendar}
        inputs={postLeadDialogInputs}
        handleAdd={handleOpenSendLeadDialog}
        handleEdit={handleEditLead}
        clearDialogInputObject={clearDialogInputObject}
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
        clearDialogInputObject={clearDialogInputObject}
      />

      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <div className="flex flex-column align-items-center justify-content-center">
        <div className="flex justify-content-end my-5" style={{ width: "90%" }}>
          {/* <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          /> */}
        </div>
        <Card style={{ width: "90%" }}>
          <DataTable
            value={leads}
            loading={loading}
            paginator
            header={headerTemplate}
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorPosition="top"
            filters={filters}
          >
            <Column body={checkboxTemplate}></Column>
            <Column field="id" header="ID" body={phoneTemplate}></Column>
            <Column field="offer" header="Оффер"></Column>
            <Column field="phone" header="Номер телефона"></Column>
            <Column field="full_name" header="Имя / Фамилия"></Column>
            <Column field="email" header="Почта"></Column>
            <Column field="geo" header="Гео"></Column>
            <Column field="domain" header="Домен"></Column>
            <Column field="funnel" header="Воронка"></Column>
            <Column
              field="status"
              header="Статус"
              body={statusTemplate}
            ></Column>
            <Column
              field="is_fraud"
              header="Shave"
              body={fraudTemplate}
            ></Column>
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
        </Card>
      </div>
    </>
  );
}

export default Leads;
