// api.js
import axios from "axios";

export const getFunnels = () =>
  axios.get(`http://25.18.88.64:8000/api/funnels`);

export const getFunnelsPaginationData = (parametersObject) =>
  axios.post(`http://25.18.88.64:8000/api/funnels`, parametersObject);

export const deleteFunnel = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/funnels/${id}`);

export const addFunnel = (funnelName) =>
  axios.post(`http://25.18.88.64:8000/api/funnels/store`, {
    name: funnelName,
  });

export const getUsers = () => axios.get(`http://25.18.88.64:8000/api/users`);

export const getUsersPaginationData = (parametersObject) =>
  axios.post(`http://25.18.88.64:8000/api/funnels`, parametersObject);

export const addUser = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/users/store`, dialogInputObject);

export const editUser = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/users/update/${id}`, {
    name: dialogInputObject.name,
    email: dialogInputObject.email,
    role: dialogInputObject.role,
  });

export const deleteUser = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/users/${id}`);

export const getDomains = (parametersObject) =>
  axios.get(`http://25.18.88.64:8000/api/domains`, parametersObject);

export const deleteDomain = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/domains/${id}`);

export const addDomain = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/domains/store`, {
    domain: dialogInputObject.name,
    name: dialogInputObject.user,
    user_id: dialogInputObject.user_id,
  });

export const editDomain = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/domains/update/${id}`, {
    domain: dialogInputObject.name,
    name: dialogInputObject.user,
    user_id: dialogInputObject.user_id,
  });

export const getSpends = () => axios.get(`http://25.18.88.64:8000/api/spends`);

export const addSpend = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/spends/store`, dialogInputObject);

export const deleteSpend = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/spends/${id}`);

export const editSpend = (dialogInputObject, id) =>
  axios.put(
    `http://25.18.88.64:8000/api/spends/update/${id}`,
    dialogInputObject
  );

export const getOffersPaginationData = (parametersObject) =>
  axios.post(`http://25.18.88.64:8000/api/offers`, parametersObject);

export const getOffers = () => axios.get(`http://25.18.88.64:8000/api/offers`);

export const getCountries = () =>
  axios.get(`http://25.18.88.64:8000/api/country`);

export const addOffer = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/offers/store`, {
    name: dialogInputObject.name,
    cap: dialogInputObject.cap,
    funnels: JSON.stringify(dialogInputObject.funnels),
    geo: JSON.stringify(dialogInputObject.geo),
    offer_start: dialogInputObject.offer_start,
    offer_end: dialogInputObject.offer_end,
    source: JSON.stringify(dialogInputObject.source),
  });

export const editOffer = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/offers/update/${id}`, {
    name: dialogInputObject.name,
    cap: dialogInputObject.cap,
    funnels: JSON.stringify(dialogInputObject.funnels),
    geo: JSON.stringify(dialogInputObject.geo),
    offer_start: dialogInputObject.offer_start,
    offer_end: dialogInputObject.offer_end,
    source: JSON.stringify(dialogInputObject.source),
  });

export const deleteOffer = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/offers/${id}`);

export const editActivity = (id, active) =>
  axios.put(`http://25.18.88.64:8000/api/offers/activity`, {
    id,
    active,
  });

export const getSources = () =>
  axios.get(`http://25.18.88.64:8000/api/sources`);

export const deleteSource = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/sources/${id}`);

export const addSource = (sourceName) =>
  axios.post(`http://25.18.88.64:8000/api/sources/store`, {
    name: sourceName,
  });

export const getLeads = () => axios.get(`http://25.18.88.64:8000/api/leads`);

// export const getLeadsPaginationData = (parametersObject) =>
//   axios.post(`http://25.18.88.64:8000/api/leads`, parametersObject);

export const sendLead = (dialogInputObject) =>
  axios.post(
    `http://25.18.88.64:8000/api/offer/control-send`,
    dialogInputObject
  );

