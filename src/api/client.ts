import axios from "axios";

const BASE_URL = "http://localhost:8080/api/client";

export const getContracts = (username: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/contracts?username=" + username,
  });
};

export const getPredictCurrentMonth = (contractName: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/records/predict-current?contractName=" + contractName,
  });
};

export const getRecordsCurrentMonth = (contractName: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/records/current-month?contractName=" + contractName,
  });
};

export const getRecords7DaysBefore = (contractName: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/records/7days-before?contractName=" + contractName,
  });
};

export const getTotals6MonthsBefore = (contractName: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/records/6months-before?contractName=" + contractName,
  });
};

export const getRequests = (username: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/requests?username=" + username,
  });
};

export const getBillsContract = (contractName: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/bills?contractName=" + contractName,
  });
};

export const getBillCurrentMonth = (username: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/bills/current-month?username=" + username,
  });
};
