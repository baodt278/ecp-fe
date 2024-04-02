import { RequestCreate, RequestUpdate } from "@/schema/request.schema";
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
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createRequest = (username: string, data: RequestCreate) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/create-request?username=" + username,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}

export const updateRequest = (username: string, data: RequestUpdate) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/update-request?username=" + username,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteRequest = (username: string, code: string) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/delete-request?username=" + username + "&code=" + code,
  });
};


export const verifyAccount = (username: string, file: File[]) => {
  let formData = new FormData();
   for (let i = 0; i < file.length; i++) {
     const file1 = file[i];
     console.log(file1);
     formData.append(`files[${i}]`, file1);
   }
   console.log(formData);
  return axios({
    method: "POST",
    url: BASE_URL + "/verify-account?username=" + username,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const requestVerify = (username: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/request-verify",
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

export const getCompanies = () => {
  return axios({
    method: "GET",
    url: BASE_URL + "/companies",
  });
}