export const postLead = (parametersObject) =>
  axios.post(`http://25.18.88.64:8000/api/leads`, parametersObject);

export const addLead = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/leads/store`, dialogInputObject);

export const editLead = (dialogInputObject, id) =>
  axios.put(
    `http://25.18.88.64:8000/api/leads/update/${id}`,
    dialogInputObject
  );

export const deleteLead = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/leads/${id}`);

export const getLeadStatus = () => {
  axios.get(`http://25.18.88.64:8000/api/offers/leadsStatus`);
};

export const getLogs = (date) =>
  axios.post(`http://25.18.88.64:8000/api/logs`, { created_at: date });

export const getStatuses = () =>
  axios.get(`http://25.18.88.64:8000/api/status`);

export const getStatusesCRM = () =>
  axios.get(`http://25.18.88.64:8000/api/status-crm`);

export const editStatusCRMValidity = (id, is_valid) =>
  axios.put(`http://25.18.88.64:8000/api/status-crm/validity`, {
    id,
    is_valid,
  });

export const addStatus = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/status/store`, dialogInputObject);

export const deleteStatus = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/status/${id}`);

export const editStatus = (dialogInputObject, id) =>
  axios.put(
    `http://25.18.88.64:8000/api/status/update/${id}`,
    dialogInputObject
  );

export const editStatusBroker = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/status-brokers/update/${id}`, {
    crm_status: dialogInputObject.crm_status,
    status_id: dialogInputObject.status_id,
  });

export const getLeadsForChart = () =>
  axios.get(`http://25.18.88.64:8000/api/leads-chart`);

export const getStats = () =>
  axios.get(`http://25.18.88.64:8000/api/leads-stats`);

export const postLeadsStats = (postDates) =>
  axios.post(`http://25.18.88.64:8000/api/leads/leads-stats`, postDates);

export const postOffersStats = (postDates) =>
  axios.post(`http://25.18.88.64:8000/api/leads/offer-stats`, postDates);

export const postFunnelsStats = (postDates) =>
  axios.post(`http://25.18.88.64:8000/api/leads/funnel-stats`, postDates);

export const getDuplicateLeads = (parametersObject) =>
  axios.get(`http://25.18.88.64:8000/api/duplicate-leads`, parametersObject);

export const getFilteredSpends = (filtersObject) =>
  axios.post(
    `http://25.18.88.64:8000/api/spends/filtersForSpend`,
    filtersObject
  );

export const getFilteredOffers = (filtersObject) =>
  axios.post(`http://25.18.88.64:8000/api/offer/filtersOffer`, filtersObject);

export const getFilteredFunnels = (filtersObject) =>
  axios.post(
    `http://25.18.88.64:8000/api/funnels/filtersFunnel`,
    filtersObject
  );

export const getFilteredDomains = (filtersObject) =>
  axios.post(
    `http://25.18.88.64:8000/api/domains/filtersDomains`,
    filtersObject
  );

export const postOfferForLead = (dialogInputObject) =>
  axios.post(
    `http://25.18.88.64:8000/api/offers/offerforlead`,
    dialogInputObject
  );

export const generatePassword = () =>
  axios({
    method: "get",
    url: "https://api.api-ninjas.com/v1/passwordgenerator?length=16",
    headers: { "X-Api-Key": "AavHY7KdIR2V8+sTlGxCcA==fAnbORAjskzshSrB" },
    contentType: "application/json",
  });

export const getNoSendLeadsPaginationData = (parametersObject) =>
  axios.post(`http://25.18.88.64:8000/api/nosend-leads`, parametersObject);

export const getImportedLeads = () =>
  axios.get(`http://25.18.88.64:8000/api/imported-leads`);

export const getFilteredLeads = (filtersObject) =>
  axios.post(`http://25.18.88.64:8000/api/leads`, filtersObject);

export const login = (loginObject) =>
  axios.post(`http://25.18.88.64:8000/api/login`, loginObject);
