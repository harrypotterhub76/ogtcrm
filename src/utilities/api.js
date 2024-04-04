// api.js
import axios from "axios";

export const getFunnels = () =>
  axios.get(`http://25.18.88.64:8000/api/funnels`);

export const deleteFunnel = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/funnels/${id}`);

export const addFunnel = (funnelName) =>
  axios.post(`http://25.18.88.64:8000/api/funnels/store`, {
    name: funnelName,
  });

export const getUsers = () => axios.get(`http://25.18.88.64:8000/api/users`);

export const addUser = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/users/store`, {
    name: dialogInputObject.name,
    email: dialogInputObject.email,
    password: dialogInputObject.password,
    role: dialogInputObject.role,
  });

export const editUser = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/users/update/${id}`, {
    name: dialogInputObject.name,
    email: dialogInputObject.email,
    role: dialogInputObject.role,
  });

export const deleteUser = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/users/${id}`);

export const getDomains = () =>
  axios.get(`http://25.18.88.64:8000/api/domains`);

export const deleteDomain = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/domains/${id}`);

export const addDomain = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/domains/store`, {
    domain: dialogInputObject.name,
    name: dialogInputObject.user.name,
    user_id: dialogInputObject.user_id,
  });

export const editDomain = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/domains/update/${id}`, {
    domain: dialogInputObject.name,
    name: dialogInputObject.user.name,
    user_id: dialogInputObject.user_id,
  });

export const getSpends = () => axios.get(`http://25.18.88.64:8000/api/spends`);

export const addSpend = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/spends/store`, {
    name: dialogInputObject.name.name,
    summary: dialogInputObject.summary,
    date: dialogInputObject.date,
    user_id: dialogInputObject.user_id,
  });

export const deleteSpend = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/spends/${id}`);

export const editSpend = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/spends/update/${id}`, {
    name: dialogInputObject.name,
    summary: dialogInputObject.summary,
    date: dialogInputObject.date,
  });

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

export const postLead = (dialogInputObject) =>
  axios.post(
    `http://25.18.88.64:8000/api/integration/valik`,
    dialogInputObject
  );

export const addLead = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/leads/store`, dialogInputObject);

export const deleteLead = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/leads/${id}`);

export const getLeadStatus = () => {
  axios.get(`http://25.18.88.64:8000/api/offers/leadsStatus`);
};

export const getLogs = (date) =>
  axios.get(`http://25.18.88.64:8000/api/logs/${date}`);

export const getStatuses = () =>
  axios.get(`http://25.18.88.64:8000/api/status`);

export const addStatus = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/status/store`, dialogInputObject);

export const deleteStatus = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/status/${id}`);

export const editStatus = (dialogInputObject, id) =>
  axios.put(
    `http://25.18.88.64:8000/api/status/update/${id}`,
    dialogInputObject
  );
