// src/api/companyApi.js
import axios from "axios";

export const getCompanyProfile = async (id) => {
  const res = await axios.get(`/api/companies/${id}`);
  return res.data;
};

export const updateCompanyProfile = async (id, data) => {
  const res = await axios.put(`/api/companies/${id}`, data);
  return res.data;
};
